/* eslint-disable import/no-unresolved */
import type { EditorOptions } from "@tiptap/core";
import {
  LinkBubbleMenu,
  RichTextEditor as MuiRichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditor as MuiRichTextEditorType,
  type RichTextEditorRef,
} from "mui-tiptap";
import type { ComponentProps } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { EditorMenuControls } from "./EditorMenuControls";
import { useExtensions } from "./useExtensions";

const fileListToImageFiles = (fileList: FileList): File[] => {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();

    return mimeType.startsWith("image/");
  });
};

type MuiRichTextEditorProps = ComponentProps<typeof MuiRichTextEditorType>;

type RichTextEditorProps = {
  isEditable?: boolean;
  showMenuBar?: boolean;
  htmlContent?: string;
} & Omit<MuiRichTextEditorProps, "ref" | "content" | "editable" | "extensions">;

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    { isEditable = false, showMenuBar = false, htmlContent = "", ...rest },
    ref
  ) => {
    const extensions = useExtensions({
      placeholder: "Add your own content here...",
    });

    const rteRef = useRef<RichTextEditorRef>(null);

    useImperativeHandle(ref, () => rteRef.current as RichTextEditorRef, []);

    const handleNewImageFiles = useCallback(
      (files: File[], insertPosition?: number): void => {
        if (!rteRef.current?.editor) {
          return;
        }

        const attributesForImageFiles = files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }));

        insertImages({
          images: attributesForImageFiles,
          editor: rteRef.current.editor,
          position: insertPosition,
        });
      },
      []
    );

    const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
      useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (view, event, _slice, _moved) => {
          if (!(event instanceof DragEvent) || !event.dataTransfer) {
            return false;
          }

          const imageFiles = fileListToImageFiles(event.dataTransfer.files);

          if (imageFiles.length > 0) {
            const insertPosition = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;

            handleNewImageFiles(imageFiles, insertPosition);

            event.preventDefault();

            return true;
          }

          return false;
        },
        [handleNewImageFiles]
      );

    const handlePaste: NonNullable<
      EditorOptions["editorProps"]["handlePaste"]
    > = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_view, event, _slice) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );

        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);

          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

    return (
      <MuiRichTextEditor
        ref={rteRef}
        extensions={extensions}
        content={htmlContent}
        editable={isEditable}
        editorProps={{
          handleDrop,
          handlePaste,
          attributes: {
            class: "a4-page",
          },
        }}
        renderControls={() => <EditorMenuControls />}
        RichTextFieldProps={{
          variant: "outlined",
          MenuBarProps: {
            hide: !showMenuBar,
          },
        }}
        sx={{
          "& .a4-page": {
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "#fff",
            margin: "0 auto",
            padding: "10mm 10mm",
            boxShadow: "0 0 10px rgba(0,0,0,0.15)",
          },
        }}
        {...rest}
      >
        {() => (
          <>
            <LinkBubbleMenu />
            <TableBubbleMenu />
          </>
        )}
      </MuiRichTextEditor>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

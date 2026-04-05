import { Stack, InputLabel, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { EditorContent } from "@tiptap/react";
import { useCallback, useEffect } from "react";
import {
  useController,
  useFormContext,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

import { useTextEditorInstance } from "@web/components/common/TextEditor/hooks/useTextEditorInstance";
import { errorMessages } from "@web/utils/helper";

import { Skeleton } from "./Skeleton";
import { TextEditorToolbar } from "./TextEditorToolbar";

export type TextEditorProps<P extends FieldValues> = UseControllerProps<P> & {
  height?: string | number;
  label?: string;
  loading: boolean;
  minHeight?: number;
  name: string;
  required?: boolean;
};

export const TextEditor = <T extends FieldValues>({
  control,
  defaultValue,
  height = 290,
  label,
  loading = false,
  minHeight = 120,
  name,
  required,
  rules,
  ...inputFieldProps
}: TextEditorProps<T>) => {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, defaultValue, name, rules });

  const { trigger } = useFormContext();

  const { editor } = useTextEditorInstance(value);

  const onEditorUpdate = useCallback(() => {
    if (!editor) {
      return;
    }

    const html = editor.getHTML();

    const text = editor.getText().trim();

    const finalValue = text ? html : "";

    onChange(finalValue);
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on("update", onEditorUpdate);

    editor.on("blur", () => trigger(name));

    return () => {
      editor.off("update", onEditorUpdate);

      editor.off("blur", () => trigger(name));
    };
  }, [editor, onEditorUpdate, name, trigger]);

  if (loading) {
    return <Skeleton />;
  }

  return (
    <Stack gap="10px">
      {label && <InputLabel required={required}>{label}</InputLabel>}

      <TextEditorToolbar editor={editor} />

      <Stack
        className="editor-box"
        style={{
          border: `1px solid ${error ? red[400] : "#ccc"}`,
          display: "flex",
          height,
          minHeight,
          overflow: "auto",
          padding: 10,
        }}
        sx={{
          "& .ProseMirror": {
            flex: 1,
            minHeight: "100%",
          },
          "& .ProseMirror p, & .ProseMirror h1, & .ProseMirror h2, & .ProseMirror h3, & .ProseMirror h4, & .ProseMirror h5, & .ProseMirror h6":
            {
              margin: "0 0 4px 0",
            },
          "& .ProseMirror:focus-visible": {
            outline: "none !important",
          },
          "& > *": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "100%",
          },
        }}
      >
        <EditorContent
          editor={editor}
          style={{
            height: "100%",
            minHeight: "100%",
            width: "100%",
          }}
          {...inputFieldProps}
        />
      </Stack>

      {Boolean(error) && (
        <Typography
          variant="caption"
          sx={{
            color: `${red["A700"]}`,
            textWrap: "wrap",
            whiteSpace: "pre",
          }}
        >
          {errorMessages(error?.message)}
        </Typography>
      )}
    </Stack>
  );
};

import { Stack, InputLabel, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { EditorContent } from "@tiptap/react";
import { useEffect, useCallback } from "react";
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

import { useTextEditorInstance } from "@web/components/common/TextEditor/hooks/useTextEditorInstance";

import { Skeleton } from "./Skeleton";
import { TextEditorToolbar } from "./TextEditorToolbar";

export type TextEditorProps<P extends FieldValues> = UseControllerProps<P> & {
  error?: boolean;
  helperText?: string;
  label?: string;
  loading: boolean;
  name: string;
  required?: boolean;
};

export const TextEditor = <T extends FieldValues>({
  control,
  defaultValue,
  error,
  helperText,
  label,
  loading = false,
  name,
  required,
  rules,
}: TextEditorProps<T>) => {
  const {
    field: { onChange, value },
  } = useController({ control, defaultValue, name, rules });

  const { editor } = useTextEditorInstance(value);

  const onEditorUpdate = useCallback(() => {
    const html = editor?.getHTML();

    if (html) {
      onChange(html);
    }
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on("update", onEditorUpdate);

    return () => {
      editor.off("update", onEditorUpdate);
    };
  }, [editor, onEditorUpdate]);

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
          border: "1px solid #ccc",
          display: "flex",
          height: 290,
          overflow: "auto",
          padding: 10,
        }}
        sx={{
          "& .ProseMirror:focus-visible": {
            outline: "none !important",
          },
        }}
      >
        <EditorContent
          editor={editor}
          value={value}
          style={{ height: "100%", width: "100%" }}
        />

        {error && (
          <Typography
            variant="caption"
            sx={{
              color: `${red[400]}`,
              textWrap: "wrap",
              whiteSpace: "pre",
            }}
          >
            {helperText}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

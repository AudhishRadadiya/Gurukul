import Color from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  FontFamily,
  TextStyle,
  TextStyleKit,
} from "@tiptap/extension-text-style";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { useFontSize } from "@web/components/common/TextEditor/hooks/useFontSize";

export const useTextEditorInstance = (content: string) => {
  const { FontSize } = useFontSize();

  const extensions = [
    TextStyleKit,
    StarterKit,
    TextStyle,
    Color,
    FontSize,
    FontFamily,
    TextAlign.configure({
      types: ["paragraph"],
    }),
  ];

  const editor = useEditor({
    content,
    editorProps: {
      attributes: {
        class: "prose",
      },
    },
    extensions,

    immediatelyRender: false,
    onCreate({ editor }) {
      if (content) {
        editor.commands.setContent(content);
      }
    },
  });

  useEffect(() => {
    if (
      editor &&
      content &&
      !editor.isFocused &&
      content !== editor.getHTML()
    ) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return { editor };
};

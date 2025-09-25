import { useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

import { defaultEditorState } from "@web/components/common/TextEditor/hooks/constant";

export const useTextEditorState = (editor: Editor) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return defaultEditorState;
      }

      return {
        canBold: editor.can().chain().toggleBold().run(),
        canClearMarks: editor.can().chain().unsetAllMarks().run(),
        canCode: editor.can().chain().toggleCode().run(),
        canItalic: editor.can().chain().toggleItalic().run(),
        canRedo: editor.can().chain().redo().run(),
        canStrike: editor.can().chain().toggleStrike().run(),
        canUndo: editor.can().chain().undo().run(),
        color: editor.getAttributes("textStyle").color ?? "#000000",
        isBlockquote: editor.isActive("blockquote"),
        isBold: editor.isActive("bold"),
        isBulletList: editor.isActive("bulletList"),
        isCenterAligned: editor.isActive({ textAlign: "center" }),
        isCode: editor.isActive("code"),
        isCodeBlock: editor.isActive("codeBlock"),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isHeading3: editor.isActive("heading", { level: 3 }),
        isHeading4: editor.isActive("heading", { level: 4 }),
        isHeading5: editor.isActive("heading", { level: 5 }),
        isHeading6: editor.isActive("heading", { level: 6 }),
        isItalic: editor.isActive("italic"),
        isLeftAligned: editor.isActive({ textAlign: "left" }),
        isOrderedList: editor.isActive("orderedList"),
        isParagraph: editor.isActive("paragraph"),
        isRightAligned: editor.isActive({ textAlign: "right" }),
        isStrike: editor.isActive("strike"),
      };
    },
  });

  return { editorState };
};

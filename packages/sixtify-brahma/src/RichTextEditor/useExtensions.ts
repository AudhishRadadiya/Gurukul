/* eslint-disable import/no-unresolved */
import type { EditorOptions } from "@tiptap/core";
import { Node, mergeAttributes } from "@tiptap/core";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Code } from "@tiptap/extension-code";
import { CodeBlock } from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { FontFamily } from "@tiptap/extension-font-family";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Highlight } from "@tiptap/extension-highlight";
import { History } from "@tiptap/extension-history";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Strike } from "@tiptap/extension-strike";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Text } from "@tiptap/extension-text";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import {
  FontSize,
  HeadingWithAnchor,
  LinkBubbleMenuHandler,
  ResizableImage,
  TableImproved,
} from "mui-tiptap";
import { useMemo } from "react";

declare module "@tiptap/core" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Commands<ReturnType> {
    insertDynamicValue: {
      insertDynamicValue: (label: string) => ReturnType;
    };
  }
}

export type UseExtensionsOptions = {
  placeholder?: string;
};

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

const CustomSubscript = Subscript.extend({
  excludes: "superscript",
});

const CustomSuperscript = Superscript.extend({
  excludes: "subscript",
});

const DynamicValue = Node.create({
  name: "insertDynamicValue",

  inline: true,
  group: "inline",
  atom: true,

  addAttributes() {
    return {
      label: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-label]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const label = HTMLAttributes.label ?? "";

    const token = `{{${label}}}`;

    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: "field-insert", // only keep class
        "data-label": label,
      }),

      token,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("span");

      const label = node.attrs.label ?? "";

      dom.textContent = `${label}`;

      dom.classList.add("field-insert", "mceNonEditable", "other-attribute");

      // Add only for editor view
      dom.style.backgroundColor = "#e3f2fd";
      dom.style.borderRadius = "4px";
      dom.style.border = "1px solid #2196f3";
      dom.style.color = "#1976d2";
      dom.style.marginTop = "10px";
      dom.style.marginBottom = "10px";
      dom.style.marginLeft = "2px";
      dom.style.marginRight = "2px";

      return {
        dom,
      };
    };
  },

  renderText({ node }) {
    return `{{${node.attrs.label}}}`;
  },

  addCommands() {
    return {
      insertDynamicValue:
        (label: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { label },
          });
        },
    };
  },
});

export const useExtensions = ({
  placeholder,
}: UseExtensionsOptions = {}): EditorOptions["extensions"] => {
  return useMemo(() => {
    return [
      TableImproved.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,

      BulletList,
      CodeBlock,
      Document,
      HardBreak,
      ListItem,
      OrderedList,
      Paragraph,
      CustomSubscript,
      CustomSuperscript,
      Text,
      Bold,
      Blockquote,

      Code,
      Italic,
      Underline,
      Strike,
      CustomLinkExtension.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: false,
      }),
      LinkBubbleMenuHandler,

      Gapcursor,
      HeadingWithAnchor,
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      HorizontalRule,

      ResizableImage,
      Dropcursor,

      TaskList,
      TaskItem.configure({
        nested: true,
      }),

      Placeholder.configure({
        placeholder,
      }),

      History,

      DynamicValue,
    ];
  }, [placeholder]);
};

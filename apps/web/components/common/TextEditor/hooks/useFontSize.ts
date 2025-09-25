import { Mark, mergeAttributes } from "@tiptap/react";

export const useFontSize = () => {
  const FontSize = Mark.create({
    addAttributes() {
      return {
        size: {
          default: null,
          parseHTML: (element) => element.style.fontSize.replace("px", ""),
          renderHTML: (attributes) => {
            if (!attributes.size) {
              return {};
            }

            return {
              style: `font-size: ${attributes.size}px`,
            };
          },
        },
      };
    },

    addCommands() {
      return {
        setFontSize:
          (size) =>
          ({ chain }) => {
            return chain().setMark(this.name, { size }).run();
          },
        unsetFontSize:
          () =>
          ({ chain }) => {
            return chain().unsetMark(this.name).run();
          },
      };
    },

    addOptions() {
      return {
        HTMLAttributes: {},
      };
    },

    name: "fontSize",

    parseHTML() {
      return [{ style: "font-size" }];
    },

    renderHTML({ HTMLAttributes }) {
      return [
        "span",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        0,
      ];
    },
  });

  return { FontSize };
};

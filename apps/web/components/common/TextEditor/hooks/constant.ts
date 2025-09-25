import type { OptionsType } from "@codezee/sixtify-brahma";
import { blue } from "@mui/material/colors";

export const fontFamilies: OptionsType[] = [
  { label: "sans-serif", value: "sans-serif" },
  { label: "serif", value: "serif" },
  { label: "monospace", value: "monospace" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
];

export const fontSizes: OptionsType[] = [
  { label: "10px", value: "10" },
  { label: "12px", value: "12" },
  { label: "14px", value: "14" },
  { label: "16px", value: "16" },
  { label: "18px", value: "18" },
  { label: "24px", value: "24" },
  { label: "32px", value: "32" },
  { label: "48px", value: "48" },
];

type RichTextEditorState = {
  canBold: boolean;
  canClearMarks: boolean;
  canCode: boolean;
  canItalic: boolean;
  canRedo: boolean;
  canStrike: boolean;
  canUndo: boolean;
  color: string | null;
  isBlockquote: boolean;
  isBold: boolean;
  isBulletList: boolean;
  isCenterAligned: boolean;
  isCode: boolean;
  isCodeBlock: boolean;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isHeading4: boolean;
  isHeading5: boolean;
  isHeading6: boolean;
  isItalic: boolean;
  isLeftAligned: boolean;
  isOrderedList: boolean;
  isParagraph: boolean;
  isRightAligned: boolean;
  isStrike: boolean;
};

export const defaultEditorState: RichTextEditorState = {
  canBold: false,
  canClearMarks: false,
  canCode: false,
  canItalic: false,
  canRedo: false,
  canStrike: false,
  canUndo: false,
  color: null,
  isBlockquote: false,
  isBold: false,
  isBulletList: false,
  isCenterAligned: false,
  isCode: false,
  isCodeBlock: false,
  isHeading1: false,
  isHeading2: false,
  isHeading3: false,
  isHeading4: false,
  isHeading5: false,
  isHeading6: false,
  isItalic: false,
  isLeftAligned: false,
  isOrderedList: false,
  isParagraph: false,
  isRightAligned: false,
  isStrike: false,
};

export const activeButton = {
  "&.is-active": {
    backgroundColor: `${blue[400]}`,
    borderColor: `${blue[400]}`,
    color: "white",
  },
};

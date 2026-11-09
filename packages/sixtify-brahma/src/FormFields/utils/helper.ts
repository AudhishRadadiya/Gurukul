import type { SizeType } from "../../utils";

type GetFormFieldStyleConfigReturnType = {
  inputFontSize: string;
  inputHeight: number;
};

type GetInputLabelTopStyleConfigReturnType = {
  topMargin: number;
  fontSize: number;
  scale: number;
};

export const getFormFieldStyleConfig = (
  size?: SizeType
): GetFormFieldStyleConfigReturnType => {
  if (size === "small") {
    return {
      inputFontSize: "12px",
      inputHeight: 30,
    };
  }

  if (size === "large") {
    return {
      inputFontSize: "15px",
      inputHeight: 42,
    };
  }

  return {
    inputFontSize: "13px",
    inputHeight: 35,
  };
};

export const getInputLabelStyleConfig = (
  size?: SizeType
): GetInputLabelTopStyleConfigReturnType => {
  if (size === "small") {
    return {
      topMargin: 16,
      fontSize: 13,
      scale: 0.7,
    };
  }

  if (size === "large") {
    return {
      topMargin: 24,
      fontSize: 16,
      scale: 0.85,
    };
  }

  return {
    topMargin: 20,
    fontSize: 14,
    scale: 0.75,
  };
};

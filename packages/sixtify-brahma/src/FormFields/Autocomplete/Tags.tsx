import { type AutocompleteRenderGetTagProps } from "@mui/material";
import type { Option } from "./Autocomplete";
import { AvatarCell } from "./AvatarCell";
import { StyledChip } from "./Chip.styled";

type TagsProps = Readonly<{
  tags: Option[];
  getTagProps: AutocompleteRenderGetTagProps;
  isShowAvatar: boolean;
  disabled: boolean;
  startIndex: number;
}>;

export const Tags = ({
  tags,
  getTagProps,
  isShowAvatar,
  disabled,
  startIndex,
}: TagsProps) => {
  return tags.map((option: Option, index) => {
    const realIndex = startIndex + index;

    const { key, ...tagProps } = getTagProps({
      index: realIndex,
    });

    const label = typeof option === "string" ? option : option.label;

    return (
      <StyledChip
        key={key}
        avatar={
          <AvatarCell
            isShowAvatar={isShowAvatar}
            option={option}
            label={label}
          />
        }
        label={label}
        {...tagProps}
        disabled={option.disabled || disabled}
      />
    );
  });
};

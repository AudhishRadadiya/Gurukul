import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonImageUpload,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontSize,
  MenuSelectHeading,
  MenuSelectTextAlign,
} from "mui-tiptap";

export const EditorMenuControls = () => {
  return (
    <MenuControlsContainer>
      <MenuButtonImageUpload
        onUploadFiles={(files) =>
          files.map((file) => ({
            src: URL.createObjectURL(file),
            alt: file.name,
          }))
        }
      />
      <MenuDivider />
      <MenuSelectHeading />
      <MenuDivider />
      <MenuSelectFontSize />
      <MenuDivider />
      <MenuButtonBold />
      <MenuButtonItalic />
      <MenuButtonUnderline />
      <MenuButtonEditLink />
      <MenuButtonOrderedList />
      <MenuButtonBulletedList />
      <MenuSelectTextAlign defaultValue="justify" />
      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
};

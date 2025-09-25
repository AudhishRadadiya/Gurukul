import { Button } from "@codezee/sixtify-brahma";
import { Autocomplete, Stack, TextField } from "@mui/material";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  List,
  Undo,
  Redo,
  Italic,
  Strikethrough,
  NumberedListLeft,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from "iconoir-react";

import {
  activeButton,
  fontFamilies,
  fontSizes,
} from "@web/components/common/TextEditor/hooks/constant";
import { useTextEditorState } from "@web/components/common/TextEditor/hooks/useTextEditorState";

type EditorToolbarProps = { editor: Editor | null };

export const TextEditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) {
    return null;
  }

  const { editorState } = useTextEditorState(editor);

  return (
    <Stack direction="row" gap="10px" alignItems="center" flexWrap="wrap">
      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        className={editorState.isBold ? "is-active" : ""}
        sx={activeButton}
      >
        <Bold />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        className={editorState.isItalic ? "is-active" : ""}
        sx={activeButton}
      >
        <Italic />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        className={editorState.isStrike ? "is-active" : ""}
        sx={activeButton}
      >
        <Strikethrough />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editorState.isHeading1 ? "is-active" : ""}
        sx={activeButton}
      >
        H1
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editorState.isHeading2 ? "is-active" : ""}
        sx={activeButton}
      >
        H2
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editorState.isHeading3 ? "is-active" : ""}
        sx={activeButton}
      >
        H3
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editorState.isHeading4 ? "is-active" : ""}
        sx={activeButton}
      >
        H4
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editorState.isHeading5 ? "is-active" : ""}
        sx={activeButton}
      >
        H5
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editorState.isHeading6 ? "is-active" : ""}
        sx={activeButton}
      >
        H6
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editorState.isBulletList ? "is-active" : ""}
        sx={activeButton}
      >
        <List />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editorState.isOrderedList ? "is-active" : ""}
        sx={activeButton}
      >
        <NumberedListLeft />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editorState.isLeftAligned ? "is-active" : ""}
        sx={activeButton}
      >
        <AlignLeft />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editorState.isRightAligned ? "is-active" : ""}
        sx={activeButton}
      >
        <AlignRight />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editorState.isCenterAligned ? "is-active" : ""}
        sx={activeButton}
      >
        <AlignCenter />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      >
        <Undo />
      </Button>

      <Button
        variant="outlined"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      >
        <Redo />
      </Button>

      <input
        type="color"
        style={{ borderRadius: "4px", height: "35px", width: "60px" }}
        onChange={(e) => {
          editor.chain().focus().setColor(e.target.value).run();
        }}
        value={editorState.color}
        disabled={!editor.can().chain().setColor(editorState.color).run()}
      />

      <Button
        variant="outlined"
        onClick={() => {
          editor.chain().focus().unsetColor().run();
        }}
      >
        Default Color
      </Button>

      <Autocomplete
        disablePortal
        disableClearable={true}
        options={fontFamilies}
        defaultValue={fontFamilies[0]}
        sx={{ width: 188 }}
        onChange={(_, newValue) => {
          if (newValue) {
            editor.chain().focus().setFontFamily(newValue.value).run();
          }
        }}
        renderInput={(params) => <TextField {...params} />}
        renderOption={(props, option) => (
          <li {...props} style={{ fontSize: "15px" }}>
            {option.label}
          </li>
        )}
      />

      <Autocomplete
        disablePortal
        disableClearable={true}
        options={fontSizes}
        defaultValue={fontSizes[3]}
        sx={{ width: 100 }}
        onChange={(_, newValue) => {
          if (newValue) {
            editor.chain().focus().setFontSize(newValue.value).run();
          }
        }}
        renderInput={(params) => <TextField {...params} />}
        renderOption={(props, option) => (
          <li {...props} style={{ fontSize: "15px" }}>
            {option.label}
          </li>
        )}
      />
    </Stack>
  );
};

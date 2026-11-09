export type OnAction<Args = void, Return = void> = [Args] extends [void]
  ? () => Return
  : (props: Args) => Return;

export type SizeType = "small" | "medium" | "large";

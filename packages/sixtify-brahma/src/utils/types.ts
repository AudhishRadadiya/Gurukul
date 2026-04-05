export type OnAction<Args = void, Return = void> = [Args] extends [void]
  ? () => Return
  : (props: Args) => Return;

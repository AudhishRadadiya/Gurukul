import type { MouseEventHandler, ReactNode } from "react";

export type SubMenuItem = {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  dataPTag?: string;
  dataCy?: string;
  hidden?: boolean;
};

export type MenuItem = {
  key: string;
  label: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  dataPTag?: string;
  dataCy?: string;
  divider?: boolean;
  hidden?: boolean;
  subMenuItems?: SubMenuItem[];
};

export type ActionButton = {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  tooltip?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  menuItems?: MenuItem[];
  endIcon?: ReactNode;
  menuPlacement?: "left" | "right";
  size?: "small" | "medium" | "large";
  dataPTag?: string;
  dataCy?: string;
  hidden?: boolean;
  disableElevation?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  disabled?: boolean;
};

export type DataProps = {
  dataPTag?: string;
  dataCy?: string;
};

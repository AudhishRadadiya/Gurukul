import { Grid } from "@mui/material";
import { Children, type ReactNode } from "react";

type FormGridLayoutProps = {
  children: ReactNode;
  columns?: number;
  columnsOnMobile?: number;
};

export const FormGridLayout = ({
  children,
  columns = 3,
  columnsOnMobile = 1,
}: FormGridLayoutProps) => {
  const validColumns = columns ? columns : 3;

  const validColumnsOnMobile = columnsOnMobile ? columnsOnMobile : 1;

  return (
    <Grid container spacing={2} rowSpacing={1}>
      {Children.map(
        children,
        (child, index) =>
          child && (
            <Grid
              // eslint-disable-next-line sonarjs/no-array-index-key
              key={index}
              sx={{
                "& > *": {
                  width: { xs: "100%", sm: "auto" },
                },
              }}
              item
              xs={12 / validColumnsOnMobile}
              sm={12 / Math.min(validColumns, 2)}
              md={12 / Math.min(validColumns, 3)}
              lg={12 / validColumns}
            >
              {child}
            </Grid>
          )
      )}
    </Grid>
  );
};

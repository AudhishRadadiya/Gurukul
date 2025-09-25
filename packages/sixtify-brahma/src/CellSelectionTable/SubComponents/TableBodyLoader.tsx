import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import type { Column } from "../utils";

type TableBodyLoaderProps = {
  columns: Column[];
  rowCount?: number;
};

export const TableBodyLoader = ({
  columns,
  rowCount = 25,
}: TableBodyLoaderProps) => {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map(() => (
        <TableRow key={uuidv4()}>
          {columns.map(() => (
            <TableCell key={uuidv4()} sx={{ padding: "5px 10px" }}>
              <Skeleton width="100%" height="100%" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

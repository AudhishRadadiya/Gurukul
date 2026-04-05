import { Checkbox, Stack, Typography, useTheme } from "@mui/material";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { formatDateValue } from "../../utils/helper";

type VirtualCheckboxListProps = {
  checkedMap: Record<string, boolean>;
  onToggle: (value: string) => void;
  options: string[];
};

export const VirtualCheckboxList = memo(
  ({ checkedMap, onToggle, options }: VirtualCheckboxListProps) => {
    const theme = useTheme();

    const { butterflyBlue, sapphireBlue } = theme.palette.app.color;

    const containerRef = useRef<HTMLDivElement>(null);

    const [visibleRange, setVisibleRange] = useState({ end: 20, start: 0 });

    const [isMouseDown, setIsMouseDown] = useState(false);

    const [dragMode, setDragMode] = useState<"check" | "unCheck" | null>(null);

    const ITEM_HEIGHT = 25;

    const BUFFER = 5;

    const CONTAINER_HEIGHT = 200;

    const handleScroll = useCallback(() => {
      if (!containerRef.current) {
        return;
      }

      const scrollTop = containerRef.current.scrollTop;

      const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);

      const end = Math.min(
        options.length,
        Math.ceil((scrollTop + CONTAINER_HEIGHT) / ITEM_HEIGHT) + BUFFER
      );

      if (start !== visibleRange.start || end !== visibleRange.end) {
        setVisibleRange({ end, start });
      }
    }, [options.length, visibleRange.start, visibleRange.end]);

    const visibleItems = useMemo(() => {
      return options.slice(visibleRange.start, visibleRange.end);
    }, [options, visibleRange.start, visibleRange.end]);

    // useCallback is used to memoize the handler and prevent unnecessary re-creations
    // when passed to event listeners inside the list items.
    const handleMouseDown = useCallback(
      (value: string) => {
        setIsMouseDown(true);

        const isAlreadyChecked = checkedMap[value];

        setDragMode(isAlreadyChecked ? "unCheck" : "check");
        onToggle(value);
      },
      [onToggle, checkedMap]
    );

    // useCallback ensures stable reference when attached to multiple items’ mouse events,
    // avoiding re-binding on every render and improving performance.
    const handleMouseEnter = useCallback(
      (value: string) => {
        if (isMouseDown && dragMode) {
          const isChecked = checkedMap[value];

          if (
            (dragMode === "check" && !isChecked) ||
            (dragMode === "unCheck" && isChecked)
          ) {
            onToggle(value);
          }
        }
      },
      [isMouseDown, dragMode, checkedMap, onToggle]
    );

    // useCallback memoizes this function so the global mouseup listener
    // remains stable across renders, preventing multiple event bindings.
    const handleMouseUp = useCallback(() => {
      setIsMouseDown(false);
      setDragMode(null);
    }, []);

    // Stop drag globally when mouse released anywhere
    useMemo(() => {
      document.addEventListener("mouseup", handleMouseUp);

      return () => document.removeEventListener("mouseup", handleMouseUp);
    }, [handleMouseUp]);

    return (
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "300px",
          maxHeight: `${CONTAINER_HEIGHT}px`,
          overflowY: "auto",
          position: "relative",
          userSelect: "none",
        }}
      >
        <div
          style={{
            height: `${options.length * ITEM_HEIGHT}px`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: `${visibleRange.start * ITEM_HEIGHT}px`,
              width: "100%",
            }}
          >
            {visibleItems.map((value) => {
              const isChecked = checkedMap[value] || false;

              return (
                <Stack
                  key={value}
                  onMouseDown={() => handleMouseDown(value)}
                  onMouseEnter={() => handleMouseEnter(value)}
                  style={{
                    backgroundColor: isChecked
                      ? sapphireBlue[400]
                      : "transparent",
                    cursor: "pointer",
                  }}
                  flexDirection="row"
                  alignItems="center"
                  gap="5px"
                  height={`${ITEM_HEIGHT}px`}
                >
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggle(value);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    size="small"
                    style={{
                      color: isChecked ? butterflyBlue[900] : "",
                      padding: "4px",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="black"
                    sx={{
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: "1",
                      // eslint-disable-next-line sort-keys
                      display: "-webkit-box",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "150px",
                    }}
                  >
                    {formatDateValue(value)}
                  </Typography>
                </Stack>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

VirtualCheckboxList.displayName = "VirtualCheckboxList";

import ZoomInOutlinedIcon from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon from "@mui/icons-material/ZoomOutOutlined";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import {
  type MouseEvent,
  useMemo,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import { Button } from "../../../Button";
import { FilePreviewContainer } from "../../../Layouts";
import { PadBox } from "../../../PadBox";
import { isImageDomainValid } from "../../../utils";

type Position = {
  x: number;
  y: number;
};

type Offset = {
  offsetX: number;
  offsetY: number;
};

type FilePreviewProps = {
  fileName: string;
  resetTrigger?: number;
};

export const SUPPORTED_IMAGE_FORMATS = [".png", ".jpg", ".jpeg"] as const;

export const SUPPORTED_PDF_FORMATS = [".pdf"] as const;

export const SUPPORTED_DOC_FORMATS = [".doc", ".docx"] as const;

export const SUPPORTED_EXCEL_FORMATS = [".xls", ".xlsx"] as const;

const DEFAULT_ZOOM_CONFIG = {
  min: 0.5,
  max: 2,
  step: 0.5,
  sensitivity: 0.1,
};

export function isFileType(
  url: string,
  extensions: readonly string[]
): boolean {
  return extensions.some((ext) => url.toLowerCase().endsWith(ext));
}

export const FilePreview = ({ fileName, resetTrigger }: FilePreviewProps) => {
  const isValidUrl = isImageDomainValid(fileName);

  const [isDragging, setIsDragging] = useState(false);

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });

  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const { sensitivity, min, max, step } = DEFAULT_ZOOM_CONFIG;

  const { x: positionX, y: positionY } = position;

  const handleMouseDown = ({
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartPos({ x: clientX - positionX, y: clientY - positionY });
  };

  const handleMouseMove = ({
    clientX,
    clientY,
  }: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const x = clientX - startPos.x;

      const y = clientY - startPos.y;

      setPosition({ x, y });
    }
  };

  const calculateOffset = (
    {
      clientX,
      clientY,
    }: MouseEvent<HTMLDivElement> | WheelEvent<HTMLDivElement>,
    container: HTMLDivElement
  ): Offset => {
    const { left, top, height, width } = container.getBoundingClientRect();

    const mouseX = clientX - left;

    const mouseY = clientY - top;

    return {
      offsetX: mouseX - width / 2,
      offsetY: mouseY - height / 2,
    };
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;

    if (!container) {
      return;
    }

    const { offsetX, offsetY } = calculateOffset(e, container);

    const delta = e.deltaY > 0 ? -sensitivity : sensitivity;

    const newZoom = Math.min(Math.max(zoomLevel + delta, min), max);

    if (newZoom !== zoomLevel) {
      const zoomFactor = newZoom / zoomLevel;

      const newX = positionX - offsetX * (zoomFactor - 1);

      const newY = positionY - offsetY * (zoomFactor - 1);

      setPosition({ x: newX, y: newY });
      setZoomLevel(newZoom);
    }
  };

  const resetZoomLevel = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  useMemo(() => {
    resetZoomLevel();
  }, [resetTrigger]);

  const updateZoomLevel = (delta: number) => {
    setZoomLevel((prev) => {
      const updatedZoom = Math.min(2, Math.max(0.5, prev + delta));

      return updatedZoom;
    });
  };

  const handleDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const container = imageContainerRef.current;

    if (!container) {
      return;
    }

    const { offsetX, offsetY } = calculateOffset(e, container);

    const newZoom = zoomLevel > 1 ? 1 : Math.min(zoomLevel + step, max);

    if (zoomLevel > 1) {
      resetZoomLevel();

      setZoomLevel(newZoom);

      return;
    }

    const zoomFactor = newZoom / zoomLevel;

    const newX = positionX - offsetX * (zoomFactor - 1);

    const newY = positionY - offsetY * (zoomFactor - 1);

    setPosition({ x: newX, y: newY });
    setZoomLevel(newZoom);
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  if (isFileType(fileName, SUPPORTED_PDF_FORMATS)) {
    return (
      <FilePreviewContainer>
        <iframe
          src={`${fileName}#toolbar=0`}
          style={{ width: "100%", height: "100%" }}
        />
      </FilePreviewContainer>
    );
  }

  if (isFileType(fileName, SUPPORTED_IMAGE_FORMATS) && isValidUrl) {
    return (
      <FilePreviewContainer>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="10px"
          sx={{
            position: "absolute",
            top: 10,
            right: 66,
            zIndex: 10,
          }}
        >
          <Button
            sx={{
              backgroundColor: slate[900],
              minWidth: "42px",
              height: "42px",
            }}
            onClick={() => updateZoomLevel(-0.3)}
          >
            <ZoomOutOutlinedIcon />
          </Button>

          <Button
            sx={{
              backgroundColor: slate[900],
              minWidth: "42px",
              height: "42px",
            }}
            onClick={() => updateZoomLevel(0.3)}
          >
            <ZoomInOutlinedIcon />
          </Button>

          {zoomLevel !== 1 && (
            <Button
              sx={{
                backgroundColor: slate[900],
                minWidth: "42px",
                height: "42px",
              }}
              onClick={() => resetZoomLevel()}
            >
              Reset
            </Button>
          )}
        </Stack>

        <Box
          ref={imageContainerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
            transform: `scale(${zoomLevel}) translate(${positionX / zoomLevel}px, ${positionY / zoomLevel}px)`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.2s ease-in-out",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
        >
          <Image
            src={fileName}
            alt="Attachment"
            fill
            style={{
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </Box>
      </FilePreviewContainer>
    );
  }

  if (
    isFileType(fileName, SUPPORTED_DOC_FORMATS) ||
    isFileType(fileName, SUPPORTED_EXCEL_FORMATS)
  ) {
    return (
      <FilePreviewContainer>
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            fileName
          )}`}
          style={{ width: "100%", height: "100%" }}
        />
      </FilePreviewContainer>
    );
  }

  return (
    <FilePreviewContainer>
      <PadBox padding={{ padding: "10px" }}>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          File Preview Not Supported
        </Typography>
      </PadBox>
    </FilePreviewContainer>
  );
};

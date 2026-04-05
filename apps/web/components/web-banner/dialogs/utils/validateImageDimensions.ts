export const validateImageDimensions = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();

    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const isValid = img.width <= maxWidth && img.height <= maxHeight;

      resolve(isValid);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      resolve(false);
    };

    img.src = objectUrl;
  });
};

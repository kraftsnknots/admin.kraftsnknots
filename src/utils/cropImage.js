export const getCroppedImg = (imageSrc, crop) => {
  const canvas = document.createElement("canvas");
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        resolve(new File([blob], `cropped-${Date.now()}.jpg`, {
          type: "image/jpeg",
        }));
      }, "image/jpeg");
    };
  });
};

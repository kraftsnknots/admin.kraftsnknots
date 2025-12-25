import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { getCroppedImg } from "../utils/cropImage";

export default function ImageCropperModal({
  file,
  onCancel,
  onCropped,
  isLast,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    const croppedFile = await getCroppedImg(
      URL.createObjectURL(file),
      croppedAreaPixels
    );
    onCropped(croppedFile);
  };

  return ReactDOM.createPortal(
    <div className="cropper-overlay">
      <div className="cropper-box">

        {/* 🔲 CROPPER AREA */}
        <div className="cropper-area">
          <Cropper
            image={URL.createObjectURL(file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* 🔘 ACTIONS */}
        <div className="cropper-footer">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn-save" onClick={handleSave}>
            {isLast ? "Save & Upload" : "Save & Next"}
          </button>
        </div>

      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

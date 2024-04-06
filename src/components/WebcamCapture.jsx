import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { addPhoto,deletePhoto,updatePhoto, GetPhotoSrc,getPhotoSrcFromDB } from "../db.jsx"; 
const WebcamCapture = ({ imgSrc, setImgSrc, addPhoto, ...props }) => {
  const webcamRef = useRef(null);
  const [imgId, setImgId] = useState(null);
  const [photoSave, setPhotoSave] = useState(false);

  useEffect(() => {
    if (photoSave) {
      console.log("useEffect detected photoSave");
      props.photoedTask(imgId);
      setPhotoSave(false);
    }
  });

  console.log("WebCamCapture", props.id);

  const capture = useCallback((id) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log("capture", imageSrc.length, id);
  }, [webcamRef, setImgSrc]);

  const savePhoto = (id, imgSrc) => {
    console.log("savePhoto", imgSrc.length, id);
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
  };

  const cancelPhoto = () => {
    if (!imgSrc) {
      alert("img is empty");
      return;
    } else {
      alert("cancelPhoto", imgSrc.length, props.id);
      setImgSrc(null);
    }
  };

  return (
    <div style={{ maxWidth: '140%' }}>
      <>
        {!imgSrc && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
        {imgSrc && <img src={imgSrc} />}
        <div className="btn-group">
          {!imgSrc && (
            <button
              type="button"
              className="btn"
              onClick={() => capture(props.id)}
            >
              Capture photo
            </button>
          )}
          {imgSrc && (
            <button
              type="button"
              className="btn"
              onClick={() => savePhoto(props.id, imgSrc)}
            >
              Save Photo
            </button>
          )}
          <button
            type="button"
            className="btn todo-cancel"
            onClick={cancelPhoto}
          >
            Cancel
          </button>
        </div>
      </>
    </div>
  );
};

export default WebcamCapture;

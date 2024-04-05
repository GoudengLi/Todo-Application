import { useEffect, useRef, useState, useCallback } from "react"; 
import Popup from "reactjs-popup"; 
import "reactjs-popup/dist/index.css"; 
import Webcam from "react-webcam"; 
import { addPhoto,deletePhoto,updatePhoto, GetPhotoSrc,getPhotoSrcFromDB } from "../db.jsx"; 
import React from 'react';
import GoogleMap from '../GoogleMap.jsx';

function Todo(props) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const editButtonRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const DATA = JSON.parse(localStorage.getItem('tasks'))||[];
  

 

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    setEditing(false);
  }
  

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>

    <div className="form-group">
      <label className="todo-label" htmlFor={props.id}>
        New name for {props.name}
      </label>
      <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
    </div>
    <div className="btn-group">
    <button
  type="button"
  className="btn todo-cancel"
  onClick={() => setEditing(false)}>
  Cancel
  <span className="visually-hidden">renaming {props.name}</span>
</button>

      <button type="submit" className="btn btn__primary todo-edit">
        Save
        <span className="visually-hidden">new name for {props.name}</span>
      </button>
    </div>
    
  </form>
);


const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
};

const handleUpdatePhoto = async (id) => {
  if (selectedFile) {
    try {
      // Using FileReader to read a file and convert it to a Base64 encoded string.
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = async () => {
        const base64Img = reader.result;

        // Invoke the update photo function and pass the Base64 encoded image string.
        await updatePhoto(id, base64Img);
        console.log(`Photo with ID ${id} successfully updated.`);
      };
    } catch (error) {
      console.error(`Failed to update photo with ID ${id}: ${error}`);
    }
  } else {
    console.error("No file selected.");
  }
};
const [showPopup, setShowPopup] = useState(false);
const togglePopup = () => {
  setShowPopup(!showPopup);
};


function getCoordinatesById(id) {
  const foundItem = DATA.find(item => item.id === id);
  if (foundItem) {
      return foundItem.location;
  } else {
      return "sb";
  }
}

const [initialCoordinates, setInitialCoordinates] = useState(null); 


useEffect(() => {
  // 调用getCoordinatesById方法获取坐标
  const fetchCoordinates = () => {
    const id = props.id; 
    const coordinates = getCoordinatesById(id);

    if (coordinates !== "sb") {
      const latitude = parseFloat(coordinates.latitude);
      const longitude = parseFloat(coordinates.longitude);

      // 如果成功获取到坐标，则更新initialCoordinates
      setInitialCoordinates({ latitude, longitude });
      console.log(coordinates);
    }
  };

  fetchCoordinates();
}, [props.id]);


const viewTemplate = (
 
  
  <div className="stack-small">
  <div className="c-cb">
  <input
  id={props.id}
  type="checkbox"
  defaultChecked={props.completed}
  onChange={() => props.toggleTaskCompleted(props.id)}
  />
  <label className="todo-label" htmlFor={props.id}>


  <div className="App">
  {props.name} &nbsp;&nbsp; <a href={props.location.smsURL}>(sms)&nbsp;&nbsp;</a>
  <Popup
  trigger={<button onClick={togglePopup}>(map)</button>}
  modal
  open={showPopup}
  onClose={togglePopup}
  className="custom-popup" // 添加自定义的CSS类名
>
  <div>
    <GoogleMap initialCoordinates={initialCoordinates} />
  </div>
</Popup>
    </div>
 
 
  </label>
  </div>
  <div className="btn-group">
  <button
  type="button"
  className="btn"
  onClick={() => {
  setEditing(true);
  }}
  ref={editButtonRef}
  >
  Edit <span className="visually-hidden">{props.name}</span>
  </button>
  <Popup 
  trigger={
  <button type="button" className="btn">
  {" "}
  Take Photo{" "}
  </button>
  }
  modal
  >
 <div style={{ width: '100%' }}>
  <WebcamCapture id={props.id} photoedTask={props.photoedTask} 
    imgSrc={imgSrc} setImgSrc={setImgSrc}/>
</div>
  </Popup>
  
  <Popup 
  
  trigger={
    
  <button type="button" className="btn">
  {" "}
  View Photo{" "}
  </button>
  }
  modal
  >
  <div>
  <ViewPhoto id={props.id} alt={props.name} />
  </div>
  </Popup>
  <button
  type="button"
  className="btn btn__danger"
  onClick={() => props.deleteTask(props.id)}
  >
  Delete <span className="visually-hidden">{props.name}</span>
  </button>
  </div>

  <div>
  {imgSrc ? (
    <React.Fragment>
      <input type="file" onChange={handleFileChange} />
      <button onClick={() => handleUpdatePhoto(props.id)}>Update Photo</button>
    </React.Fragment>
  ) : null}
</div>

  </div>
  );


return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;

  }

const WebcamCapture = ({ imgSrc, setImgSrc, ...props }) => {
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
   
    const capture = useCallback( (id) => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    console.log("capture", imageSrc.length, id);
    },
    [webcamRef, setImgSrc]
    );
 
    const savePhoto = (id, imgSrc) => {
    console.log("savePhoto", imgSrc.length, id);
    addPhoto(id, imgSrc);
    setImgId(id);
    setPhotoSave(true);
    };

    const cancelPhoto = (id, imgSrc) => {
      if (!imgSrc) {
       alert("img is empty");
        return;
      }else{
        alert("cancelPhoto", imgSrc.length, id);
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
    onClick={() => capture(props.id)}>
    Capture photo
    </button>
    )}
    {imgSrc && ( 
    <button
    type="button"
    className="btn"
    onClick={() => savePhoto(props.id, imgSrc)}>
    Save Photo
    </button>
    )}
    <button 
    type="button"
    className="btn todo-cancel"
    onClick={() => cancelPhoto(props.id, imgSrc)
    
    }>
    Cancel
    </button>
    </div>
   
    </>
    </div>);
   };


   const ViewPhoto = (props) => {
    const photoSrc = GetPhotoSrc(props.id);
    const [currentPhotoSrc, setPhotoSrc] = useState(null);
    useEffect(() => {
      getPhotoSrcFromDB(props.id)
        .then(imgSrc => {
          if (imgSrc !== null) {
            setPhotoSrc(imgSrc);
          } else {
            setPhotoSrc(null);
            console.log("Photo source not found.");
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    }, [props.id]);
  
    const handleDeletePhoto = () => {
      deletePhoto(props.id);
    };
    
   
  

    
    if (currentPhotoSrc==null) {
      return (
        <div style={{ margin: 'auto' }}>
          <p>Photo not found</p>
        </div>
        
      );
    }else{ return (
      <div className="photo-container">
        <>
        <img src={photoSrc} alt={props.name} className="photo" />
        <br />
          <button
            type="button"
            className="btn btn__danger"
            onClick={handleDeletePhoto}
          >
            Delete Photo
          </button>
        </>
      </div>
    );}



    

   
  };
  
  export default Todo;
  
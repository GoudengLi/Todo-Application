import Dexie from "dexie"; 
import { useLiveQuery } from "dexie-react-hooks";
export const db = new Dexie("todo-photos"); 
db.version(1).stores({ 
 photos: "id", 

});
async function addPhoto(id, imgSrc) {
 console.log("addPhoto", imgSrc.length, id);
 try {
 const i = await db.photos.add({
 id: id, 
 imgSrc: imgSrc, 
 });
 console.log(`Photo ${imgSrc.length} bytes successfully added. Got id ${i}`);
 } catch (error) {
 console.log(`Failed to add photo: ${error}`);
 }
 return (
 <>
 <p>
 {imgSrc.length} &nbsp; | &nbsp; {id}
 </p>
 </>
 );
}

async function deletePhoto(id) {
    console.log("deletePhoto", id);
    try {
      await db.photos.where("id").equals(id).delete();
      console.log(`Photo with id ${id} successfully deleted.`);
    } catch (error) {
      console.log(`Failed to delete photo: ${error}`);
    }
  }

function GetPhotoSrc(id) {
 console.log("getPhotoSrc", id);
 const img = useLiveQuery(() => db.photos.where("id").equals(id).toArray());
 console.table(img);
 if (Array.isArray(img) && img.length > 0 && img[0] && img[0].imgSrc) {
  return img[0].imgSrc;
} else {
  return null; 
}
}

async function getPhotoSrcFromDB(id) {
  try {
     
      const photoInfo = await db.photos.where("id").equals(id).first();
      
  
      return photoInfo ? photoInfo.imgSrc : null;
  } catch (error) {
      console.error("Error fetching photo from database:", error);
      return null;
  }
}
export { addPhoto, GetPhotoSrc ,deletePhoto,getPhotoSrcFromDB}; 
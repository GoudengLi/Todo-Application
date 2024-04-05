import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";

// create dexie
export const db = new Dexie("todo-photos");
db.version(4).stores({
  photos: "id",
  locations: "id"
});



// add photo
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
}

// delete phpto
async function deletePhoto(id) {
  console.log("deletePhoto", id);
  try {
    await db.photos.where("id").equals(id).delete();
    console.log(`Photo with id ${id} successfully deleted.`);
  } catch (error) {
    console.log(`Failed to delete photo: ${error}`);
  }
}
 // update photo
async function updatePhoto(id, updatedImgSrc) {
  console.log("updatePhoto", id);
  try {
    await db.photos.where("id").equals(id).modify({ imgSrc: updatedImgSrc });
    console.log(`Photo with id ${id} successfully updated.`);
  } catch (error) {
    console.log(`Failed to update photo: ${error}`);
  }
}

// get photosrc by id
async function getPhotoSrcFromDB(id) {
  try {
    const photoInfo = await db.photos.where("id").equals(id).first();
    return photoInfo ? photoInfo.imgSrc : null;
  } catch (error) {
    console.error("Error fetching photo from database:", error);
    return null;
  }
}

// get photosrc by id
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


async function getCoordinatesById(id) {
  const foundItem = DATA.find(item => item.id === id);
  if (foundItem) {
      return foundItem.location;
  } else {
      return "sb";
  }
}




export { addPhoto, deletePhoto, updatePhoto,getPhotoSrcFromDB, GetPhotoSrc ,getCoordinatesById};
import { firestore } from './firebase-config.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentTitle = "";
let currentDescription = "";
let currentType = "";
async function saveArtToFirestore(artData) {
  try {
   
    await addDoc(collection(firestore, "artGallery"), {
      title: artData.title,
      description: artData.description,
      type: artData.type,
      fileurl: artData.fileurl || null,  
      content: artData.content || null,  
      createdAt: new Date()
    });
    alert("Art saved successfully!");
  } catch (error) {
    console.error("Error saving art:", error);
    alert("Failed to save art.");
  }
}

document.getElementById('submit').addEventListener('click', async (event) => {
  event.preventDefault();

  const title = document.getElementById('arttitle').value;
  const description = document.getElementById('description').value;
  const type = document.getElementById('artselect').value;

  if (type === "text") {
    const content = document.querySelector('textarea[name="arttext"]').value;
    await saveArtToFirestore({ title, description, type, content });
  } else {
   const uploadWidget = cloudinary.createUploadWidget({
  cloudName: "your_cloud_name",
  uploadPreset: "your_unsigned_preset"
}, (error, result) => {
  if (!error && result.event === "success") {
    const fileUrl = result.info.secure_url;
    saveArtToFirestore({
      title: currentTitle,
      description: currentDescription,
      type: currentType,
      fileurl: fileUrl
    });
  }
});

// Single submit event listener
document.getElementById('submit').addEventListener('click', (event) => {
  event.preventDefault();

  const title = document.getElementById('arttitle').value;
  const description = document.getElementById('description').value;
  const type = document.getElementById('artselect').value;

  if (type === "text") {
    const content = document.querySelector('textarea[name="arttext"]').value;
    saveArtToFirestore({ title, description, type, content });
  } else if (type === "image" || type === "audio") {
    currentTitle = title;
    currentDescription = description;
    currentType = type;
    uploadWidget.open(); // open the Cloudinary widget to upload file
  } else {
    alert("Please select a valid art type.");
  }

});
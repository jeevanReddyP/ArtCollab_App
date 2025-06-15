import { firestore } from './firebase-config.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


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
  cloudName: "v",           // Replace with your Cloudinary cloud name
  uploadPreset: "unsigned_preset"         // Your unsigned upload preset name
}, (error, result) => {
  if (!error && result.event === "success") {
    const fileUrl = result.info.secure_url;  // The uploaded file's URL
    // Now save to Firestore with this URL
    saveArtToFirestore({
      title: currentTitle,
      description: currentDescription,
      type: currentType,
      fileurl: fileUrl
    });
  }
});

  }
});
document.getElementById('submit').addEventListener('click', (event) => {
  event.preventDefault();

  const title = document.getElementById('arttitle').value;
  const description = document.getElementById('description').value;
  const type = document.getElementById('artselect').value;

  if (type === "text") {
    const content = document.querySelector('textarea[name="arttext"]').value;
    saveArtToFirestore({ title, description, type, content });
  } else if (type === "image" || type === "audio") {
    // Store current form data to use in upload widget callback
    currentTitle = title;
    currentDescription = description;
    currentType = type;

    // Open Cloudinary upload widget
    uploadWidget.open();
  } else {
    alert("Please select a valid art type.");
  }
});

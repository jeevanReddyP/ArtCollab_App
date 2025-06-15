import { firestore } from './firebase-config.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentTitle = "";
let currentDescription = "";
let currentType = "";


// Create Cloudinary upload widget once, outside the event listener
const uploadWidget = cloudinary.createUploadWidget({
  cloudName: "dnbvjqofz",        // Replace with your Cloudinary cloud name
  uploadPreset: "unsigned_preset" // Replace with your unsigned upload preset
}, (error, result) => {
  if (!error && result.event === "success") {
    const fileUrl = result.info.secure_url;
    // Save to Firestore when upload finishes
    saveArtToFirestore({
      title: currentTitle,
      description: currentDescription,
      type: currentType,
      fileurl: fileUrl
    });
  }
});

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
    uploadWidget.open(); // Open Cloudinary upload widget for image/audio
  } else {
    alert("Please select a valid art type.");
  }
});

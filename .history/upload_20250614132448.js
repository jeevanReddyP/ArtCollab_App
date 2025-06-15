import { firestore } from './firebase-config.js'; 
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const auth = getAuth();

let currentUser = null;
let currentTitle = "";
let currentDescription = "";
let currentType = "";

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = null;
    alert("Please log in to upload art.");
  }
});

const uploadWidget = cloudinary.createUploadWidget({
  cloudName: "dnbvjqofz",       
  uploadPreset: "unsigned_preset" 
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

async function saveArtToFirestore(artData) {
  const user = getAuth().currentUser;
  if (!user) {
    alert("You must be logged in to upload art.");
    return;
  }
   console.log("Saving art by user:", user?.uid)
  try {
    await addDoc(collection(firestore, "artGallery"), {
      title: artData.title,
      description: artData.description,
      type: artData.type,
      fileurl: artData.fileurl || null,
      content: artData.content || null,
      createdAt: new Date(),
      ownerId: user.uid,
    });
    alert("Art saved successfully!");
    window.location = "dashboard.html";
  } catch (error) {
    console.error("Error saving art:", error);
    alert("Failed to save art.");
  }
}

document.getElementById('submit').addEventListener('click', (event) => {
  event.preventDefault();

  if (!user) {
    alert("Please log in first to upload.");
    return;
  }

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
    uploadWidget.open();
  } else {
    alert("Please select a valid art type.");
  }
});

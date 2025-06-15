import { firestore } from './firebase-config.js';  // Adjust path as needed
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


async function saveArtToFirestore(artData) {
  try {
    // "artGallery" is your collection name in Firestore
    await addDoc(collection(firestore, "artGallery"), {
      title: artData.title,
      description: artData.description,
      type: artData.type,
      fileurl: artData.fileurl || null,  // file URL for images/audio or null for text
      content: artData.content || null,  // text content if type is text
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
   
  }
});

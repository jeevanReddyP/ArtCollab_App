import { firestore } from './firebase-config.js';
import { collection, addDoc, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { cloudinary } from './cloudinary-config.js';

let currentTitle = "";
let currentDescription = "";
let currentType = "";
let currentFileUrl = "";
let currentDocId = "";

const uploadWidget = cloudinary.createUploadWidget({
  cloudName: "dnbvjqofz",
  uploadPreset: "unsigned_preset"
}, (error, result) => {
  if (!error && result.event === "success") {
    currentFileUrl = result.info.secure_url;
    saveArtToFirestore({
      title: currentTitle,
      description: currentDescription,
      type: currentType,
      fileurl: currentFileUrl
    });
  }
});

async function saveArtToFirestore(artData) {
  try {
    const docRef = await addDoc(collection(firestore, "artGallery"), {
      title: artData.title,
      description: artData.description,
      type: artData.type,
      fileurl: artData.fileurl || null,
      content: artData.content || null,
      createdAt: new Date()
    });
    alert("Art saved successfully!");
    window.location = "dashboard.html";
  } catch (error) {
    console.error("Error saving art:", error);
    alert("Failed to save art.");
  }
}

async function deleteArtFromFirestore(docId, fileUrl) {
  try {
    const artDoc = doc(firestore, "artGallery", docId);
    await deleteDoc(artDoc);
    if (fileUrl) {
      const publicId = extractPublicId(fileUrl);
      await cloudinary.uploader.destroy(publicId);
    }
    alert("Art deleted successfully!");
    window.location.reload();
  } catch (error) {
    console.error("Error deleting art:", error);
    alert("Failed to delete art.");
  }
}

function extractPublicId(fileUrl) {
  const urlParts = fileUrl.split('/');
  const publicIdWithExtension = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExtension.split('.')[0];
  return publicId;
}

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
    uploadWidget.open();
  } else {
    alert("Please select a valid art type.");
  }
});

function renderPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');
  postsContainer.innerHTML = '';
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.description}</p>
      ${post.fileurl ? `<img src="${post.fileurl}" alt="${post.title}" style="max-width: 100%"/>` : ''}
      <button class="delete-btn" data-id="${post.id}" data-fileurl="${post.fileurl}">Delete</button>
    `;
    postsContainer.appendChild(postElement);
  });
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const docId = event.target.getAttribute('data-id');
      const fileUrl = event.target.getAttribute('data-fileurl');
      deleteArtFromFirestore(docId, fileUrl);
    });
  });
}

async function fetchPosts() {
  const querySnapshot = await getDocs(collection(firestore, "artGallery"));
  const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderPosts(posts);
}

fetchPosts();

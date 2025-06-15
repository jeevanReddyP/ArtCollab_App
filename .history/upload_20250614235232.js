<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Art Upload - ArtCollab</title>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    crossorigin="anonymous"
  />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 30px;
      background: #f9f9f9;
      color: #333;
    }
    form {
      max-width: 500px;
      margin: auto;
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 0 10px #ccc;
    }
    label {
      display: block;
      margin: 15px 0 5px;
      font-weight: bold;
    }
    input[type="text"],
    select,
    textarea {
      width: 100%;
      padding: 8px;
      font-size: 14px;
      border-radius: 4px;
      border: 1px solid #ccc;
      resize: vertical;
    }
    textarea {
      height: 100px;
    }
    button {
      margin-top: 20px;
      padding: 12px;
      width: 100%;
      font-size: 16px;
      background-color: #ff6f61;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #e85c50;
    }
  </style>
</head>
<body>

  <h1>Upload Art</h1>

  <form id="artUploadForm">
    <label for="arttitle">Title</label>
    <input type="text" id="arttitle" name="arttitle" required />

    <label for="description">Description</label>
    <textarea id="description" name="description"></textarea>

    <label for="artselect">Type of Art</label>
    <select id="artselect" name="artselect" required>
      <option value="" disabled selected>Select art type</option>
      <option value="image">Image</option>
      <option value="audio">Audio</option>
      <option value="text">Text</option>
    </select>

    <div id="textContentWrapper" style="display:none;">
      <label for="arttext">Enter Text Content</label>
      <textarea id="arttext" name="arttext"></textarea>
    </div>

    <button type="submit" id="submit">Upload</button>
  </form>

  <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>

  <script type="module">
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
      uploadPreset: "unsigned_preset",
      sources: ['local', 'url', 'camera', 'facebook', 'instagram'],
      multiple: false,
      resourceType: "auto",
      maxFileSize: 10485760,
    }, (error, result) => {
      if (!error && result && result.event === "success") {
        const fileUrl = result.info.secure_url;
        saveArtToFirestore({
          title: currentTitle,
          description: currentDescription,
          type: currentType,
          fileurl: fileUrl
        });
      }
      else if (error) {
        alert("Upload failed: " + error.message);
      }
    });

    async function saveArtToFirestore(artData) {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to upload art.");
        return;
      }

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
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error saving art:", error);
        alert("Failed to save art.");
      }
    }

    const form = document.getElementById('artUploadForm');
    const artselect = document.getElementById('artselect');
    const textContentWrapper = document.getElementById('textContentWrapper');

    artselect.addEventListener('change', () => {
      if (artselect.value === "text") {
        textContentWrapper.style.display = "block";
      } else {
        textContentWrapper.style.display = "none";
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!currentUser) {
        alert("Please log in first to upload.");
        return;
      }

      const title = document.getElementById('arttitle').value.trim();
      const description = document.getElementById('description').value.trim();
      const type = artselect.value;

      if (!title) {
        alert("Please enter a title.");
        return;
      }

      if (type === "text") {
        const content = document.getElementById('arttext').value.trim();
        if (!content) {
          alert("Please enter the text content.");
          return;
        }
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
  </script>
</body>
</html>

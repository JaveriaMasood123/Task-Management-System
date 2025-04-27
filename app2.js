import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvhp5RdY17DSQCO6p6vLrQ5E2RasBH-IM",
  authDomain: "sign-up-login-form-f52a3.firebaseapp.com",
  projectId: "sign-up-login-form-f52a3",
  storageBucket: "sign-up-login-form-f52a3.appspot.com",
  messagingSenderId: "339294474621",
  appId: "1:339294474621:web:f40c5c517c66c544effc14",
  measurementId: "G-J2985QSGLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Allow drop functionality for drag-and-drop
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.target.classList.add("dragging");
}

function drop(event) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text/plain");
  const card = document.getElementById(id);
  const container = event.target.closest(".column").querySelector(".card-container");
  if (card && container) {
    card.classList.remove("dragging");
    container.appendChild(card);
    saveToFirestore();  
  }
}

// Add Task with Title, Description, and Assignee
async function addCard(columnId) {
  const title = prompt("Enter task title:");
  const description = prompt("Enter task description:");
  const assignee = prompt("Assign this task to:");

  if (title && description && assignee) {
    const cardId = "card-" + Math.random().toString(36).substr(2, 9);

    // Create UI card
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.id = cardId;

    card.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Assigned to:</strong> ${assignee}</p>
      <div class="card-buttons">
        <button class="edit-btn" onclick="editCard(event)">✏️</button>
        <button class="delete-btn" onclick="deleteCard(event)">🗑️</button>
      </div>
    `;

    card.addEventListener("dragstart", drag);
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    const container = document.getElementById(columnId).querySelector(".card-container");
    container.appendChild(card);

    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        id: cardId,
        title: title,
        description: description,
        assignee: assignee,
        column: columnId,
        createdAt: new Date().toISOString()
      });
      console.log("Task added to Firestore with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding task to Firestore: ", error);
    }
  }
}

// Save task to Firestore
async function saveToFirestore() {
  const tasks = [];

  document.querySelectorAll('.card').forEach(card => {
    const column = card.closest('.column').id;
    tasks.push({
      id: card.id,
      title: card.querySelector('h3').innerText,
      description: card.querySelector('p').innerText,
      assignee: card.querySelector('p').innerText,
      column: column
    });
  });

  // Update Firestore with the new task states
  tasks.forEach(async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        column: task.column
      });
    } catch (error) {
      console.error("Error updating task in Firestore: ", error);
    }
  });
}

// Load tasks from Firestore and display them
async function loadFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const container = document.getElementById(task.column)?.querySelector('.card-container');

      if (container) {
        // Create a new task card
        const card = document.createElement("div");
        card.className = "card";
        card.draggable = true;
        card.id = task.id;

        card.innerHTML = `
          <h3>${task.title}</h3>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Assigned to:</strong> ${task.assignee}</p>
          <div class="card-buttons">
            <button class="edit-btn" onclick="editCard(event)">✏️</button>
            <button class="delete-btn" onclick="deleteCard(event)">🗑️</button>
          </div>
        `;

        // Add drag and drop event listeners
        card.addEventListener("dragstart", drag);
        card.addEventListener("dragend", () => card.classList.remove("dragging"));

        // Append the card to the column container
        container.appendChild(card);
      } else {
        console.warn(`Column with ID ${task.column} not found!`);
      }
    });
  } catch (error) {
    console.error("Error loading tasks from Firestore: ", error);
  }
}

// Delete a task
async function deleteCard(event) {
  event.stopPropagation();
  const card = event.target.closest(".card");
  const cardId = card.id;

  // Delete task from Firestore
  try {
    await deleteDoc(doc(db, "tasks", cardId));
    console.log("Task deleted from Firestore.");
  } catch (error) {
    console.error("Error deleting task from Firestore: ", error);
  }

  // Remove task from the UI
  card.remove();
  saveToFirestore(); // Update Firestore after deletion
}

// Edit a task
function editCard(event) {
  event.stopPropagation();
  const card = event.target.closest(".card");
  const h3 = card.querySelector("h3");
  const newTitle = prompt("Edit your task title:", h3.innerText);
  if (newTitle) {
    h3.innerText = newTitle;
    saveToFirestore(); // Update Firestore after edit
  }
}

// On page load, fetch tasks from Firestore
document.addEventListener("DOMContentLoaded", () => {
  loadFromFirestore();

  // Make functions globally available
  window.addCard = addCard;
  window.allowDrop = allowDrop;
  window.drag = drag;
  window.drop = drop;
  window.editCard = editCard;
  window.deleteCard = deleteCard;
});




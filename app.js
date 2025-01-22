const STORAGE_KEY = "notes";
const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const exportButton = document.querySelector(".note-export");

// Status of notes in memory
let notesCache = loadNotes();
let activeNote = null; // Stores a link to an open note

// Loading notes from localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Saving notes to localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  notesCache = notes; // Cache update
}

// Function for creating a note item
function createNoteElement(noteData) {
  const note = document.createElement("div");
  note.className = "note";
  // Note markup
  note.innerHTML = `
    <span class="note-date">${noteData.date}</span>
    
    <div class="note-title-container">
      <textarea class="note-title" placeholder="Title" maxlength="50">${
        noteData.title || ""
      }</textarea> 
    </div>
    <div class="note-text-container">
      <textarea class="note-text" placeholder="Write new text here..." maxlength="10000">${
        noteData.text || ""
      }</textarea>
      <button class="note-delete" title="Delete">
        <svg class="delete-svg"
          width="20px" 
          height="20px" 
          fill="none" 
          stroke="#FFFFEF" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          viewBox="5 5 14 14" 
          xmlns="http://www.w3.org/2000/svg"
          >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Delete record
    </button>
    </div>
  `;

  // Connect event handlers
  initializeNoteEventListeners(note, noteData);

  return note;
}

// Initializing events for a note
function initializeNoteEventListeners(note, noteData) {
  const textArea = note.querySelector(".note-text");
  const titleArea = note.querySelector(".note-title");
  const noteTextContainer = note.querySelector(".note-text-container");

  // Listener to change the text of the note
  [titleArea, textArea].forEach((area) =>
    area.addEventListener("input", () => {
      updateNoteData(noteData.id, titleArea.value, textArea.value);
    })
  );

  // Note click handler
  note.addEventListener("click", () => {
    if (!noteTextContainer.classList.contains("open")) {
      openNote(noteTextContainer, note);
    }
  });

  // Deleting a note
  note.querySelector(".note-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNote(noteData.id);
  });
}

// Function for updating note data
function updateNoteData(noteId, title, text) {
  const updatedNote = notesCache.find((note) => note.id === noteId);
  if (updatedNote) {
    updatedNote.title = title;
    updatedNote.text = text;
    saveNotes(notesCache);
  }
}
function deleteNotification() {
  // Creating a notification
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = "Entry deleted";

  // Add to the DOM
  document.body.appendChild(notification);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 1500);
}

// Deleting a note
function deleteNote(noteId) {
  notesCache = notesCache.filter((note) => note.id !== noteId);
  saveNotes(notesCache);
  renderNotes();
  deleteNotification();
}

// Opening a note
function openNote(noteTextContainer, note) {
  if (activeNote && activeNote !== note) {
    closeNote(activeNote.querySelector(".note-text-container"));
  }
  noteTextContainer.classList.add("open");
  activeNote = note;
  adjustTextAreaHeight(noteTextContainer.querySelector(".note-text"));
}

// Closing a note
function closeNote(noteTextContainer) {
  noteTextContainer.classList.remove("open");
  activeNote = null;
}

// Automatic height change for a text field
function adjustTextAreaHeight(textArea) {
  textArea.style.height = "auto"; // First, we're dropping altitude
  textArea.style.height = `${textArea.scrollHeight}px`; // Set the desired height
}

// Function for rendering all notes
function renderNotes() {
  notesContainer.innerHTML = "";
  notesCache.forEach((note) => {
    const noteElement = createNoteElement(note);
    notesContainer.append(noteElement);
  });
}

// Adding a new note
addButton.addEventListener("click", () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
  })} ${currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: formattedDate,
  };

  notesCache.unshift(newNote);
  saveNotes(notesCache);
  renderNotes();
});

// Exporting notes
function exportNotes() {
  const content = notesCache
    .map(
      (note) =>
        `\n| ${(note.title || "empty").toUpperCase()} (${note.date})\n\n${
          note.text || "empty"
        }\n\n`
    )
    .join("");

  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
exportButton.addEventListener("click", exportNotes);

// Application initialization
renderNotes();

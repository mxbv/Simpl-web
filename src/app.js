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
    <div class="note-title-container">
      <textarea class="note-title" placeholder="Title" maxlength="50">${
        noteData.title || ""
      }</textarea>
      <button class="note-delete" title="Delete">
        <svg class="cf-icon-svg" width="35px" height="35px" fill="#000000" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
        </svg>

      </button>
    </div>
    <div class="note-text-container">
      <textarea class="note-text" placeholder="Write new text here..." maxlength="10000">${
        noteData.text || ""
      }</textarea>
    </div>
    <span class="note-date">${noteData.date}</span>
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
      const updatedNote = notesCache.find((n) => n.id === noteData.id);
      if (updatedNote) {
        updatedNote.title = titleArea.value;
        updatedNote.text = textArea.value;
        saveNotes(notesCache);
      }
    })
  );

  // Note click handler
  note.addEventListener("click", (event) => {
    if (!noteTextContainer.classList.contains("open")) {
      openNote(noteTextContainer, note);
    }
  });

  // Deleting a note
  note.querySelector(".note-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNote(noteData);
  });
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

// Closing a note when you click outside of it
document.addEventListener("click", (event) => {
  if (activeNote && !activeNote.contains(event.target)) {
    closeNote(activeNote.querySelector(".note-text-container"));
  }
});

// Deleting a note
function deleteNote(noteData) {
  const updatedNotes = notesCache.filter((n) => n.id !== noteData.id);
  saveNotes(updatedNotes);
  renderNotes();
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
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`,
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

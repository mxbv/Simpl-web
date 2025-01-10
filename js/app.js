const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const STORAGE_KEY = "notes";

// Function for loading notes from localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Function for saving notes to localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Function for displaying a note
function createNoteElement(noteData) {
  const note = document.createElement("div");
  note.className = "note";
  note.innerHTML = `
  <div class="note-title-container"><textarea placeholder="Title" class="note-title" maxlength="50">${
    noteData.title || ""
  }</textarea>
    <button class="note-delete button" title="Delete"><img src="icon/delete.svg" alt="delete" class="note-delete-img"></button></div>
    <textarea placeholder="Write new text here..." class="note-text" maxlength="10000">${
      noteData.text || ""
    }</textarea>
    <div class="note-date">${noteData.date}</div>
  `;

  // Note deletion handler
  note.querySelector(".note-delete").addEventListener("click", () => {
    note.remove();
    const updatedNotes = loadNotes().filter((n) => n.id !== noteData.id);
    saveNotes(updatedNotes);
  });

  // Automatic textarea height change
  const textArea = note.querySelector(".note-text");
  textArea.addEventListener("input", () => {
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  });

  // Saving changes to a note
  const titleArea = note.querySelector(".note-title");
  [titleArea, textArea].forEach((area) =>
    area.addEventListener("input", () => {
      const notes = loadNotes();
      const updatedNote = notes.find((n) => n.id === noteData.id);
      if (updatedNote) {
        updatedNote.title = titleArea.value;
        updatedNote.text = textArea.value;
        saveNotes(notes);
      }
    })
  );

  return note;
}

// Function for downloading and displaying all notes
function renderNotes() {
  notesContainer.innerHTML = "";
  const notes = loadNotes();
  notes.forEach((note) => {
    const noteElement = createNoteElement(note);
    notesContainer.append(noteElement);
  });
}

// Handler for adding a new note
addButton.addEventListener("click", () => {
  const currentDate = new Date();
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
  };

  // Add a new note to the beginning of the array
  const notes = loadNotes();
  notes.unshift(newNote);
  saveNotes(notes);

  const noteElement = createNoteElement(newNote);
  notesContainer.prepend(noteElement);
});

// Application initialization
renderNotes();

// Notes export function
function exportNotes(notes) {
  // Convert each note object to a formatted string
  const content = notes
    .map((note) => `${note.title}\n ${note.text}`)
    .join("\n\n");

  // Create a Blob object with the contents of the file
  const blob = new Blob([content], { type: "text/plain" });

  // Create a link to download the file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt"; // File name

  // Simulate a click to download
  link.click();

  // Free the memory associated with the URL object
  URL.revokeObjectURL(link.href);
}
document.querySelector(".note-export").addEventListener("click", () => {
  const notes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  exportNotes(notes);
});

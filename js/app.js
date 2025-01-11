const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const exportButton = document.querySelector(".note-export");
const STORAGE_KEY = "notes";

// Status of notes in memory
let notesCache = loadNotes();

// Function for loading notes from localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Function for saving notes to localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  notesCache = notes; // Обновляем кэш
}

// Function for displaying a note
function createNoteElement(noteData) {
  const note = document.createElement("div");
  note.className = "note";
  note.innerHTML = `
  <div class="note-title-container">
    <textarea placeholder="Title" class="note-title" maxlength="50">${
      noteData.title || ""
    }</textarea>
    <button class="note-delete" title="Delete"><img src="icon/delete.svg" alt="delete" class="note-delete-img"></button>
  </div>
  <textarea placeholder="Write new text here..." class="note-text" maxlength="10000">${
    noteData.text || ""
  }</textarea>
  <span class="note-date">${noteData.date}</span>
  `;

  const textArea = note.querySelector(".note-text");
  textArea.addEventListener("input", () => adjustTextAreaHeight(textArea));

  const titleArea = note.querySelector(".note-title");
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

  note.querySelector(".note-delete").addEventListener("click", () => {
    const updatedNotes = notesCache.filter((n) => n.id !== noteData.id);
    saveNotes(updatedNotes);
    renderNotes(); // Redraw notes after deletion
  });

  return note;
}

// Automatic textarea height change
function adjustTextAreaHeight(textArea) {
  textArea.style.height = "auto";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

// Function for drawing all notes
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
    date: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
  };

  notesCache.unshift(newNote); // Adding a new note to the beginning
  saveNotes(notesCache);
  renderNotes(); // Redrawing notes
});

// Exporting notes
// it's a cool cat, but when downloading notes,
// I would somehow separate them visually, 
// for example, add ------------ 
// Did I make such a design between them
// -------------
// Title
// - text
// -------------
// + I also added checks for empty lines. which don't look good
function exportNotes() {
  const content = notesCache
    .map((note) => 
    `-------------\n${note.title ? note.title : "empty"}\n ${note.text ? note.text : "empty"}\n`)
    .join("");

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

exportButton.addEventListener("click", exportNotes);

// Application initialization
renderNotes();


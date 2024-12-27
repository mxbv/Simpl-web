const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const STORAGE_KEY = "notes";

// Функция для загрузки заметок из localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Функция для сохранения заметок в localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Функция для отображения заметки
function createNoteElement(noteData) {
  const note = document.createElement("div");
  note.className = "note";

  note.innerHTML = `
    <textarea placeholder="Title" class="note-title" maxlength="30">${
      noteData.title || ""
    }</textarea>
    <button class="note-delete button"><img src="img/delete.svg" alt="delete" class="note-delete-img"></button>
    <textarea placeholder="Write new text here..." class="note-text" maxlength="2000">${
      noteData.text || ""
    }</textarea>
    <div class="note-date">${noteData.date}</div>
  `;

  // Обработчик удаления заметки
  note.querySelector(".note-delete").addEventListener("click", () => {
    note.remove();
    const updatedNotes = loadNotes().filter((n) => n.id !== noteData.id);
    saveNotes(updatedNotes);
  });

  // Автоматическое изменение высоты textarea
  const textArea = note.querySelector(".note-text");
  textArea.addEventListener("input", () => {
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  });

  // Сохранение изменений в заметке
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

// Функция для загрузки и отображения всех заметок
function renderNotes() {
  notesContainer.innerHTML = "";
  const notes = loadNotes();
  notes.forEach((note) => {
    const noteElement = createNoteElement(note);
    notesContainer.append(noteElement);
  });
}

// Обработчик добавления новой заметки
addButton.addEventListener("click", () => {
  const currentDate = new Date();
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
  };

  const notes = loadNotes();
  notes.unshift(newNote); // Добавляем новую заметку в начало массива
  saveNotes(notes);

  const noteElement = createNoteElement(newNote);
  notesContainer.prepend(noteElement);
});

// Инициализация приложения
renderNotes();

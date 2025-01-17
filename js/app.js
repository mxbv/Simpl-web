// Константы
const STORAGE_KEY = "notes";
const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const exportButton = document.querySelector(".note-export");

// Статус заметок в памяти
let notesCache = loadNotes();

// Загрузка заметок из localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Сохранение заметок в localStorage
function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  notesCache = notes; // Обновление кэша
}

// Функция для создания элемента заметки
function createNoteElement(noteData) {
  const note = document.createElement("div");
  note.className = "note";

  // Разметка заметки
  note.innerHTML = `
    <div class="note-title-container">
      <textarea class="note-title" placeholder="Title" maxlength="50">${
        noteData.title || ""
      }</textarea>
      <button class="note-delete" title="Delete">
        <img src="icons/delete.svg" alt="delete" class="note-delete-img">
      </button>
    </div>
    <div class="note-text-container">
      <textarea class="note-text" placeholder="Write new text here..." maxlength="10000">${
        noteData.text || ""
      }</textarea>
    </div>
    <span class="note-date">${noteData.date}</span>
  `;

  // Подключаем обработчики событий
  initializeNoteEventListeners(note, noteData);

  return note;
}

// Инициализация событий для заметки
function initializeNoteEventListeners(note, noteData) {
  const textArea = note.querySelector(".note-text");
  const titleArea = note.querySelector(".note-title");
  const noteTextContainer = note.querySelector(".note-text-container");

  // Слушатель на изменение текста заметки
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

  // Открытие/закрытие текста заметки при клике на всю заметку
  note.addEventListener("click", (event) => {
    if (!event.target.closest(".note-delete")) {
      toggleNoteTextVisibility(noteTextContainer);
    }
  });

  // Закрытие текста при клике за пределами заметки
  document.addEventListener("click", (event) => {
    if (!note.contains(event.target)) {
      noteTextContainer.classList.remove("open");
    }
  });

  // Остановка распространения события клика по контейнеру с текстом
  noteTextContainer.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Удаление заметки
  note.querySelector(".note-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deleteNote(noteData);
  });
}

// Функция для скрытия или отображения текста заметки
function toggleNoteTextVisibility(noteTextContainer) {
  noteTextContainer.classList.toggle("open");
}

// Удаление заметки
function deleteNote(noteData) {
  const updatedNotes = notesCache.filter((n) => n.id !== noteData.id);
  saveNotes(updatedNotes);
  renderNotes();
}

// Функция для рисования всех заметок
function renderNotes() {
  notesContainer.innerHTML = "";
  notesCache.forEach((note) => {
    const noteElement = createNoteElement(note);
    notesContainer.append(noteElement);
  });
}

// Добавление новой заметки
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

// Экспорт заметок
function exportNotes() {
  const content = notesCache
    .map(
      (note) =>
        `\n| ${(note.title || "empty").toUpperCase()} (${note.date})\n\n${
          note.text || "empty"
        }\n\n`
    )
    .join("");

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

exportButton.addEventListener("click", exportNotes);

// Инициализация приложения
renderNotes();

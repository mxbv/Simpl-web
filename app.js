const STORAGE_KEY = "notes";
const notesContainer = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");
const exportButton = document.querySelector(".note-export");

// Менеджер для работы с заметками
const notesManager = {
  cache: [],
  activeNote: null,

  saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
  },

  loadNotes() {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    this.cache = savedNotes ? JSON.parse(savedNotes) : [];
  },

  updateNote(id, title, text) {
    const note = this.cache.find((note) => note.id === id);
    if (note) {
      note.title = title;
      note.text = text;
      this.saveNotes();
    }
  },

  deleteNote(id) {
    this.cache = this.cache.filter((note) => note.id !== id);
    this.saveNotes();
    renderNotes();
    showNotification("Entry deleted");
  },
};

// Создание HTML для заметки
function createNoteHTML(note) {
  return `
    <div class="note" data-id="${note.id}">
      <span class="note-date">${note.date}</span>
      <div class="note-title-container">
        <textarea class="note-title" placeholder="Title" maxlength="50">${
          note.title || ""
        }</textarea>
      </div>
      <button class="note-toggle">
        <svg width="35" height="35" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5.707 9.711a1 1 0 0 0 0 1.414l4.892 4.887a2 2 0 0 0 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.414l-4.186 4.186a1 1 0 0 1-1.414 0l-4.182-4.182a1 1 0 0 0-1.414 0z" fill="#000000"/>
        </svg>
      </button>
      <div class="note-text-container">
        <textarea class="note-text" placeholder="Write new text here..." maxlength="10000">${
          note.text || ""
        }</textarea>
        <div class="count">
          <span class="current_count">${note.text.length || 0}</span>
          <span>/</span>
          <span class="maximum_count">10,000</span>
        </div>
        <button class="note-delete" title="Delete">
          <svg class="delete-svg"
            width="20px"
            height="20px"
            fill="none"
            stroke="#ffffff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="5 5 14 14"
            xmlns="http://www.w3.org/2000/svg"
            >
           <line x1="18" y1="6" x2="6" y2="18" />
           <line x1="6" y1="6" x2="18" y2="18" />
         </svg> Delete record
        </button>
        
      </div>
    </div>
  `;
}

// Рендер всех заметок
function renderNotes() {
  notesContainer.innerHTML = notesManager.cache.map(createNoteHTML).join("");
}

// Добавление новой заметки
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
  notesManager.cache.unshift(newNote);
  notesManager.saveNotes();
  renderNotes();
});

// Экспорт заметок
exportButton.addEventListener("click", () => {
  const content = notesManager.cache
    .map(
      (note) =>
        `| ${(note.title || "empty").toUpperCase()} (${note.date})\n${
          note.text || "empty"
        }\n`
    )
    .join("\n");

  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
});

// Делегирование событий для работы с заметками
notesContainer.addEventListener("click", (event) => {
  const target = event.target;

  // Удаление заметки
  if (target.classList.contains("note-delete")) {
    const noteElement = target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id);
    notesManager.deleteNote(noteId);
    return;
  }

  // Переключение видимости заметки (клик по кнопке Toggle visibility)
  if (target.classList.contains("note-toggle")) {
    const noteElement = target.closest(".note");
    toggleNoteVisibility(noteElement);
  }
});

// Делегирование для автоувеличения textarea
notesContainer.addEventListener("input", (event) => {
  const target = event.target;

  if (
    target.classList.contains("note-title") ||
    target.classList.contains("note-text")
  ) {
    const noteElement = target.closest(".note");
    const noteId = parseInt(noteElement.dataset.id);
    const title = noteElement.querySelector(".note-title").value;
    const text = noteElement.querySelector(".note-text").value;

    // Сохраняем изменения
    notesManager.updateNote(noteId, title, text);

    // Обновляем счётчик символов
    if (target.classList.contains("note-text")) {
      updateCharacterCounter(target);
      autoResizeTextArea(target);
    }
  }
});

function toggleNoteVisibility(noteElement) {
  const toggleButton = noteElement.querySelector(".note-toggle");

  // Если заметка уже открыта, закрываем ее
  if (notesManager.activeNote === noteElement) {
    closeNote(noteElement);
    toggleButton.classList.remove("open"); // Убираем класс поворота кнопки
    return;
  }

  // Закрываем текущую активную заметку
  if (notesManager.activeNote) {
    const activeToggleButton =
      notesManager.activeNote.querySelector(".note-toggle");
    closeNote(notesManager.activeNote);
    activeToggleButton.classList.remove("open"); // Убираем класс поворота у предыдущей кнопки
  }

  // Открываем выбранную заметку
  const textContainer = noteElement.querySelector(".note-text-container");
  textContainer.classList.add("open");
  toggleButton.classList.add("open"); // Добавляем класс поворота кнопки

  // Автоматически подстраиваем высоту textarea при раскрытии
  const noteTextArea = noteElement.querySelector(".note-text");
  autoResizeTextArea(noteTextArea);

  notesManager.activeNote = noteElement;
}

// Закрытие заметки
function closeNote(noteElement) {
  const textContainer = noteElement.querySelector(".note-text-container");
  textContainer.classList.remove("open");
  notesManager.activeNote = null;
}

// Автоувеличение высоты textarea
function autoResizeTextArea(textArea) {
  textArea.style.height = "auto";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

// Обновление счётчика символов
function updateCharacterCounter(textArea) {
  const currentCount = textArea
    .closest(".note-text-container")
    .querySelector(".current_count");
  if (currentCount) currentCount.textContent = textArea.value.length;
}

// Уведомления
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1500);
}

// Инициализация приложения
notesManager.loadNotes();
renderNotes();

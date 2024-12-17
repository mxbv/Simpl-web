const notesEl = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");

// Создание заметки
function createNote(title, text) {
  const noteEl = document.createElement("div");
  noteEl.classList.add("note");

  noteEl.innerHTML = `
    <div class="note-header">
      <p class="note-title">${title}</p>
      <textarea class="note-title-input hidden" maxlength="50"></textarea>
      <div class="note-actions">
        <button class="note-delete button">Delete</button>
      </div>
    </div>
    <p class="note-text">${text}</p>
    <textarea class="note-text-input hidden"></textarea>
  `;

  return noteEl;
}

// Добавление новой заметки
addButton.addEventListener("click", () => {
  const noteEl = createNote("Header", "Write new text");
  notesEl.prepend(noteEl); // Добавляем в начало списка
});

// Обработчик кликов и событий
notesEl.addEventListener("click", (e) => {
  const note = e.target.closest(".note");
  if (!note) return;

  const titleEl = note.querySelector(".note-title");
  const textEl = note.querySelector(".note-text");
  const titleInputEl = note.querySelector(".note-title-input");
  const textInputEl = note.querySelector(".note-text-input");

  // Клик на заголовок
  if (e.target.classList.contains("note-title")) {
    titleInputEl.value = titleEl.textContent; // Копируем текст
    titleEl.classList.add("hidden");
    titleInputEl.classList.remove("hidden");
    titleInputEl.focus();
  }

  // Клик на текст
  if (e.target.classList.contains("note-text")) {
    textInputEl.value = textEl.textContent;
    textEl.classList.add("hidden");
    textInputEl.classList.remove("hidden");
    textInputEl.focus();
  }

  // Удаление заметки
  if (e.target.classList.contains("note-delete")) {
    note.remove();
  }
});

// Обновление текста при вводе
notesEl.addEventListener("input", (e) => {
  const note = e.target.closest(".note");
  if (!note) return;

  if (e.target.classList.contains("note-title-input")) {
    note.querySelector(".note-title").textContent = e.target.value;
  }

  if (e.target.classList.contains("note-text-input")) {
    note.querySelector(".note-text").textContent = e.target.value;
  }
});

// Завершение редактирования при потере фокуса
notesEl.addEventListener(
  "blur",
  (e) => {
    const note = e.target.closest(".note");
    if (!note) return;

    const titleEl = note.querySelector(".note-title");
    const textEl = note.querySelector(".note-text");
    const titleInputEl = note.querySelector(".note-title-input");
    const textInputEl = note.querySelector(".note-text-input");

    if (e.target.classList.contains("note-title-input")) {
      titleEl.classList.remove("hidden");
      titleInputEl.classList.add("hidden");
    }

    if (e.target.classList.contains("note-text-input")) {
      textEl.classList.remove("hidden");
      textInputEl.classList.add("hidden");
    }
  },
  true
);

document.addEventListener("input", (e) => {
  if (e.target.tagName.toLowerCase() === "textarea") {
    e.target.style.height = "auto"; // Сбрасываем текущую высоту
    e.target.style.height = e.target.scrollHeight + "px"; // Устанавливаем новую высоту
  }
});

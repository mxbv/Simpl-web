const notesEl = document.querySelector(".notes");
const addButton = document.querySelector(".note-add");

// Create Note Function
function createNote(title, text) {
  const noteEl = document.createElement("div");
  noteEl.classList.add("note");
  noteEl.innerHTML = `
    <div class="note-header">
      <p>${title}</p>
      <div class="note-actions">
        <button class="note-edit button">
          <img src="/img/edit.svg" alt="Edit button" class="button-img"/>
        </button>
        <button class="note-delete button">
          <img src="/img/delete.svg" alt="Delete button" class="button-img"/>
        </button>
      </div>
    </div>
    <p id="note-description">${text}</p>
    `;
  const editBtn = noteEl.querySelector(".note-edit");
  const deleteBtn = noteEl.querySelector(".note-delete");
  // Edit note
  // editBtn.addEventListener("click", (e) => {});
  // Delete note
  deleteBtn.addEventListener("click", (e) => {
    noteEl.remove(e);
  });
  return noteEl;
}

addButton.addEventListener("click", (e) => {
  const el = createNote("Header", "Your text");
  notesEl.appendChild(el);
});

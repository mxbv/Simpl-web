const mainEl = document.querySelector(".main");

function createNote(title, text) {
  const noteEl = document.createElement("div");
  noteEl.classList.add("note");
  noteEl.innerHTML = `
    <div class="note-header">
      <p>${title}</p>
      <div class="note-actions">
        <button class="note-edit">
          <img src="/img/edit.svg" alt="Edit button" />
        </button>
        <button class="note-delete">
          <img src="/img/delete.svg" alt="Delete button" />
        </button>
      </div>
    </div>
    <p id="note-description">${text}</p>
    `;
}

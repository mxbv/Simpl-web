const notesContainer = document.querySelector(".notes");
document.querySelector(".note-add").addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note";

  // Get the current date and format it
  const currentDate = new Date();
  const dateString = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  note.innerHTML = `
    <textarea placeholder="Title" class="note-title" maxlength="50"></textarea>
    <button class="note-delete button"><img src="/img/delete.svg" alt="delete" class="note-delete-img"></button>
    <textarea placeholder="Write new text here..." class="note-text" maxlength="4000" ></textarea>
    <div class="note-date">${dateString}</div>
  `;

  const textArea = note.querySelector(".note-text");

  // Function for auto-increase of textarea height
  textArea.addEventListener("input", () => {
    textArea.style.height = "auto"; // Resetting the altitude before calculation
    textArea.style.height = `${textArea.scrollHeight}px`; // Set the new height
  });

  // Deleting a note
  note
    .querySelector(".note-delete")
    .addEventListener("click", () => note.remove());

  notesContainer.prepend(note); // Add a note to the top
});

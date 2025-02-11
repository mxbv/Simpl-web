<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
const notes = ref([]);
const note = ref(null);
let autoSaveInterval = null;

// Block scrolling when opening a note
onMounted(() => {
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  // Run auto-save every 200 ms.
  autoSaveInterval = setInterval(() => {
    if (note.value) saveNoteToDB(note.value);
  }, 200);
});

// Restore scrolling when exiting a note
onUnmounted(() => {
  document.body.style.overflow = "";
  clearInterval(autoSaveInterval);
});

// Load note when noteId is changed
watchEffect(async () => {
  const notes = await getNotesFromDB();
  note.value = notes.find((n) => n.id === noteId.value) || null;
});

// Deleting a note
const deleteNote = async () => {
  if (note.value) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (isConfirmed) {
      clearInterval(autoSaveInterval); // Stop auto-save
      await deleteNoteFromDB(note.value.id);
      note.value = null; // Zeroing the current note
      emit("noteDeleted");
      emit("refreshNotes");
      router.replace("/");
    }
  }
};
// Exporting notes
const exportNotes = () => {
  const content = notes.value
    .map(
      (note) =>
        `| ${(note.title || "empty").toUpperCase()} (${note.date})\n${
          note.content || "empty"
        }\n`
    )
    .join("\n");

  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
};
const goBack = async () => {
  if (!note.value.title && !note.value.content) {
    // If the note is empty, delete it
    await deleteNoteFromDB(note.value.id);
  }
  router.replace("/");
  emit("refreshNotes"); // Redirect to the home page
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <div class="note-header">
        <button @click="goBack" class="note-button go-back-button">
          <svg
            transform="matrix(-1 0 0 1 0 0)"
            width="27px"
            height="27px"
            fill="#000000"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"
            />
          </svg>
        </button>
        <div class="note-header-right">
          <button
            class="note-button export-button"
            type="button"
            title="Export"
            @click="exportNotes"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button @click="deleteNote" class="note-button delete-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="delete-icon"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="content-container">
        <input
          v-model="note.title"
          placeholder="Title"
          class="note-input note-title"
          ref="titleTextarea"
          maxlength="50"
          type="text"
        />
        <textarea
          v-model="note.content"
          placeholder="Write your text here..."
          class="note-input note-text"
          ref="contentTextarea"
          maxlength="10000"
        ></textarea>
      </div>
      <div class="counter">
        <span>{{ note.content ? note.content.length : "0" }}</span>
        <span> / </span>
        <span>10000</span>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Record not found</p>
  </div>
</template>

<style scoped>
.note {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100dvh;
  background-color: var(--bg-light);
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 1000;
  overflow: auto;
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.note-header-right {
  display: flex;
  justify-content: center;
}
.export-button {
  margin-right: 20px;
}
.note-container {
  width: 70%;
  height: 100%;
  padding: 20px 0;
}

.note-input {
  width: 100%;
  border: none;
  padding: 20px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: none;
  background: none;
  color: var(--black-color);
  font-size: 1.2rem;
  background-color: #faf3e0;
}

.note-input::placeholder {
  color: var(--black-color);
  opacity: 1;
}

.note-title {
  display: block;
  font-size: 1.7rem;
  font-weight: 500;
  text-overflow: ellipsis;
  border-bottom: none;
  padding-bottom: 0;
  border-radius: 30px 30px 0 0;
  margin-top: 40px;
}

.note-text {
  min-height: 500px;
  height: 90%;
  padding-bottom: 30px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0px 4px 10px #0000001a;
}
.counter {
  margin-top: 10px;
}
@media screen and (max-width: 768px) {
  .note-container {
    width: 95%;
    height: 100%;
  }
  .note-text {
    height: 60%;
    min-height: 60%;
    max-height: 60%;
  }
}
</style>

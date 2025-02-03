<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
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

const goBack = async () => {
  if (!note.value.title && !note.value.text) {
    // Если заметка пустая, удаляем её
    await deleteNoteFromDB(note.value.id);
  }
  router.replace("/");
  emit("refreshNotes"); // Перенаправление на главную страницу
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <div class="note-header">
        <button @click="goBack" class="go-back-button">
          <svg
            transform="rotate(90)"
            width="35"
            height="35"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m5.707 9.711a1 1 0 0 0 0 1.414l4.892 4.887a2 2 0 0 0 2.828 0l4.89-4.89a1 1 0 1 0-1.414-1.414l-4.186 4.186a1 1 0 0 1-1.414 0l-4.182-4.182a1 1 0 0 0-1.414 0z"
              fill="#000"
            />
          </svg>
        </button>
        <span>{{ note.date }}</span>
        <button @click="deleteNote" class="delete-button">
          <svg
            class="delete-icon"
            width="35px"
            height="35px"
            fill="#fffff0"
            viewBox="-3.5 0 19 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"
            />
          </svg>
        </button>
      </div>
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
      <span>{{ note.content ? note.content.length : "0" }}</span>
      <span> / </span>
      <span>10,000</span>
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
  background-color: #fffff0;
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 1000;
  overflow: auto;
}

.note-container {
  width: 70%;
  height: 100%;
  padding: 30px 0;
}
.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.go-back-button {
  background-color: #ececdd;
  transition: 0.3s;
}
.go-back-button:hover {
  background-color: #dedece;
}
.note-input {
  width: 100%;
  border: none;
  padding: 15px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: none;
  background-color: var(--content-color);
  color: var(--black-color);
  font-size: 20px;
  border-radius: 15px;
}

.note-input::placeholder {
  color: var(--black-color);
  opacity: 1;
}

.note-title {
  width: 100%;
  font-size: 28px;
  font-weight: 500;
  text-overflow: ellipsis;
  margin-top: 30px;
  border-bottom: none;
  border-radius: 15px 15px 0 0;
}

.note-text {
  height: 500px;
  min-height: 400px;
  max-height: 60%;
  margin-bottom: 10px;
  border-radius: 0 0 15px 15px;
  border-top: solid 1px var(--border-color);
}

.delete-button {
  background-color: var(--black-color);
  transition: 0.3s ease-in-out;
}
.delete-button:hover {
  background-color: red;
  .delete-icon path {
    fill: #000000;
  }
}
.delete-icon {
  transition: fill 0.4s;
}
@media screen and (max-width: 768px) {
  .note-container {
    width: 98%;
    height: 100%;
  }
  .note-title {
    font-size: 22px;
  }
  .note-text {
    height: 60%;
    min-height: 60%;
    max-height: 60%;
  }
}
</style>

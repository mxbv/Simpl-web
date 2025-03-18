<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";
// Icons
import BackIcon from "@/assets/icons/BackIcon.vue";
import ExportIcon from "@/assets/icons/ExportIcon.vue";
import DeleteIcon from "@/assets/icons/DeleteIcon.vue";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
const note = ref(null);
const contentTextarea = ref([]);
let autoSaveInterval = null;

onMounted(() => {
  // Run auto-save every 200 ms.
  autoSaveInterval = setInterval(() => {
    if (note.value) saveNoteToDB(note.value);
  }, 200);
});

// Restore scrolling when exiting a note
onUnmounted(() => {
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
      "Are you sure you want to delete this record ?"
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
const exportNote = () => {
  if (!note.value) return;
  const content = `${(note.value.title || "Empty").toUpperCase()} | ${
    note.value.date
  }\n\n${note.value.content || "Empty"}`;
  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "note.txt";
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
        <button @click="goBack" class="button go-back-button" title="Go Back">
          <BackIcon />
        </button>
        <div class="note-header-right">
          <button
            class="button export-button"
            type="button"
            title="Export"
            @click="exportNote"
          >
            <ExportIcon />
          </button>
          <button
            @click="deleteNote"
            class="button delete-button"
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
      <input
        v-model="note.title"
        placeholder="Title"
        class="note-input note-title"
        ref="titleTextarea"
        type="text"
        maxlength="100"
      />
      <textarea
        v-model="note.content"
        placeholder="Tell a new story..."
        class="note-input note-text"
        ref="contentTextarea"
        maxlength="30000"
      ></textarea>
    </div>
  </div>
  <div v-else class="hint">
    Note not found
    <router-link to="/" class="button">Back to main page</router-link>
  </div>
</template>

<style scoped>
.note {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  background-color: var(--main-bg);
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
  color: var(--text);
  animation: fadeIn 0.3s ease;
}
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
  flex: none;
}
.note-header-right {
  display: flex;
  justify-content: center;
}
.export-button {
  margin-right: 10px;
}
.note-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.note-input {
  width: 100%;
  border: none;
  padding: 0 25%;
  outline: none;
  resize: none;
  background: none;
  color: var(--black-color);
  font-size: 1.2rem;
}

.note-title {
  display: block;
  font-size: 2rem;
  font-weight: 500;
  text-overflow: ellipsis;
  border-bottom: none;
  padding-bottom: 0;
  margin-top: 20px;
  flex: none;
}

.note-text {
  box-sizing: border-box;
  overflow: auto;
  flex: 1;
  margin-bottom: 20px;
  margin-top: 20px;
}
.hint .button {
  margin-top: 20px;
}
@media screen and (max-width: 768px) {
  .note-header {
    width: 100%;
    margin-top: 10px;
  }
  .note-container {
    width: 95%;
    height: 100%;
  }
  .note-input {
    padding: 0 0;
  }
}
</style>

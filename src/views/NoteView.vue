<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";
// Icons
import BackIcon from "@/assets/icons/editor/BackIcon.vue";
import ExportIcon from "@/assets/icons/editor/ExportIcon.vue";
import DeleteIcon from "@/assets/icons/editor/DeleteIcon.vue";
import StarIcon from "@/assets/icons/editor/StarIcon.vue";

// Emits for events
const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
const note = ref(null);
let autoSaveInterval = null;

// Load the note when component is mounted or noteId changes
const loadNote = async () => {
  const notes = await getNotesFromDB();
  note.value = notes.find((n) => n.id === noteId.value) || null;
};

onMounted(() => {
  loadNote();

  // Auto-save only when the note is modified
  autoSaveInterval = setInterval(() => {
    if (note.value && (note.value.title || note.value.content)) {
      saveNoteToDB(note.value);
    }
  }, 200); // Interval increased to 1 second
});

// Clean up on unmount
onUnmounted(() => {
  clearInterval(autoSaveInterval);
});

// Watch for noteId changes and reload the note
watch(
  () => route.params.id,
  (newId) => {
    noteId.value = parseInt(newId);
    loadNote();
  }
);

// Deleting the note
const deleteNote = async () => {
  if (note.value) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this record?"
    );
    if (isConfirmed) {
      try {
        clearInterval(autoSaveInterval); // Stop auto-save
        await deleteNoteFromDB(note.value.id);
        note.value = null; // Clear the note
        emit("noteDeleted");
        emit("refreshNotes");
        router.replace("/");
      } catch (error) {
        console.error("Error deleting the note:", error);
        alert("Failed to delete the note.");
      }
    }
  }
};

// Exporting the note
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

// Go back to the main page
const goBack = async () => {
  if (note.value && !note.value.title && !note.value.content) {
    try {
      await deleteNoteFromDB(note.value.id); // If empty, delete it
    } catch (error) {
      console.error("Error deleting empty note:", error);
    }
  }
  router.replace("/");
  emit("refreshNotes"); // Redirect to the home page
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <div class="note-header">
        <button
          @click="goBack"
          class="control-item go-back-button"
          title="Go Back"
        >
          <BackIcon />
        </button>
        <div class="note-header-right">
          <button class="control-item star-button" title="Add to Favorite">
            <StarIcon />
          </button>
          <button
            class="control-item export-button"
            type="button"
            title="Export"
            @click="exportNote"
          >
            <ExportIcon />
          </button>
          <button
            @click="deleteNote"
            class="control-item delete-button"
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
    <router-link to="/" class="control-item">Back to main page</router-link>
  </div>
</template>

<style scoped>
.note {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
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
  height: fit-content;
  z-index: 100;
  margin: 0 auto;
  margin-top: 10px;
  background-color: var(--item);
  border: solid 1px #242424;
  border-radius: 13px;
  box-shadow: 0px 2px #0c0c0c;
}
.note-header-right {
  display: flex;
  justify-content: center;
}
.star-button {
  margin-right: 10px;
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
  color: var(--text);
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
@media screen and (max-width: 992px) {
  .note-header {
    width: 95%;
  }
  .note-input {
    padding: 0 15px;
  }
}
</style>

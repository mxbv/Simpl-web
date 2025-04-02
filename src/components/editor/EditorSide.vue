<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";
// Icons
import ExportIcon from "@/assets/icons-editor/ExportIcon.vue";
import DeleteIcon from "@/assets/icons-editor/DeleteIcon.vue";
import LogoIcon from "@/assets/icons-editor/LogoIcon.vue";
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
  }, 1000); // Interval increased to 1 second
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
</script>

<template>
  <div class="container-editor">
    <div v-if="note" class="note">
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
        type="text"
        maxlength="30000"
      ></textarea>
      <div class="note-control">
        <div class="note-info">
          <a
            href="https://github.com/mxbv/Simpl"
            class="button note-info-link"
          >
            <LogoIcon /> View Source
          </a>
          <span class="created">Created: {{ note.date }}</span>
          <span class="chars">
            Characrters:
            {{
              note.content + note.title
                ? note.content.length + note.title.length
                : "0"
            }}
          </span>
        </div>
        <div class="note-control-buttons">
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
    </div>
    <div v-else class="hint">Note not selected</div>
  </div>
</template>

<style scoped>
.container-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
.note {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: var(--text);
  animation: fadeIn 0.3s ease;
}
.export-button {
  margin-right: 10px;
}
.note-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  background: none;
  color: var(--black-color);
  font-size: 1.2rem;
  margin-top: 20px;
  padding: 0 1rem;
}

.note-title {
  font-size: 2rem;
  font-weight: 500;
  text-overflow: ellipsis;
}

.note-text {
  flex-grow: 1;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: 10px;
}
.note-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--block);
  .note-info,
  .note-control-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .note-info {
    color: #a5a5a5;
    span {
      font-size: 13px;
    }
    .created {
      margin-right: 15px;
    }
  }
  .note-info-link {
    color: #a5a5a5;
    font-size: 13px;
    margin-right: 15px;
  }
}
</style>

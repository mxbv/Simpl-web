<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect, watch, nextTick } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";
// Icons
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import ExportIcon from "@/assets/icons/ExportIcon.vue";
import DeleteIcon from "@/assets/icons/DeleteIcon.vue";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
const note = ref(null);
const contentTextarea = ref([]);
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

// Adjust height
const adjustTextareaHeight = () => {
  if (contentTextarea.value) {
    contentTextarea.value.style.height = "auto"; // Dropping altitude
    contentTextarea.value.style.height =
      contentTextarea.value.scrollHeight + "px"; // Set the new height
  }
};

watch(
  () => note.value,
  (newNote) => {
    if (newNote) {
      nextTick(() => adjustTextareaHeight());
    }
  },
  { immediate: true }
);

watch(
  () => note.value?.content,
  () => {
    nextTick(() => adjustTextareaHeight());
  }
);
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <div class="note-header">
        <button @click="goBack" class="note-button go-back-button">
          <CloseIcon />
        </button>
        <div class="counter">
          <span>{{ note.content ? note.content.length : "0" }}</span>
          <span> / </span>
          <span>10000</span>
        </div>
        <div class="note-header-right">
          <button
            class="note-button export-button"
            type="button"
            title="Export"
            @click="exportNote"
          >
            <ExportIcon />
          </button>
          <button @click="deleteNote" class="note-button delete-button">
            <DeleteIcon />
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
          placeholder="Tell a new story..."
          class="note-input note-text"
          ref="contentTextarea"
          maxlength="10000"
        ></textarea>
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
  width: 70%;
  margin: 0 auto;
}
.note-header-right {
  display: flex;
  justify-content: center;
}
.export-button {
  margin-right: 20px;
}
.note-container {
  width: 100%;
  height: 100%;
  padding: 20px 0 0 0;
}

.note-input {
  width: 100%;
  border: none;
  padding: 0 15%;
  outline: none;
  resize: none;
  background: none;
  color: var(--black-color);
  font-size: 1.2rem;
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
  margin-top: 50px;
}

.note-text {
  margin-top: 20px;
  overflow: hidden;
  padding-bottom: 20px;
}
@media screen and (max-width: 768px) {
  .note-header {
    width: 100%;
  }
  .note-container {
    width: 95%;
    height: 100%;
  }
  .note-text {
    height: 60%;
    min-height: 60%;
    max-height: 60%;
  }
  .note-input {
    padding: 0 0;
  }
}
</style>

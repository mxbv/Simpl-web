<script setup>
import { ref, onMounted } from "vue";
import SideBar from "./components/SideBar.vue";
import NoteItem from "./components/NoteItem.vue";

const STORAGE_KEY = "notes";

const notes = ref([]);
const activeNote = ref(null);

const loadNotes = () => {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  notes.value = savedNotes ? JSON.parse(savedNotes) : [];
};

const saveNotes = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value));
};

const updateNote = (updatedNote) => {
  const index = notes.value.findIndex((note) => note.id === updatedNote.id);
  if (index !== -1) {
    notes.value[index] = updatedNote;
    saveNotes();
  }
};

const deleteNote = (id) => {
  notes.value = notes.value.filter((note) => note.id !== id);
  saveNotes();
};

const toggleNote = (note) => {
  if (activeNote.value === note) {
    activeNote.value = null;
  } else {
    activeNote.value = note;
  }
};

// Load notes when component is mounted
onMounted(() => {
  loadNotes();
});
</script>

<template>
  <body>
    <SideBar :notes="notes" @update:notes="notes = $event" />
    <router-view></router-view>
    <div class="notes-list">
      <NoteItem
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @update="updateNote"
        @delete="deleteNote"
        @open="toggleNote"
      />
    </div>
  </body>
</template>

<style scoped>
.notes-list {
  width: 100%;
  height: 100%;
  padding: 10px 0px;
}
</style>

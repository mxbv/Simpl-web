<script setup>
import { ref, onMounted, watch } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import { useRouter } from "vue-router";
import SearchBox from "@/components/SearchBox.vue";
import NoteItem from "@/components/NoteItem.vue";
import SettingsModal from "@/components/SettingsModal.vue";
import AddIcon from "@/assets/icons/AddIcon.vue";
import SettingsIcon from "@/assets/icons/SettingsIcon.vue";
const notes = ref([]);
const router = useRouter();
const searchQuery = ref("");
const filteredNotes = ref([]);
const settingsModal = ref(null);
// Load the list of notes when a component is mounted
onMounted(async () => {
  notes.value = await getNotesFromDB();
  filteredNotes.value = [...notes.value];
});

// Function for adding a new note
const addNewNote = async () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: formattedDate,
  };
  await saveNoteToDB(newNote);
  router.replace(`/note/${newNote.id}`);
  // Add a new note to the top of the list
  notes.value.unshift(newNote);
};

// Function for updating the list of notes
const refreshNotes = async () => {
  notes.value = await getNotesFromDB(); // Updating the list of notes from IndexedDB
};

const searchNotes = (query) => {
  if (!query) {
    filteredNotes.value = [...notes.value]; // If the search is empty, show all notes
    return;
  }
  filteredNotes.value = notes.value
    .filter((note) => {
      const title = note.title ? note.title.toLowerCase() : "";
      const content = note.content ? note.content.toLowerCase() : "";
      return (
        title.includes(query.toLowerCase()) ||
        content.includes(query.toLowerCase())
      );
    })
    .sort((a, b) => b.createdAt - a.createdAt); // Sort by date
};

watch(searchQuery, (newQuery) => {
  searchNotes(newQuery);
});

const openSettings = () => {
  settingsModal.value.open();
};
</script>

<template>
  <div>
    <nav>
      <button type="menu" class="settings" @click="openSettings">
        <SettingsIcon />
      </button>
      <SettingsModal ref="settingsModal" />
      <SearchBox v-model:searchQuery="searchQuery" />
      <button
        class="note-add"
        type="button"
        title="Create new record"
        @click="addNewNote"
      >
        <AddIcon />
      </button>
    </nav>
    <div class="note-list">
      <NoteItem
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        class="note-item"
      />
    </div>
    <router-view @refreshNotes="refreshNotes" />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg);
  border: solid 1px var(--border);
  padding: 4px;
  border-radius: 1rem;
}
.settings {
  margin-right: 10px;
}
.note-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  background-color: var(--content-block);
  padding: 0.8rem;
  border: solid 1px var(--border);
  border-radius: 1rem;
}
.note-add:hover {
  border-color: var(--border-hover);
  svg {
    transform: rotate(180deg);
  }
}
.note-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  padding-top: 7rem;
}
@media screen and (max-width: 768px) {
  nav {
    width: 95%;
  }
}
</style>

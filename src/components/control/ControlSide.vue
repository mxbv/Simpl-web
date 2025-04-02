<script setup>
import SearchBox from "./control-items/SearchBox.vue";
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import { useRouter } from "vue-router";
// Components
import NoteItem from "@/components/control/control-items/NoteItem.vue";
const SettingsModal = defineAsyncComponent(() =>
  import("@/components/control/control-items/SettingsModal.vue")
);
import AddIcon from "@/assets/icons-control/AddIcon.vue";
import SettingsIcon from "@/assets/icons-control/SettingsIcon.vue";

const notes = ref([]);
const filteredNotes = ref([]);
const searchQuery = ref("");
const settingsModal = ref(null);
const router = useRouter();

// Load notes from IndexedDB
onMounted(async () => {
  notes.value = await getNotesFromDB();
  filteredNotes.value = [...notes.value];
});

// Add a new note
const addNewNote = async () => {
  const currentDate = new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const newNote = {
    id: Date.now(),
    title: "",
    content: "",
    date: currentDate,
    createdAt: Date.now(),
  };

  await saveNoteToDB(newNote);
  notes.value.unshift(newNote); // Add new note to the beginning
  router.replace(`/note/${newNote.id}`);
};

// Refresh notes (reload from DB)
const refreshNotes = async () => {
  notes.value = await getNotesFromDB();
};

// Search notes based on query
const searchNotes = (query) => {
  if (!query) {
    filteredNotes.value = [...notes.value];
  } else {
    filteredNotes.value = notes.value
      .filter(
        (note) =>
          (note.title || "").toLowerCase().includes(query.toLowerCase()) ||
          (note.content || "").toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }
};

// Watch search query to filter notes
watch(searchQuery, searchNotes);

// Open settings modal
const openSettings = () => {
  settingsModal.value.open();
};
</script>

<template>
  <div class="container-control">
    <div class="control">
      <SearchBox />
      <button
        class="note-add button"
        @click="addNewNote"
        title="Create new record"
      >
        New note
        <AddIcon />
      </button>
    </div>
    <div v-if="filteredNotes.length" class="note-list">
      <NoteItem
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        class="note-item"
      />
    </div>
    <button class="settings button" @click="openSettings" title="Settings">
      <SettingsIcon />
    </button>
    <SettingsModal ref="settingsModal" />
  </div>
</template>

<style scoped>
.container-control {
  display: flex;
  width: 250px;
  flex-direction: column;
  padding: 10px;
  background-color: var(--content-block);
  overflow: auto;
}
.control {
  height: fit-content;
}
.note-add,
.settings {
  width: 100%;
  margin-top: 1rem;
  background-color: #141414;
  padding: 10px;
  border-radius: 13px;
  svg {
    margin-left: 10px;
  }
}
.note-add:hover {
  background-color: #000000;
}
.note-list {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
</style>

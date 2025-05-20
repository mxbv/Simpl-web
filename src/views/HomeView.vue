<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import { useRouter } from "vue-router";
// Components
import SearchBox from "@/components/SearchBox.vue";
import NoteItem from "@/components/NoteItem.vue";
const SettingsModal = defineAsyncComponent(() =>
  import("@/components/SettingsModal.vue")
);
import AddIcon from "@/assets/icons/nav/AddIcon.vue";
import SettingsIcon from "@/assets/icons/nav/SettingsIcon.vue";

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
  <div>
    <nav>
      <button
        class="settings control-item"
        @click="openSettings"
        title="Settings"
      >
        <SettingsIcon />
      </button>
      <SettingsModal ref="settingsModal" />
      <SearchBox v-model:searchQuery="searchQuery" />
      <button
        class="note-add control-item"
        @click="addNewNote"
        title="Create new record"
      >
        <AddIcon />
      </button>
    </nav>

    <div v-if="filteredNotes.length" class="note-list">
      <NoteItem
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        class="note-item"
      />
    </div>

    <!-- Message when no notes -->
    <div v-else class="hint">Click + to create a note</div>

    <!-- View for other routes (e.g. note view) -->
    <router-view @refreshNotes="refreshNotes" />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: fit-content;
  z-index: 100;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--item);
  border: solid 1px #242424;
  border-radius: 13px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15);
}
.note-add {
  border-left: solid 1px #242424;
  background-color: #1a1a1a;
}
.note-add:hover svg {
  transform: rotate(180deg);
}
.note-list {
  padding-top: 6rem;
}

.hint .control-item {
  margin-top: 20px;
}

@media(max-width: 992px) {
  nav {
    width: 95%;
  }
  .note-list {
    padding: 5rem 10px 0px 10px;
  }
}
</style>

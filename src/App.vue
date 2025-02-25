<script setup>
import { ref, onMounted } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import NoteItem from "./components/NoteItem.vue";
import { useRouter } from "vue-router";
import AddIcon from "./assets/icons/AddIcon.vue";
const notes = ref([]);
const router = useRouter();
// Load the list of notes when a component is mounted
onMounted(async () => {
  notes.value = await getNotesFromDB();
});

// Function for adding a new note
const addNewNote = async () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
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
</script>

<template>
  <div>
    <div class="main-header">
      <a
        href="https://github.com/mxbv/Simpl"
        target="_blank"
        rel="noopener noreferrer"
        class="main-header-link"
        >Simpl
      </a>
      <button
        class="note-add"
        type="button"
        title="Create new record"
        @click="addNewNote"
      >
        <AddIcon />
      </button>
    </div>
    <div class="note-list">
      <NoteItem
        v-for="note in notes"
        :key="note.id"
        :note="note"
        class="note-item"
      />
    </div>
    <!-- Main content for routes -->
    <router-view @refreshNotes="refreshNotes" />
  </div>
</template>

<style scoped>
.main-header {
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.main-header-link {
  color: var(--black-color);
  font-size: 1.6rem;
  font-weight: 500;
  text-decoration: none;
  margin-right: 20px;
}
.main-header-link:hover {
  text-decoration: underline;
}
.note-add {
  background-color: var(--black-color);
  transition: 0.5s;
}
.note-add:hover {
  svg {
    transform: rotate(180deg);
  }
}
.note-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
}
.note-item {
  height: fit-content;
}
@media screen and (max-width: 768px) {
  .main-header {
    width: 95%;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
  }
  .main-header-link {
    font-size: 2rem;
  }
}
</style>

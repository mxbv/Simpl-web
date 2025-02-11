<script setup>
import { ref, onMounted } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import NoteItem from "./components/NoteItem.vue";
import { useRouter } from "vue-router";
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
        >Simpl</a
      >

      <button
        class="note-add"
        type="button"
        title="Create new entry"
        @click="addNewNote"
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="#FFFFF0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="add-icon"
        >
          <line
            x1="12"
            x2="12"
            y1="19"
            y2="5"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
          <line
            x1="5"
            x2="19"
            y1="12"
            y2="12"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>
    </div>

    <div class="note-list">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
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
  width: 40%;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.main-header-link {
  color: var(--black-color);
  font-size: 1.6rem;
  font-weight: 500;
  text-decoration: none;
}
.main-header-link:hover {
  text-decoration: underline;
}
.note-add {
  background-color: var(--black-color);
  transition: 2s;
}
.add-icon {
  transition: 0.5s;
}
.note-add:hover {
  .add-icon {
    transform: rotate(180deg);
  }
}

@media screen and (max-width: 768px) {
  .main-header {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
  }
}
</style>

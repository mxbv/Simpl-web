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

// Exporting notes
const exportNotes = () => {
  const content = notes.value
    .map(
      (note) =>
        `| ${(note.title || "empty").toUpperCase()} (${note.date})\n${
          note.content || "empty"
        }\n`
    )
    .join("\n");

  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
};
</script>

<template>
  <div>
    <div class="sidebar">
      <a
        href="https://github.com/mxbv/Simpl"
        target="_blank"
        rel="noopener noreferrer"
        class="sidebar-link"
        >Simpl</a
      >
      <button
        class="note-export"
        type="button"
        title="Export"
        @click="exportNotes"
      >
        <svg
          width="35px"
          height="35px"
          fill="#000000"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-4,4A1,1,0,1,0,8.71,7.71ZM21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Z"
          />
        </svg>
      </button>
      <button
        class="note-add"
        type="button"
        title="Create new entry"
        @click="addNewNote"
      >
        <svg
          width="35"
          height="35"
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
.sidebar {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  background-color: #d6d6cc6a;
  backdrop-filter: blur(5px);
  border: solid 1.3px var(--border-color);
  flex-direction: row;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 60px;
  z-index: 1000;
}

.sidebar-link {
  color: var(--black-color);
  font-size: 22px;
  font-weight: 500;
  text-decoration: none;
  margin-left: 20px;
  margin-right: 20px;
}
.sidebar-link:hover {
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
  .sidebar {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
  }
}
</style>

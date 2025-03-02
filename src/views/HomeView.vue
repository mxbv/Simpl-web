<script setup>
import { ref, onMounted } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import { useRouter } from "vue-router";
import SearchBox from "@/components/SearchBox.vue";
import NoteItem from "@/components/NoteItem.vue";
import FooterItem from "@/components/FooterItem.vue";
import AddIcon from "@/assets/icons/AddIcon.vue";
const notes = ref([]);
const router = useRouter();
// Load the list of notes when a component is mounted
onMounted(async () => {
  notes.value = await getNotesFromDB();
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
</script>

<template>
  <div>
    <header>
      <SearchBox />
      <button
        class="note-add"
        type="button"
        title="Create new record"
        @click="addNewNote"
      >
        <AddIcon />
      </button>
    </header>
    <div class="note-list">
      <NoteItem
        v-for="note in notes"
        :key="note.id"
        :note="note"
        class="note-item"
      />
    </div>
    <FooterItem />
    <!-- Main content for routes -->
    <router-view @refreshNotes="refreshNotes" />
  </div>
</template>

<style scoped>
header {
  display: flex;
  position: absolute;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}
.note-add {
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
@media screen and (max-width: 768px) {
  header {
    width: 95%;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
  }
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import NoteItem from "./components/NoteItem.vue";

const notes = ref([]);

// Загружаем список заметок при монтировании компонента
onMounted(async () => {
  notes.value = await getNotesFromDB();
});

// Функция для добавления новой заметки
const addNewNote = async () => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
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
  // Добавляем новую заметку в начало списка
  notes.value.unshift(newNote);
};

// Функция для обновления списка заметок
const refreshNotes = async () => {
  notes.value = await getNotesFromDB(); // Обновляем список заметок из IndexedDB
};
</script>

<template>
  <div>
    <div class="sidebar">
      <button class="note-export" type="button" title="Export">
        <img src="@/assets/icons/export.svg" alt="Export Notes" />
      </button>
      <button
        class="note-add"
        type="button"
        title="Create new entry"
        @click="addNewNote"
      >
        <img src="@/assets/icons/add.svg" alt="Create Note" />
      </button>
    </div>

    <div class="note-list">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </div>

    <!-- Основной контент для маршрутов -->
    <router-view @refreshNotes="refreshNotes" />
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  background-color: var(--header-footer-bg-color);
  backdrop-filter: blur(10px);
  border: solid 1.3px var(--border-color);
  flex-direction: column;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  border-radius: 60px;
}

.note-add {
  background-color: var(--black-color);
}
</style>

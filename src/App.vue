<script setup>
import { ref, onMounted } from "vue";
import { getNotesFromDB, saveNoteToDB } from "@/utils/db";
import NoteItem from "./components/NoteItem.vue";
// Массив для хранения заметок
const notes = ref([]);

// Загружаем все заметки при монтировании
onMounted(async () => {
  notes.value = await getNotesFromDB(); // Загружаем все заметки из IndexedDB
});

// Функция добавления новой заметки
const addNewNote = async () => {
  const newNote = {
    id: Date.now(), // Уникальный id на основе текущего времени
    title: "", // Заголовок по умолчанию
    content: "", // Пустое содержание
    timestamp: new Date().toLocaleString(), // Текущее время для метки
  };

  // Сохраняем новую заметку в IndexedDB
  await saveNoteToDB(newNote);

  // Добавляем её в локальный список заметок
  notes.value.push(newNote); // Обновление локального состояния
};

// Обновление заметок при удалении
const refreshNotes = async () => {
  notes.value = await getNotesFromDB(); // Перезагружаем все заметки
};
</script>

<template>
  <div>
    <!-- Sidebar с кнопками -->
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

    <!-- Список заметок, добавляем NoteItem сразу здесь -->
    <div class="note-list">
      <NoteItem v-for="note in notes" :key="note.id" :note="note" />
    </div>

    <!-- Основной контент для маршрутов -->
    <router-view @noteDeleted="refreshNotes" />
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

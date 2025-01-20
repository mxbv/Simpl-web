<script setup>
import { ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import NoteItem from "./components/NoteItem.vue";

// Ссылки на данные заметок
const notes = ref(loadNotes());

// Загружаем заметки из localStorage
function loadNotes() {
  const savedNotes = localStorage.getItem("notes");
  return savedNotes ? JSON.parse(savedNotes) : [];
}

// Сохраняем заметки в localStorage
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes.value));
}

// Добавляем новую заметку
function addNote() {
  const currentDate = new Date();
  const newNote = {
    id: Date.now(),
    title: "",
    text: "",
    date: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    )}`,
  };
  notes.value.unshift(newNote); // Добавляем заметку в начало списка
  saveNotes();
}

// Обновляем заметку
function updateNote(updatedNote) {
  const index = notes.value.findIndex((note) => note.id === updatedNote.id);
  if (index !== -1) {
    notes.value[index] = updatedNote; // Обновляем заметку в массиве
    saveNotes();
  }
}

// Удаляем заметку
function deleteNote(noteToDelete) {
  notes.value = notes.value.filter((note) => note.id !== noteToDelete.id); // Удаляем заметку
  saveNotes();
}

// Экспортируем заметки
function exportNotes() {
  const content = notes.value
    .map(
      (note) =>
        `\n| ${(note.title || "empty").toUpperCase()} (${note.date})\n\n${
          note.text || "empty"
        }\n\n`
    )
    .join("");

  const blob = new Blob([content], { type: "text/plain; charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "exportNotes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <div id="app">
    <AppHeader @add-note="addNote" @export-notes="exportNotes" />
    <div class="notes">
      <NoteItem
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @update:note="updateNote"
        @delete:note="deleteNote"
      />
    </div>
  </div>
</template>

<style scoped>
.notes {
  height: 100%;
  padding-top: 80px;
}
</style>

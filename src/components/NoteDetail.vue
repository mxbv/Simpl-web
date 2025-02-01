<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = ref(parseInt(route.params.id));
const note = ref(null);
let autoSaveInterval = null;

// Блокируем прокрутку при открытии заметки
onMounted(() => {
  document.body.style.overflow = "hidden";

  // Запускаем авто-сохранение каждые 200 мс
  autoSaveInterval = setInterval(() => {
    if (note.value) saveNoteToDB(note.value);
  }, 200);
});

// Восстанавливаем прокрутку при выходе из заметки
onUnmounted(() => {
  document.body.style.overflow = "";
  clearInterval(autoSaveInterval);
});

// Загружаем заметку при изменении noteId
watchEffect(async () => {
  const notes = await getNotesFromDB();
  note.value = notes.find((n) => n.id === noteId.value) || null;
});

// Удаление заметки
const deleteNote = async () => {
  if (note.value) {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (isConfirmed) {
      clearInterval(autoSaveInterval); // Останавливаем авто-сохранение
      await deleteNoteFromDB(note.value.id);
      note.value = null; // Обнуляем текущую заметку
      emit("noteDeleted");
      emit("refreshNotes");
      router.push("/");
    }
  }
};

// Переход назад
const goBack = () => {
  router.push("/");
  emit("refreshNotes");
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <div class="note-header">
        <button @click="goBack" class="go-back-button">
          <img src="@/assets/icons/back.svg" alt="Go Back" />
        </button>
        <span>{{ note.date }}</span>
      </div>
      <input
        v-model="note.title"
        placeholder="Title"
        class="note-input note-title"
        ref="titleTextarea"
        maxlength="50"
        type="text"
      />
      <textarea
        v-model="note.content"
        placeholder="Write your text here..."
        class="note-input note-text"
        ref="contentTextarea"
      ></textarea>
      <button @click="deleteNote" class="delete-button">
        <img src="@/assets/icons/delete.svg" alt="Delete Note" /> Delete record
      </button>
    </div>
  </div>
  <div v-else>
    <p>Record not found</p>
  </div>
</template>

<style scoped>
.note {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100dvh;
  background-color: #fffff0;
  top: 0;
  left: 0;
  justify-content: center;
  z-index: 1000;
  overflow: auto;
  animation: fadeIn 0.3s ease-in-out;
}

.note-container {
  width: 70%;
  height: 100%;
  padding: 30px 0;
}
.note-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.go-back-button {
  background-color: #ececdd;
}
.note-input {
  width: 100%;
  border: none;
  padding: 15px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: none;
  background-color: var(--content-color);
  color: var(--black-color);
  font-size: 20px;
  border-radius: 15px;
  margin-top: 30px;
}

.note-input::placeholder {
  color: var(--black-color);
  opacity: 1;
}

.note-title {
  width: 100%;
  font-size: 28px;
  font-weight: 500;
  text-overflow: ellipsis;
}

.note-text {
  height: 50%;
  min-height: 50%;
  max-height: 50%;
}

.delete-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  height: fit-content;
  background-color: var(--black-color);
  color: var(--white-color);
  transition: 0.5s;
  border-radius: 15px;
  padding: 15px 15px;
  font-size: 18px;
  font-weight: 300;
  color: #fffff0;
  margin-top: 50px;
}

.delete-button img {
  margin-right: 8px;
}
span {
  font-size: 18px;
  font-weight: 300;
}

</style>

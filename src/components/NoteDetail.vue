<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db"; // Утилиты для работы с IndexedDB

// Определяем событие, которое будет отправляться
const emit = defineEmits(["noteDeleted"]); // Теперь событие 'noteDeleted' правильно определено

const route = useRoute(); // Получаем информацию о маршруте
const router = useRouter(); // Для навигации

const noteId = parseInt(route.params.id); // Преобразуем id в число
const note = ref(null); // Создаем реактивную переменную для заметки

// Загружаем заметку при монтировании компонента
onMounted(async () => {
  const notes = await getNotesFromDB(); // Получаем все заметки из IndexedDB
  note.value = notes.find((n) => n.id === noteId); // Находим нужную заметку по id
});

// Обновление заметки
const updateNote = async () => {
  if (note.value) {
    // Сохраняем изменения заметки в IndexedDB
    await saveNoteToDB(note.value);
  }
};

// Удаление заметки
const deleteNote = async () => {
  if (note.value) {
    await deleteNoteFromDB(note.value.id); // Удаляем заметку из IndexedDB
    router.push("/"); // После удаления возвращаем на главную страницу
    // Отправляем событие для обновления главной страницы
    emit("noteDeleted"); // Это событие теперь отправляется
  }
};

// Возврат на главную страницу
const goBack = () => {
  router.push("/"); // Возврат на главную страницу
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <button @click="goBack" class="go-back-button">
        <img src="@/assets/icons/back.svg" alt="Go Back" />
      </button>
      <!-- Поле для заголовка заметки -->
      <textarea
        v-model="note.title"
        placeholder="Title"
        class="note-title"
      ></textarea>
      <!-- Поле для контента заметки -->
      <textarea
        v-model="note.content"
        placeholder="Write your text here..."
      ></textarea>
      <button @click="updateNote">Save changes</button>
      <!-- Кнопка удаления заметки -->
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
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100dvh;
  background-color: #fffff0;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.note-container {
  width: 50%;
  height: 100%;
}
.go-back-button {
  margin-top: 20px;
}
textarea {
  width: 100%;
  height: auto;
  border: none;
  padding: 5px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: none;
  line-height: 20px;
  background: none;
  color: var(--black-color);
  font-size: 20px;
}
textarea::placeholder {
  color: var(--black-color);
  opacity: 1;
}
.note-title {
  width: 100%;
  font-size: 28px;
  font-weight: 500;
  text-overflow: ellipsis;
  line-height: normal;
  margin-top: 50px;
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
  margin-top: 10px;
  color: #fffff0;
}
.delete-button img {
  margin-right: 8px;
}
</style>

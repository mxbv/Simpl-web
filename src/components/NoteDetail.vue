<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, nextTick } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";

const emit = defineEmits(["noteDeleted", "refreshNotes"]); // События для обновления

const route = useRoute();
const router = useRouter();

const noteId = parseInt(route.params.id);
const note = ref(null);

const typingTimeout = ref(null);

// Загружаем заметку при монтировании компонента
onMounted(async () => {
  const notes = await getNotesFromDB();
  note.value = notes.find((n) => n.id === noteId);
  nextTick(() => {
    autoExpand();
  });
});

const updateNote = async () => {
  if (note.value) {
    await saveNoteToDB(note.value);
  }
};

// Удаление заметки
const deleteNote = async () => {
  if (note.value) {
    await deleteNoteFromDB(note.value.id);
    emit("noteDeleted"); // Генерируем событие для удаления
    emit("refreshNotes"); // Генерируем событие для обновления списка заметок
    router.push("/"); // Перенаправляем на главную страницу
  }
};

// Переход на главную страницу
const goBack = () => {
  router.push("/");
  emit("refreshNotes"); // Отправка события для обновления списка при переходе назад
};

// Автоматическое расширение поля ввода
const autoExpand = () => {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  });
};

const onInput = () => {
  clearTimeout(typingTimeout.value);
  typingTimeout.value = setTimeout(() => {
    updateNote();
  }, 1);
};
</script>

<template>
  <div v-if="note" class="note">
    <div class="note-container">
      <button @click="goBack" class="go-back-button">
        <img src="@/assets/icons/back.svg" alt="Go Back" />
      </button>
      <textarea
        v-model="note.title"
        placeholder="Title"
        class="note-title"
        @blur="updateNote"
        @input="onInput"
        maxlength="50"
      ></textarea>
      <textarea
        v-model="note.content"
        placeholder="Write your text here..."
        @blur="updateNote"
        @input="onInput"
        class="note-text"
      ></textarea>
      <div class="count">
        <span class="current_count"></span>
        <span>/</span>
        <span class="maximum_count">10,000</span>
      </div>
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

.note-text {
  max-height: 6000px;
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
  margin-top: 30px;
  color: #fffff0;
}

.delete-button img {
  margin-right: 8px;
}
</style>

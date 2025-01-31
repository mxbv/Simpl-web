<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, nextTick } from "vue";
import { getNotesFromDB, deleteNoteFromDB, saveNoteToDB } from "@/utils/db";

const emit = defineEmits(["noteDeleted", "refreshNotes"]);
const route = useRoute();
const router = useRouter();
const noteId = parseInt(route.params.id);
const note = ref(null);

// Загружаем заметку при монтировании компонента
onMounted(async () => {
  note.value = (await getNotesFromDB()).find((n) => n.id === noteId);
  nextTick(() => {
    restoreHeight();
  });
});

// Восстановление сохранённой высоты
const restoreHeight = () => {
  const titleTextarea = document.querySelector(".note-title");
  const contentTextarea = document.querySelector(".note-text");
  const savedTitleHeight = localStorage.getItem("titleHeight");
  const savedContentHeight = localStorage.getItem("contentHeight");

  if (savedTitleHeight) {
    titleTextarea.style.height = savedTitleHeight + "px";
  }
  if (savedContentHeight) {
    contentTextarea.style.height = savedContentHeight + "px";
  }
};

// Сохранение высоты textarea
const saveHeight = (textarea, field) => {
  localStorage.setItem(`${field}Height`, textarea.scrollHeight);
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};

// Обновление заметки в базе данных
const updateNote = async () => {
  if (note.value) {
    await saveNoteToDB(note.value);
  }
};

// Удаление заметки
const deleteNote = async () => {
  if (note.value) {
    await deleteNoteFromDB(note.value.id);
    emit("noteDeleted");
    emit("refreshNotes");
    router.push("/");
  }
};

// Переход на главную страницу
const goBack = () => {
  router.push("/");
  emit("refreshNotes");
};

// Автоматическое расширение textarea
const autoExpand = (event) => {
  event.target.style.height = "auto";
  event.target.style.height = `${event.target.scrollHeight}px`;
  saveHeight(event.target, event.target.classList.contains('note-title') ? 'title' : 'content');
};

// Обработчик ввода
const onInput = (event) => {
  updateNote();
  autoExpand(event);
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
        class="note-text"
        @blur="updateNote"
        @input="onInput"
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
  overflow: hidden;
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #fffff0;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: flex-start;
  padding: 30px 0;
}

.note-container {
  width: 50%;
  height: 100%;
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
  border-bottom: solid 1px #000000;
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
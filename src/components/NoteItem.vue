<script>
export default {
  name: "NoteItem",
  props: {
    note: {
      type: Object,
      required: true,
    }, // Получаем заметку как пропс
  },
  data() {
    return {
      localNote: { ...this.note }, // Создаем локальную копию заметки
    };
  },
  methods: {
    // Метод для удаления заметки
    deleteNote() {
      this.$emit("delete:note", this.localNote); // Генерируем событие для родительского компонента
    },
    // Метод для синхронизации изменений с родительским компонентом
    updateNote() {
      this.$emit("update:note", this.localNote);
    },
  },
  watch: {
    // Следим за изменением пропса note и обновляем локальную копию
    note: {
      deep: true,
      handler(newNote) {
        this.localNote = { ...newNote };
      },
    },
  },
};
</script>

<template>
  <div class="note">
    <div class="note-title-container">
      <textarea
        v-model="localNote.title"
        class="note-title"
        placeholder="Title"
        maxlength="50"
        @input="updateNote"
      ></textarea>
      <button @click="deleteNote" class="note-delete" title="Delete">
        <img
          src="../assets/icons/delete.svg"
          alt="delete"
          class="note-delete-img"
        />
      </button>
    </div>
    <div class="note-text-container">
      <textarea
        v-model="localNote.text"
        class="note-text"
        placeholder="Write new text here..."
        maxlength="10000"
        @input="updateNote"
      ></textarea>
    </div>
    <span class="note-date">{{ localNote.date }}</span>
  </div>
</template>

<style scoped>
.notes {
  height: 100%;
  padding-top: 60px;
}
.note {
  width: 100%;
  margin-top: 50px;
  border-radius: 30px;
  padding: 15px;
  border: solid 1.3px var(--border-color);
}

.note-title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
textarea {
  width: 100%;
  border: none;
  padding: 5px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  resize: none;
  line-height: 20px;
  background: none;
  color: var(--text-color);
}
textarea::placeholder {
  color: var(--text-color);
  opacity: 1;
}
.note-title {
  font-size: 24px;
  font-weight: 600;
}
.note-text {
  font-size: 18px;
}
span {
  padding: 5px;
  color: #595959;
  font-size: 14px;
}
</style>

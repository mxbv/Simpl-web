<script>
export default {
  name: "NoteItem",
  props: {
    note: {
      type: Object,
      required: true,
    }, // Getting a note as a props
  },
  data() {
    return {
      localNote: { ...this.note }, // Create a local copy of the note
    };
  },
  methods: {
    // Method for deleting a note
    deleteNote() {
      this.$emit("delete:note", this.localNote); // Generate event for parent component
    },
    // Method for synchronizing changes with the parent component
    updateNote() {
      this.$emit("update:note", this.localNote);
    },
  },
  watch: {
    // Watch for changes to the note props and update the local copy
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
.note-delete {
  width: 70px;
}
.note-text {
  font-size: 18px;
}
span {
  padding: 5px;
  color: #595959;
  font-size: 14px;
}
@media screen and (max-width: 480px) {
  .notes {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 0;
    padding-top: 100px;
  }
  .note {
    width: 95%;
    padding: 20px 10px;
    margin: 0 auto;
    margin-top: 30px;
  }
  .note-title {
    display: inline-block;
    width: 80%;
    font-size: 24px;
    border: none;
    resize: none;
    padding: 5px;
    font-family: inherit;
    box-sizing: border-box;
    outline: none;
    line-height: 18px;
  }
  .note-date {
    display: inline-block;
    padding: 5px;
  }
}
</style>

<script>
export default {
  name: "AppHeader",
  methods: {
    addNewNote() {
      this.$emit("add-note");
    },
    exportNotes() {
      this.$emit("export-notes");
    },
  },
};
</script>
<template>
  <header>
    <img src="../assets/icons/logo.svg" alt="logo" class="logo" />
    <div class="header-buttons">
      <button
        class="note-export"
        type="button"
        title="Export"
        @click="exportNotes"
      >
        <img src="../assets/icons/export.svg" alt="create-note" />
      </button>
      <button
        class="note-add"
        type="button"
        title="Add a note"
        @click="addNewNote"
      >
        <img src="../assets/icons/create-note.svg" alt="create-note" />
      </button>
    </div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--header-footer-bg-color);
  backdrop-filter: blur(10px);
  border-radius: 60px;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
}
.logo {
  width: 100px;
  height: 50px;
  user-select: none;
  margin-right: 50px;
  margin-left: 30px;
}
.header-buttons {
  display: flex;
  user-select: none;
  border-radius: 100px;
}
.note-add {
  margin-left: 5px;
  background-color: #000000;
}
.note-export {
  background-color: #ffffff00;
}
</style>

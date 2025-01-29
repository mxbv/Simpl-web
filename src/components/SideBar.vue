<script>
export default {
  name: "SideBar",
  props: {
    notes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    addNote() {
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString("en-GB", {
        weekday: "short",
        year: "numeric",
        day: "2-digit",
        month: "2-digit",
      })} ${currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
      const newNote = {
        id: Date.now(),
        title: "",
        text: "",
        date: formattedDate,
      };
      this.$emit("update:notes", [newNote, ...this.notes]); // Обновляем список через $emit
    },
    exportNotes() {
      const content = this.notes
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
    },
  },
};
</script>

<template>
  <div class="sidebar">
    <button
      class="note-export"
      type="button"
      title="Export"
      @click="exportNotes"
    >
      <svg
        width="35px"
        height="35px"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 15c0 2.8284 0 4.2426 0.87868 5.1213s2.2929 0.8787 5.1213 0.8787h6c2.8284 0 4.2426 0 5.1213-0.8787s0.8787-2.2929 0.8787-5.1213M12 3v13l4-4.375m-4 4.375-4-4.375"
        />
      </svg>
    </button>
    <button
      class="note-add"
      type="button"
      title="Create new entry"
      @click="addNote"
    >
      <svg
        width="35px"
        height="35px"
        fill="none"
        stroke="#FFFFF0"
        stroke-width="2"
        stroke-linecap="round"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
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

<script setup>
defineProps({
  note: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <router-link :to="`/note/${note.id}`" class="note-item">
    <div class="note-head">
      <h3 class="note-title">
        {{ note.title || "Untitled" }}
      </h3>
      <div class="note-date">{{ note.date }}</div>
    </div>
    <h4 class="note-text">
      {{ note.content || "" }}
    </h4>
  </router-link>
</template>

<style scoped>
.note-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  padding: 20px;
  background: var(--content-block);
  border-radius: 15px;
  text-decoration: none;
  overflow: hidden;
  border: solid 1px var(--border);
  transition: 0.3s ease-in-out;
  color: var(--text);
}

.note-item:hover {
  background-color: #202020;
}
.note-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.note-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  width: 100%;
  height: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note-date {
  margin-left: 15px;
  color: var(--accent);
}
.note-text {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #858585;
}

@media screen and (max-width: 768px) {
  .note-item {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>

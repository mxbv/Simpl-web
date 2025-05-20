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
    <h4 class="note-text" v-if="note.content">
      {{ note.content }}
    </h4>
  </router-link>
</template>

<style scoped>
.note-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 1rem;
  background: var(--item);
  border-radius: 13px;
  text-decoration: none;
  overflow: hidden;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.2s ease;
}

.note-item:hover {
  background-color: var(--item-hover);
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
  font-weight: 400;
  width: 100%;
  height: fit-content;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.note-date {
  margin-left: 1rem;
  color: var(--text);
  font-weight: 300;
  color: #b3b3b3;

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
  color: #b3b3b3;
  font-weight: 300;
}

@media screen and (max-width: 992px) {
  .note-item {
    width: 100%;
    margin-bottom: 1.2rem;
  }
}
</style>

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
    <h3 class="note-title">
      {{ note.title || "Untitled" }}
    </h3>
    <!-- <h4 class="note-text" v-if="note.content">— {{ note.content }}</h4> -->
  </router-link>
</template>

<style scoped>
.note-item {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  border-radius: 10px;
  text-decoration: none;
  overflow: hidden;
  color: var(--text);
}

.note-item:hover {
  background-color: var(--block-hover);
}
.note-title {
  width: fit-content;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* .note-text {
  width: fit-content;
  max-width: 50%;
  min-width: 10%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #818181;
  font-weight: 300;
  margin-left: 5px;
} */
@media screen and (max-width: 768px) {
  .note-item {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 1.2rem;
  }
}
</style>

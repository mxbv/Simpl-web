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
    <h3>{{ note.title || "Write Your New Story..." }}</h3>
    <p>{{note.date}}</p>
  </router-link>
</template>

<style scoped>
.note-item {
  display: block;
  padding: 20px;
  margin-bottom: 30px;
  background: #eaead2bd;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: var(--text-color);
  text-decoration: none;
}

h3 {
  margin: 0;
  font-size: 25px;
  font-weight: 500;
}

p {
  font-size: 18px;
  color: #777;
  margin: 0;
  margin-top: 20px;
}
</style>

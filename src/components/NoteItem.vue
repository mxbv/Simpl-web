<script setup>
defineProps({
  note: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="note-item">
    <router-link :to="`/note/${note.id}`">
      <h3>{{ note.title || "Write Your New Story..." }}</h3>
      <p>{{ new Date().toLocaleString() }}</p>
    </router-link>
  </div>
</template>

<style>
.note-item {
  padding: 10px;
  margin: 10px 0;
  background: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.note-item a {
  text-decoration: none;
  color: inherit;
}

.note-item:hover {
  background-color: #ddd;
}

.note-item h3 {
  margin: 0;
  font-size: 18px;
}

.note-item p {
  font-size: 14px;
  color: #777;
}
</style>

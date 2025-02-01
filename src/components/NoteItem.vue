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
    <h4>
      {{
        note.content
          ? note.content.substring(0, 50) +
            (note.content.length > 40 ? "..." : "")
          : ""
      }}
    </h4>
    <p>{{ note.date }}</p>
  </router-link>
</template>

<style scoped>
.note-item {
  display: block;
  padding-top: 30px;
  margin-bottom: 30px;
  background: var(--content-color);
  border: 1px solid #ccc;
  border-radius: 30px;
  color: var(--text-color);
  text-decoration: none;
  animation: fadeIn 0.3s ease-in-out;
  transition: 0.3s;
}
.note-item:hover {
  background-color: #dedecf;
}

h3 {
  margin: 0;
  font-size: 25px;
  font-weight: 500;
  padding-left: 20px;
}

h4 {
  margin: 0;
  margin-top: 20px;
  font-size: 18px;
  font-weight: 400;
  color: #5d5d5d;
  padding-left: 20px;
}
p {
  font-size: 18px;
  color: var(--text-color);
  margin: 0;
  margin-top: 20px;
  padding-left: 20px;
  background-color: #dedecf;
  padding: 20px 30px 30px 20px;
  width: fit-content;
  border-radius: 0 30px 0 30px;
}
</style>

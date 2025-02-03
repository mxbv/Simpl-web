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
    <span>{{ note.date }}</span>
    <h3>{{ note.title || "Write Your New Story" }}</h3>
    <h4>
      {{
        note.content
          ? note.content.substring(0, 50) +
            (note.content.length > 50 ? "..." : "")
          : ""
      }}
    </h4>
  </router-link>
</template>

<style scoped>
.note-item {
  display: block;
  height: fit-content;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  margin-bottom: 30px;
  background: var(--content-color);
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--black-color);
  text-decoration: none;
  transition: 0.3s;
  overflow: hidden;
}
.note-item:hover {
  background-color: #dedecf;
}

h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  width: 100%;
  height: fit-content;
  margin-top: 10px;
  text-wrap-mode: wrap;
}

h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  width: fit-content;
  height: fit-content;
  margin-top: 10px;
}
span {
  width: fit-content;
}
@media screen and (max-width: 768px) {
  .note-item {
    width: 98%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 22px;
  }
}
</style>

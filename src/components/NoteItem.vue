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
    <h3>{{ note.title || "Write Your New Story" }}</h3>
    <h4>
      {{
        note.content
          ? note.content.substring(0, 50) +
            (note.content.length > 50 ? "..." : "")
          : ""
      }}
    </h4>
    <span>{{ note.date }}</span>
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
  background: var(--content-color);
  border-radius: 30px;
  color: var(--black-color);
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0px 4px 10px #0000001a;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.note-item:hover {
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  width: 100%;
  height: fit-content;
  text-wrap-mode: wrap;
}

h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  width: fit-content;
  height: fit-content;
  margin-top: 10px;
}
span {
  width: fit-content;
  font-size: 1rem;
  margin-top: 10px;
}
@media screen and (max-width: 768px) {
  .note-item {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
</style>

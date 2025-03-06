<script setup>
import { ref, watch } from "vue";
import SearchIcon from "@/assets/icons/SearchIcon.vue";
import { getNotesFromDB } from "@/utils/db"; // Importing the note taking function
const searchQuery = ref("");
const filteredNotes = ref([]);

const searchNotes = async (query) => {
  const notes = await getNotesFromDB(); // Uploading all notes
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
  );
};

// Watch the searchQuery change and call the search
watch(searchQuery, async (newQuery) => {
  filteredNotes.value = await searchNotes(newQuery);
});
</script>

<template>
  <div class="search">
    <SearchIcon />
    <input
      v-model="searchQuery"
      type="text"
      class="search-input"
      placeholder="Search in development"
    />
  </div>
  <ul v-if="searchQuery" class="search-result">
    <li v-for="note in filteredNotes" :key="note.id" class="search-result-item">
      <router-link :to="{ name: 'Note Details', params: { id: note.id } }">
        <strong>{{ note.title }}</strong
        >: {{ note.content }}
      </router-link>
    </li>
    <!-- If there are no results, show the message -->
    <li v-if="filteredNotes.length === 0" class="search-result-item">
      <strong>No notes found. Please check your search query.</strong>
    </li>
  </ul>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: var(--content-block);
  border-radius: 1rem;
  margin-right: 10px;
}
.search-input {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  outline: none;
  margin-left: 10px;
  color: var(--text);
}
svg {
  color: var(--text);
}
.search-result {
  display: flex;
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
  flex-direction: column;
  padding: 1.3rem;
  background-color: var(--accent);
  list-style: none;
  width: 150%;
  border-radius: 1rem;
}
.search-result-item {
  width: 100%;
  text-align: left;
  margin-top: 10px;
}
.search-result-item a {
  color: #000;
  text-decoration: none;
}
</style>

<script setup>
import { defineEmits, ref, watch } from "vue";
const emit = defineEmits(["update:searchQuery"]);
const searchInput = ref("");

watch(searchInput, (newQuery) => {
  emit("update:searchQuery", newQuery);
});
</script>

<template>
  <div class="search">
    <input
      v-model="searchInput"
      type="text"
      placeholder="Search"
      class="search-input"
    />
  </div>
</template>

<style>
.search {
  flex: 1;
  padding: 10px;
}
.search-input {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  background: none;
  outline: none;
  color: var(--text);
}
.search-input::placeholder {
  color: #b3b3b3;
}
</style>

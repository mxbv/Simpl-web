<script setup>
import SearchIcon from "@/assets/icons/SearchIcon.vue";
</script>

<template>
  <div class="search">
    <SearchIcon />
    <input type="text" class="search-input" placeholder="Soon..." />
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  width: 100%;
  height: 52px;
  padding: 10px 15px;
  background-color: var(--content-block);
  border-radius: 15px;
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
</style>

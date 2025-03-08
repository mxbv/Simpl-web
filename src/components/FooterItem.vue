<script setup>
import CodeIcon from "@/assets/icons/CodeIcon.vue";
</script>
<template>
  <footer>
    <a
      href="https://github.com/mxbv/Simpl"
      rel="noreferrer noopener"
      target="_blank"
      class="footer-link"
      ><CodeIcon
    /></a>
  </footer>
</template>
<style scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  height: fit-content;
}
.footer-link {
  color: var(--text);
  text-decoration: none;
}
.footer-link:hover {
  color: var(--accent);
}
</style>

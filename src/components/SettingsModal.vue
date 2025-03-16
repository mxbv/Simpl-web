<script setup>
import { ref, defineExpose } from "vue";
import CloseIcon from "@/assets/icons/CloseIcon.vue";
import LogoIcon from "@/assets/icons/LogoIcon.vue";
const isOpen = ref(false);

const open = () => (isOpen.value = true);
const close = () => (isOpen.value = false);

defineExpose({ open });
</script>
<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="settings-modal">
      <div class="settings-header">
        <h3>Settings</h3>
        <button @click="close" class="close"><CloseIcon /></button>
      </div>
      <div class="setting-item">
        <span class="setting-item-name">Themes ( in the next versions )</span>
        <select name="theme" id="theme-toggle" class="setting-item-themes">
          <option value="dark">Dark theme ( Default )</option>
          <option value="light">Light theme</option>
        </select>
      </div>
      <div class="divider"></div>
      <div class="setting-item">
        <span class="setting-item-name">About</span>
        <p class="setting-item-text">
          A lightweight note-taking app built with Vue.js. It stores your notes
          locally using IndexedDB for quick access, and you can export them as
          TXT files for backup or sharing.
        </p>
        <a href="https://github.com/mxbv/Simpl" class="settings-item-link">
          <LogoIcon /> <span>View source</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100dvw;
  height: 100dvh;
  background: #1010105a;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.settings-modal {
  background: var(--bg);
  padding: 2rem;
  border-radius: 8px;
  width: 50%;
  border: solid 1px var(--accent);
  animation: fadeIn 0.3s ease;
}
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: var(--text);
}
.settings-header h3 {
  font-size: 1.2rem;
}
.close {
  margin: 0;
}
.setting-item {
  color: var(--text);
}
.setting-item-name {
  display: block;
  color: #858585;
  margin-bottom: 10px;
}
.setting-item-themes {
  padding: 0.8rem;
  background-color: var(--content-block);
  border: solid 1px var(--border);
  border-radius: 1rem;
  color: var(--text);
}
.settings-item-link {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: var(--content-block);
  padding: 0.8rem;
  border: solid 1px var(--border);
  border-radius: 1rem;
  text-decoration: none;
  margin-top: 20px;
  color: var(--text);
}
.settings-item-link:hover {
  border-color: var(--border-hover);
}
.settings-item-link span {
  margin-left: 5px;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--border);
  margin: 20px 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@media screen and (max-width: 768px) {
  .settings-modal {
    width: 95%;
  }
}
</style>

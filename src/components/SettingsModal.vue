<script setup>
import { ref, defineExpose } from "vue";
import CloseIcon from "@/assets/icons/settings/CloseIcon.vue";
import LogoIcon from "@/assets/icons/settings/LogoIcon.vue";
const isOpen = ref(false);

const open = () => {
  document.body.style.overflow = "hidden";
  isOpen.value = true;
};
const close = () => {
  isOpen.value = false;
  document.body.style.overflow = "auto";
};

defineExpose({ open });
</script>
<template>
  <Teleport to="body"
    ><div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="settings-modal">
        <div class="settings-header">
          <h3>Settings</h3>
          <button @click="close" class="control-item"><CloseIcon /></button>
        </div>
        <div class="setting-item">
          <span class="setting-item-name">Themes ( in the next versions )</span>
          <select name="theme" id="theme-toggle" class="control-item">
            <option value="dark">Dark theme ( Default )</option>
            <option value="light">Light theme</option>
          </select>
        </div>
        <div class="divider"></div>
        <div class="setting-item">
          <span class="setting-item-name">About</span>
          <p class="setting-item-text">
            A lightweight note-taking app built with Vue.js. It stores your
            notes locally using IndexedDB for quick access, and you can export
            them as TXT files for backup or sharing.
          </p>
          <a href="https://github.com/mxbv/Simpl-web" class="control-item">
            <LogoIcon /> <span>View source</span>
          </a>
        </div>
      </div>
    </div></Teleport
  >
</template>

<style scoped>
.modal-overlay {
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100vh;
  background: #1010105a;
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.settings-modal {
  background: var(--bg);
  padding: 1.5rem;
  border-radius: 12px;
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
  margin-bottom: 20px;
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
  color: #adadad;
  margin-bottom: 20px;
}
.setting-item-text {
  margin-bottom: 20px;
}
.button span {
  margin-left: 5px;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: var(--content-block);
  margin: 20px 0;
}
@media screen and (max-width: 992px) {
  .settings-modal {
    width: 95%;
  }
}
</style>

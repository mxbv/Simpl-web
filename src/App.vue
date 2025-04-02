<script setup>
import ControlSide from "./components/control/ControlSide.vue";
import EditorSide from "./components/editor/EditorSide.vue";
</script>
<template>
  <main>
    <ControlSide />
    <EditorSide />
  </main>
</template>

<style scoped>
main {
  display: flex;
  height: 100dvh;
  overflow: hidden;
}
</style>

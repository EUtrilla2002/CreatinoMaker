<script setup lang="ts">
import { ref, reactive } from 'vue'
import BoardElement from './components/BoardElement.vue'

const positions = reactive({
  svgIcon: { x: 300, y: 100 }
})
const draggingId = ref<string | null>(null)
const offset = reactive({ x: 0, y: 0 })

function handleMouseDown(e: MouseEvent, id: string) {
  draggingId.value = id
  offset.x = e.clientX - positions[id].x
  offset.y = e.clientY - positions[id].y
}

function handleMouseMove(e: MouseEvent) {
  if (!draggingId.value) return
  positions[draggingId.value].x = e.clientX - offset.x
  positions[draggingId.value].y = e.clientY - offset.y
}

function handleMouseUp() {
  draggingId.value = null
}
</script>

<template>
  <div
    class="App"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    style="width: 100vw; height: 100vh; position: relative; overflow: hidden;"
  >
    <h1>Creatino Maker</h1>
    <div
      ref="workspaceRef"
      style="width: 100%; height: 50%; border: 2px solid #ccc; position: relative; margin-bottom: 1rem; overflow: hidden;"
    >
      <BoardElement
        :positions="positions"
        @handleMouseDown="handleMouseDown"
        ref="svgRef"
      />
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
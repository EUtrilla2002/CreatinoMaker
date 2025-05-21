<template>
  <div
    :style="{
      position: 'absolute',
      left: positions.svgIcon.x + 'px',
      top: positions.svgIcon.y + 'px',
      cursor: 'grab'
    }"
    @mousedown="onMouseDown"
    ref="svgRef"
  >
    <Board class="w-32 h-32 border border-red-500" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Board from '../assets/board.svg'

const props = defineProps<{
  positions: { svgIcon: { x: number; y: number } }
}>()

const emit = defineEmits<{
  (e: 'handleMouseDown', event: MouseEvent, id: string): void
}>()

const svgRef = ref<HTMLElement | null>(null)

function onMouseDown(e: MouseEvent) {
  emit('handleMouseDown', e, 'svgIcon')
}
</script>
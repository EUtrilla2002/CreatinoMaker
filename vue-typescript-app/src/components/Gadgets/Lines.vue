<template>
  <svg ref="svgRef" class="connections-lines">
    <path
      v-for="(line, index) in lines"
      :key="index"
      :d="generateCurvePath(line)"
      stroke="black"
      stroke-width="2"
      fill="none"
    />
    
    <!-- Puntos de control -->
    <!-- <circle
      v-for="(line, index) in lines"
      :key="'cx1-' + index"
      :cx="line.cx1"
      :cy="line.cy1"
      r="6"
      fill="red"
      @mousedown="startDragControlPoint(index, 'cx1', 'cy1', $event)"
    />
    <circle
      v-for="(line, index) in lines"
      :key="'cx2-' + index"
      :cx="line.cx2"
      :cy="line.cy2"
      r="6"
      fill="blue"
      @mousedown="startDragControlPoint(index, 'cx2', 'cy2', $event)"
    /> -->

    <line
      v-if="tempLine"
      :x1="tempLine.x1"
      :y1="tempLine.y1"
      :x2="tempLine.x2"
      :y2="tempLine.y2"
      stroke="gray"
      stroke-width="1"
      stroke-dasharray="5,5"
    />
  </svg>

  <p v-if="tempLine" style="position: absolute; color: red;">
    Línea temporal: ({{ tempLine.x1 }}, {{ tempLine.y1 }}) → ({{ tempLine.x2 }}, {{ tempLine.y2 }})
  </p>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  lines: {
    type: Array,
    required: true
  },
  tempLine: {
    type: Object,
    default: null
  }
})

const svgRef = ref(null)
const dragging = ref(null)

function generateCurvePath({ x1, y1, x2, y2, cx1, cy1, cx2, cy2 }) {
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
}

function startDragControlPoint(index, controlXKey, controlYKey, event) {
  console.log(`Arrastrando punto de control ${controlXKey}, ${controlYKey} para la línea ${index}`);
  event.preventDefault()
  dragging.value = { index, controlXKey, controlYKey }
  // Cambiar cursor a "grabbing"
  event.target.style.cursor = 'grabbing'
}
</script>

<style scoped>
.connections-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
.connections-lines circle {
  cursor: grab; /* o grab, move, lo que prefieras */
  pointer-events: auto;
}
.connections-lines path{
  pointer-events: auto;
}
</style>

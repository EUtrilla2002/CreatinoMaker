<template>
  <svg ref="svgRef" class="connections-lines">
    <!-- Path invisible más grueso para mejorar el área de hover -->
    <path
      v-for="(line, index) in lines"
      :key="'hover-' + index"
      :d="generateCurvePath(line)"
      stroke="transparent"
      stroke-width="30"
      fill="none"
      @mouseenter="hoveredLineIndex = index"
      @mouseleave="hoveredLineIndex = null"
      @click.stop="selectLine(index)"
      style="cursor: pointer"
    />
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

  <!-- <p v-if="tempLine" style="position: absolute; color: red;">
    Línea temporal: ({{ tempLine.x1 }}, {{ tempLine.y1 }}) → ({{ tempLine.x2 }}, {{ tempLine.y2 }})
  </p> -->
<button
  v-if="hoveredLineIndex !== null || selectedLineIndex !== null"
  :style="getButtonStyle(lines[selectedLineIndex ?? hoveredLineIndex])"
  class="floating-button"
  @click.stop="showColorPicker = !showColorPicker"
>
  🎨
</button>
<!-- Color Picker Popup -->
<!-- <div
  v-if="showColorPicker"
  :style="getButtonStyle(lines[selectedLineIndex ?? hoveredLineIndex])"
  class="color-picker-popup"
  @click.stop
>
  <ColorPicker
    :color="currentColor"
    @color-change="(color) => handleColorChange(color)"
  />
</div> -->
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'

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
const hoveredLineIndex = ref(null)
const selectedLineIndex = ref(null)
const showColorPicker = ref(false)



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

// Menú desplegable
function handleClickOutside(event) {
  if (!svgRef.value?.contains(event.target)) {
    selectedLineIndex.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
function getButtonStyle(line) {
  const t = 0.5
  const x = cubicBezier(t, line.x1, line.cx1, line.cx2, line.x2)
  const y = cubicBezier(t, line.y1, line.cy1, line.cy2, line.y2)

  return `position: absolute; left: ${x}px; top: ${y}px; transform: translate(-50%, -50%); z-index: 20;`
}

function cubicBezier(t, p0, p1, p2, p3) {
  const mt = 1 - t
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  )
}
function selectLine(index) {
  if (selectedLineIndex.value === index) {
    selectedLineIndex.value = null
  } else {
    selectedLineIndex.value = index
  }
}
// Menu config
function handleColorChange(color) {
  currentColor.value = color.hex
  if (selectedLineIndex.value !== null) {
    // Aplica el color a la línea seleccionada directamente
    props.lines[selectedLineIndex.value].stroke = currentColor.value
  }
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
.floating-button {
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 20px;
}
.color-picker-popup {
  position: absolute;
  transform: translate(-50%, 0);
  z-index: 30;
  background: white;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

</style>

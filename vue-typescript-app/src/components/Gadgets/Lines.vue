<template>
  <svg ref="svgRef" class="connections-lines">
    <!-- Path invisible para hover -->
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
    <!-- Path visible -->
    <path
      v-for="(line, index) in lines"
      :key="index"
      :d="generateCurvePath(line)"
      :stroke="line.stroke || 'black'"
      stroke-width="2"
      fill="none"
    />

    <!-- Línea temporal -->
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

  <!-- Botón flotante 🎨 -->
  <button
    v-if="hoveredLineIndex !== null || selectedLineIndex !== null"
    :style="parseStyle(getButtonStyle(lines[selectedLineIndex ?? hoveredLineIndex]))"
    class="floating-button"
    @click.stop="showColorPicker = !showColorPicker"
  >
    🎨
  </button>

  <!-- Menú de configuración -->
<ConfigMenu
  v-if="selectedLineIndex !== null"
  :style="parseStyle(getMenuStyle(lines[selectedLineIndex]))"
  :editingLineId="selectedLineId"
  @update:modelValue="changeLineColor"
  @delete="(id) => emit('delete', id)"

/>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { defineProps, defineEmits } from 'vue'
import ConfigMenu from './Elements/ConfigLines.vue'


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
const selectedLineId = ref(null)

const hoveredLineIndex = ref(null)
const selectedLineIndex = ref(null)
const showColorPicker = ref(false)
const currentColor = ref('#000000')

const svgRef = ref(null)

const emit = defineEmits<{
  'update:modelValue': (color: string) => void;
  'delete': (id: string) => void;
}>();

function generateCurvePath({ x1, y1, x2, y2, cx1, cy1, cx2, cy2 }) {
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
}

function handleClickOutside(event) {
  if (!svgRef.value?.contains(event.target)) {
    selectedLineIndex.value = null
    showColorPicker.value = false
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

  return {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 20
  }
}
function getMenuStyle(line) {
  const t = 0.5
  const x = cubicBezier(t, line.x1, line.cx1, line.cx2, line.x2)
  const y = cubicBezier(t, line.y1, line.cy1, line.cy2, line.y2)

  return {
    position: 'absolute',
    left: `${x - 150}px`, // desplazamiento lateral
    top: `${y + 80}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    pointerEvents: 'auto',
    transformOrigin: 'left center',
    scale: 1.5
  }
}


function parseStyle(styleObject) {
  // Vue necesita style como objeto o string, este helper lo convierte a string
  return Object.entries(styleObject).map(([k, v]) => `${k}: ${v}`).join('; ')
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
    selectedLineId.value = null
    showColorPicker.value = false
  } else {
    selectedLineIndex.value = index
    selectedLineId.value = props.lines[index].id // guarda el id
    showColorPicker.value = false
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
.connections-lines path {
  pointer-events: auto;
}
.floating-button {
  color: white;
  background: #333;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 20px;
  z-index: 30;
  position: absolute;
}

</style>

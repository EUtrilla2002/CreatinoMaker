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
      :key="line.id || index"
      :d="generateCurvePath(line)"
      :stroke="selectedLineIndex === index ? 'blue' : (line.stroke || lineColor)"
      stroke-width="selectedLineIndex === index ? 3 : 2"
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
    @update:lineValue="updateLineProperty('stroke', $event)"
    @delete="deleteLine"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ConfigMenu from './Elements/ConfigLines.vue'
const lineColor = ref('black') // color inicial
const props = defineProps({
  lines: {
    type: Array,
    required: true,
    default: () => []
  },
  tempLine: {
    type: Object,
    default: null
  },
  connections: {  // Añadido para acceder a los IDs
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'delete', 'update:lineValue'])

const hoveredLineIndex = ref<number | null>(null)
const selectedLineIndex = ref<number | null>(null)
const selectedLineId = ref<string | null>(null)
const showColorPicker = ref(false)
const svgRef = ref<SVGSVGElement | null>(null)

function generateCurvePath({ x1, y1, x2, y2, cx1, cy1, cx2, cy2 }) {
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
}

function selectLine(index: number) {
  if (selectedLineIndex.value === index) {
    selectedLineIndex.value = null
    selectedLineId.value = null
    showColorPicker.value = false
  } else {
    selectedLineIndex.value = index
    // Usamos connections para obtener el ID completo
    selectedLineId.value = props.connections[index]?.id || null
    showColorPicker.value = false
  }
}
function updateLineProperty(prop: 'stroke' | 'strokeWidth', value: string | number) {
  const index = selectedLineIndex.value
  //console.log('Updating line property:', prop, 'with value:', value, 'at index:', index)
  console.log('Lines:', props.connections)
  if (index !== null && props.lines[index]) {
    (props.lines[index] as any)[prop] = value
    //console.log('Lines:', props.connections[index].id)
    emit('update:lineValue', {
      id: props.connections[index].id,
      property: prop,
      value
    })
  }
}


function deleteLine() {
  if (selectedLineIndex.value !== null && selectedLineId.value) {
    console.log('Deleting line with ID:', selectedLineId.value)
    emit('delete', selectedLineId.value)
    selectedLineIndex.value = null
    selectedLineId.value = null
  }
}

// Funciones de utilidad (mantenidas igual)
function handleClickOutside(event: MouseEvent) {
  if (!svgRef.value?.contains(event.target as Node) && selectedLineIndex.value == null) {
    selectedLineIndex.value = null
    selectedLineId.value = null
    showColorPicker.value = false
  }
}

function getButtonStyle(line: any) {
  const t = 0.5
  const x = cubicBezier(t, line.x1, line.cx1, line.cx2, line.x2)
  const y = cubicBezier(t, line.y1, line.cy1, line.cy2, line.y2)

  return {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: '20'
  }
}

function getMenuStyle(line: any) {
  const t = 0.5
  const x = cubicBezier(t, line.x1, line.cx1, line.cx2, line.x2)
  const y = cubicBezier(t, line.y1, line.cy1, line.cy2, line.y2)

  return {
    position: 'absolute',
    left: `${x - 150}px`,
    top: `${y + 80}px`,
    transform: 'translate(-50%, -50%)',
    zIndex: '10000',
    pointerEvents: 'auto',
    transformOrigin: 'left center',
    scale: '1.5'
  }
}

function parseStyle(styleObject: Record<string, string>) {
  return Object.entries(styleObject).map(([k, v]) => `${k}: ${v}`).join('; ')
}

function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const mt = 1 - t
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  )
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
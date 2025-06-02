<template>
  <div
    class="led-component"
    :id="id"
    :style="{ left: position.x + 'px', top: position.y + 'px'}"
    @mousedown="handleMouseDown"
    
    ref="ledRef"
  >
    <div :style="{ transform: `${flipped ? 'scaleX(-1)' : ''} rotate(${rotation}deg)` }">
        <wokwi-led :color="ledColor" :value="ledState ? false : '' "></wokwi-led>
        <svg
          width="50"
          height="50"
          style="position: absolute; top: 0; left: 0; pointer-events: none;"
        >
        <!-- <circle
          :cx="20"
          :cy="25"
          r="2"
          fill="lime"
          stroke="black"
          stroke-width="0.5"
        /> -->
                  <!-- Patita izquierda -->
          <rect
            x="12"
            y="40"
            width="5"
            height="5"
            fill="rgba(255, 0, 0, 0.3)"
            style="cursor: pointer; pointer-events: auto;"
            @click.stop="handlePinClick('left')"
            ref="leftPinRef"
          />
          <!-- Patita derecha -->
          <rect
            x="22"
            y="40"
            width="5"
            height="5"
            fill="rgba(255, 0, 0, 0.3)"
            style="cursor: pointer; pointer-events: auto;"
            @click.stop="handlePinClick('right')"
            ref="rightPinRef"
          />
          <!-- Botón Config -->
        <circle
            cx="40"
            cy="10"
            r="8"
            fill="transparent"
            style="cursor: pointer; pointer-events: auto;"
            ref="configButtonRef"
            @click="handleConfigClick"
          />
          <text
            x="40"
            y="14"
            text-anchor="middle"
            alignment-baseline="middle"
            font-size="12"
            fill="white"
            style="pointer-events: none;"
          >
            ⚙️
          </text>
        </svg>
      </div>
    <ConfigMenu
      v-if="showConfigMenu"
      :style="{
        position: 'absolute',
        left: configMenuPosition.x + 'px',
        top: configMenuPosition.y + 'px',
        zIndex: 1000,
      }"
      @update:modelValue="ledColor = $event"ç
      @flip="handleFlip"
      @rotate="handleRotate"
      @delete="emit('delete', id)"
    />
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, defineExpose } from 'vue'
import ConfigMenu from './ConfigMenu.vue'

const showConfigMenu = ref(false)
const configMenuPosition = ref({ x: 0, y: 0 })
const configButtonRef = ref<SVGCircleElement | null>(null)
const ledColor = ref('red') // color inicial

const rotation = ref(0)
const flipped = ref(false)
const leftPinRef = ref<SVGRectElement | null>(null)
const rightPinRef = ref<SVGRectElement | null>(null)
// Props
defineProps<{
  position: { x: number; y: number };
  ledState: boolean;
  id: string;
  selectedPin: string | null;
  connections: Array<{ pinName: string; ledPin: 'left' | 'right' }> | [];
}>();
function getPinCoords() {
  const left = leftPinRef.value?.getBoundingClientRect()
  const right = rightPinRef.value?.getBoundingClientRect()
  return {
    left,
    right
  }
}
defineExpose({ getPinCoords })

const emit = defineEmits<{
  (e: 'handleMouseDown', event: MouseEvent, id: string): void
  (e: 'handlePinClick', side: 'left' | 'right'): void
  (e: 'update:modelValue', color: string): void 
  (e: 'delete', id: string): void
  (e: 'updateState', state: { flipped: boolean; rotation: number }): void
}>()
function handleFlip() {
  flipped.value = !flipped.value
  emit('updateState', { flipped: flipped.value, rotation: rotation.value })
}
function handleRotate() {
  rotation.value = (rotation.value + 90) % 360
  emit('updateState', { flipped: flipped.value, rotation: rotation.value })
}

function handleMouseDown(e: MouseEvent) {
  emit('handleMouseDown', e, 'led')
}
function handlePinClick(side: 'left' | 'right') {
  console.log(`Pin ${side} clicked`)
  emit('handlePinClick',side)
}
function handleConfigClick(event: MouseEvent) {
  event.stopPropagation()
  showConfigMenu.value = !showConfigMenu.value

  if (showConfigMenu.value && configButtonRef.value) {
    const buttonRect = configButtonRef.value.getBoundingClientRect()
    const containerRect = (configButtonRef.value.closest('.led-component') as HTMLElement).getBoundingClientRect()

    // Posición relativa al contenedor del LED
    configMenuPosition.value = {
      x: buttonRect.left - containerRect.left + buttonRect.width + 4,
      y: buttonRect.top - containerRect.top,
    }

    console.log('Relative config menu position:', configMenuPosition.value)
  }
}

</script>

  <style scoped>
  .led-component {
    position: absolute;
    cursor: pointer;
  }
  </style>
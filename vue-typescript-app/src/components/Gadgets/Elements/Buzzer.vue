<template>
  <div
    class="buzzer-component"
    :id="id"
    :style="{ left: position.x + 'px', top: position.y + 'px', width: '20px', height: '20px' }"
    @mousedown="handleMouseDown"
    ref="buzzerRef"
  >
    <div :style="{ transform: `${flipped ? 'scaleX(-1)' : ''} rotate(${rotation}deg)` }">
      <wokwi-buzzer
        :color="buzzerColor"
        :signal="isSignal ? false : ''"
        style="width:8px;height:8px;"
      ></wokwi-buzzer>
      <svg
        width="90"
        height="130"
        style="position: absolute; top: -30px; left: -15px; pointer-events: none;"
      >
        <!-- Patita abajo izq -->
        <rect
          x="43"
          y="115"
          width="8"
          height="8"
          fill="rgba(225, 0, 0, 0.3)"
          style="cursor: pointer; pointer-events: auto;"
          @click.stop="handlePinClick('downleft')"
          ref="DownLeftPinRef"
        />
        <!-- Patita abajo drcha -->
        <rect
          x="53"
          y="115"
          width="8"
          height="8"
          fill="rgba(255, 0, 0, 0.3)"
          style="cursor: pointer; pointer-events: auto;"
          @click.stop="handlePinClick('downright')"
          ref="DownRightPinRef"
        />
        <!-- Botón Config -->
        <circle
          cx="25"
          cy="30"
          r="10"
          fill="transparent"
          style="cursor: pointer; pointer-events: auto;"
          ref="configButtonRef"
          @click="handleConfigClick"
        />
        <text
          x="25"
          y="30"
          text-anchor="middle"
          alignment-baseline="middle"
          font-size="15"
          fill="white"
          style="pointer-events: none;"
        >
          ⚙️
        </text>
      </svg>
    </div>
  </div>

  <Teleport to="#overlay-container" v-if="showConfigMenu">
    <ConfigMenu
      :style="{
      position: 'absolute',
      left: (configMenuPosition.x + 40) + 'px',
      top: configMenuPosition.y + 'px',
      zIndex: 10000,
      pointerEvents: 'auto',
      transform: 'scale(1.1)'
    }"
      @update:modelValue="handleColor"
      @flip="handleFlip"
      @rotate="handleRotate"
      @delete="emit('delete', id)"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, defineExpose, nextTick, watch } from 'vue'
import ConfigMenu from './ConfigMenu.vue'

const showConfigMenu = ref(false)
const configMenuPosition = ref({ x: 10, y: 10 })
const configButtonRef = ref<SVGCircleElement | null>(null)
const buzzerRef = ref<HTMLElement | null>(null)
const isSignal = ref(false)

const props = defineProps<{
  position: { x: number; y: number };
  pressed: boolean;
  id: string;
  selectedPin: string | null;
  connections: Array<{ pinName: string; buzzerPin: 'upleft' | 'upright' | 'downright' | 'downleft' }> | [];
  buzzerColor: string;
  flipped: boolean;
  rotation: number
}>()

const buzzerColor = ref(props.buzzerColor || 'red')
const rotation = ref(props.rotation || 0)
const flipped = ref(props.flipped || false)
const UpRightPinRef = ref<SVGRectElement | null>(null)
const UpLeftPinRef= ref<SVGRectElement | null>(null)
const DownRightPinRef = ref<SVGRectElement | null>(null)
const DownLeftPinRef= ref<SVGRectElement | null>(null)

watch(() => props.rotation, (newStatus) => {
  rotation.value = newStatus
})
watch(() => props.flipped, (newStatus) => {
  flipped.value = newStatus
})
watch(() => props.buzzerColor, (newColor) => {
  buzzerColor.value = newColor
})

function getPinCoords() {
  const upleft = UpLeftPinRef.value?.getBoundingClientRect()
  const upright = UpRightPinRef.value?.getBoundingClientRect()
  const downleft = DownLeftPinRef.value?.getBoundingClientRect()
  const downright = DownRightPinRef.value?.getBoundingClientRect()
  return { upleft, upright, downleft, downright }
}
defineExpose({ getPinCoords })

const emit = defineEmits<{
  (e: 'handleMouseDown', event: MouseEvent, id: string): void
  (e: 'handlePinClick', side: 'upleft' | 'downleft' | 'upright' | 'downright'): void
  (e: 'update:modelValue', color: string): void
  (e: 'delete', id: string): void
  (e: 'updateState', state: { flipped: boolean; rotation: number, color: string }): void
}>()
function handleFlip() {
  flipped.value = !flipped.value
  emit('updateState', { flipped: flipped.value, rotation: rotation.value, color: buzzerColor.value })
}
function handleColor(color) {
  buzzerColor.value = color
  emit('updateState', { flipped: flipped.value, rotation: rotation.value, color: buzzerColor.value })
}
function handleRotate() {
  rotation.value = (rotation.value + 90) % 360
  emit('updateState', { flipped: flipped.value, rotation: rotation.value, color: buzzerColor.value })
}
function handleMouseDown(e: MouseEvent) {
  emit('handleMouseDown', e, 'buzzer')
}
function handlePinClick(side: 'upleft' | 'downleft' | 'upright' | 'downright') {
  console.log('Pin clicked:', side)
  emit('handlePinClick', side)
}
function handleConfigClick(event: MouseEvent) {
  event.stopPropagation()
  showConfigMenu.value = !showConfigMenu.value
  if (showConfigMenu.value) {
    nextTick(() => {
      if (configButtonRef.value) {
        const rect = configButtonRef.value.getBoundingClientRect()
        configMenuPosition.value = {
          x: rect.left + 40,
          y: rect.top
        }
      }
    })
  }
}

function onBuzzerPress(event) {
  isSignal.value = true
}

function onBuzzerRelease(event) {
  isSignal.value = false
}
</script>

<style scoped>
.buzzer-component {
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 20px;
}
</style>
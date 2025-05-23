<template>
  <div
    class="led-component"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="handleMouseDown"
    ref="ledRef"
  >
    <wokwi-led color="red" :value="ledState ? false : ''"></wokwi-led>
    <svg
      width="50"
      height="50"
      style="position: absolute; top: 0; left: 0; pointer-events: none;"
    >
      <!-- Patita izquierda -->
      <rect
        x="12"
        y="40"
        width="5"
        height="5"
        fill="rgba(255, 0, 0, 0.3)"
        style="cursor: pointer; pointer-events: auto;"
        @click.stop="handlePinClick('left')"
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
      />
    </svg>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Props
const props = defineProps<{
  position: { x: number; y: number }
  ledState: boolean
}>()

const emit = defineEmits<{
  (e: 'handleMouseDown', event: MouseEvent, id: string): void
}>()

function handleMouseDown(e: MouseEvent) {
  emit('handleMouseDown', e, 'led')
}
</script>
  
  <!-- <script>
  export default {
    props: {
      id: {
        type: String,
        required: true,
      },
      position: {
        type: Object,
        required: true,
      },
      handleMouseDown: {
        type: Function,
        required: true,
      },
      ledState: {
        type: Boolean,
        default: false,
      },
      selectedPin: {
        type: String,
        default: null,
      },
      setConnections: {
        type: Function,
        required: true,
      },
      setSelectedPin: {
        type: Function,
        required: true,
      },
    },
    methods: {
      handleClick(event) {
        event.stopPropagation();
        if (!this.selectedPin) {
          this.setSelectedPin(this.id);
        }
      },
      handlePinClick(side) {
        if (this.selectedPin) {
          this.setConnections((conns) => [
            ...conns,
            { pinName: this.selectedPin, ledPin: side },
          ]);
          this.setSelectedPin(null);
        } else {
          alert("Primero selecciona un pin en la placa");
        }
      },
    },
    mounted() {
      this.$el.addEventListener('click', this.handleClick);
    },
    beforeDestroy() {
      this.$el.removeEventListener('click', this.handleClick);
    },
  };
  </script> -->
  
  <style scoped>
  .led-component {
    position: absolute;
    cursor: pointer;
  }
  </style>
<template>
  <Teleport to="body">
    <!-- Fondo semitransparente -->
    <div class="overlay" @click.self="$emit('close')"></div>

    <!-- Popup anclado -->
    <div
      class="color-popup"
      :style="{ top: position.y + 'px', left: position.x + 'px',  width: width + 'px'  }"
    >
      <div class="popup-arrow"></div>

      <div class="popup-content">
        <!-- Color Picker -->
        <div class="picker-wrapper">
          <ColorPicker
            v-model:pureColor="color"
            format="hex"
            pickerType="chrome"
            :disableAlpha="false"
            :showHistory="true"
            class="colorpicker"
            :style="{
              transform: 'scale(2)',
              transformOrigin: 'top left'
            }"
            inline
          />
        </div>

        <div class="mt-3 text-white text-sm">
          Color seleccionado: <span :style="{ color }">{{ color }}</span>
        </div>
        <button
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
          @click="$emit('update:modelValue', color)"
        >
          Aplicar Color
        </button>
        <button
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
          @click="$emit('close')"
        >
          Cerrar
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'

const props = defineProps<{
  modelValue: string
  position: { x: number; y: number }
  width: number
}>()

const emit = defineEmits(['update:modelValue', 'close'])

const color = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 40;
}

.color-popup {
  position: fixed;
  z-index: 50;
  transform: translateY(10px);
}

.popup-arrow {
  position: absolute;
  top: -10px;
  left: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #3d3d3d;
}

.popup-content {
  background: #2d2d2d;
  border-radius: 1rem;
  border: 1px solid #555;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  padding: 1.5rem;
  width: 100%;         /* 🔹 Usa todo el ancho disponible */
  box-sizing: border-box;
}

.colorpicker {
  width: 100%;
}

.picker-wrapper {
  overflow: visible;
}
</style>

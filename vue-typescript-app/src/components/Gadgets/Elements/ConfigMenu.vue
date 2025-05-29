<template>
  <div class="w-80 bg-gray-900 text-white rounded shadow-lg p-4 relative">
    <div v-for="category in filteredCategories" :key="category.name" class="mb-4">
      <div class="font-bold text-lg mb-1">{{ category.name }}</div>
      <div class="border-b border-gray-600 mb-2"></div>
      <div class="flex flex-col gap-1">
        <button
          v-for="item in category.items"
          :key="item.label"
          :ref="item.label === 'Color' ? setColorButtonRef : null"
          class="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer w-full text-left bg-transparent border-0 focus:outline-none"
          :class="{ 'bg-gray-700': selectedItem === item.label }"
          type="button"
          @click="onItemClick(item.label)"
        >
          <fa-icon :icon="item.icon" class="mr-2" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- Popup anclado a la posición del botón -->
    <ColorPickerPopup
      v-if="selectedItem === 'Color'"
      :modelValue="selectedColor"
      :position="popupPosition"
      @update:modelValue="selectedColor = $event"
      @close="selectedItem = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ColorPickerPopup from './ColorPickerPopup.vue'

const selectedItem = ref<string | null>(null)
const selectedColor = ref('#000000')
const popupPosition = ref({ x: 0, y: 0 })


const categories = ref([
  {
    name: 'Settings',
    items: [
      { label: 'Color', icon: 'palette' },
      { label: 'Flip', icon: 'rotate' },
      { label: 'Delete', icon: 'trash' },
    ],
  },
])

const filteredCategories = computed(() => categories.value)

const colorButtonRef = ref<HTMLElement | null>(null)

const setColorButtonRef = (el: HTMLElement | null) => {
  if (el) colorButtonRef.value = el
}

const onItemClick = async (label: string) => {
  if (label === 'Color') {
    await nextTick()
    const buttonEl = colorButtonRef.value
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect()
      popupPosition.value = {
        x: rect.right + 10,
        y: rect.top,
      }
    }
  }
  selectedItem.value = selectedItem.value === label ? null : label
}
</script>


<style scoped>
.w-80 {
  width: 240px !important;
  min-height: 150px;
  background: #2d2d2d !important;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  font-size: 0.8rem;
}

.bg-gray-900 {
  background: #2d2d2d !important;
}

.category-title {
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.25rem 1rem;
}

.category-divider {
  border-bottom: 1px solid #444;
  margin: 0 1rem 0.5rem 1rem;
}

button.bg-gray-700 {
  background-color: #444 !important;
}

button:hover {
  background-color: #555 !important;
}

.flex {
  display: flex;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.ml-4 {
  margin-left: 1rem;
}

.p-4 {
  padding: 1rem;
}

.w-60 {
  width: 15rem;
}
</style>

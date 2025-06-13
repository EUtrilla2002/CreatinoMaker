<template>
  <div ref="menuRef" class="menu-panel" style="z-index: 1000;">
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
      :width="menuWidth"
      @update:modelValue="onColorChange"
      @close="selectedItem = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick ,onMounted, } from 'vue'
import ColorPickerPopup from './ColorPickerPopup.vue'
const menuRef = ref<HTMLElement | null>(null)
const menuWidth = ref(0)

const selectedItem = ref<string | null>(null)
const selectedColor = ref('#000000')
const popupPosition = ref({ x: 0, y: 0 })
const emit = defineEmits(['update:modelValue', 'flip', 'rotate','delete']) 

const categories = ref([
  {
    name: 'Settings',
    items: [
      { label: 'Color', icon: 'palette' },
      { label: 'Flip', icon: 'right-left' },
      { label: 'Rotate', icon: 'rotate' },
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
  if (label === 'Flip') {
    // Y si no fuera solo con un botón, sino con un evento? EJ: Ctrl + Flechita
    console.log('Flip action triggered')
    emit('flip') 
    return
  }
  if (label === 'Rotate') {
    emit('rotate') // emite el evento rotate
    return
  }
  if (label === 'Delete') { 
    emit('delete'); 
    return 
  }
  selectedItem.value = selectedItem.value === label ? null : label
}
const onColorChange = (color: string) => {
  selectedColor.value = color
  emit('update:modelValue', color) // <--- propaga el evento hacia LED.vue
}

onMounted(() => {
  nextTick(() => {
    if (menuRef.value) {
      const rect = menuRef.value.getBoundingClientRect()
      menuWidth.value = rect.width
      popupPosition.value = { x: rect.left, y: rect.bottom }
    }
  })
})
</script>


<style scoped>
.w-80 {
  width: 240px !important;
  min-height: 150px;
  background: #fff !important;                /* Bootstrap bg-white */
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10); /* Más suave para claro */
  padding: 1rem;
  font-size: 0.95rem;
  z-index: 1000000;
  color: #212529;                             /* Bootstrap text-dark */
  border: 1px solid #dee2e6;                  /* Bootstrap border */
}

.bg-gray-900 {
  background: #fff !important;
}

.category-title {
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem 0.25rem 1rem;
  color: #212529;
}

.category-divider {
  border-bottom: 1px solid #dee2e6;           /* Bootstrap border */
  margin: 0 1rem 0.5rem 1rem;
}

button.bg-gray-700 {
  background-color: #e2e6ea !important;       /* Bootstrap hover */
}

button {
  background: #f8f9fa !important;             /* Bootstrap bg-light */
  color: #212529 !important;                  /* Bootstrap text-dark */
  border: 1px solid #ced4da !important;       /* Bootstrap border */
  border-radius: 0.375rem;
  margin-bottom: 0.3rem;
  width: 100%;
  text-align: left;
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}

button:hover {
  background-color: #e2e6ea !important;       /* Bootstrap hover */
  color: #212529 !important;
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

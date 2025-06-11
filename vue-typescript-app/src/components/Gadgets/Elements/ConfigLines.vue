<template>
  <div ref="menuRef" class="w-56 bg-gray-900 text-white rounded shadow-lg p-2 relative" style="z-index: 1000;">
    <div
      v-for="category in filteredCategories"
      :key="category.name"
      class="mb-2"
    >
      <div class="font-bold text-md mb-1">{{ category.name }}</div>
      <div class="border-b border-gray-600 mb-2"></div>
      <div class="flex flex-row flex-wrap gap-1">
        <button
          v-for="item in category.items"
          :key="item.label"
          :ref="item.label === 'Color' ? setColorButtonRef : null"
          class="flex items-center px-2 py-1 hover:bg-gray-800 cursor-pointer text-left bg-transparent border-0 focus:outline-none rounded text-sm"
          :class="{ 'bg-gray-700': selectedItem === item.label }"
          type="button"
          @click="onItemClick(item.label)"
        >
          <fa-icon :icon="item.icon" class="mr-1" />
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
      @update:lineValue="onColorChange"
      @close="selectedItem = null"
    />

  </div>
</template>


<script setup lang="ts">
import { ref, computed, nextTick ,onMounted, } from 'vue'
import ColorPickerPopup from './ColorSelection.vue'

const menuRef = ref<HTMLElement | null>(null)
const menuWidth = ref(0)

const selectedItem = ref<string | null>(null)
const selectedColor = ref('#000000')
const popupPosition = ref({ x: 0, y: 0 })
const emit = defineEmits(['update:lineValue','delete']) 

const categories = ref([
  {
    name: 'Settings',
    items: [
      { label: 'Color', icon: 'palette' },
      { label: 'Delete', icon: 'trash' },
    ],
  },
])
const props = defineProps({
  editingLineId: {
    type: [String, Number],
    required: true,
  },
  // otros props...
})

const filteredCategories = computed(() => categories.value)

const colorButtonRef = ref<HTMLElement | null>(null)

const setColorButtonRef = (el: HTMLElement | null) => {
  if (el) colorButtonRef.value = el
}


const onItemClick = async (label: string) => {
  // Solo una vez, para alternar el estado
  selectedItem.value = selectedItem.value === label ? null : label
  
  console.log('Item clicked:', label)

  if (label === 'Color' && selectedItem.value === 'Color') {
    await nextTick()
    const buttonEl = colorButtonRef.value
    console.log('Color selectedItem value:', selectedItem.value)
    console.log('selectedItem === "Color"?', selectedItem.value === 'Color')
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect()
      popupPosition.value = {
        x: rect.right -150,
        y: rect.top +80,
      }
      console.log('Popup position set to:', popupPosition.value)
    }
  }

  if (label === 'Delete') {
    console.log('Delete action triggered in', props.editingLineId)
    emit('delete', props.editingLineId)
    return
  }
}
const onColorChange = (color: string) => {
  selectedColor.value = color
  console.log('Update:',color)
  emit('update:lineValue', color) 
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
  background: #2d2d2d !important;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  padding: 1rem;
  font-size: 0.8rem;
  z-index: 1000000;
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

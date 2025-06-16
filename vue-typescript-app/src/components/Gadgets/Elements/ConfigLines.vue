<template>
    <div class="menu-panel bg-white border rounded-3 shadow-sm p-3" :class="{ 'bg-dark text-light': isDark }" style="width:220px;max-height:300px;overflow-y:auto;">
    <div v-for="category in filteredCategories" :key="category.name" class="mb-2">
      <div class="d-flex align-items-center justify-content-between mb-1">
        <span class="fw-bold fs-6">{{ category.name }}</span>
        <button class="btn btn-sm p-0 border-0 bg-transparent ms-2" @click="$emit('close')">&times;</button>
      </div>
      <hr class="my-2" />
      <div class="d-flex flex-row gap-2 align-items-center">
        <button
          v-for="item in category.items"
          :key="item.label"
          :ref="item.label === 'Color' ? setColorButtonRef : null"
          class="btn btn-light d-flex align-items-center me-2 mb-1"
          :class="{ active: selectedItem === item.label }"
          type="button"
          @click="onItemClick(item.label)"
        >
          <fa-icon :icon="item.icon" class="me-2" />
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
import { ref, computed, nextTick, onMounted , onBeforeUnmount} from 'vue'
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
})

const filteredCategories = computed(() => categories.value)

const colorButtonRef = ref<HTMLElement | null>(null)
const setColorButtonRef = (el: HTMLElement | null) => {
  if (el) colorButtonRef.value = el
}

const onItemClick = async (label: string) => {
  selectedItem.value = selectedItem.value === label ? null : label
  if (label === 'Color' && selectedItem.value === 'Color') {
    await nextTick()
    const buttonEl = colorButtonRef.value
    if (buttonEl) {
      const rect = buttonEl.getBoundingClientRect()
      popupPosition.value = {
        x: rect.right - 150,
        y: rect.top + 80,
      }
    }
  }
  if (label === 'Delete') {
    emit('delete', props.editingLineId)
    return
  }
}
const onColorChange = (color: string) => {
  selectedColor.value = color
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

// Detecta modo oscuro por clase en body o app
const isDark = ref(document.body.classList.contains('dark-mode') || document.querySelector('#app-main')?.classList.contains('dark-mode'))

function updateDarkMode() {
  isDark.value = document.body.classList.contains('dark-mode') || document.querySelector('#app-main')?.classList.contains('dark-mode')
}

onMounted(() => {
  const observer = new MutationObserver(updateDarkMode)
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  const appMain = document.querySelector('#app-main')
  if (appMain) {
    observer.observe(appMain, { attributes: true, attributeFilter: ['class'] })
  }
  // Limpieza
  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style scoped>
.menu-panel {
  width: 240px !important;
  min-height: 150px;
  background: #fff !important;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
  padding: 1rem;
  font-size: 1rem;
  z-index: 1000000;
  color: #212529;
  border: 1px solid #dee2e6;
}
/* .menu-panel .btn-light {
  background: #f8f9fa !important;
  color: #212529 !important;
  border: 1px solid #ced4da !important;
  font-size: 1rem !important;
  border-radius: 0.375rem;
  transition: background 0.2s, color 0.2s;
  padding: 0.4rem 0.6rem;
}
.menu-panel .btn-light.active,
.menu-panel .btn-light:active {
  background-color: #e2e6ea !important;
  color: #212529 !important;
}
.menu-panel .btn-outline-secondary {
  padding: 0 6px;
  font-size: 0.9rem;
  line-height: 1;
} */
</style>

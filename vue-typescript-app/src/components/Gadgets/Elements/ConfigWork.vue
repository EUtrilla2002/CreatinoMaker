<template>
  <div class="menu-panel bg-white border rounded-3 shadow-sm p-3" :class="{ 'bg-dark text-light': isDark }" style="width:220px;max-height:300px;overflow-y:auto;">
    <!-- Component List -->
    <div v-for="category in filteredCategories" :key="category.name" class="mb-3">
      <div class="fw-bold fs-6 mb-1">{{ category.name }}</div>
      <hr class="my-2" />
      <div class="d-flex flex-column gap-1">
      <button
        v-for="item in category.items"
        :key="item.label"
        class="btn btn-primary text-start d-flex align-items-center mb-1"
        @click="handleFile(item.label)"
        type="button"
      >
          <fa-icon :icon="item.icon" class="me-2" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
    <div class="d-flex align-items-center px-2 py-2 rounded-2" :class="{ 'bg-secondary bg-opacity-10': isDark }">
      <fa-icon icon="moon" class="me-2" />
      <span class="me-2">Dark Mode</span>
      <div class="form-check form-switch ms-auto">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          v-model="darkMode"
          @change="handleFile('DarkMode')"
          id="darkModeSwitch"
        >
        <label class="form-check-label" for="darkModeSwitch"></label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['work-action']);

function handleFile(label) {
  switch(label) {
    case 'Undo':
      emit('work-action', 'undo')
      break;
    case 'Redo':
      emit('work-action', 'redo')
      break;
    case 'Zoom-In':
      emit('work-action', 'zoomin')
      break;
    case 'Zoom-Out':
      emit('work-action', 'zoomout')
      break;
    case 'Clean All':
      emit('work-action', 'clean')
      break;
    case 'Info':
      emit('work-action', 'info')
      break;
    case 'DarkMode':
      emit('work-action', 'dark')
      break;         
  }
}

const search = ref('')
const darkMode = ref(false)

const categories = ref([
  {
    name: 'File',
    items: [
      { label: 'Undo', icon: 'rotate-left'  },
      { label: 'Redo', icon: 'rotate-right' },
    ],
  },
  {
    name: 'View',
    items: [
      { label: 'Zoom-In', icon: 'magnifying-glass-plus'  },
      { label: 'Zoom-Out', icon: 'magnifying-glass-minus' },
    ],
  },
  {
    name: 'Other',
    items: [
      { label: 'Clean All', icon: 'trash'  },
      { label: 'Info', icon: 'info' },
    ],
  },
])

const filteredCategories = computed(() => {
  if (!search.value) return categories.value
  return categories.value.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.label.toLowerCase().includes(search.value.toLowerCase())),
  })).filter(cat => cat.items.length > 0)
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

<style>
.menu-panel .btn-primary {
  background-color: #0d6efd !important;
  color: #fff !important;
  border-color: #0d6efd !important;
}
.menu-panel .btn-primary:hover,
.menu-panel .btn-primary:focus {
  background-color: #0b5ed7 !important;
  border-color: #0a58ca !important;
  color: #fff !important;
}
</style>

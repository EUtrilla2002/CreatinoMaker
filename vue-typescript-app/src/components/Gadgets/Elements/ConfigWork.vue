<template>
  <div class="w-80 bg-gray-900 text-white rounded shadow-lg">
    <!-- Component List -->
    <div v-for="category in filteredCategories" :key="category.name" class="category-block">
      <div class="category-title">{{ category.name }}</div>
      <div class="category-divider"></div>
      <div class="flex flex-col">
        <button
          v-for="item in category.items"
          :key="item.label"
          class="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer w-full text-left bg-transparent border-0 focus:outline-none"
          type="button"
          @click="handleFile(item.label)"
        >
          <fa-icon :icon="item.icon" class="icon-separated" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['work-action']);


function handleFile(label) {
  console.log(`Action: ${label}`)
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
  }
}


const search = ref('')

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
</script>
<style scoped>
.w-80 {
  width: 220px !important;
  max-height: 300px;
  overflow-y: auto;
  background: #2d2d2d !important;
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  font-size: 1 rem;
}

.bg-gray-900 {
  background: #2d2d2d !important;
}
.icon-separated {
  margin-right: 1rem; /* Aumenta separación entre icono y texto */
  min-width: 1.25rem; /* Opcional: asegura espacio fijo para alinear */
  text-align: center;
}

button {
  font-size: 1rem !important;
  padding: 0.4rem 0.6rem;
  border: none;
  background: #444;
  text-align: left;
  color: white;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
}

button:hover {
  background-color: #1d1b1b;
}

button.bg-gray-700 {
  background-color: #555 !important;
}

.fa-icon {
  margin-right: 0.5rem;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #64676c;
  border-radius: 2px;
}
</style>

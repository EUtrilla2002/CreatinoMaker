<template>
  <div class="menu-panel">
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
    <div class="flex items-center px-4 py-2 darkmode-switch-row">
      <fa-icon icon="moon" class="icon-separated" />
      <span class="mr-2">Dark Mode</span>
      <label class="switch slider-sep">
        <input type="checkbox" v-model="darkMode" @click="handleFile('DarkMode')" />
        <span class="slider"></span>
      </label>
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
</script>
<style scoped>
.w-80 {
  width: 220px !important;
  max-height: 300px;
  overflow-y: auto;
  background: #fff !important;           /* Bootstrap bg-white */
  border-radius: 0.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  font-size: 1rem;
  color: #212529;                        /* Bootstrap text-dark */
  border: 1px solid #dee2e6;             /* Bootstrap border */
}

.bg-gray-900 {
  background: #fff !important;
}

button {
  font-size: 1rem !important;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ced4da;             /* Bootstrap border */
  background: #f8f9fa;                   /* Bootstrap bg-light */
  text-align: left;
  color: #212529;                        /* Bootstrap text-dark */
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
  margin-bottom: 0.3rem;
  transition: background 0.2s, color 0.2s;
}

button:hover {
  background-color: #e2e6ea;             /* Bootstrap hover */
  color: #212529;
}

.fa-icon {
  margin-right: 0.5rem;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

/* Switch slider styles */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #adb5bd;             /* Bootstrap secondary */
  transition: .4s;
  border-radius: 20px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.slider-sep {
  margin-left: 1rem;
}
.switch input:checked + .slider {
  background-color: #007bff;             /* Bootstrap primary */
}
.switch input:checked + .slider:before {
  transform: translateX(18px);
}
.moon-icon {
  font-size: 1.2rem;
  margin-right: 1rem;
}
.darkmode-switch-row {
  margin-top: 0.3rem;
  margin-right: 3rem;
  border-radius: 0.375rem;
}
.icon-separated {
  margin-right: 1rem;
  min-width: 1.25rem;
  text-align: center;
}
</style>

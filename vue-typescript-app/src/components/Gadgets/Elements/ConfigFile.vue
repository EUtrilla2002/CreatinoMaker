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

const emit = defineEmits(['add-gadget']);


function handleFile(label) {
  console.log(`Adding component: ${label}`)
  switch(label) {
    case 'Save':
      emit('file-action', 'save')
      break;
    case 'Button':
      emit('add-gadget', 'Pushbutton')
      break;
    case 'Servo':
      emit('add-gadget', 'Servo')
      break;
    // case 'RGB LED':
    //   emit('add-gadget', 'RGB LED')
    //   break;
    // case 'SSD1306 OLED display':
    //   emit('add-gadget', 'SSD1306 OLED display')
    //   break;
  }
}


const search = ref('')

const categories = ref([
  {
    name: 'File',
    items: [
      { label: 'Upload', icon: 'upload'  },
      { label: 'Save', icon: 'download' },
      { label: 'Examples', icon: 'infinity' },
    ],
  },
  // {
  //   name: 'Display',
  //   items: [
  //     { label: 'RGB LED', icon: '/icons/rgbled.png' },
  //     { label: 'SSD1306 OLED display', icon: '/icons/oled.png' },
  //   ],
  // },
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
  background: transparent;
  text-align: left;
  color: white;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.375rem;
}

button:hover {
  background-color: #444;
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

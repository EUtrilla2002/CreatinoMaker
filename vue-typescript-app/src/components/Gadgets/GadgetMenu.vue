<template>
  <div class="w-80 bg-gray-900 text-white rounded shadow-lg">
    <!-- Search Bar -->
    <div class="p-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="w-full p-2 bg-gray-800 text-white rounded focus:outline-none"
      />
    </div>

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
          @click="addComponent(item.label)"
        >
          <img :src="item.icon" alt="" class="w-5 h-5 mr-3" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['add-gadget'])

function addComponent(label) {
  console.log(`Adding component: ${label}`)
  switch(label) {
    case 'LED':
      emit('add-gadget', 'LED')
      break;
    case 'Pushbutton':
      emit('add-gadget', 'Pushbutton')
      break;
    case 'Pushbutton 6mm':
      emit('add-gadget', 'Pushbutton 6mm')
      break;
    case 'Resistor':
      emit('add-gadget', 'Resistor')
      break;
    case 'RGB LED':
      emit('add-gadget', 'RGB LED')
      break;
    case 'SSD1306 OLED display':
      emit('add-gadget', 'SSD1306 OLED display')
      break;
  }
}


const search = ref('')

const categories = ref([
  {
    name: 'Basic',
    items: [
      { label: 'LED', icon: '/icons/led.svg'  },
      { label: 'Pushbutton', icon: '/icons/pushbutton.png' },
      { label: 'Pushbutton 6mm', icon: '/icons/pushbutton6mm.png' },
      { label: 'Resistor', icon: '/icons/resistor.png' },
    ],
  },
  {
    name: 'Display',
    items: [
      { label: 'RGB LED', icon: '/icons/rgbled.png' },
      { label: 'SSD1306 OLED display', icon: '/icons/oled.png' },
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
  width: 520px !important;
  min-height: 600px;
  background: #2d2d2d !important;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  padding-bottom: 2.5rem;
  font-size: 1.25rem;
}

.bg-gray-900 {
  background: #2d2d2d !important;
}

.p-2 input[type="text"] {
  height: 2rem;
  width: 80%;
  font-size: 1.3rem;
  margin-top: 1rem;
  padding: 1rem !important;
}

.category-title {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
}

.category-divider {
  border-bottom: 2px solid #444;
  margin: 0 1.5rem 0.5rem 1.5rem;
}

.px-4, .py-2, .font-bold, .text-sm, .uppercase, .text-gray-400,
.flex, .items-center, .hover\:bg-gray-800, .cursor-pointer {
  font-size: 1.5rem !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #64676c;
  border-radius: 3px;
}
.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Espacio entre botones, opcional */
}
</style>
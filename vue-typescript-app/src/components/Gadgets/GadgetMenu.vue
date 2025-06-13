<template>
  <div class="menu-panel">
    <!-- Search Bar -->
    <div class="p-2">
    <input
      v-model="search"
      type="text"
      placeholder="Search..."
      class="w-full p-2 rounded focus:outline-none"
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
          @click="handleAddGadget(item.label)"
        >
          <img :src="item.icon" alt="" class="w-5 h-5 mr-3" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits(['add-gadget']);


function handleAddGadget(label) {
  console.log(`Adding component: ${label}`)
  switch(label) {
    case 'LED':
      emit('add-gadget', 'LED')
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
    name: 'Basic',
    items: [
      { label: 'LED', icon: '/icons/led.svg'  },
      { label: 'Button', icon: '/icons/pushbutton.png' },
      { label: 'Servo', icon: '/icons/pushbutton6mm.png' },
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
.menu-panel {
  width: 340px !important;
  max-height: 500px;
  overflow-y: auto;
  background: #fff !important;                /* Bootstrap bg-white */
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding-bottom: 2.5rem;
  font-size: 1.1rem;
  color: #212529;                             /* Bootstrap text-dark */
  border: 1px solid #dee2e6;                  /* Bootstrap border */
}

.p-2 input[type="text"] {
  height: 1.6rem;           /* más bajo */
  width: 90%;               /* más angosto */
  font-size: 0.95rem;       /* texto más pequeño */
  margin-top: 0.5rem;       /* menos espacio arriba */
  padding: 0.4rem !important; /* menos padding */
  background: #f8f9fa;
  color: #212529;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}

.category-divider {
  border-bottom: 1px solid #dee2e6;
  margin: 0 1.5rem 0.5rem 1.5rem;
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
  background-color: #e2e6ea !important;       /* Bootstrap hover */
  color: #212529 !important;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.w-5, .h-5 {
  width: 1.25rem !important;
  height: 1.25rem !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}
</style>
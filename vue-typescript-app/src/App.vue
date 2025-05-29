<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, computed } from 'vue'
import BoardElement from './components/BoardElements/BoardElement.vue';
import * as Emulator from "@aloeminium108/risc-v-emulator";
const { Assembler, CPU } = Emulator.default;
import hookMap from './components/BoardElements/emulator.js';
import boardData from './components/BoardElements/esp32c3.json';
import ConnectionsLines from './components/Gadgets/Lines.vue';
import Menu from './components/Gadgets/GadgetMenu.vue';
import LEDComponent from './components/Gadgets/Elements/LED.vue';

const workspaceRef = ref<HTMLDivElement | null>(null);


const compState = ref(true);
const positions = ref<{ id: string, position: { x: number, y: number }, compState: boolean }[]>([
  {
    id: 'board',
    position: { x: 300, y: 100 },
    compState: true
  }
]);
// Dibujo de líneas
const tempLine = ref<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
const connections = ref<Array<{
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  fromPinId: string,
  toPinId: string
}>>([]);


const asmCode = ref([
      "addi a0, a0, 5",
      "addi a1, a1, 1",
      "jal ra, 0x100",
      "addi a0, a0, -5",
      "addi a0, a0, 1000",
      "jal ra, 0x104",
      "addi a0, a0, -1000",
      "addi a0, a0, 5",
      "addi a1, a1, -1",
      "addi a1, a1, 0",
      "jal ra, 0x100",
      "addi t1, t1, 2",
    ]);
const draggingId = ref<string | null>(null)
const offset = reactive({ x: 0, y: 0 })
const svgRef = ref<SVGSVGElement | null>(null)
const selectedPin = ref<string | null>(null)

const SCALE = 2; // Usa el mismo valor que en el CSS

function handleMouseDown(e: MouseEvent, id: string) {
  draggingId.value = id
  const element = positions.value.find(item => item.id === id);
  
  if (!element) return;

  if (draggingId.value?.startsWith("led-")) {
    offset.x = (e.clientX - element.position.x * SCALE)
    offset.y = (e.clientY - element.position.y * SCALE)
  } else {
    console.log("Elemento normal arrastrado:", draggingId.value);
  }
  
  offset.x = (e.clientX - element.position.x * SCALE)
  offset.y = (e.clientY - element.position.y * SCALE)
}

// function handleMouseMove(e: MouseEvent) {
//   if (!draggingId.value) return
//   console.log("Dragging ID:", draggingId.value);
//   console.log("Status:", {
//   length: positions.value.length,
//   elements: JSON.stringify(positions.value, null, 2),
//   raw: positions.value
// });
  
//   positions.value.forEach((item) => {
//     if (item.id === draggingId.value) {
//       item.position.x = (e.clientX - offset.x) / SCALE
//       item.position.y = (e.clientY - offset.y) / SCALE
//     }
//   });
// }
function handleMouseMove(e: MouseEvent) {
  if (!draggingId.value && selectedPin.value) {
    const workspaceRect = workspaceRef.value?.getBoundingClientRect();
    if (!workspaceRect) return;

    // console.log("SVG Rect:", svgRect);

    const safeId = CSS.escape(selectedPin.value);
    const pinEl = svgRef.value?.svgEl.querySelector(`#${safeId}`);
    if (!pinEl) return;
    //console.log("Pin Element:", pinEl);

    const pinRect = pinEl.getBoundingClientRect();

    const x1 = (pinRect.left + pinRect.width / 2) - workspaceRect.left;
    const y1 = (pinRect.top + pinRect.height / 2) - workspaceRect.top;

    const x2 = e.clientX - workspaceRect.left;
    const y2 = e.clientY - workspaceRect.top;

    tempLine.value = { x1, y1, x2, y2 };
  }

  // Movimiento normal de componentes
  if (!draggingId.value) return;

  const element = positions.value.find(item => item.id === draggingId.value);
  if (element) {
    element.position.x = (e.clientX - offset.x) / SCALE;
    element.position.y = (e.clientY - offset.y) / SCALE;
    updateConnectionsPositions();
  }
  console.log("Temp Line:", tempLine.value);
}

function handleAddGadget(type: string) {
  if (type === 'LED') {
    const id = `led-${Date.now()}-${Math.random()}`;
    console.log("Adding LED with ID:", id);
    positions.value.push({
      id,
      position: { x: 200 + positions.value.length * 40, y: 100 }, // Espaciado simple
      compState: true
    });
    console.log(positions.value.length);

  }
}

function updateConnectionsPositions() {
  const workspaceRect = workspaceRef.value?.getBoundingClientRect();
  if (!workspaceRect) return;
  console.log("Workspace Rect:", workspaceRect);

  connections.value = connections.value.map(conn => {
    // Obtener el pin origen
    console.log("Updating connection:", conn);
    console.log("From Pin ID:", conn.fromPinId);
    const svg = svgRef.value.svgEl;
    if (!svg) return;
    //console.log("SVG Element:", svg);
    const group = svg.querySelector<SVGElement>('#g147');
    console.log(group);
    if (!group) return;
    const pins = group.querySelectorAll<SVGElement>('[id]');
    const fromElement = Array.from(pins).find(el => el.id === conn.fromPinId) as SVGElement | undefined;
    //console.log("From Element:", fromElement);
    //const fromElement = document.getElementById(conn.fromPinId);
    // Obtener el pin destino
    console.log("To Pin ID:", conn.toPinId);
    const lastDashIndex = conn.toPinId.lastIndexOf('-');
    const id = conn.toPinId.substring(0, lastDashIndex);  // "led-1748428485105-0.20556167771505063"
    const side = conn.toPinId.substring(lastDashIndex + 1); // "right"
    const toElement = document.getElementById(id);
    console.log("To Element:", toElement);
    const ledPinPos = {
          left: { x: 105, y: 45 },
          right: { x: 60, y: 45 }
        };

    if (!fromElement || !toElement) return conn; // Sin cambio si no existe
    console.log("From Element:", fromElement);

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    // Convertir a coordenadas relativas al workspace
    const x1 = fromRect.left + fromRect.width / 2 - workspaceRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - workspaceRect.top;

    const x2 = toRect.left + toRect.width - ledPinPos[side].x / 2 - workspaceRect.left ;
    const y2 = toRect.top + toRect.height - ledPinPos[side].y / 2 - workspaceRect.top ;

    return {
      ...conn,
      x1, y1, x2, y2
    };
  });
}


function handlePinClick(ledId, side) {
  console.log(`Pin ${side} clicked on LED with ID: ${ledId} and selected pin: ${selectedPin.value}`);
  if (!selectedPin.value || !tempLine.value) return;

  const { x1, y1, x2, y2 } = tempLine.value;

  // Puntos de control: por defecto hacemos una curva vertical tipo "S"
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx1 = x1 + dx / 2;
  const cy1 = y1;
  const cx2 = x1 + dx / 2;
  const cy2 = y2;

  connections.value.push({
    x1,
    y1,
    x2,
    y2,
    cx1,
    cy1,
    cx2,
    cy2,
    fromPinId: selectedPin.value,
    toPinId: `${ledId}-${side}`
  });

  tempLine.value = null;
  selectedPin.value = null;
}

const lines = computed(() => {
  return connections.value.map(conn => ({
    x1: conn.x1,
    y1: conn.y1,
    x2: conn.x2,
    y2: conn.y2,
    cx1: conn.cx1,
    cy1: conn.cy1,
    cx2: conn.cx2,
    cy2: conn.cy2,
  }));
});



function handleMouseUp() {
  draggingId.value = null;
  setTimeout(() => {
    tempLine.value = null;
  }, 50); // Espera breve para dejar que el click ocurra
}

const runProgram = async () => {
      const programBuffer = Assembler.assemble(asmCode.value);
      const ramSize = 1024;
      const ram = new ArrayBuffer(ramSize);
      const ramView = new Uint8Array(ram);
      const programView = new Uint8Array(programBuffer);
      ramView.set(programView, 0);

      const cpu = new CPU(ram, 0);
      let prev_value = 0;
      for (let i = 0; i < 30; i++) {
        const pcvalue = cpu.pc - prev_value;
        switch (pcvalue) {
          case 0x100:
            hookMap[0x100](cpu, connections.value, (val) => (compState.value = val));
            prev_value = cpu.pc;
            break;
          case 0x104:
            await hookMap[0x104](cpu, (val) => (compState.value = val));
            prev_value = cpu.pc;
            break;
          default:
            prev_value = cpu.pc;
            cpu.executionStep();
            console.log(`PC: ${cpu.pc}`);
            console.log(`ra: ${cpu.registerSet.getRegister(1)}`);
        }
      }
    };

function setupPinListeners() {
  if (!svgRef.value) return;

  // Accedemos al SVG completo
  const svg = svgRef.value.svgEl;
  if (!svg) return;

  // Buscamos el grupo donde están todos los pines
  const group = svg.querySelector<SVGElement>('#g147');
  console.log(group);
  if (!group) return;

  // Seleccionamos todos los hijos con id dentro del grupo GPIO5
  const pins = group.querySelectorAll<SVGElement>('[id]');
  
  pins.forEach(el => {
    const pinId = el.id;
    if ((boardData.pins as string[]).includes(pinId)) {
      // Cambiamos cursor para indicar que es clickeable
      (el as HTMLElement).style.cursor = "pointer";

      // Añadimos el click handler
      (el as HTMLElement).onclick = (e: Event) => {
        e.stopPropagation();

        if (selectedPin.value === pinId) {
          // Deseleccionar
          el.setAttribute("fill", "#ffd700");
          selectedPin.value = null;
          console.log("Out");
        } else {
          // Si había otro seleccionado, lo resetamos
          if (selectedPin.value) {
            const prev = svg.querySelector(`#${selectedPin.value}`);
            if (prev) prev.setAttribute("fill", "#ffd700");
          }
          // Seleccionamos el nuevo
          el.setAttribute("fill", "red");
          selectedPin.value = pinId;
          console.log("Selected");
        }
      };
    }
  });
}
watch(() => selectedPin.value, (newVal) => {
  console.log('selectedPin changed to:', newVal);
}, { immediate: true });

onMounted(() => {
  nextTick(() => {
    setupPinListeners();
  });
});

watch(() => boardData.pins, () => {
  nextTick(() => {
    setupPinListeners();
  });
});
const showMenu = ref(false);
function setupMenu() {
  showMenu.value = !showMenu.value; 
}


function clearConnections() {
  connections.value = [];
  if (svgRef.value) {
    const group = svgRef.value.svgEl.querySelector<SVGElement>('#g147');
    if (group) {
      const pins = group.querySelectorAll<SVGElement>('[id]');
      pins.forEach(el => {
        const pinId = el.id;
        if ((boardData.pins as string[]).includes(pinId)) {
          el.setAttribute("fill", "#ffd700");
        }
      });
    }
  }
  selectedPin.value = null;
}
</script>

<template>
  
  <div class="App" @mousemove="handleMouseMove" @mouseup="handleMouseUp" style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
    <h1 style="text-align: center; margin-top: 1rem;">Creatino Maker</h1>
    <Menu v-if="showMenu" style="position: absolute; bottom:270px; right: 510px; z-index: 1200;" @add-gadget="handleAddGadget" />

    <div ref="workspaceRef" style="width: 90%; height: 70%; border: 2px solid #ccc; position: relative; margin-bottom: 1rem; overflow: hidden;">
      <div style="position: absolute; bottom: 20px; right: 20px; z-index: 1100;">
        <div style="position: relative; display: inline-block;">
          <button @click="setupMenu" id="plus-btn" style="font-size: 2rem; padding: 0.75rem 1.5rem; margin-right: 0.5rem;">+</button>
          <button @click="runProgram" style="font-size: 1.5rem; padding: 0.75rem 1.5rem; margin-right: 0.5rem;">Run</button>
          <button @click="clearConnections" style="font-size: 1.5rem; padding: 0.75rem 1.5rem;">Clear</button>
          <!-- <button @click="handleAddGadget('LED')" style="position: absolute; top: -80px; left: 10px;">Añadir LED</button> -->

        </div>
      </div>
      <div style="transform: scale(2); transform-origin: top left; display: inline-block;">
        <BoardElement
          :positions="positions"
          @handleMouseDown="handleMouseDown"
          ref="svgRef"
        />
        <!-- <LEDComponent
          v-for="led in positions.filter(item => item.id.startsWith('led-'))"
          :key="led.id"
          :position="led.position"
          :ledState="led.compState"
          :selectedPin="selectedPin?.value"
          :connections="connections"
          @handleMouseDown="(e) => handleMouseDown(e, led.id)"
          @handlePinClick="(side) => handlePinClick(led.id,side)"
        /> -->
        <LEDComponent
          v-for="led in positions.filter(item => item.id.startsWith('led-'))"
          :id="led.id"
          :position="led.position"
          :ledState="led.compState"
          :selectedPin="selectedPin?.value"
          :connections="connections"
          @handleMouseDown="(e) => handleMouseDown(e, led.id)"
          @handlePinClick="(side) => handlePinClick(led.id, side)"
        />
      </div>
      <!-- <ConnectionsLines
        :connections="connections"
        :svgRef="svgRef"
        :positions="positions"
        :workspaceRef="workspaceRef"
      /> -->
      <ConnectionsLines
        :connections="connections"
        :svgRef="svgRef"
        :positions="positions"
        :workspaceRef="workspaceRef"
        :tempLine="tempLine"
        :lines="lines"
    />

    </div>

    <!-- <textarea v-model="asmCode" readonly style="width: 100%;" rows="10"></textarea> -->
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
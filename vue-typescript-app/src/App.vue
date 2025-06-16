<!-- 
/*  CREATino Maker-App
 *  Copyright 2018-2025 Felix Garcia Carballeira, Diego Camarmas Alonso, Alejandro Calderon Mateos, Elisa Utrilla Arroyo
 *
 *  file is part of CREATOR.
 *
 *  CREATOR is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  CREATOR is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with CREATOR.  If not, see <http://www.gnu.org/licenses/>.
 *
 */ -->

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, computed , onBeforeUnmount} from 'vue'
import BoardElement from './components/BoardElements/BoardElement.vue';
import * as Emulator from "@aloeminium108/risc-v-emulator";
const { Assembler, CPU } = Emulator.default;
import hookMap from './components/BoardElements/emulator.js';
import boardData from './components/BoardElements/esp32c3.json';
import ConnectionsLines from './components/Gadgets/Lines.vue';
import Menu from './components/Gadgets/GadgetMenu.vue';
import LEDComponent from './components/Gadgets/Elements/LED.vue';
import FileMenu from './components/Gadgets/Elements/ConfigFile.vue';
import WorkMenu from './components/Gadgets/Elements/ConfigWork.vue';

const workspaceRef = ref<HTMLDivElement | null>(null);
const boardDataMutable = ref({ ...boardData });

/// -----------UNDO y REDO
const undoStack = ref<Array<{ positions: typeof positions.value, connections: typeof connections.value }>>([]);
const redoStack = ref<Array<{ positions: typeof positions.value, connections: typeof connections.value }>>([]);


const compState = ref(true);
const positions = ref<{ id: string, position: { x: number, y: number }, compState: boolean ,   flipped: boolean,  rotation: number, color : string }[]>([
  {
    id: 'board',
    position: { x: 300, y: 100 },
    compState: true,
    flipped: false,
    rotation: 0,
    color: 'black',
  }
]);
const ledRefs = ref<Record<string, any>>({});
//Deformar líneas

// Dibujo de líneas
const tempLine = ref<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
const connections = ref<Array<{
  id: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  fromPinId: string,
  toPinId: string,
  stroke: string,
  strokeWidth: number
}>>([]);


// const asmCode = ref([
//       "addi a0, a0, 5",
//       "addi a1, a1, 1",
//       "jal ra, 0x100",
//       "addi a0, a0, -5",
//       "addi a0, a0, 1000",
//       "jal ra, 0x104",
//       "addi a0, a0, -1000",
//       "addi a0, a0, 5",
//       "addi a1, a1, -1",
//       "addi a1, a1, 0",
//       "jal ra, 0x100",
//       "addi t1, t1, 2",
//     ]);
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
      "addi a0, a0, 1",
      "addi a1, a1, 1",
      "jal ra, 0x100",      
      "addi a0, a0, -6",
      "addi a0, a0, 1000",
      "jal ra, 0x104",
      "addi a0, a0, -994",
      "addi a0, a0, 6",
      "addi a1, a1, 0",
      "jal ra, 0x100", 
    ]);
const draggingId = ref<string | null>(null)
const offset = reactive({ x: 0, y: 0 })
const svgRef = ref<SVGSVGElement | null>(null)
const selectedPin = ref<string | null>(null)

const showSave = ref(false);
const showUpload = ref(false);
const filename = ref('board-state');

const SCALE= ref(2); // empieza en 1x

function handleMouseDown(e: MouseEvent, id: string) {
  saveStateForUndo() 
  draggingId.value = id;
  const element = positions.value.find(item => item.id === id);
  if (!element) return;

  // Calcula offset relativo a la posición actual del elemento y ajusta por la escala
  offset.x = (e.clientX / SCALE.value) - element.position.x;
  offset.y = (e.clientY / SCALE.value) - element.position.y;
}

function handleFlip(id: string) {
  const led = positions.value.find(item => item.id === id);
  if (led) led.flipped = !led.flipped;
}
function handleColor(id: string) {
  const led = positions.value.find(item => item.id === id);
  if (led) led.color = color;
}

function handleRotate(id: string) {
  const led = positions.value.find(item => item.id === id);
  if (led) led.rotation = (led.rotation + 90) % 360;
}

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
    // La posición se calcula dividiendo clientX/clientY por escala y restando el offset
    element.position.x = (e.clientX / SCALE.value) - offset.x;
    element.position.y = (e.clientY / SCALE.value) - offset.y;
    updateConnectionsPositions();
  }
}
function handleAddGadget(type: string) {
  saveStateForUndo() 
  if (type === 'LED') {
    const id = `led-${Date.now()}-${Math.random()}`;
    console.log("Adding LED with ID:", id);
    positions.value.push({
      id,
      position: { x: 200 + positions.value.length * 40, y: 100 }, // Espaciado simple
      compState: true,
      flipped: false,
      rotation: 0,
      color: 'red'

    });
    console.log(positions.value.length);

  }
}
function handleLedStateChange(id: string, state: { flipped: boolean; rotation: number ,color: string}) {
  saveStateForUndo() 
  const led = positions.value.find(item => item.id === id);
  if (led) {
    led.flipped = state.flipped;
    led.rotation = state.rotation;
    led.color = state.color;
    console.log(`LED ${id} state updated:`, led);
  }
}
function removeLed(id: string) {
  saveStateForUndo() 
  positions.value = positions.value.filter(item => item.id !== id)
  connections.value = connections.value.filter(conn =>
  !conn.fromPinId.startsWith(id) && !conn.toPinId.startsWith(id)
)

}
function removeLine(id) {
  console.log("Removing line with ID:", id);
  connections.value = connections.value.filter(conn => conn.id !== id
)
}

function updateConnectionsPositions() {
  const workspaceRect = workspaceRef.value?.getBoundingClientRect();
  if (!workspaceRect) return;

  connections.value = connections.value.map(conn => {
    // Obtenemos el pin origen del SVG
    const svg = svgRef.value?.svgEl;
    if (!svg) return conn;

    const group = svg.querySelector<SVGElement>('#g147');
    if (!group) return conn;

    const pins = group.querySelectorAll<SVGElement>('[id]');
    const fromElement = Array.from(pins).find(el => el.id === conn.fromPinId);
    if (!fromElement) return conn;

    const toId = conn.toPinId.substring(0, conn.toPinId.lastIndexOf('-'));
    const side = conn.toPinId.substring(conn.toPinId.lastIndexOf('-') + 1);

    const toLedComponent = ledRefs.value[toId];
    if (!toLedComponent) return conn;

    const fromRect = fromElement.getBoundingClientRect();
    const x1 = fromRect.left + fromRect.width / 2 - workspaceRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - workspaceRect.top;

    const ledValues = toLedComponent.getPinCoords();
    const x2 = (side === 'left' ? ledValues.left.x : ledValues.right.x) - workspaceRect.left;
    const y2 = (side === 'left' ? ledValues.left.y : ledValues.right.y) - workspaceRect.top;

    return {
      ...conn,
      x1,
      y1,
      x2,
      y2,
      strokeWidth: 2 * SCALE.value
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
    id: `${ledId}-${side}-${selectedPin.value}`,
    x1,
    y1,
    x2,
    y2,
    cx1,
    cy1,
    cx2,
    cy2,

    fromPinId: selectedPin.value,
    toPinId: `${ledId}-${side}`,

    stroke: 'black',
    strokeWidth: 2 * SCALE.value,


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
    stroke: conn.stroke,           // <-- añadir esto
    strokeWidth: 2 * SCALE.value
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
    if ((boardDataMutable.value.pins as string[]).includes(pinId)) {
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

watch(() => boardDataMutable.value.pins, () => {
  nextTick(() => {
    setupPinListeners();
  });
});
watch(positions, (newPositions) => {
  //console.log('Positions changed:', newPositions);
  updateConnectionsPositions();
}, { deep: true });

const showMenu = ref(false);
function setupMenu() {
  showMenu.value = !showMenu.value; 
}const showFile = ref(false);
function setupFile() {
  showFile.value = !showFile.value; 
}

// Workspace button

// Pantalla work

const showWork = ref(false);
function setupWork() {
  showWork.value = !showWork.value; 
}

function clearConnections() {
  const shouldClear = window.confirm("¿Estás seguro de que quieres borrar todas las conexiones?");
  if (!shouldClear) {
    return;
  }

  // 2. Restaurar color de los pines en el SVG
  if (svgRef.value) {
    const group = svgRef.value.svgEl.querySelector<SVGElement>('#g147');
    if (group && boardDataMutable.value?.pins) {
      const pins = group.querySelectorAll<SVGElement>('[id]');
      pins.forEach(el => {
        const pinId = el.id;
        if ((boardDataMutable.value.pins as string[]).includes(pinId)) {
          el.setAttribute("fill", "#ffd700");
        }
      });
    }
  }

  // 3. Eliminar LEDs que estaban conectados
  positions.value = positions.value.filter(component => {
    // Si es un LED, lo eliminamos si hay alguna conexión cuyo id contenga el id del LED
    if (component.id.startsWith('led-')) {
      return !connections.value.some(conn => conn.id.includes(component.id));
    }
    return true; // mantener si no es LED
  });
  connections.value = [];

  // 4. Resetear selección
  selectedPin.value = null;
}

function zoomIn() {
  SCALE.value += 0.5;
  if (SCALE.value > 5) SCALE.value = 5; // Limitar a 2x
  updateConnectionsPositions();
}
function zoomOut() {
  SCALE.value -= 0.5;
  if (SCALE.value < 1) SCALE.value = 1; // Limitar a 2x
  updateConnectionsPositions();
}
function onWorkAction(action) {
  switch(action){
    case 'zoomin': zoomIn(); break;
    case 'zoomout': zoomOut(); break;
    case 'clean': 
      clearConnections(); 
      break;
    case 'undo': 
      undo(); 
      break;
    case 'redo': 
      redo(); 
      break;
    case 'dark': 
      changeDarkMode(); 
      break;  
  }
}
function saveStateForUndo() {
  // Guarda una copia profunda del estado actual
  undoStack.value.push({
    positions: JSON.parse(JSON.stringify(positions.value)),
    connections: JSON.parse(JSON.stringify(connections.value)),
  });
  // Limita el tamaño del stack si quieres
  if (undoStack.value.length > 50) undoStack.value.shift();
}

function undo() {
  if (undoStack.value.length === 0) return;
  // Guarda el estado actual en el redoStack antes de deshacer
  redoStack.value.push({
    positions: JSON.parse(JSON.stringify(positions.value)),
    connections: JSON.parse(JSON.stringify(connections.value)),
  });
  const prevState = undoStack.value.pop();
  if (prevState) {
    positions.value = JSON.parse(JSON.stringify(prevState.positions));
    connections.value = JSON.parse(JSON.stringify(prevState.connections));
    updateConnectionsPositions();
  }
}
function redo() {
  if (redoStack.value.length === 0) return;
  // Guarda el estado actual en el undoStack antes de rehacer
  undoStack.value.push({
    positions: JSON.parse(JSON.stringify(positions.value)),
    connections: JSON.parse(JSON.stringify(connections.value)),
  });
  const nextState = redoStack.value.pop();
  if (nextState) {
    positions.value = JSON.parse(JSON.stringify(nextState.positions));
    connections.value = JSON.parse(JSON.stringify(nextState.connections));
    updateConnectionsPositions();
  }
}

const darkMode = ref(false);

function changeDarkMode() {
  darkMode.value = !darkMode.value;
  const app = document.getElementById('app-main');
  if (darkMode.value) {
    app?.classList.add('dark-mode');
    localStorage.setItem("conf_dark_mode", "on");
  } else {
    app?.classList.remove('dark-mode');
    localStorage.setItem("conf_dark_mode", "off");
  }
}
onMounted(() => {
  const app = document.getElementById('app-main');
  if (localStorage.getItem("conf_dark_mode") === "on") {
    darkMode.value = true;
    app?.classList.add('dark-mode');
  }
});
// Pantalla archivos
function onFileAction(action) {
  if (action === 'save') {
    console.log("Saving board state...");
    showSave.value = true;
  }
  if (action === 'upload') {
    console.log("Uploading board state...");
    showUpload.value = true;
  }
}

function confirmDownload() {
  showSave.value = false;
  downloadState();
}

function cancelDownload() {
  showSave.value = false;
}

function downloadState() {
  const state = {
    positions: positions.value,
    connections: connections.value,
    boardDataMutable: boardDataMutable,
    code: asmCode.value,
  };
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename.value || 'board-state'}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

// Upload file 
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const content = e.target.result as string;
      const parsed = JSON.parse(content);

      // Reemplaza todo el array con uno nuevo (gatilla la reactividad en Vue)
      positions.value = (parsed.positions || []).map(p => ({
        id: p.id,
        position: p.position,
        compState: p.compState ?? true,
        flipped: p.flipped ?? false,
        rotation: p.rotation ?? 0,
        color: p.color ?? 'red'
      }));
      console.log("Positions loaded:", positions.value);

      connections.value = parsed.connections || [];
      boardDataMutable.value = parsed.boardData || {};
      asmCode.value = parsed.code || [];

      nextTick(() => {
        updateConnectionsPositions(); // Actualiza visualmente las líneas
      });

      showSave.value = false;
    } catch (err) {
      console.error('Error parsing uploaded JSON:', err);
    }
  };
  reader.readAsText(file);
}

function confirmUpload() {
  showUpload.value = false;
}

function cancelUpload() {
  showUpload.value = false;
}


</script>

<template>
  <div id="app-main" class="App" @mousemove="handleMouseMove" @mouseup="handleMouseUp" style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
    <h1 style="text-align: center; margin-top: 1rem;">Creatino Maker</h1>
    <Menu v-if="showMenu" :dark-mode="darkMode" style="position: absolute; bottom:480px; right: 460px; z-index: 1200;" @add-gadget="handleAddGadget" />
    <FileMenu v-if="showFile" style="position: absolute; top: 170px; right: 250px; z-index: 1000;" @file-action="onFileAction" />
    <WorkMenu v-if="showWork" style="position: absolute; top: 170px; left:100px; z-index: 1000;" @work-action="onWorkAction" />

    <!-- Pantalla save -->
    <div class="modal fade show" tabindex="-1" style="display: block;" v-if="showSave" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Introduce un nombre para el archivo:</h5>
            <button type="button" class="btn-close" @click="cancelDownload"></button>
          </div>
          <div class="modal-body">
            <input v-model="filename" class="form-control" placeholder="board-state" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="confirmDownload">Aceptar</button>
            <button class="btn btn-primary" @click="cancelDownload">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showSave"></div>

    <!-- Pantalla upload -->
    <div class="modal fade show" tabindex="-1" style="display: block;" v-if="showUpload" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sube un archivo JSON para cargar el estado:</h5>
            <button type="button" class="btn-close" @click="cancelUpload"></button>
          </div>
          <div class="modal-body">
            <input type="file" @change="handleFileUpload" accept=".json" class="form-control" />
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="confirmUpload">Aceptar</button>
            <button class="btn btn-primary" @click="cancelUpload">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showUpload"></div>

    <div ref="workspaceRef" style="width: 90%; height: 70%; border: 2px solid #ccc; position: relative; margin-bottom: 1rem; overflow: hidden;">
      <!-- Elementos de zoom -->
      <div style="position: absolute; top: 20px; left: 20px; z-index: 1100; display: flex; flex-direction: column;">
        <!-- <button @click="zoomIn" style="font-size: 2rem; padding: 0.75rem 1.5rem; margin-bottom: 0.5rem;" id="menu-btn">
          <fa-icon :icon="['fas', 'magnifying-glass-plus']" style="width: 1em; height: 1em; color: white;" />
        </button>
        <button @click="zoomOut" style="font-size: 2rem; padding: 0.75rem 1.5rem;" id="menu-btn">
          <fa-icon :icon="['fas', 'magnifying-glass-minus']" style="width: 1em; height: 1em; color: white;" />
        </button> -->
        <button @click="setupWork" style="font-size: 2rem; padding: 0.75rem 1.5rem; margin-bottom: 0.5rem;" id="work-btn">
          <fa-icon :icon="['fas', 'wrench']" style="width: 1em; height: 1em; color: white;" />
        </button>
      </div>
      <div style="position: absolute; top: 20px; right: 20px; z-index: 1100; display: flex; flex-direction: column;">
        <button @click="setupFile" style="font-size: 2rem; padding: 0.75rem 1.5rem; margin-bottom: 0.5rem;" id="menu-btn">
          <fa-icon :icon="['fas', 'bars']" style="width: 1em; height: 1em; color: white;" />
        </button>
      </div>

      <div style="position: absolute; bottom: 20px; right: 20px; z-index: 1100;">
        <!-- Botones del fondo -->
        <div style="position: relative; display: inline-block;">
          <button @click="setupMenu" id="plus-btn" style="font-size: 1.5rem; padding: 0.75rem 1.5rem; margin-right: 0.5rem;">
            <fa-icon :icon="['fas', 'circle-plus']" style="width: 1em; height: 1em; color: white;" />
          </button>
          <button @click="runProgram" style="font-size: 1.5rem; padding: 0.75rem 1.5rem; margin-right: 0.5rem;">
            <fa-icon :icon="['fas', 'play']" style="width: 1em; height: 1em; color: white;" />
          </button>
          <!-- <button @click="clearConnections" style="font-size: 1.5rem; padding: 0.75rem 1.5rem;">
            <fa-icon :icon="['fas', 'trash']" style="width: 1em; height: 1em; color: white;" />
          </button> -->
          <!-- <button @click="handleAddGadget('LED')" style="position: absolute; top: -80px; left: 10px;">Añadir LED</button> -->

        </div>
      </div>
      <div 
        :style="{ 
          transform: `scale(${SCALE})`, 
          transformOrigin: 'top left', 
          display: 'inline-block' 
        }"
      >
        <BoardElement
          :positions="positions"
          @handleMouseDown="handleMouseDown"
          ref="svgRef"
        />
        <LEDComponent
          v-for="led in positions.filter(item => item.id.startsWith('led-'))"
          :id="led.id"
          :position="led.position"
          :ledState="led.compState"
          :selectedPin="selectedPin?.value"
          :ledColor="led.color"
          :flipped="led.flipped"
          :rotation="led.rotation"
          :connections="connections"
          @handleMouseDown="(e) => handleMouseDown(e, led.id)"
          @handlePinClick="(side) => handlePinClick(led.id, side)"
          @delete="removeLed(led.id)"
          @flip="() => handleFlip(led.id)"
          @rotate="() => handleRotate(led.id)"
          @updateState="(state) => handleLedStateChange(led.id, state)"
          :ref="el => {
            if (el) ledRefs[led.id] = el;
            else delete ledRefs[led.id];
          }"
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
        @delete="removeLine"
        @update:lineValue="changelineValue => {
          console.log('Update line value:', changelineValue);

          // Aquí puedes manejar el cambio de valor de la línea
          connections = connections.map(conn => {
            if (conn.id === changelineValue.id) {
              console.log('Updating connection stroke:', conn.id, changelineValue.value);
              return { ...conn, stroke: changelineValue.value };
            }
            console.log('Unchanged connection:', conn);
            return conn;
          });

          console.log('Updated connections:', connections);
        }"
    />

    </div>

    <!-- <textarea v-model="asmCode" readonly style="width: 100%;" rows="10"></textarea> -->
  </div>
  <div id="overlay-container"
     style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2000;">
  </div>
</template>

<style>
/* --------- General --------- */
#app-main {
  background-color: #f8f9fa;
  color: #212529;
  transition: background 0.3s, color 0.3s;
}
#app-main button,
#app-main .btn {
  background: #0d6efd;
  color: #fff;
  border: 1px solid #0d6efd;
  border-radius: 0.25rem;
  transition: background 0.2s, color 0.2s;
  font-weight: 500;
  padding: 0.5rem 1rem;
}
#app-main button:hover,
#app-main .btn:hover {
  background: #0b5ed7;
  color: #fff;
}
#app-main input,
#app-main select,
#app-main textarea,
#app-main .form-control {
  background: #f8fafc;
  color: #23272b;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
  transition: background 0.2s, color 0.2s;
}

/* --------- Bootstrap Modal --------- */
.modal-content {
  background-color: #fff !important;
  color: #23272b !important;
  border-radius: 0.7rem;
  box-shadow: 0 8px 32px rgba(60,60,60,0.12);
}
.modal-backdrop {
  background-color: #000 !important;
  opacity: 0.5 !important;
}
.modal-footer .btn {
  background-color: #0d6efd !important;
  color: #fff !important;
  border-color: #0d6efd !important;
}
.modal-footer .btn:hover, 
.modal-footer .btn:focus {
  background-color: #0b5ed7 !important;
  border-color: #0a58ca !important;
  color: #fff !important;
}

/* --------- Modo Oscuro --------- */
.dark-mode,
.dark-mode #app-main {
  background-color: #181a1b !important;
  color: #f8f9fa !important;
}
.dark-mode #app-main button,
.dark-mode #app-main .btn {
  background: #2563eb !important;
  color: #f8f9fa !important;
  border-color: #2563eb !important;
}
.dark-mode #app-main button:hover,
.dark-mode #app-main .btn:hover {
  background: #1e40af !important;
  color: #fff !important;
}
.dark-mode #app-main input,
.dark-mode #app-main select,
.dark-mode #app-main textarea,
.dark-mode #app-main .form-control {
  background: #23272b !important;
  color: #f8f9fa !important;
  border-color: #454d55 !important;
}
.dark-mode .modal-content {
  background-color: #23272b !important;
  color: #f8f9fa !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.32);
}
.dark-mode .modal-footer .btn {
  background-color: #2563eb !important;
  color: #fff !important;
  border-color: #2563eb !important;
}
.dark-mode .modal-footer .btn:hover,
.dark-mode .modal-footer .btn:focus {
  background-color: #1e40af !important;
  border-color: #1e40af !important;
  color: #fff !important;
} 
.dark-mode .bg-white,
.dark-mode .bg-light,
.dark-mode .card,
.dark-mode .border,
.dark-mode .shadow-sm {
  background-color: #23272b !important;
  color: #f8f9fa !important;
  border-color: #343a40 !important;
}
.dark-mode hr,
.dark-mode .border,
.dark-mode .modal-content {
  border-color: #343a40 !important;
}
.dark-mode .form-check-input {
  background-color: #23272b !important;
  border-color: #495057 !important;
}
.dark-mode .form-check-input:checked {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}
.dark-mode ::placeholder,
.dark-mode .form-control::placeholder {
  color: #b0b3b8 !important;
  opacity: 1;
}
.dark-mode .modal-footer .btn {
  background-color: #2563eb !important;
  color: #fff !important;
  border-color: #2563eb !important;
}
.dark-mode .modal-footer .btn:hover,
.dark-mode .modal-footer .btn:focus {
  background-color: #1e40af !important;
  border-color: #1e40af !important;
  color: #fff !important;
}

/* Opcional: scrollbar */
.dark-mode ::-webkit-scrollbar {
  background: #23272b;
}
.dark-mode ::-webkit-scrollbar-thumb {
  background: #343a40;
}
</style>
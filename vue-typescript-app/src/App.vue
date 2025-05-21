<script setup lang="ts">
import { ref, reactive } from 'vue'
import BoardElement from './components/BoardElement.vue';
import * as Emulator from "@aloeminium108/risc-v-emulator";
const { Assembler, CPU } = Emulator.default;
import hookMap from './components/BoardElements/emulator.js';
import boardData from './components/BoardElements/esp32c3.json';

const positions = reactive({
  svgIcon: { x: 300, y: 100 }
})
const connections = ref(boardData.connections);
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

function handleMouseDown(e: MouseEvent, id: string) {
  draggingId.value = id
  offset.x = e.clientX - positions[id].x
  offset.y = e.clientY - positions[id].y
}

function handleMouseMove(e: MouseEvent) {
  if (!draggingId.value) return
  positions[draggingId.value].x = e.clientX - offset.x
  positions[draggingId.value].y = e.clientY - offset.y
}

function handleMouseUp() {
  draggingId.value = null
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
            hookMap[0x100](cpu, connections.value, (val) => (ledState.value = val));
            prev_value = cpu.pc;
            break;
          case 0x104:
            await hookMap[0x104](cpu, (val) => (ledState.value = val));
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
</script>

<template>
  
  <div class="App" @mousemove="handleMouseMove" @mouseup="handleMouseUp" style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
    <h1>Creatino Maker</h1>
    <!-- <GadgetMenu /> -->
    <div ref="workspaceRef" style="width: 100%; height: 50%; border: 2px solid #ccc; position: relative; margin-bottom: 1rem; overflow: hidden;">
      <!-- <Board class="w-8 h-8" /> -->
      <BoardElement
    :positions="positions"
    @handleMouseDown="handleMouseDown"
    ref="svgRef"
      />
      <!-- <ConnectionsLines
        :connections="connections"
        :svgRef="svgRef"
        :positions="positions"
        :workspaceRef="workspaceRef"
      /> -->
    </div>
    <button @click="runProgram">Run</button>
    <button @click="clearConnections">Clear</button>
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
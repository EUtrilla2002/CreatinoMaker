<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, defineExpose, nextTick, computed } from 'vue'

const configButtonRef = ref<SVGCircleElement | null>(null)
// Props
const props = defineProps<{
  positions: { 
    id: string;
    position: { x: number; y: number };
    compState: boolean;
    rotation: number;
  }[]
}>()

// Get board position from the positions array
const getBoardPosition = () => {
  const boardItem = props.positions.find(item => item.id === 'board')
  return boardItem?.position || { x: 0, y: 0 }
}

// Emit
const emit = defineEmits<{
  (e: 'handleMouseDown', event: MouseEvent, id: string): void;
  (e: 'updateBoard', payload: { rotation: number }): void;
}>()

// Refs
const svgEl = ref<SVGSVGElement | null>(null)
const svgRef = ref<HTMLDivElement | null>(null)
const elementsGndGpio = ref<(SVGElement)[]>([])


// Cuando el componente esté montado, buscamos los elementos que queremos
onMounted(() => {
  if (svgEl.value) {
    const selector = '[id^="GND"], [id^="GPIO"]'
    const foundElements = svgEl.value.querySelectorAll<SVGElement>(selector)
    elementsGndGpio.value = Array.from(foundElements)
  }
})

// Estado para el círculo GPIO8
const gpio30Active = ref(false)

function setGPIO30State(state: boolean) {
  gpio30Active.value = state
}


// Función para alternar el estado
function toggleGPIO30() {
  gpio30Active.value = !gpio30Active.value
}
// Exponer referencias para que el padre pueda acceder
defineExpose({
  svgEl,
  elementsGndGpio,
  svgRef,
  setGPIO30State: setGPIO30State 
})

// Función para manejar el evento mousedown
function onMouseDown(e: MouseEvent) {
  emit('handleMouseDown', e, 'board')
}
const rotation = computed(() => {
  const board = props.positions.find(item => item.id === 'board');
  return board?.rotation ?? 0;
});

function handleRotate() {
  emit('updateBoard', {rotation: (rotation.value + 90) % 360})
}




</script>

<template>
  <div
    :style="{
      position: 'absolute',
      left: getBoardPosition().x + 'px',
      top: getBoardPosition().y + 'px',
      cursor: 'grab'
    }"
    @mousedown="onMouseDown"
    ref="svgRef"
  >
  <!-- SVG de la placa -->
<svg width="28.2mm" height="54.053mm" version="1.1" viewBox="0 0 107 201" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pin-pattern" height="4.6" width="5" patternUnits="userSpaceOnUse">
            <path d="m3.5 2.85c0.268 1.82e-4 0.525-0.106 0.716-0.296 0.187-0.19 0.296-0.445 0.297-0.713l5.7e-4 -0.836c1.82e-4 -0.268-0.109-0.525-0.296-0.716-0.19-0.19-0.447-0.296-0.715-0.297l-3.5-0.0024-0.0019 2.85z" fill="#d1c479" stroke-width="3.11"></path>
          </pattern>
          <pattern id="small-pin-pattern" height="4.6" width="2.5" patternUnits="userSpaceOnUse">
            <path d="m1.4 1.32c0-0.138-0.0547-0.271-0.153-0.37-0.098-0.0965-0.23-0.153-0.368-0.153h-0.432c-0.138 0-0.271 0.0563-0.37 0.153-0.098 0.098-0.153 0.231-0.153 0.37v1.81h1.47z" fill="#f5f9f0" stroke-width="1.61"></path>
          </pattern>
          <filter id="ledFilter" x="-0.8" y="-0.8" height="5.2" width="5.8">
            <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          </filter>
        </defs>

        <!-- Board -->
        <path d="m7.56 0c-4.19 0-7.56 3.37-7.56 7.56v181c0 4.19 3.37 7.56 7.56 7.56h91.5c4.19 0 7.56-3.37 7.56-7.56v-181c0-4.19-3.37-7.56-7.56-7.56zm1.11 2.5a6.24 6.24 0 0 1 6.24 6.24 6.24 6.24 0 0 1-6.24 6.24 6.24 6.24 0 0 1-6.24-6.24 6.24 6.24 0 0 1 6.24-6.24zm88.9 0.217a6.24 6.24 0 0 1 6.24 6.24 6.24 6.24 0 0 1-6.24 6.24 6.24 6.24 0 0 1-6.24-6.24 6.24 6.24 0 0 1 6.24-6.24zm3.75 15.8a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.5 0.438a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.6 9.15a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.8 0.344a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.8 9.7a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.6 0.27a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.6 9.24a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.6 0.0391a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm0.0762 9.58a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.6 0.0371a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm0 9.58a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.6 0.422a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm0 9.51a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.5 0.115a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.4 9.54a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.5 0.0391a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.5 9.7a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.5 0.346a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.7 9.35a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.7 0.154a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.6 9.43a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.7 0.23a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm0 9.58a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.7 0.23a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.7 9.35a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.7 0.152a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.8 9.51a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.7 0.154a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm96.7 9.43a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm-96.7 0.152a3.4 3.4 0 0 1 3.4 3.4 3.4 3.4 0 0 1-3.4 3.4 3.4 3.4 0 0 1-3.4-3.4 3.4 3.4 0 0 1 3.4-3.4zm3.79 24.7a6.24 6.24 0 0 1 6.24 6.24 6.24 6.24 0 0 1-6.24 6.24 6.24 6.24 0 0 1-6.24-6.24 6.24 6.24 0 0 1 6.24-6.24zm88.7 0.217a6.24 6.24 0 0 1 6.24 6.24 6.24 6.24 0 0 1-6.24 6.24 6.24 6.24 0 0 1-6.24-6.24 6.24 6.24 0 0 1 6.24-6.24z" fill="#1a1a1a" fill-rule="evenodd"></path>

        <!-- ESP32 Chip -->
        <rect transform="translate(85,34)" width="4.8" height="55" fill="url(#pin-pattern)"></rect>
        <rect transform="translate(20.5,87) rotate(180)" width="4.8" height="55" fill="url(#pin-pattern)"></rect>
        <rect transform="translate(80,98) rotate(90)" width="4.8" height="55" fill="url(#pin-pattern)"></rect>
        <rect x="20" y="24.8" width="65.6" height="73.3" fill="#808080" fill-rule="evenodd"></rect>

        <!-- Regulator -->
        <g fill="#ececec" fill-rule="evenodd">
          <rect x="19.3" y="143" width="7.21" height="11.5"></rect>
          <rect x="39.8" y="139" width="6.59" height="3.07"></rect>
          <rect x="40" y="147" width="6.59" height="3.07"></rect>
          <rect x="40.2" y="156" width="6.59" height="3.07"></rect>
        </g>
        <rect x="26.3" y="137" width="14" height="24.7" fill="#4d4d4d" fill-rule="evenodd"></rect>

        <!-- Buttons -->
        <g stroke-width="1.24">
          <rect x="77.6" y="177" width="11.1" height="9.96" fill="#cecccb"></rect>
          <circle cx="83.2" cy="182" r="3.48" fill="#ffdc8e"></circle>
          <g fill="#cecccb">
            <path d="m80.7 190h-1.34v1.64c0 0.734 0.595 1.33 1.33 1.33h0.0099z"></path>
            <path d="m80.7 175h-1.34v-1.64c0-0.734 0.595-1.33 1.33-1.33h0.0099z"></path>
            <rect x="81" y="190" width="5.23" height="2.59"></rect>
            <rect x="81" y="173" width="5.23" height="2.59"></rect>
            <path d="m84.5 175c0.062 0 0.122 0.0248 0.166 0.0682 0.0434 0.0446 0.0682 0.104 0.0682 0.167 0 0.134 0.0533 0.263 0.149 0.358 0.0955 0.0942 0.224 0.148 0.358 0.148h0.0236c0.141 0 0.277-0.0558 0.376-0.155s0.155-0.234 0.155-0.374v-0.564h2.16v3.09h-1.69v0.744h-2.16v-0.392h-1.87v0.392h-2.16v-0.744h-1.69v-3.09h2.16v0.564c0 0.14 0.0558 0.275 0.155 0.374s0.234 0.155 0.376 0.155h0.0236c0.135 0 0.263-0.0533 0.358-0.148 0.0955-0.0955 0.149-0.224 0.149-0.358 0-0.0632 0.0248-0.123 0.0682-0.167 0.0446-0.0434 0.104-0.0682 0.167-0.0682z"></path>
            <path d="m81.8 190c-0.0632 0-0.123-0.0248-0.167-0.0694-0.0434-0.0434-0.0682-0.103-0.0682-0.166 0-0.134-0.0533-0.263-0.149-0.358-0.0955-0.0955-0.223-0.149-0.358-0.149h-0.0236c-0.141 0-0.277 0.0558-0.376 0.156-0.0992 0.0992-0.155 0.234-0.155 0.374v0.564h-2.16v-3.09h1.69v-0.745h2.16v0.393h1.87v-0.393h2.16v0.745h1.69v3.09h-2.16v-0.564c0-0.14-0.0558-0.275-0.155-0.374-0.0992-0.1-0.234-0.156-0.376-0.156h-0.0236c-0.134 0-0.263 0.0533-0.358 0.149s-0.149 0.224-0.149 0.358c0 0.0632-0.0248 0.123-0.0682 0.166-0.0446 0.0446-0.104 0.0694-0.166 0.0694z"></path>
          </g>
        </g>
        <g stroke-width="1.24">
          <rect x="17.7" y="177" width="11.1" height="9.96" fill="#cecccb"></rect>
          <circle cx="23.3" cy="182" r="3.48" fill="#ffdc8e"></circle>
          <g fill="#cecccb">
            <path d="m20.8 189h-1.34v1.64c0 0.734 0.595 1.33 1.33 1.33h0.0099z"></path>
            <path d="m20.8 175h-1.34v-1.64c0-0.734 0.595-1.33 1.33-1.33h0.0099z"></path>
            <rect x="21" y="189" width="5.23" height="2.59"></rect>
            <rect x="21" y="172" width="5.23" height="2.59"></rect>
            <path d="m24.5 175c0.062 0 0.122 0.0248 0.166 0.0682 0.0434 0.0446 0.0682 0.104 0.0682 0.167 0 0.134 0.0533 0.263 0.149 0.358 0.0955 0.0942 0.224 0.148 0.358 0.148h0.0236c0.141 0 0.277-0.0558 0.376-0.155s0.155-0.234 0.155-0.374v-0.564h2.16v3.09h-1.69v0.744h-2.16v-0.392h-1.87v0.392h-2.16v-0.744h-1.69v-3.09h2.16v0.564c0 0.14 0.0558 0.275 0.155 0.374s0.234 0.155 0.376 0.155h0.0236c0.135 0 0.263-0.0533 0.358-0.148 0.0955-0.0955 0.149-0.224 0.149-0.358 0-0.0632 0.0248-0.123 0.0682-0.167 0.0446-0.0434 0.104-0.0682 0.167-0.0682z"></path>
            <path d="m21.9 189c-0.0632 0-0.123-0.0248-0.167-0.0694-0.0434-0.0434-0.0682-0.103-0.0682-0.166 0-0.134-0.0533-0.263-0.149-0.358-0.0955-0.0955-0.223-0.149-0.358-0.149h-0.0236c-0.141 0-0.277 0.0558-0.376 0.156-0.0992 0.0992-0.155 0.234-0.155 0.374v0.564h-2.16v-3.09h1.69v-0.745h2.16v0.393h1.87v-0.393h2.16v0.745h1.69v3.09h-2.16v-0.564c0-0.14-0.0558-0.275-0.155-0.374-0.0992-0.1-0.234-0.156-0.376-0.156h-0.0236c-0.134 0-0.263 0.0533-0.358 0.149s-0.149 0.224-0.149 0.358c0 0.0632-0.0248 0.123-0.0682 0.166-0.0446 0.0446-0.104 0.0694-0.166 0.0694z"></path>
          </g>
        </g>

        <!-- USB Connection -->
        <path d="m66.4 197 1.06 2.24c0.0651 0.142 0.0731 0.302 0.0207 0.448-0.0525 0.147-0.16 0.266-0.301 0.332-0.14 0.0665-0.302 0.0744-0.448 0.022-0.146-0.0525-0.266-0.16-0.332-0.301l-0.724-1.54-3e-3 0.207c-6e-3 0.488-0.206 0.955-0.556 1.3-0.35 0.342-0.821 0.529-1.31 0.522l-22.2-0.29c-0.489-6e-3 -0.955-0.206-1.3-0.556-0.341-0.35-0.529-0.821-0.522-1.31l3e-3 -0.207-0.764 1.52c-0.0701 0.14-0.192 0.244-0.34 0.292-0.147 0.0486-0.307 0.0365-0.446-0.0336l-1e-3 -1e-5c-0.138-0.0701-0.244-0.192-0.292-0.34-0.0486-0.147-0.0365-0.307 0.0336-0.447l1.11-2.21-0.602-8e-3 0.269-20.6 28.2 0.369-0.269 20.6z" fill="#cecccb" stroke-width="1.26"></path>
        <path d="m60.7 177-0.0236 1.8c-7.9e-4 0.0607 0.0301 0.116 0.0802 0.148 0.522 0.329 3.38 2.12 3.38 2.12l-0.0217 1.66-1.74-0.0227-0.0156 1.19-2.63-0.0344 0.0156-1.19-1.66-0.0217 0.0413-3.16c2e-3 -0.136-0.0496-0.265-0.143-0.361-0.0948-0.096-0.223-0.151-0.357-0.152l-1.58-0.0207-0.0172 1.31-6.46-0.0845 0.0172-1.31-1.58-0.0207c-0.134-2e-3 -0.264 0.0496-0.36 0.143-0.0973 0.0936-0.152 0.221-0.154 0.357l-0.0413 3.16-1.66-0.0217-0.0156 1.19-2.63-0.0344 0.0156-1.19-1.74-0.0228 0.0217-1.66s2.91-1.73 3.43-2.03c0.0522-0.0309 0.0833-0.0848 0.0841-0.146l0.0236-1.8z" fill="#989898" stroke-width="1.26"></path>

        <!-- LEDs -->
        <g stroke-width="1.44">
          <rect x="35" y="108" width="3.83" height="9.3" fill="#e5e5e5"></rect>
          <rect x="35" y="111" width="3.83" height="5.31" fill="#f5ecde"></rect>
          <!--?lit$661416543$-->false

          <rect x="69.5" y="108" width="3.83" height="9.3" fill="#e5e5e5"></rect>
          <rect x="69.5" y="110" width="3.83" height="5.31" fill="#f5ecde"></rect>
          <!--?lit$661416543$-->false
        </g>

        <!-- Small Chip-->
        <rect transform="translate(69,137)" width="13.9" height="3" fill="url(#small-pin-pattern)"></rect>
        <rect transform="translate(82.8,160.5) rotate(180)" width="13.9" height="3" fill="url(#small-pin-pattern)"></rect>
        <rect transform="translate(87.2,142) rotate(90)" width="13.9" height="3" fill="url(#small-pin-pattern)"></rect>
        <rect transform="translate(64,155.8) rotate(270)" width="13.9" height="3" fill="url(#small-pin-pattern)"></rect>
        <rect x="66.9" y="140" width="17.4" height="17.4" fill="#333" stroke-width="1.61"></rect>

        <!-- Texts -->
        <text fill="#ffffff" font-family="sans-serif" font-size="3.72px" transform="rotate(270)">
          <tspan x="-162.21" y="12.285">VIN</tspan>
          <tspan x="-153.37" y="12.317">GND</tspan>
          <tspan x="-143.03" y="12.269">D13</tspan>
          <tspan x="-132.81" y="12.130">D12</tspan>
          <tspan x="-123.10" y="12.514">D14</tspan>
          <tspan x="-113.82" y="12.481">D27</tspan>
          <tspan x="-103.55" y="12.580">D26</tspan>
          <tspan x="-94.204" y="12.509">D25</tspan>
          <tspan x="-84.482" y="12.632">D33</tspan>
          <tspan x="-74.139" y="12.294">D32</tspan>
          <tspan x="-64.263" y="12.750">D35</tspan>
          <tspan x="-54.385" y="12.631">D34</tspan>
          <tspan x="-44.529" y="12.468">VN</tspan>
          <tspan x="-35.205" y="12.546">VP</tspan>
          <tspan x="-25.439" y="12.846">EN</tspan>
          <tspan x="-163.01" y="95.712">3V3</tspan>
          <tspan x="-153.64" y="95.392">GND</tspan>
          <tspan x="-142.86" y="95.431">D15</tspan>
          <tspan x="-131.36" y="95.296">D2</tspan>
          <tspan x="-122.53" y="95.505">D4</tspan>
          <tspan x="-114.75" y="95.613">RX2</tspan>
          <tspan x="-104.84" y="95.442">TX2</tspan>
          <tspan x="-93.899" y="95.430">D5</tspan>
          <tspan x="-85.460" y="95.585">D18</tspan>
          <tspan x="-75.415" y="95.747">D19</tspan>
          <tspan x="-65.796" y="95.687">D21</tspan>
          <tspan x="-55.802" y="95.818">RX0</tspan>
          <tspan x="-45.850" y="95.613">TX0</tspan>
          <tspan x="-36.582" y="96.012">D22</tspan>
          <tspan x="-26.250" y="95.903">D23</tspan>
        </text>
        <text x="30" y="59" fill="#cecccb" font-family="sans-serif" font-size="15px">ESP32</text>

        <!-- Antenna -->
        <path d="m24.3 22.1v-18.8h8v11.5h10.2v-11h8.5v10.5h10v-10.5h17.8v20.2" fill="none" stroke="#4f4c48" stroke-width="1px"></path>
        <path d="m69.7 4.16v19.5" fill="none" stroke="#4f4c48" stroke-width="1px"></path>
               <!-- Botón Configuración -->
      <circle
        cx="10"
        cy="10"
        r="10"
        fill="transparent"
        style="cursor: pointer; pointer-events: auto;"
        ref="configButtonRef"
        @click="handleRotate"
      />
      <text
        x="10"
        y="11"
        text-anchor="middle"
        alignment-baseline="middle"
        font-size="12"
        fill="black"
        style="pointer-events: none;"
      >🔁</text>
      </svg>


  </div>
</template>



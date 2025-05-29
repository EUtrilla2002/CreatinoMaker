<template>
  <svg ref="svgRef" class="connections-lines">
    <path
      v-for="(line, index) in lines"
      :key="index"
      :d="generateCurvePath(line)"
      stroke="black"
      stroke-width="2"
      fill="none"
    />
    <!-- Puntos de control
    <circle
      v-for="(line, index) in lines"
      :key="'cx1-' + index"
      :cx="line.cx1"
      :cy="line.cy1"
      r="6"
      fill="red"
      @mousedown="startDrag(index, 'cx1', 'cy1')"
    />
    <circle
      v-for="(line, index) in lines"
      :key="'cx2-' + index"
      :cx="line.cx2"
      :cy="line.cy2"
      r="6"
      fill="blue"
      @mousedown="startDrag(index, 'cx2', 'cy2')"
    /> -->
    <line
      v-if="tempLine"
      :x1="tempLine.x1"
      :y1="tempLine.y1"
      :x2="tempLine.x2"
      :y2="tempLine.y2"
      stroke="gray"
      stroke-width="1"
      stroke-dasharray="5,5"
    />
  </svg>
  <p v-if="tempLine" style="position: absolute; color: red;">
    Línea temporal: ({{ tempLine.x1 }}, {{ tempLine.y1 }}) → ({{ tempLine.x2 }}, {{ tempLine.y2 }})
  </p>
</template>

<script>
export default {
  name: 'ConnectionsLines',
  props: {
    lines: {
      type: Array,
      required: true
    },
    tempLine: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dragging: null // { index, controlXKey, controlYKey }
    }
  },
  methods: {
    generateCurvePath({ x1, y1, x2, y2, cx1, cy1, cx2, cy2 }) {
      return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
    },
     startDrag(index, controlXKey, controlYKey) {
    this.dragging = { index, controlXKey, controlYKey };
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.stopDrag);
  },
  }
}
</script>

<style scoped>
.connections-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>

<template>
  <svg ref="svgRef" class="connections-lines">
    <line
      v-for="(line, index) in lines"
      :key="index"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="black"
      stroke-width="2"
    />
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

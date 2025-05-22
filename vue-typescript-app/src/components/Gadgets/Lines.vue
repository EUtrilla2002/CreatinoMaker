<template>
  <svg ref="svgRef" class="connections-lines">
    <line
      v-for="(line, index) in lines"
      :key="index"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="green"
      stroke-width="3"
    />
  </svg>
</template>

<script>
export default {
  name: 'ConnectionsLines',
  props: {
    connections: {
      type: Array,
      required: true
    },
    svgRef: {
      type: Object,
      required: true
    },
    positions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      lines: []
    }
  },
  mounted() {
    this.drawConnections();
  },
  watch: {
    connections: {
      handler() {
        this.drawConnections();
      },
      deep: true
    }
  },
  methods: {
    drawConnections() {
      if (!this.svgRef || !this.svgRef.$el) return;
      const svgElement = this.svgRef.$el || this.svgRef;
      const ledOffsetX = this.positions.led.x;
      const ledOffsetY = this.positions.led.y;
      const ledPinPos = {
        left: { x: 45, y: 40 },
        right: { x: 60, y: 40 }
      };

      this.lines = this.connections.map(({ pinName, ledPin }) => {
        const pinEl = svgElement.querySelector(`#${pinName}`);
        if (!pinEl) return null;
        const pinRect = pinEl.getBoundingClientRect();
        const svgRect = svgElement.getBoundingClientRect();

        const x1 = pinRect.left - svgRect.left + pinRect.width / 2;
        const y1 = pinRect.top - svgRect.top + pinRect.height / 2;
        const x2 = ledOffsetX + ledPinPos[ledPin].x;
        const y2 = ledOffsetY + ledPinPos[ledPin].y;

        return { x1, y1, x2, y2 };
      }).filter(Boolean);
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
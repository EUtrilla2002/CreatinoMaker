<template>
  <svg ref="svgRef" class="connections-lines">
    <line
    v-for="(conn, index) in connections"
    :key="index"
    :x1="conn.x1"
    :y1="conn.y1"
    :x2="conn.x2"
    :y2="conn.y2"
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
  tempLine: {
    type: Object,
    required: false
  },
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
    },
    selectedPin: {
      type: Object,
      required: false
    },
    workspaceRef: {
      type: Object,
      required: true
    },
    tempLine: {
      type: Object,
      default: null
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
      console.log('Drawing connections:', this.connections);

      this.lines = this.connections.map((conn, i) => {
        console.log(`Connection ${i}:`, conn);

        // Verifica que los datos de la conexión sean válidos
        if (!conn.selectedPin || !conn.ledPin) {
          console.warn(`Invalid connection data at index ${i}:`, conn);
          return null;
        }
        console.log(conn.selectedPin);

        const ledOffsetX = conn.ledPin.position.x;
        const ledOffsetY = conn.ledPin.position.y;
        const ledPinPos = {
          left: { x: 45, y: 40 },
          right: { x: 60, y: 40 }
        };

        const x1 = conn.selectedPin.position.x;
        const y1 = conn.selectedPin.position.y;
        const x2 = ledOffsetX + ledPinPos[conn.ledPin.side].x;
        const y2 = ledOffsetY + ledPinPos[conn.ledPin.side].y;

        return { x1, y1, x2, y2 };
      }).filter(Boolean);

      console.log('Lines drawn:', this.lines);
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
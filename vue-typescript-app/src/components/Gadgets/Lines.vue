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
    tempLine: {
      type: Object,
      default: null
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
    workspaceRef: {
      type: Object,
      required: true
    }
  },
  computed: {
    lines() {
      return this.connections.map(({ fromPinId, toPinId }, index) => {
        console.log(`Conexión ${index}:`, { fromPinId, toPinId });
        console.log(`Posiciones:`, this.positions[1]);
        //const fromPos = this.positions[fromPinId];
        const fromPos = this.positions[0].position;
        //const toPos = this.positions[toPinId];
        const toPos = this.positions[1].position;
        // Si el id tiene formato led-xxxx-xxxx-left/right, separamos el lado
        let side = null;
        if (typeof toPinId === 'string' && toPinId.startsWith('led-')) {
          const parts = toPinId.split('-');
          if (parts.length >= 4 && (parts[3] === 'left' || parts[3] === 'right')) {
            side = parts[3];
          }
        }

        if (!fromPos || !toPos) {
          console.warn(`Conexión ${index} omitida: faltan posiciones para`, { fromPinId, toPinId });
          return null;
        }
        const ledPinPos = {
          left: { x: 45, y: 40 },
          right: { x: 60, y: 40 }
        };
        return {
          x1: fromPos.x,
          y1: fromPos.y,
          x2: toPos.x + ledPinPos[side].x,
          y2: toPos.y + ledPinPos[side].y
        };
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

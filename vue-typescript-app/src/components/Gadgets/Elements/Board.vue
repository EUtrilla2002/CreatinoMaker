<template>
  <div class="board">
    <svg ref="svgRef" width="100%" height="100%">
      <g id="g147">
        <slot></slot>
      </g>
    </svg>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Board',
  setup() {
    const svgRef = ref(null);

    onMounted(() => {
      // Additional setup can be done here if needed
    });

    return {
      svgRef,
    };
  },
};
</script>

<style scoped>
.board {
  border: 2px solid #ccc;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
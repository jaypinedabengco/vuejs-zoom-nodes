<template lang="pug">
  div
    transition(name="fade" mode="out-in")
      component(:is="getSelectedComponent")

    button(@click="onClickChangeButton") {{changeButtonLabel}}
</template>

<script>
import ZoomNode from "@/components/ZoomNode/ZoomNode";
import Node from "@/components/ZoomNode/Node";
export default {
  name: "Home",
  components: {
    "zoom-node": ZoomNode,
    node: Node
  },
  data() {
    return {
      selected: "zoom-node"
    };
  },
  methods: {
    onClickChangeButton() {
      this.selected = this.selected === "zoom-node" ? "node" : "zoom-node";
    }
  },
  computed: {
    getSelectedComponent() {
      return this.selected;
    },
    changeButtonLabel() {
      return this.selected === "zoom-node" ? "node" : "zoom-node";
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
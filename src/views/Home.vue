<template lang="pug">
  div
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

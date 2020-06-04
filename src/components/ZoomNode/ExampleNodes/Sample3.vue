<template lang="pug">
  z-node(label="Sample 2")
    template(v-slot:content)
      select(v-model="mixinsVModel" @change="applyChange")
        option(value="volvo") Volvo
        option(value="saab") Saab
        option(value="mercedes") Mercedes
        option(value="audi") Audi
</template>

<script>
import Node from "@/components/ZoomNode/Node";
import NodeMixins from "@/components/ZoomNode/mixins/node-mixins";

export default {
  name: "sample-two",
  mixins: [NodeMixins],
  components: {
    node: Node
  },
  data() {
    return {};
  }
};
</script>
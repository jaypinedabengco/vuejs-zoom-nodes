<template lang="pug">
	z-node(label="Sample 2")
		template(v-slot:content)
			input(v-model="mixinsVModel" @change="applyChange")
			button(@click="next") customNext
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
<template lang="pug">
	z-node(label="Sample 1")
		template(v-slot:content)
			input(v-model="mixinsVModel" @change="applyChange")
</template>

<script>
import Node from "@/components/ZoomNode/Node";
import NodeMixins from "@/components/ZoomNode/mixins/node-mixins";

export default {
  name: "sample-one",
  mixins: [NodeMixins],
  components: {
    node: Node
  },
  mounted() {
    console.log('ellox');
  },
  data() {
    return {};
  }
};
</script>
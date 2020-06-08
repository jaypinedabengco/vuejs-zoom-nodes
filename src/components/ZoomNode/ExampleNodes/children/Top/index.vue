<template lang="pug">
	node(:angle="12", label="Top", :child-nodes="[$options.components.TopChild, $options.components.LeftChild]")
</template>

<script>
import Node from "@/components/ZoomNode/Node";
import TopChild from "@/components/ZoomNode/ExampleNodes/children/Top/children/TopChild";
import LeftChild from "@/components/ZoomNode/ExampleNodes/children/Top/children/LeftChild";

export default {
  components: {
    node: Node,
    TopChild,
    LeftChild
  }
};
</script>
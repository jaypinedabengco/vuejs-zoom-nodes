<template lang="pug">
	node(:angle="0", label="Top Child")
</template>

<script>
import Node from "@/components/ZoomNode/Node";

export default {
  components: {
    node: Node
  }
};
</script>
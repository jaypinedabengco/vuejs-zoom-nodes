<template lang="pug">
	div
		h1 Node
		h4 Label {{label}}
		h3 add slot here
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false
    },
  },
  mounted() {
    // console.log("ey!");
    // console.log(this.childNodes);
  }
};
</script>
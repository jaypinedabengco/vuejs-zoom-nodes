<template lang="pug">
	div
		h4 Label {{label}}
		div.content
			slot(name="content")
				| No Content			
</template>

<script>
export default {
  props: {
    value: {
      required: false
    },
    label: {
      type: String,
      required: false
    }
  },
  mounted() {
    // console.log("ey!");
    // console.log(this.childNodes);
  }
};
</script>
<template lang="pug">
	div
		div.content
			h1 {{label}}
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
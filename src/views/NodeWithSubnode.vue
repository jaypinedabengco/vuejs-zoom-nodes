<template lang="pug">
	div
		h2 {{data}}
		hr
		h1 Test
		z-zoom-node(:structure="structure")
			template(v-slot:selectedNode="{selectedNodeDetails, componentName, value}")
				keep-alive
					component(:is="componentName", v-model="data[componentName]")

</template>

<script>
import Sample1 from "@/components/ZoomNode/ExampleNodes/Sample1";
import Sample2 from "@/components/ZoomNode/ExampleNodes/Sample2";
import Sample3 from "@/components/ZoomNode/ExampleNodes/Sample3";
import Sample3Child from "@/components/ZoomNode/ExampleNodes/Sample3Child";

export default {
  components: {
    "sample-one": Sample1,
    "sample-two": Sample2,
    "sample-three": Sample3,
    "sample-three-child": Sample3Child
  },
  data() {
    return {
      sample: "",
      data: {
        "sample-three": "mercedes"
      },
      structure: {
        component: "sample-one",
        label: "Sample One",
        angle: 0,
        children: [
          {
            component: "sample-two",
            label: "Sample Two",
            angle: 0,
            preview_style: {
              background: "blue"
            },
            dot_style: {
              background: "blue"
            },
            selected_view_style: {
              background: "blue"
            }
          },
          {
            component: "sample-three",
            label: "Sample Three",
            angle: 60,
            children: [
              {
                label: "Sample Three Child 3",
                angle: 90,
                component: "sample-three-child",
                preview_style: {
                  background: "yellow"
                },
                dot_style: {
                  background: "yellow"
                },
                selected_view_style: {
                  background: "yellow"
                }
              }
            ]
          }
        ]
      }
    };
  }
};
</script>

<style scoped>
</style>
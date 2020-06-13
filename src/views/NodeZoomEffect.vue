<template lang="pug">
	div
		h2 {{data}}
		hr
		z-zoom-node(ref="zoomNode" :structure="structure")
			template(v-slot:selectedNode="{selectedNodeDetails, componentName}")
				keep-alive
					component(
						:zoomNode="$refs.zoomNode",
						:structureDetail="selectedNodeDetails",
						:is="componentName", 
						v-model="data[componentName]")

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
        id: 1,
        component: "sample-one",
        label: "Sample One",
        angle: 0,
        children: [
          {
            id: 2,
            component: "sample-two",
			label: "Sample Two",
			next: {
				id: 3
			},
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
            id: 3,
            component: "sample-three",
            label: "Sample Three",
            angle: 60,
            preview_style: {
              background: "red"
            },
            dot_style: {
              background: "red"
            },
            selected_view_style: {
              background: "red"
            },
            children: [
              {
                id: 4,
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
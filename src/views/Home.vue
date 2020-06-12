<template lang="pug">
	div
		h2 {{data}}
		hr
		z-zoom-node(:structure="structure")
			template(v-slot:selectedNode="{selectedNodeDetails, componentName, value}")
				keep-alive
					component(:is="componentName", v-model="data[componentName]")

</template>

<script>
import Sample1 from "@/components/ZoomNode/ExampleNodes/Sample1";
import Sample2 from "@/components/ZoomNode/ExampleNodes/Sample2";
import Sample3 from "@/components/ZoomNode/ExampleNodes/Sample3";
import Sample4 from "@/components/ZoomNode/ExampleNodes/Sample3Child";

export default {
  components: {
    "sample-one": Sample1,
    "sample-two": Sample2,
    "sample-three": Sample3,
    "sample-four": Sample4,
    "sample-five": Sample1,
    "sample-six": Sample3
  },
  data() {
    return {
      data: {
        "sample-three": "mercedes",
        "sample-six": "volvo"
      },
      structure: {
        component: "sample-one",
        label: "Sample One",
        angle: 0,
        preview_style: {
          background: "red"
        },
        selected_view_style: {
          background: "red"
        },
        children: [
          {
            component: "sample-two",
            label: "Sample Two",
            angle: 60,
            preview_style: {
              background: "blue"
            },
            dot_style: {
              background: "blue"
            },
            selected_view_style: {
              background: "blue"
            },
            children: [
              {
                component: "sample-four",
                label: "Sample Four",
                angle: 20
              }
            ]
          },
          {
            component: "sample-three",
            label: "Sample Three X",
            angle: 175,
            children: [
              {
                label: "Sample Three Child 1",
                angle: 175,
                component: "sample-five",
                preview_style: {
                  background: "yellow"
                },
                dot_style: {
                  background: "yellow"
                },
                selected_view_style: {
                  background: "yellow"
                }
              },
              {
                label: "Sample Three Child 2",
                angle: 259,
                component: "sample-six",
                preview_style: {
                  background: "pink"
                },
                selected_view_style: {
                  background: "pink"
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
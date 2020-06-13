<template lang="pug">
	div
		h2 {{data}}
		div
			label Zoom IN Speed 
			input(v-model="zoomInAnimation", type="number")
			label &nbsp; in Milliseconds
		div
			label Zoom OUT Speed 
			input(v-model="zoomOutAnimation", type="number")
			label &nbsp; in Milliseconds			
		hr
		z-zoom-node(ref="zoomNode" :structure="structure", :animationTransitionZoomIn="zoomInAnimationInNumber", :animationTransitionZoomOut="zoomOutAnimationInNumber")
			template(v-slot:selectedNode="{selectedNodeDetails, componentName, value}")
				keep-alive
					component(
						:zoomNode="$refs.zoomNode",
						:structureDetail="selectedNodeDetails",
						:is="componentName", 
						v-model="data[componentName]")
			//- template(v-slot:nextButton)
			//- 	| Overwrite!

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
  mounted() {
    console.log(this.$refs);
  },
  data() {
    return {
      zoomInAnimation: 500,
      zoomOutAnimation: 500,
      data: {
        "sample-three": "mercedes",
        "sample-six": "volvo"
      },
      structure: {
        id: 1,
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
            id: 2,
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
            next: {
              id: 6
            },
            children: [
              {
                id: 3,
                component: "sample-four",
                label: "Sample Four",
                angle: 20
              }
            ]
          },
          {
            id: 6,
            component: "sample-three",
            label: "Sample Three X",
            angle: 175,
            next: {
              id: 2
            },
            children: [
              {
                id: 4,
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
                id: 5,
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
  },
  computed: {
    zoomInAnimationInNumber() {
      return parseInt(this.zoomInAnimation);
    },
    zoomOutAnimationInNumber() {
      return parseInt(this.zoomOutAnimation);
    }
  }
};
</script>

<style scoped>
</style>
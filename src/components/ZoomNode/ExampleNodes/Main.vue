<template lang="pug">
	div
		div.container(@click="back")
			div.main-circle(ref="mainCircleRef", 
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false", 
				:style="setViewStyle(getSelectedComponentDetails)")
				component(:is="getSelectedComponent" v-model="nodeData" @change="checkIfChanged")
				//- Sub circle & circle within them
				//- This should be a component?
				div.sub-circle-container(
					v-for="(node, i) in getSelectedComponentDetails.children", :key="i", 
					@click="selected = node.component", 
					:style="setChildCoordinateViaStyle(node)" )
					div.sub-circle(:style="setChildSubCircleCoordinateViaStyle(node)") 
						| {{node.label}}
						//- Build Preview of child
						div.circle-grandchild-preview-container(
								v-if="node.children" v-for="(node_child, j) in node.children", 
								:style="{transform: `translate(-50%, -50%) rotate(${node_child.angle}deg)`}")
							div.circle-grandchild(:style="setGranChildCircleStyle(node_child)")
						
			//- div.sub-circle
			//- 	div Label
			//- 		pre
			//- div.sub-circle
			//- 	div Label 2
			//- div.sub-circle
			//- 	div Label 3									
		div.review
			hr
			div.selection-container
				ul
					li(v-for="(node, i) in getSelectedComponentDetails.children" :key="i", @click="selected = node.component") 
						| {{node.label}} - {{node.children && node.children.length ? `(${node.children.length}) child`: `no child`}}
				button(v-if="getSelectedParentComponentDetails", @click="selected = getSelectedParentComponentDetails.component") Go Back		
			hr
			h3 Component Names
			pre
				| {{getAllComponentNames}}
			hr
			h3 Data		
			pre
				| {{data}}												
			hr
			h3 Target
			pre
				| {{getSelectedComponentDetails}}
			hr
			h3 Parent
			pre
				| {{getSelectedParentComponentDetails}}
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
      selected: "sample-one",
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
      },
      data: {},
      mainCircleElementReference: null,
      disableBack: false
    };
  },
  created() {
    this.getAllComponentNames.forEach(key => {
      this.$set(this.data, key, null);
    });
  },
  mounted() {
    //   https://stackoverflow.com/questions/43531755/using-refs-in-a-computed-property
    this.mainCircleElementReference = this.$refs.mainCircleRef;
  },
  methods: {
    back() {
      if (!this.disableBack && this.getSelectedParentComponentDetails) {
        this.selected = this.getSelectedParentComponentDetails.component;
      }
    },
    setViewStyle(node) {
      const { selected_view_style = {} } = node;
      const styleCoordinates = {
        ...selected_view_style
      };
      return styleCoordinates;
    },
    setChildCoordinateViaStyle(node) {
      const { angle, selected_style = {} } = node;
      const transform = `translate(-50%, -50%) rotate(${angle}deg)`;

      const styleCoordinates = {
        transform,
        ...selected_style
      };
      return styleCoordinates;
    },
    setChildSubCircleCoordinateViaStyle(node) {
      const { angle, preview_style } = node;
      const transform = `rotate(${-angle}deg)`;
      const styleCoordinates = {
        transform,
        ...preview_style
      };
      return styleCoordinates;
    },
    setGranChildCircleStyle(node) {
      const { dot_style = {} } = node;
      const styleCoordinates = {
        ...dot_style
      };
      return styleCoordinates;
    },
    checkIfChanged() {
      console.log("changed!");
    }
  },
  computed: {
    nodeData: {
      get() {
        const selectedComponent = this.getSelectedComponent;
        return this.data[selectedComponent];
      },
      set(value) {
        const selectedComponent = this.getSelectedComponent;
        this.data[selectedComponent] = value;
      }
    },
    getSelectedComponent() {
      return this.selected;
    },
    getSelectedComponentDetails() {
      let result_container = null;
      const recursiveChecker = (component_name, children) => {
        if (!result_container && children instanceof Array) {
          const component = children.filter(({ component }) => {
            return component === component_name;
          })[0];
          if (component) {
            result_container = component;
            return;
            // check children
          } else {
            children.forEach(component =>
              recursiveChecker(
                component_name,
                component.children,
                result_container
              )
            );
          }
        }
      };

      recursiveChecker(this.selected, [this.structure]);
      return result_container;
    },

    getSelectedParentComponentDetails() {
      let result_container = null;
      const recursiveChecker = (component_name, children) => {
        if (!result_container && children instanceof Array) {
          // check if 1st degree child has target-component
          const found = children.filter(component => {
            return (
              component.children &&
              component.children.filter(
                ({ component: child_component_name }) =>
                  child_component_name === component_name
              ).length
            );
          })[0];
          if (found) {
            result_container = found;
            return;
          } else {
            children.forEach(component =>
              recursiveChecker(component_name, component.children)
            );
          }
        }
      };

      recursiveChecker(this.selected, [this.structure]);
      return result_container;
    },

    getAllComponentNames() {
      const result_container = [];
      const getComponentNames = components => {
        if (components instanceof Array) {
          const extracted_names = components.map(({ component }) => component);
          result_container.push(...extracted_names);
          components.forEach(component =>
            getComponentNames(component.children, result_container)
          );
        }
      };
      getComponentNames([this.structure]);
      return result_container;
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
}
.main-circle {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 3px solid #a78686;
  margin: 0 auto;
}

.sub-circle-container {
  position: absolute;
  width: 170%;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sub-circle {
  float: right;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #a78686;
}

.circle-grandchild-preview-container {
  position: absolute;
  width: 150%;
  height: 10px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.circle-grandchild {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  border: 3px solid #a78686;
  float: right;
}

.selection-container {
  width: 300px;
  margin: auto;
}
pre {
  text-align: left;
  width: 500px;
  margin: auto;
}
</style>
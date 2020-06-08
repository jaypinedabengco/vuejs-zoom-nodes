<template lang="pug">
	div
		div.container(@click="back")
			div.main-circle(ref="mainCircleRef", 
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false", 
				:style="setViewStyle(getSelectedComponentDetails)")
				//- https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
				slot(
					name="selectedNode",  
					:selectedNodeDetails="getSelectedComponentDetails", 
					:componentName="getSelectedComponentDetails.component")
					| 'selectedNode' Slot not used. Selected Node is {{getSelectedComponentDetails.node}}
				//- keep-alive
				//- 	component(:is="getSelectedComponent" v-model="nodeData" @change="checkIfChanged")
				//- Sub circle & circle within them
				//- This should be a component?
				div.sub-circle-container(v-for="(node, i) in getSelectedComponentDetails.children", :key="i", :style="setChildCoordinateViaStyle(node)")
					div.sub-circle(:style="setChildSubCircleCoordinateViaStyle(node)", @click="selected = node.component") 
						p {{node.label}}
						//- Build Preview of child
						div.circle-grandchild-preview-container(
								v-if="node.children" v-for="(node_child, j) in node.children", 
								:style="{transform: `translate(-50%, -50%) rotate(${node_child.angle}deg)`}")
							div.circle-grandchild(:style="setGrandChildCircleStyle(node_child)")
		div.review
			//- hr
			//- div.selection-container
			//- 	ul
			//- 		li(v-for="(node, i) in getSelectedComponentDetails.children" :key="i", @click="selected = node.component") 
			//- 			| {{node.label}} - {{node.children && node.children.length ? `(${node.children.length}) child`: `no child`}}
			//- 	button(v-if="getSelectedParentComponentDetails", @click="selected = getSelectedParentComponentDetails.component") Go Back		
			hr
			h3 Component Names
			pre
				| {{getAllComponentNames}}
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
export default {
  props: {
    // value: {
    //   requred: true
    // },
    structure: {
      type: Object,
      required: true
    }
  },
  components: {},
  created() {
    // set base component as selected
    this.selected = this.structure.component;

    // add sent value to component
    // this.data = { ...this.value };

    // auto generate if field does not exist.
    // this.getAllComponentNames.forEach(key => {
    //   if (!this.data[key]) {
    //     this.$set(this.data, key, null);
    //   }
    // });
  },
  mounted() {},
  data() {
    return {
      selected: "",
      //   data: {},
      disableBack: false
    };
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
    setGrandChildCircleStyle(node) {
      const { dot_style = {} } = node;
      const styleCoordinates = {
        ...dot_style
      };
      console.log({ styleCoordinates });
      return styleCoordinates;
    },
    checkIfChanged() {
      console.log("changed!");
    }
  },
  computed: {
    // nodeData: {
    //   get() {
    //     console.log("hey!");
    //     const selectedComponent = this.getSelectedComponent;
    //     return this.data[selectedComponent];
    //   },
    //   set(value) {
    //     console.log("ho");
    //     const selectedComponent = this.getSelectedComponent;
    //     this.data[selectedComponent] = value;
    //   }
    // },
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
  z-index: 20;
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 3px solid #d4cdcd;
  margin: 0 auto;

  background-color: #e6e3e3;
}

.sub-circle-container {
  z-index: -1;
  position: absolute;
  width: 170%;
  height: 120px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sub-circle {
  z-index: 10000;
  float: right;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #d4cdcd;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Set base design */
  background-color: #e6e3e3;
  font-weight: bold;
  color: #000;
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
  background-color: #e6e3e3;
  border-radius: 50%;
  border: 2px solid #d4cdcd;
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
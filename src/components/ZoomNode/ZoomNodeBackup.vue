<template lang="pug">
	div.wrapper(@click="back", :class="{'back-is-valid' : allowBack}")
		div.container
			div.main-circle-container(ref="mainCircleRef",
				:class="{'circle-transition-in': !!selectedSubChildForIn, 'circle-transition-out': !!selectedSubChildForOut }"
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false")
				//- https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
				div.main-circle(
					:style="setViewStyle(getSelectedComponentDetails)", 
					:class="{...mainCircleFocusClass}")
					slot(
						name="selectedNode",  
						:selectedNodeDetails="getSelectedComponentDetails", 
						:componentName="getSelectedComponentDetails.component",
						:selectedNodeParentDetails="getSelectedParentComponentDetails")
						| 'selectedNode' Slot not used. Selected Node Component is {{getSelectedComponentDetails.component}}
				div.sub-circle-container(
						v-for="(node, i) in getSelectedComponentDetails.children", 
						:key="i", 
						:style="setChildCoordinateViaStyle(node)")
					div.sub-circle(
						@mouseover="disableBack = true",
						:style="setChildSubCircleCoordinateViaStyle(node)", 
						:class="{'selected-focus-in-circle' : node.component == selectedSubChildForIn, 'selected-focus-out-circle': node.component == selectedSubChildForOut}"
						@click="onClickChildNode(node)") 
						p {{node.label}}
						//- Build Preview of child
						div.circle-grandchild-preview-container(
								v-if="node.children" v-for="(node_child, j) in node.children", 
								:style="{transform: `translate(-50%, -50%) rotate(${node_child.angle}deg)`}")
							div.circle-grandchild(:style="setGrandChildCircleStyle(node_child)")
		div.review(v-if="showDebugUI")
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
    showDebugUI: {
      requred: false,
      default: false
    },
    mainCircleAnimation: {
      type: String,
      default: "ZOOM"
    },
    structure: {
      type: Object,
      // TODO: ADD validation of structures
      required: true
    }
  },
  components: {},
  created() {
    // set base component as selected
    // TODO: Maybe add concept of adding 'UNIQUE' id on structures
    this.selected = this.structure.component;
  },
  mounted() {},
  data() {
    return {
      selected: "",
      selectedSubChildForIn: "",
      selectedSubChildForOut: "",
      disableBack: false,
      transitionOngoing: false
    };
  },
  methods: {
    onClickChildNode(node) {
      if (this.transitionOngoing) {
        return;
      }
      this.selectedSubChildForIn = node.component;
      this.disableBack = true;

      this.transitionOngoing = true;
      setTimeout(() => {
        this.selected = node.component;
        this.selectedSubChildForIn = null;
        this.transitionOngoing = false;
        setTimeout(() => {
          this.disableBack = false;
        }, 100);
      }, 300);
    },
    back() {
      if (this.transitionOngoing) {
        return;
      }

      if (!this.disableBack && !!this.getSelectedParentComponentDetails) {
        this.transitionOngoing = true;
        this.selectedSubChildForOut = this.getSelectedComponentDetails.component;
        this.selected = this.getSelectedParentComponentDetails.component;
        setTimeout(() => {
          this.transitionOngoing = false;
          this.selectedSubChildForOut = null;
        }, 300);
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
      return styleCoordinates;
    }
  },
  computed: {
    mainCircleFocusClass() {
      // main-circle-zoom-out
      // main-circle-focus-in
      let zoomInClass = "main-circle-zoom-in";
      let zoomOutClass = "main-circle-zoom-out";

      switch (this.mainCircleAnimation) {
        case "ZOOM":
          zoomInClass = "main-circle-zoom-in";
          zoomOutClass = "main-circle-zoom-out";
          break;
        case "STACK":
          zoomInClass = "main-circle-focus-in";
          zoomOutClass = "main-circle-focus-out";
          break;
        default:
      }

      const classes = {};
      classes[zoomInClass] = !!this.selectedSubChildForOut;
      classes[zoomOutClass] = !!this.selectedSubChildForIn;
      return classes;
    },
    getSelectedComponent() {
      return this.selected;
    },
    allowBack() {
      return !this.disableBack && !!this.getSelectedParentComponentDetails;
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
  /* padding: 10% 0;
  width: 100%; */
}

.wrapper {
  position: relative;
  padding: 10% 0;
}

.wrapper.back-is-valid {
  cursor: zoom-out;
}

.main-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 3px solid #d4cdcd;
  margin: 0 auto;

  background-color: #e6e3e3;
}

.main-circle-container {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  left: 50%;
  transform: translate(-50%);
  background-color: rgba(255, 255, 255, 0);
}

.sub-circle-container {
  cursor: zoom-in;
  visibility: hidden;
  position: absolute;
  width: 170%;
  /* height: 120px; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sub-circle {
  /* z-index: 10000; */
  visibility: visible;
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

.selected-focus-in-circle {
  position: relative;
  border-width: 0;
  animation: focusInCircleAnimation 0.4s ease-out;
}

.selected-focus-out-circle {
  position: relative;
  border-width: 0;
  animation: focusOutCircleAnimation 0.3s ease-out;
}

.selected-focus-in-circle > *,
.selected-focus-out-circle > * {
  display: none;
}

.main-circle-focus-out {
  position: fixed;
  animation: focusOutMainCircleAnimation 0.5s;
}

.main-circle-focus-in {
  position: fixed;
  animation: focusInMainCircleAnimation 0.5s;
  animation-direction: normal;
}

.main-circle-zoom-out {
  position: fixed;
  animation: zoomOutMainCircleAnimation 0.5s;
}

.main-circle-zoom-in {
  position: fixed;
  animation: zoomInMainCircleAnimation 0.5s;
  animation-direction: normal;
}

.main-circle.main-circle-focus-out .content,
.main-circle.main-circle-focus-in .content {
  display: none !important;
}

@keyframes focusInCircleAnimation {
  0% {
    right: 0%;
  }
  100% {
    right: 40%;
    transform: scale(4);
  }
}

@keyframes focusOutCircleAnimation {
  0% {
    right: 40%;
    transform: scale(4);
  }
  100% {
    right: 0%;
  }
}

@keyframes focusOutMainCircleAnimation {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.1);
  }
}

@keyframes focusInMainCircleAnimation {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOutMainCircleAnimation {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(4);
  }
}

@keyframes zoomInMainCircleAnimation {
  0% {
    opacity: 0;
    transform: scale(4);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
<template lang="pug">
	div.wrapper(@click="back", :class="{'back-is-valid' : allowBack, 'animation-on-going': animationOngoing}")
		div.container
			div.main-circle-container(
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false")
				//- https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
				div.main-circle(
					:style="setViewStyle(getSelectedComponentDetails)")
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
						:style="{...setChildSubCircleCoordinateViaStyle(node)}", 
						:class="{...setChildSubCircleClass(node)}"
						@click="onClickChildNode(node)") 
						p {{node.label}}
						//- Build Preview of child
						div.circle-grandchild-preview-container(
								v-if="node.children" v-for="(node_child, j) in node.children", 
								:style="{transform: `translate(-50%, -50%) rotate(${node_child.angle}deg)`}")
							div.circle-grandchild(:style="setGrandChildCircleStyle(node_child)")
			div.previous-main-circle-preview(v-if="showMainCirclePreview" :style="{...mainCirclePreviewPositionBySelectedNode}")
				//- Use Parent details, as that is the previous selected.
				div.main-circle(
					:style="{...mainCirclePreviewCircleStyle}"
					:class="{...previewCircleClass}")
</template>

<script>
/**
 * NOTE: I find the solution, the animation in particular as Messy :(.
 * Find a way to improve on this, as this will create a nightmare for future developers
 * when doing debug or additional features. - Jay
 */
export default {
  props: {
    structure: {
      /**
       * - component : (String)
       * - label: (String)
       * - angle: (Number)
       * - preview_style: (Object)
       * - selected_view_style: (Object)
       * - dot_style: (Object)
       */
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
  /****************************************************************
   *
   * Data
   *
   *****************************************************************/
  data() {
    return {
      selected: null,
      animationOngoing: false,
      animationTransitionZoomIn: 600, // ms
      animationTransitionZoomOut: 600, // ms
      animationZoomIn: true,
      animationSelectedComponent: null,
      //   selectedSubChildComponentForIn: null,
      //   selectedSubChildComponentForOut: null,
      disableBack: false
    };
  },
  /****************************************************************
   *
   * Methods
   *
   *****************************************************************/
  methods: {
    setChildSubCircleClass(node) {
      // if animation not ongoing, then disable classes
      if (!this.animationOngoing) {
        return {};
      }

      if (node.component === this.animationSelectedComponent) {
        return {
          "animate-selected-focus-in-circle": !!this.animationZoomIn,
          "animate-selected-focus-out-circle": !this.animationZoomIn
        };
      }
      return {};
    },
    onClickChildNode(node) {
      // if animation ongoing then do nothing
      if (this.animationOngoing) {
        return;
      }
      this.disableBack = true;
      this.animationOngoing = true;
      this.animationZoomIn = true;

      // Find a way to not use Timeout
      this.animationSelectedComponent = node.component;
      setTimeout(() => {
        // set actual selected
        this.selected = node.component;

        // cleanup
        this.animationOngoing = false;
        this.disableBack = false;
      }, this.animationTransitionZoomIn);
    },
    back() {
      // if animation ongoing then do nothing
      if (this.animationOngoing) {
        return;
      }

      if (this.allowBack) {
        this.disableBack = true;
        this.animationOngoing = true;

        this.selected = this.getSelectedParentComponentDetails.component;
        this.animationZoomIn = false; // zoomOut

        setTimeout(() => {
          // set actual selected
          this.animationSelectedComponent = this.selected;

          // cleanup
          this.animationOngoing = false;
          this.disableBack = false;
        }, this.animationTransitionZoomIn);
        // }, 50);
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
    },
    /**
     *
     */
    getComponentDetailsFromStructure(component_name, structure) {
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

      recursiveChecker(component_name, [structure]);
      return result_container;
    },
    getComponentParentDetailsFromStructure(component_name, structure) {
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

      recursiveChecker(component_name, [structure]);
      return result_container;
    }
  },
  /****************************************************************
   *
   * Computed
   *
   *****************************************************************/
  computed: {
    previewCircleClass() {
      const classes = {
        "animate-previous-circle-zoom-out": false,
        "animate-previous-circle-zoom-in": false,
        "zoomed-out": false
      };
      if (this.animationOngoing && this.animationSelectedComponent) {
        classes["animate-previous-circle-zoom-out"] = !!this.animationZoomIn;
        classes["animate-previous-circle-zoom-in"] = !this.animationZoomIn;
      }

      // if has parent, then apply position part
      if (!this.animationOngoing && this.getSelectedParentComponentDetails) {
        classes["zoomed-out"] = true;
      }

      return classes;
    },
    showMainCirclePreview() {
      // main circle is show if has a parent.
      return this.animationOngoing || !!this.getSelectedParentComponentDetails;
    },
    mainCirclePreviewPositionBySelectedNode() {
      const style = {};

      const selectedComponentDetails = this.getComponentDetailsFromStructure(
        this.animationSelectedComponent,
        this.structure
      );
      if (selectedComponentDetails) {
        //   transform:"translate(-50%) rotate(130deg)"
        const BASE_DEGREE_ADJUSMENT = 130; // got this from trial & error, need to research more on how to get proper value.
        const { angle } = selectedComponentDetails;

        // build transform
        style["transform"] = `rotate(${angle + BASE_DEGREE_ADJUSMENT}deg)`;
      }

      return style;
    },
    mainCirclePreviewCircleStyle() {
      let componentForPreview = this.getComponentParentDetailsFromStructure(
        this.animationSelectedComponent,
        this.structure
      );

      // build
      if (componentForPreview) {
        const { selected_view_style = {} } = componentForPreview;
        return selected_view_style;
      }
      return {};
    },
    getSelectedComponent() {
      return this.selected;
    },
    allowBack() {
      return !this.disableBack && !!this.getSelectedParentComponentDetails;
    },
    /**
     * Get selected component details from the 'structure'
     * via the 'selected' data variable.
     */
    getSelectedComponentDetails() {
      const result = this.getComponentDetailsFromStructure(
        this.selected,
        this.structure
      );
      return result;
    },

    /**
     * Get Currently 'selected' component from the 'structure' data parent.
     * Parent is the 1 level up ^ from current from 'structure'.
     */
    getSelectedParentComponentDetails() {
      return this.getComponentParentDetailsFromStructure(
        this.selected,
        this.structure
      );
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
  overflow: hidden;
}

.wrapper.back-is-valid {
  cursor: zoom-out;
}

/**
	Main Circle
 */
.main-circle-container {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  left: 50%;
  transform: translate(-50%);
  background-color: rgba(255, 255, 255, 0);
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

/**
	Subcircles (Child)
 */
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

/**
	Preview (Giant Circle)
 */
.previous-main-circle-preview {
  position: absolute;
  transform: translate(-50% -50%);
  left: 50%;
  top: 50%;
  width: 0px;
  height: 0px;
}

.previous-main-circle-preview .main-circle {
  transform: translate(-50%, -51%);
}

.previous-main-circle-preview .main-circle.zoomed-out {
  border-width: 30px;
  transform: translate(140%, 140%) scale(4);
  opacity: 0.4;
}

/* Hide elements on animation */
.animation-on-going
  .sub-circle:not(.animate-selected-focus-in-circle):not(.animate-selected-focus-out-circle),
.animation-on-going .sub-circle *,
.animation-on-going .main-circle-container .main-circle {
  display: none;
}

/******************************************
 Animations 
*******************************************/

/* Previous Circle */
.animate-previous-circle-zoom-out {
  animation: zoomOutPreviousCircle 0.7s;
}

.animate-previous-circle-zoom-in {
  animation: zoomInPreviousCircle 0.8s;
}

/* Selected Circle */
.animate-selected-focus-in-circle {
  position: relative;
  animation: focusInCircleAnimation 0.8s;
}

.animate-selected-focus-out-circle {
  position: relative;
  animation: focusOutCircleAnimation 0.7s;
}

@keyframes zoomOutPreviousCircle {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    border-width: 30px;
    transform: translate(140%, 140%) scale(4);
    opacity: 0.4;
  }
}

/* Previous Circle */
@keyframes zoomInPreviousCircle {
  0% {
    border-width: 30px;
    transform: translate(140%, 140%) scale(4);
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

/* Selected Circle */
@keyframes focusInCircleAnimation {
  0% {
    border-width: 1px;
    right: 0%;
    opacity: 0.1;
  }
  100% {
    border-width: 0.25px;
    right: 42%;
    transform: scale(4);
    opacity: 0.8;
  }
}

@keyframes focusOutCircleAnimation {
  0% {
    border-width: 0.25px;
    right: 42%;
    transform: scale(4);
    opacity: 0.8;
  }
  100% {
    right: 0%;
    border-width: 1px;
    opacity: 0.4;
  }
}
</style>
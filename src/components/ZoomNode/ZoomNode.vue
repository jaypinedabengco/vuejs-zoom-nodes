<template lang="pug">
	//- {cssAnimationSpeed} = Add style Variable
	div.wrapper(
			@click="back", 
			:style="{...cssAnimationSpeed}", 
			:class="{'back-is-valid' : allowBack, 'animation-on-going': animationOngoing}")
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
						:selectedNodeParentDetails="getSelectedParentComponentDetails",
						:nextComponent="getSelectedComponentDetails.next")
						| 'selectedNode' Slot not used. Selected Node Component ID is {{getSelectedComponentDetails.id}}
					div.next-button-container(v-if="getSelectedComponentDetails.next", @click="next(getSelectedComponentDetails)")
						slot(name="nextButton", :nextComponent="getSelectedComponentDetails.next")
							div.next-button Next						
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
// // - Change to a much better approach
// // - as there is no internet in toyota center right now :(
// const _uniqueIDGenerator = component_name => {
//   return `${component_name}-${Math.floor(
//     Math.random() * Math.random() * Date.now()
//   )}`;
// };

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
      required: true,
      validator(structure) {
        const invalidContentDetails = [];
        const registeredIds = [];

        const recursiveValidator = component => {
          // should have id
          if (!component.id) {
            invalidContentDetails.push({
              component,
              reason: "id is required"
            });
          }

          // ids should be unique
          // check if we can move this to a key/value pair, to register
          // registered component's name
          if (component.id && registeredIds.indexOf(component.id) > -1) {
            invalidContentDetails.push({
              component,
              reason: `id ${component.id} is used by other components`
            });
          }
          // register Id
          if (component.id) {
            registeredIds.push(component.id);
          }

          if (!!component.children && component.children instanceof Array) {
            component.children.forEach(component =>
              recursiveValidator(component)
            );
          }
        };

        recursiveValidator(structure);

        if (invalidContentDetails.length) {
          console.error("Invalid structure props value", invalidContentDetails);
          return false;
        }

        return true;
      }
    },
    animationTransitionZoomIn: {
      type: Number,
      default: 500
    },
    animationTransitionZoomOut: {
      type: Number,
      default: 500
    },
    animationTransitionNext: {
      type: Number,
      default: 200
    }
  },
  components: {},
  created() {
    // set base component as selected
    // TODO: Maybe add concept of adding 'UNIQUE' id on structures

    // clone structure
    this.selected = this.structure.id;

    // Generate unique ID
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
      structureWithIds: {},
      animationOngoing: false,
      //   animationTransitionZoomIn: 400, // ms
      //   animationTransitionZoomOut: 600, // ms
      animationZoomIn: true,
      animationSelectedComponentId: null,
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
    // generateUniqueIDforStructure(structure) {
    //   const recursiveMethod = component => {
    //     // add id to component
    //     // if has child, then add id to children
    //     component.id = _uniqueIDGenerator(component.component);
    //     if (!!component.children && component.children instanceof Array) {
    //       component.children.forEach(component => recursiveMethod(component));
    //     }
    //   };

    //   recursiveMethod(structure);
    //   return structure;
    // },
    setChildSubCircleClass(node) {
      // if animation not ongoing, then disable classes
      if (!this.animationOngoing) {
        return {};
      }

      if (node.id === this.animationSelectedComponentId) {
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
      this.animationSelectedComponentId = node.id;
      setTimeout(() => {
        // set actual selected
        this.selected = node.id;

        // cleanup
        this.animationOngoing = false;
        this.disableBack = false;
      }, this.animationTransitionZoomIn);
    },
    async next(node) {
      // if node.next does not exists, then do something...
      if (node.next && node.next.id) {
        const { id: componentId } = node.next;

        // do back first
        // need to manually enable back
        this.disableBack = false;
        await this.back();
        // need to manually disable again
        this.disableBack = true;

        // 300 millis of animation to just preview selected
        setTimeout(() => {
          const componentDetails = this.getComponentDetailsFromStructure(
            componentId,
            this.structure
          );
          this.onClickChildNode(componentDetails);
        }, this.animationTransitionNext);
      } else {
        console.warn(`Component has no next && next.id value`, node);
      }
    },
    async back() {
      // if animation ongoing then do nothing
      if (this.animationOngoing) {
        return false;
      }

      if (this.allowBack) {
        this.disableBack = true;
        this.animationOngoing = true;

        this.selected = this.getSelectedParentComponentDetails.id;
        this.animationZoomIn = false; // zoomOut

        return new Promise(resolve => {
          setTimeout(() => {
            // set actual selected
            this.animationSelectedComponentId = this.selected;

            // cleanup
            this.animationOngoing = false;
            this.disableBack = false;

            resolve(true);
          }, this.animationTransitionZoomOut);
        });
      }
      return false;
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
    getComponentDetailsFromStructure(component_id, structure) {
      let result_container = null;
      const recursiveChecker = (component_id, children) => {
        if (!result_container && children instanceof Array) {
          const component = children.filter(({ id }) => {
            return id === component_id;
          })[0];
          if (component) {
            result_container = component;
            return;
            // check children
          } else {
            children.forEach(component =>
              recursiveChecker(
                component_id,
                component.children,
                result_container
              )
            );
          }
        }
      };

      recursiveChecker(component_id, [structure]);
      return result_container;
    },
    getComponentParentDetailsFromStructure(component_id, structure) {
      let result_container = null;
      const recursiveChecker = (component_id, children) => {
        if (!result_container && children instanceof Array) {
          // check if 1st degree child has target-component
          const found = children.filter(component => {
            return (
              component.children &&
              component.children.filter(
                ({ id: child_component_id }) =>
                  child_component_id === component_id
              ).length
            );
          })[0];
          if (found) {
            result_container = found;
            return;
          } else {
            children.forEach(component =>
              recursiveChecker(component_id, component.children)
            );
          }
        }
      };

      recursiveChecker(component_id, [structure]);
      return result_container;
    }
  },
  /****************************************************************
   *
   * Computed
   *
   *****************************************************************/
  computed: {
    cssAnimationSpeed() {
      const delayInMillis = 100;

      // formula (animationTransition + delayInMillis) / 1000
      const animationZoomInSpeed = `${(this.animationTransitionZoomIn +
        delayInMillis) /
        1000}s`; // in seconds
      const animationZoomOutSpeed = `${(this.animationTransitionZoomOut +
        delayInMillis) /
        1000}s`; // in seconds
      return {
        "--animationZoomInSpeed": animationZoomInSpeed,
        "--animationZoomOutSpeed": animationZoomOutSpeed
      };
    },
    previewCircleClass() {
      const classes = {
        "animate-previous-circle-zoom-out": false,
        "animate-previous-circle-zoom-in": false,
        "zoomed-out": false
      };
      if (this.animationOngoing && this.animationSelectedComponentId) {
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
        this.animationSelectedComponentId,
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
        this.animationSelectedComponentId,
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
	Next 
 */
.next-button-container {
  position: absolute;
  bottom: 30px;
}

.next-button-container .next-button {
  border: 2px solid #d4cdcd;
  background-color: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
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
  animation: zoomOutPreviousCircle var(--animationZoomInSpeed);
}

.animate-previous-circle-zoom-in {
  animation: zoomInPreviousCircle var(--animationZoomOutSpeed);
}

/* Selected Circle */
.animate-selected-focus-in-circle {
  position: relative;
  animation: focusInCircleAnimation var(--animationZoomInSpeed);
}

.animate-selected-focus-out-circle {
  position: relative;
  animation: focusOutCircleAnimation var(--animationZoomOutSpeed);
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
    border-width: 15px;
    opacity: 0.6;
  }
  90% {
    border-width: 6px;
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
  25% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.3;
  }
  75% {
    opacity: 0.6;
  }
  100% {
    border-width: 0.25px;
    right: 45%;
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
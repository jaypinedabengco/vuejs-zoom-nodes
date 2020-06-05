<template lang="pug">
	div
		div.container(@click="back")
			div.main-circle(ref="mainCircleRef", 
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false")
				component(:is="getSelectedComponent" v-model="nodeData")
			//- Sub circle & circle within them
			//- This should be a component?
			div.sub-circle(
				v-for="(node, i) in getSelectedComponentDetails.children", :key="i", 
				@click="selected = node.component", 
				@mouseover="disableBack = true", 
				@mouseleave="disableBack = false",
				:style="setChildCoordinateViaStyle(node)" )
				div 
					| {{node.label}}
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
        children: [
          {
            component: "sample-two",
            label: "Sample Two",
            children: []
          },
          {
            component: "sample-three",
            label: "Sample Three",
            children: [
              {
                label: "Sample Three Child",
                component: "sample-three-child"
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
    setChildCoordinateViaStyle(node) {
      if (node.coordinates) {
        const { x, y } = node.coordinates;
        const styleCoordinates = {
          left: `${x}px`,
          top: `${y}px`
        };

        console.log({ styleCoordinates });
        return styleCoordinates;
      }
      return null;
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

      // Set coordinates using main circle
      // https://stackoverflow.com/questions/53608536/vuejs-get-left-top-position-of-element
      if (this.mainCircleElementReference) {
        // set coordinates
        // https://www.w3schools.com/jsref/met_element_getboundingclientrect.asp
        const mainCircleCoordinates = this.mainCircleElementReference.getBoundingClientRect();
        if (
          result_container.children &&
          result_container.children.length &&
          document.querySelector(".sub-circle")
        ) {
          const childCoordinates = document
            .querySelector(".sub-circle")
            .getBoundingClientRect();
          // first child
          result_container.children.forEach(child => {
            child.coordinates = {
              x: 0,
              y: 0
            };

            /** mainCircleCoordinates
				bottom,
				height,
				left,
				right,
				top,
				width,
				x,
				y
			*/

            // Start in Center
            console.log(childCoordinates);
            // set x
            //   Base X = left + (width / 2 ) - (childWidth / 2)
            child.coordinates.x =
              mainCircleCoordinates.left +
              mainCircleCoordinates.width / 2 -
              childCoordinates.width / 2;
            //   childCoordinates.width / 2;

            // set y
            //   Base Y = top + (height / 2 ) - (childHeight + childHeight / 2)
            child.coordinates.y =
              mainCircleCoordinates.height / 2 - childCoordinates.height / 2;
          });
        }
        // grand child
      }

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
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 3px solid #a78686;
  margin: 0 auto;
}

.sub-circle {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid #a78686;
  margin: 0 auto;
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
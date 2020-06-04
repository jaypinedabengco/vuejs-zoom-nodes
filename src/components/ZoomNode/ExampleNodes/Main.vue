<template lang="pug">
	div
		h1 Selected
		div
			component(:is="getSelectedComponent")
		div.selection-container
			ul
				li(v-for="(node, i) in getSelectedComponentDetails.children" :key="i", @click="selected = node.component") 
					| {{node.label}} - {{node.children && node.children.length ? `(${node.children.length}) child`: `no child`}}
			button(v-if="getSelectedParentComponentDetails", @click="selected = getSelectedParentComponentDetails.component") Go Back
												
		hr
		h1 Target
		pre
			| {{getSelectedComponentDetails}}
		hr
		h1 Parent
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
	"sample-three-child": Sample3Child,
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
      }
    };
  },
  computed: {
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
    }
  }
};
</script>

<style scoped>
.selection-container {
	width: 300px;
	margin: auto;
}
</style>
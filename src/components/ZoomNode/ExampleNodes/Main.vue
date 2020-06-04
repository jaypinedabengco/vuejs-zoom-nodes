<template lang="pug">
	div
		component(:is="getSelectedComponent")
		h1 Target
		pre
			| {{getSelectedComponentDetails}}

		h1 Parent
		pre
			| {{getSelectedParentComponentDetails}}
</template>

<script>
import Sample1 from "@/components/ZoomNode/ExampleNodes/Sample1";
import Sample2 from "@/components/ZoomNode/ExampleNodes/Sample2";
import Sample3 from "@/components/ZoomNode/ExampleNodes/Sample3";

export default {
  components: {
    "sample-one": Sample1,
    "sample-two": Sample2,
    "sample-three": Sample3,
    "sample-three-child": Sample1
  },
  data() {
    return {
      selected: "sample-one",
      structure: {
        component: "sample-one",
        children: [
          {
            component: "sample-two",
            children: []
          },
          {
            component: "sample-three",
            children: [
              {
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
            return component.children && component.children.filter(
              ({ component: child_component_name }) =>
                child_component_name === component_name
            ).length;
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
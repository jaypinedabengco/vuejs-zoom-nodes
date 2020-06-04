<template lang="pug">
	div
		h1 Selected
		div
			component(:is="getSelectedComponent" v-model="nodeData")
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
      data: {}
    };
  },
  created() {
    this.getAllComponentNames.forEach(key => {
      this.$set(this.data, key, null);
    });
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
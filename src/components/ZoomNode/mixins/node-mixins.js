export default {
	props: ['value', 'zoomNode', 'structureDetail'],
	data() {
		return {
			mixinsVModel: null
		};
	},
	mounted() {
		this.mixinsVModel = this.value;
	},
	computed: {
		hasNext() {
			return !!this.zoomNode &&
				!!this.structureDetail &&
				!!this.structureDetail.next &&
				!!this.structureDetail.next.id;
		}
	},
	methods: {
		applyChange() {
			this.$emit("input", this.mixinsVModel);
			this.$emit("change", this.mixinsVModel);
		},
		next() {
			if (!this.zoomNode) {
				console.error('Next is not possible, \'zoomNode\' not passed on Props.');
				return;
			}

			if (!this.structureDetail) {
				console.error('Next is not possible, \'structureDetail\' not passed on Props.');
				return;
			}

			if (!this.structureDetail.next || !this.structureDetail.next.id) {
				console.error('Next is not possible, \'structureDetail.next\' or \'structureDetail.next.id\' does not exist on current node structure.');
				return;
			}

			console.log(this.zoomNode, this.structureDetail);
			this.zoomNode.next(this.structureDetail);
		}
	}
}
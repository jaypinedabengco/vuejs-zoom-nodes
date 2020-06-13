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
			return !!this.structureDetail &&
				!!this.structureDetail.next &&
				!!this.structureDetail.next.component;
		}
	},
	methods: {
		applyChange() {
			this.$emit("input", this.mixinsVModel);
			this.$emit("change", this.mixinsVModel);
		},
		next() {
			console.log(this.zoomNode, this.structureDetail);
			this.zoomNode.next(this.structureDetail);
		}
	}
}
export default {
	props: ['value'],
	data() {
		return {
			mixinsVModel: null
		};
	},
	mounted() {
		this.mixinsVModel = this.value;
	},
	methods: {
		applyChange() {
			this.$emit("input", this.mixinsVModel);
			this.$emit("change", this.mixinsVModel);
		}
	}
}
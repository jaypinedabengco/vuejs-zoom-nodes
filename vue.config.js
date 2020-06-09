
let publicPath = '/';

if (process.env.VUE_APP_BUILD_GITHUB_PAGE) {
	publicPath = '/vuejs-zoom-nodes/'
}

module.exports = {
	publicPath,
	outputDir: 'docs',
}
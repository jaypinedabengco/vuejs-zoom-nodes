import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ComponentIs from '../views/ComponentIs'
import NodeStackEffect from '../views/NodeStackEffect'
import NodeZoomEffect from '../views/NodeZoomEffect'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/zoom-effect',
		name: 'Zoom Effect',
		component: NodeZoomEffect
	},
	{
		path: '/stack-effect',
		name: 'Stack Effect',
		component: NodeStackEffect
	},
	{
		path: '/component-is',
		name: 'ComponentIs',
		component: ComponentIs
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router

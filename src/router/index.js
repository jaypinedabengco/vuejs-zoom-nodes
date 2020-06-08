import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ComponentIs from '../views/ComponentIs'
import NodeWithSubnode from '../views/NodeWithSubnode'
import NodeWithSubnodeTwo from '../views/NodeWithSubnodeTwo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/node-with-subnode',
    name: 'Node with Subnode',
    component: NodeWithSubnode
  },
  {
    path: '/node-with-subnode-2',
    name: 'Node with Subnode 1',
    component: NodeWithSubnodeTwo
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

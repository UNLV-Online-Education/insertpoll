import Vue from 'vue';
import Router from 'vue-router';
import InsertPollView from './views/InsertPollView.vue';
import EmbeddedPollView from './views/EmbeddedPollView.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/insert',
      name: 'insert',
      component: InsertPollView,
      props: (route) => ({ hash: route.query.hash })
    },
    {
      path: '/embed',
      name: 'embed',
      component: EmbeddedPollView,
      props: (route) => ({
        hash: route.query.hash,
        pollId: route.query.pollId
      })
    }
  ]
});

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: 'Connexion',
      metaTags: [
        {
          name: 'description',
          content: 'The login page of the platform.'
        }
      ]
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'Profil étudiant',
      metaTags: [
        {
          name: 'description',
          content: 'Here you can see how your year is going on.'
        }
      ]
    }
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: () => import(/* webpackChunkName: "calculator" */ '../views/Calculator.vue'),
    meta: {
      title: 'Simulateur',
      metaTags: [
        {
          name: 'description',
          content: 'You can do maths with your modules here.'
        }
      ]
    }
  },
  {
    path: '/list',
    name: 'list',
    component: () => import(/* webpackChunkName: "calculator" */ '../views/List.vue'),
    meta: {
      title: 'Liste des modules',
      metaTags: [
        {
          name: 'description',
          content: 'You can do maths with your modules here.'
        }
      ]
    }
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  if(!nearestWithMeta) return next();

  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router

import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Inicio from '@/components/Inicio';
import Segunda from '@/components/Segunda';
import Tercera from '@/components/Tercera';
import Cuarta from '@/components/Cuarta';
import Login from '@/components/Login';
import Upload from '@/components/Upload';
import Registro from '@/components/Registro';
import CambiarClave from '@/components/CambiarClave';
import Forgot from '@/components/Forgot';
import ConfirmForgot from '@/components/ConfirmForgot';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Inicio
  },
  {
    path: '/ui/login',
    name: 'login',
    component: Login
  },
  {
    path: '/ui/upload',
    name: 'upload',
    component: Upload
  },
  {
    path: '/ui/segunda',
    name: 'segunda',
    component: Segunda
  },
  {
    path: '/ui/tercera',
    name: 'tercera',
    component: Tercera,
    meta: { requiresAuth: true }
  },
  {
    path: '/ui/cuarta',
    name: 'cuarta',
    component: Cuarta
  },
  {
    path: '/ui/registro',
    name: 'registro',
    component: Registro
  },
  {
    path: '/ui/forgot',
    name: 'forgot',
    component: Forgot
  },
  {
    path: '/ui/confirma-forgot',
    name: 'confirma-forgot',
    component: ConfirmForgot
  },
  {
    path: '/ui/cambiar-clave',
    name: 'cambiar-clave',
    component: CambiarClave,
    meta: { requiresAuth: true }
  }
]


const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes
})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) { // requiere autenticarse?
    if (store.state.firmado===false) { // NO estás autenticado ????
      store.commit('setDestination', to.fullPath);
      router.push("/ui/login");
    } else { // si, si lo estoy. ah, ok. toz, adelante !!!
      next();
    }
  } else { // NO, REQUIERE AUTENTICACIÓN.... TONZ... ADELANTE !!!!!!
    next()
  }
})

export default router

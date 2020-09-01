<template>
  <div id="app">
    <div id='top'>
      <a class='liga' href='#' @click="goLogin" >{{ valor }}</a>
    </div>
    <h1>*</h1>
    <router-view></router-view>
    <div id='footer'>
      Hola mundo
    </div>
  </div>
</template>

<script>
import router from './router';
import store from './store'

export default {
    name: "App",
    data: function () {
        return {
          usr: "."
        }
    },
    computed: {
      valor: function() {
        var estado= store.state.firmado;
        if(estado) {
          return "Salir del sistema (" + store.state.estado.usuarioDetalles.nombre + ")";
        } else {
          return "Ingresar al sistema ";
        }
      }
    },    
    methods: {
      goLogin: function() {
        store.commit('setState', '');
        store.commit('setFirmado', false);
        router.push('/ui/login');
      }
    }
}

/*
,
    data() {
        return {
            mostrarMenu: false,
        }
    },
    methods: {
        home() {
            router.push({ name: "segunda" });
        }
    },
    created() {
        console.log("entre a created");
    } //cierra created
*/

</script>

<style>
#app {
    /* background-color: red; */
    padding-bottom: 40px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
#footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 25px;
    background-color: #26262b;
    color:#ffffff;
}
#top {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 23px;
  background-color: #26262b;
  color:#ffffff;
}
.liga {
  color: #00ff00;
}
.liga:hover {
  color: #ff0000;
}
</style>

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        estado: '',
        firmado: false,
        destination: '/ui/upload',
        botonNotificaciones: { 
            texto: "Sin notificaciones", 
            color: "success" 
        }
    },
    mutations: {
        setState(state, estado) {
            state.estado = estado;
        },
        setFirmado(state, firmado) {
            state.firmado = firmado;
        },
        setDestination(state, destination) {
            state.destination = destination;
        },
        setBotonNotificaciones(state, botonNotificaciones) {
            state.botonNotificaciones = botonNotificaciones;
        }
    },
    getters: {
        estado: state => state.estado,
        firmado: state => state.firmado,
        botonNotificaciones: state => state.botonNotificaciones
    }
})
export default store

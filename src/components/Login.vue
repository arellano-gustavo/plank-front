<template>
    <div class="container">
        <div class="card" style="width: 480px;">
            <div class="card-header">
                <div class="row">
                    <div class="col-sm-6">
                        <label>Login al sistema</label>
                    </div>
                    <div class="col-sm-6" style="text-align: right;">
                        <label>(v2.3.7)</label>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group">
                            <label for="precioVenta">Usuario</label>
                            <input type="text" class="form-control" v-model="usr" />
                        </div>
                        <div class="form-group">
                            <label for="cantidadVenta">Password</label>
                            <input type="password" class="form-control" v-model="psw" />
                        </div>
                    </div>
                    <div class="col-sm-12" style="text-align: center;">
                        <button @click="checkCredentials" class="btn btn-success">Ingresar al sistema</button>
                    </div>
                </div>
            </div>
        </div>
<!--
        <b-card>
            <b-row>
                <b-col cols="2"></b-col>
                <b-col cols="4">
                    <h1>Cuarta Pagina</h1>
                    <b-button variant="success">Ve a la Quinta Forma</b-button>
                </b-col>
                <b-col cols="6"></b-col>
            </b-row>
        </b-card>
-->
        <modal 
            name="mensaje-login" 
            :clickToClose="false" 
            :reset="true"
            :width="480"
            :height="260">
            <div class="card">
                <div class="card-header">Advertencia del sistema</div>
                <div class="card-body">
                    <h5 class="card-title">Error de ingreso al sistema</h5>
                    <p class="card-text">{{ msgErr }}</p>
                    <div style="text-align: right;">
                        <a href="#" class="btn btn-primary" @click="closeModal">Aceptar</a>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import axios from 'axios';
import router from '../router'
import store from '../store'
import { serviceUrl } from '../ConstantesGlobales.js'

export default {
    data: function () {
        return {
          usr: "",
          psw: "",
          msgErr: "",
          url: serviceUrl
        }
    },
    created() {
    },
    methods: {
        detecta: function(input) {
            if(store.state.destination.length>0) {
                var target = store.state.destination;
                store.commit('setDestination','');
                return target;
            }
            if (typeof input === 'string') {
                return '/ui/welcome';
            } else {
                for(var i=0; i<input.length; i++) {
                    switch(input[i].id) {
                        case 1: return '/ui/cuarta';
                        case 2: return '/ui/segunda';
                        default: return '/ui/tercera';
                    } 
                } // ends for cycle with switch inside
            }
        },
        closeModal: function() {
            this.$modal.hide('mensaje-login');
        },
        openUploadPage: function() {
            router.push('/ui/upload');
        },
        checkCredentials: function() {
            axios.post('api/login.json', 
            {
                usr: this.usr,
                pass: this.psw
            }, 
            {
                headers: {
                    'Content-type': 'application/json',
                    'crossDomain': true,
                    'Acces-Control-Allow-Origin': '*',
                    "X-CSRFToken": store.state.jwt 
                }
            }
        ).catch(error => {
            this.msgErr = "Ha ocurrido un error de red: " + error;
            this.$modal.show('mensaje-login');
        }).then(response => {            
            if(response.status===200) {
                store.commit('setState', response.data);
                store.commit('setFirmado', true);
                router.push(this.detecta(response.data.roles));
            } else {
                this.msgErr = response.data['desc-exception'];
                this.$modal.show('mensaje-login');
            }
          });
        }
    }
}

</script>

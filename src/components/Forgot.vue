<template>
    <div  id="axiosForm" class="container">
        <div class="loader" v-if="loading"></div>

        <div class="card" style="width: 600px;">
            <div class="card-header">
                <div class="row">
                    <div class="col-sm-12">
                        <label style="font-size:26px;">Regeneración de clave</label>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">

                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="correo">Correo</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="text" class="form-control" style="width: 250px;" v-model="correo" />
                    </div>

                    <div class="col-sm-12" style="text-align: center;">
                        <vue-recaptcha 
                            ref="recaptcha"
                            sitekey="6LdvjMEZAAAAADymamvyGxz4OxTHotrJPsCb5U_q"
                            @verify="onCaptchaVerified"
                            @expired="onCaptchaExpired">
                        </vue-recaptcha>
                    </div>

                    <div class="col-sm-12" style="text-align: center;">
                        <hr/>
                    </div>
                    
                    <div class="col-sm-12" style="text-align: center;">
                        <button @click="registrar" class="btn btn-success">Solicitar restauración</button>
                    </div>

                </div>

            </div>
        </div>

        <modal 
            name="mensaje-login" 
            :clickToClose="false" 
            :reset="true"
            :width="480"
            :height="260">
            <div class="card">
                <div class="card-header">Advertencia del sistema</div>
                <div class="card-body">
                    <h5 class="card-title">Error de regeneración de clave</h5>
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
import VueRecaptcha from 'vue-recaptcha';

export default {
    data: function () {
        return {
            correo: "",
            msgErr: "",
            loading: false,

            status: "",
            sucessfulServerResponse: "",
            serverError: "",

            captchaOk: false,
            reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
        }
    },
    created() {
    },
    methods: {
        closeModal: function() {
            this.$modal.hide('mensaje-login');
        },
        registrar: function() {
            if(!this.captchaOk) {
                this.msgErr = 'El Captcha es incorrecto';
                this.$modal.show('mensaje-login');
                return;
            }
            if(this.correo == null || this.correo == '') {
                this.msgErr = 'El correo no puede ser vacío';
                this.$modal.show('mensaje-login');
                return;
            }
            if(!this.reg.test(this.correo)) {
                this.msgErr = 'La estructura del correo es incorrecta';
                this.$modal.show('mensaje-login');
                return;
            }

            this.loading = true;

            axios.get('api/forgot-password.json?mail='+this.correo, 
            {
                mail: this.correo
            }, 
            {
                headers: {
                    'Content-type': 'application/json',
                    'crossDomain': true,
                    'Acces-Control-Allow-Origin': '*'
                }
            }).catch(error => {
                this.msgErr = "Ha ocurrido un error de red: " + error;
                this.$modal.show('mensaje-login');
            }).then(response => {
                if(response.status===200) {
                    router.push('/ui/confirma-forgot');
                } else {
                    this.msgErr = response.data['desc-exception'];
                    this.$modal.show('mensaje-login');
                }
            }).finally(() => {
                this.loading =  false
            });            
        },
        onCaptchaVerified: function (recaptchaToken) {
            axios.post('api/check-captcha.json', 
            {
                response: recaptchaToken,
                ip: '127.0.0.1'
            }, 
            {
                headers: {
                    'Content-type': 'application/json',
                    'crossDomain': true,
                    'Acces-Control-Allow-Origin': '*'
                }
            }).catch(error => {
                this.msgErr = "Ha ocurrido un error de red: " + error;
                this.$modal.show('mensaje-login');
            }).then(response => {
                if(response.status===200) {
                    this.captchaOk = response.data.success;
                } else {
                    this.msgErr = 'Regreso con un estatus: '+response.status;
                    this.$modal.show('mensaje-login');
                }
            }).finally(() => {
                console.log('Ya acabo el chequeo del captcha');
            });
        },
        onCaptchaExpired: function () {
            this.captchaOk = false;
            this.$refs.recaptcha.reset();
        }
    },
    components: { 
        VueRecaptcha
    }
}

</script>




<style scoped>
#axiosForm{  /* Components Root Element ID */
    position: relative;
}
.loader{  /* Loader Div Class */
    position: absolute;
    top:0px;
    right:0px;
    width:100%;
    height:100%;
    background-color:#eceaea;
    background-image: url('../assets/logo2.gif');
    background-repeat:no-repeat;
    background-position:center;
    z-index:10000000;
    opacity: 0.4;
    filter: alpha(opacity=40);
}
</style>
<template>
    <div  id="axiosForm" class="container">
        <div class="loader" v-if="loading"></div>

        <div class="card" style="width: 600px;">
            <div class="card-header">
                <div class="row">
                    <div class="col-sm-12">
                        <label style="font-size:26px;">Registro al sistema</label>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="nombre">Token</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="text" class="form-control" style="width: 250px;" v-model="token" maxlength="25"/>
                    </div>

                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="clave">Clave Nueva</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="password" class="form-control" style="width: 150px;" v-model="clave" />
                    </div>

                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="clave2">Confirma Clave Nueva</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="password" class="form-control" style="width: 150px;" v-model="clave2" />
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

<script>
import axios from 'axios';
import router from '../router'
import VueRecaptcha from 'vue-recaptcha';

export default {
    data: function () {
        return {
          token: "",
          clave: "",
          clave2: "",
          msgErr: "",
          loading: false,

          status: "",
          sucessfulServerResponse: "",
          serverError: "",

          captchaOk: false
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

            if(this.clave != this.clave2) {
                this.msgErr = 'La clave y su confirmación no coinciden';
                this.$modal.show('mensaje-login');
                return;
            }

            this.loading = true;

            axios.get('api/confirm-forgot-password.json?code='+this.token+'&pass='+this.clave, 
            {
                code: this.token,
                pass: this.clave
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
                    router.push('/ui/login');
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

<template> 
    <div  id="axiosForm" class="container">
        <div class="loader" v-if="loading"></div>

        <div class="card" style="width: 600px;">

            <div class="card-header">
                <div class="row">
                    <div class="col-sm-12">
                        <label style="font-size:26px;">Cambiar clave de acceso</label>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="row">
                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="clave">Clave Anterior</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="password" class="form-control" style="width: 150px;" v-model="claveAnterior" />
                    </div>

                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="clave">Clave Nueva</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="password" class="form-control" style="width: 150px;" v-model="claveNueva" />
                    </div>

                    <div class="col-sm-6"  style="text-align: right;">
                        <label for="clave2">Confirma Clave Nuevaa</label>
                    </div>
                    <div class="col-sm-6 form-group">
                        <input type="password" class="form-control" style="width: 150px;" v-model="confirmaClaveNueva" />
                    </div>

                    <div class="col-sm-12" style="text-align: center;">
                        <hr/>
                    </div>
                    <div class="col-sm-12" style="text-align: center;">
                        <button @click="cambiar" class="btn btn-success">Cambiar Clave</button>
                    </div>
                </div>
            </div>

        </div>

        <modal 
            name="mensaje" 
            :clickToClose="false" 
            :reset="true"
            :width="480"
            :height="260">
            <div class="card">
                <div class="card-header">Advertencia del sistema</div>
                <div class="card-body">
                    <h5 class="card-title">{{ titulo }}</h5>
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

export default {
  data() {
    return {
      claveAnterior: "",
      claveNueva: "",
      confirmaClaveNueva: "",
      msgErr: "",
      loading: "",
      titulo: "",
      salta: false
    }
  },
  methods: {
    cambiar: function() {
        if(this.claveNueva != this.confirmaClaveNueva) {
            this.titulo = 'Error al cambiar la clave';
            this.msgErr = 'La clave y su confirmación no coinciden';
            this.$modal.show('mensaje');
            return;
        }
        // Si la clave y su confirmación fueron iguales:
        this.loading =  true;
        axios.post('api/change-password.json', 
        {
            usr: store.state.estado.usuario.mail,
            nuevaClave: this.claveNueva,
            claveAnterior: this.claveAnterior
        }, 
        {
            headers: {
                'Content-type': 'application/json',
                'crossDomain': true,
                'Acces-Control-Allow-Origin': '*',
                'X-CSRFToken': store.state.estado.jwt
            }
        }).catch(error => {
            this.titulo = 'Error al cambiar la clave';
            this.msgErr = "Ha ocurrido un error de red: " + error;
            this.$modal.show('mensaje');
        }).then(response => {
            if(response.status===200) {
                this.salta = true;
                this.titulo = 'Felicidades !!!';
                this.msgErr = 'La clave ha sido cambiada exitosamente';
                this.$modal.show('mensaje');
            } else {
                this.msgErr = response.data['desc-exception'];
                this.$modal.show('mensaje');
            }
        }).finally(() => {
            this.loading =  false
        });
    },
    closeModal: function() {
        this.$modal.hide('mensaje');
        if(this.salta) router.push('/ui/login');
    }
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
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

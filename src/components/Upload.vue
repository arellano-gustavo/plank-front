<template>
<div>
    <a href="#" class="btn btn-primary" @click="regresa">Aceptar</a>
    <h2>Cargar Imagenes {{ valor }}</h2>
    <vue-upload-multiple-image 
        @upload-success="uploadImageSuccess"
        @before-remove="beforeRemove" 
        @edit-image="editImage"
        @data-change="dataChange" 
        :data-images="imagesEmpty"
        markIsPrimaryText="Imágen secundaria" 
        dragText="Drag Image"
        dropText="Drop images here"
        browseText="Directory" 
        popupText="Esta será la principal imagen de este grupo"
        primaryText="Principal" 
        ></vue-upload-multiple-image>
        <a href="#" class="btn btn-danger" @click="upload()">Upload Image(s)</a>
</div>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import axios from 'axios'
import store from '../store'
import router from '../router'

export default {
  name: 'app',
  data: function() {
    return {
      valor: store.state.estado.roles,
      images: [],
      imagesEmpty: [],
      goose: []
    }
  },
  components: {
    VueUploadMultipleImage
  },
  methods: {
    regresa: function() {
      router.push('/ui/login');
    },
    upload() {
      console.log("Longitud: "+this.goose.length);
      if(this.goose.length<1) {
        alert("Nada que subir");
        return;
      }
      for (var i = 0; i < this.goose.length; i++) {
        console.log(this.goose[i]);
        axios.post('http://192.168.100.4:8082/rest/books/fileupload', this.goose[i]).then(response => {
          console.log(response)
        })
      }
    },
    uploadImageSuccess(formData, index, fileList) {
      //console.log('data', formData, index, fileList);
      this.images=fileList;
      this.goose.push(formData);
    },
    beforeRemove (index, done, fileList) {
      console.log('index', index, fileList)
      //var r = confirm("remove image")
      //if (r == true) {
        this.goose.splice(index, 1); 
        done()
      //} else {
      //}
    },
    editImage (formData, index, fileList) {
      console.log('edit data', formData, index, fileList)
    },
    dataChange (data) {
      console.log(data)
    }
  }
}
</script>

<style>
#my-strictly-unique-vue-upload-multiple-image {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
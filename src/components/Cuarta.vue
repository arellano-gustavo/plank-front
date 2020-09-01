<template>
  <div class="hello">
    <h1>{{ otro }}</h1>
    <p>Interfaz para el ROL 1</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colorSala: 0,
      usuario: {
        rol: "admin"
      },
      otro: this.$store.state.distribuidorId,
      ultimo: 2
    }
  },
  methods: {
    pba() {
      console.log('pba');
    }
  },
  computed: {

  },
  created() {
    //console.log(this);
    //console.log(this.$store.state.distribuidorId);
  },
  name: 'Cuarta',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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

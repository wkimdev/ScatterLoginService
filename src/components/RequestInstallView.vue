<template>
  <div class="app">
    <h2>{{ msg }}</h2>
    <br>
    <a href="https://get-scatter.com">https://get-scatter.com</a>
  </div>
</template>

<script>
export default {
  name: "RequestInstallView",
  data() {
    return {
      msg: "You need to install Scatter to use the form"
    };
  },
  methods: {}
};
</script>

<style scoped>
h1,
h2 {
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


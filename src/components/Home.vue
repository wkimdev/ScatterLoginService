<template>
  <div class="app">
    <div>Check Scatter Install....</div>
    <Spinner></Spinner>
  </div>
</template>


<script>
import Spinner from "vue-simple-spinner";

export default {
  name: "Home",
  props: ["checked"],
  data() {
    return {
      msg: "Initial scatter install page"
    };
  },
  created() {
    // 두번 찍는다..
    // console.log("check props :" + this.checked);
  },
  components: {
    Spinner
  }
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


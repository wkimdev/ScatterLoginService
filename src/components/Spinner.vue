<template>
  <div id="app">
    <vue-simple-spinner></vue-simple-spinner>
    <hr>
    <vue-simple-spinner message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="tiny" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="small" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="medium" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="large" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="big" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="huge" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="massive" message="Loading..."></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="55"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="88"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner line-size="7"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner line-size="12"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="55" line-size="7"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner size="88" line-size="12"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner line-fg-color="#009900"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner line-bg-color="#555555"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner line-fg-color="#009900" line-bg-color="#555555"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner speed="0.4"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner speed="2"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner speed="6"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner spacing="55" message="I'm 55px below the vue-simple-spinner"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner font-size="20" message="I'm a 20px font size"></vue-simple-spinner>
    <hr>
    <vue-simple-spinner text-fg-color="#009900" message="I'm #009900 green!"></vue-simple-spinner>
  </div>
</template>

<script>
import Spinner from "vue-simple-spinner";

export default {};
</script>

<style>
body {
  font-family: sans-serif;
  background: #fff;
  margin: 1rem;
}

hr {
  border: 0;
  border-top: 1px solid #ddd;
  margin: 1rem 0;
}
</style>

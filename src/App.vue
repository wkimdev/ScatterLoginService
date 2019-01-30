<template>
  <!-- <div id="app"> -->
  <div>
    <router-view keep-alive></router-view>
    <p>this is app.vue</p>
  </div>
</template>
<style src="./styles/all.sass" lang="sass"></style>

<script>
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Eos from "eosjs";
import Home from "./components/Home";
import LoginView from "./components/LoginView";
import RequestInstallView from "./components/RequestInstallView";
import networking from "./networking.json";
//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-vue/dist/bootstrap-vue.css";

ScatterJS.plugins(new ScatterEOS());

// mainnet
// const network = networking["mainnet"];
// testnet
const network = networking["junglenet"];

//const APP_NAME = "scatter-login-service";

export default {
  name: "App",
  data: function() {
    return {
      checked: ""
    };
  },
  created: function() {
    this.load();
  },
  methods: {
    load() {
      var _self = this;
      // scatter classic (web extension) install check
      ScatterJS.scatter.connect("scatter-login-service").then(connected => {
        return new Promise(() => {
          if (!connected) {
            return _self.$router.push({ path: "/RequestInstallView" });
          } else {
            const scatter = ScatterJS.scatter;
            const eos = scatter.eos(network, Eos);
            window.ScatterJS = null;
            return _self.$router.push({ path: "/LoginView" });
          }
        });
      });
    }
  },
  components: {
    Home,
    LoginView,
    RequestInstallView
  }
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
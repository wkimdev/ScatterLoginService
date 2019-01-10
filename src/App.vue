<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Eos from "eosjs";
import Home from "./components/Home";
import LoginView from "./components/LoginView";
import RequestInstallView from "./components/RequestInstallView";
import networking from "./networking.json";

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
    //console.log("start load~~~");
  },
  methods: {
    load() {
      console.log("load method start ~~~");
      var checkedValue;
      ScatterJS.scatter.connect("scatter-login-service").then(connected => {
        if (!connected) {
          checkedValue = false;
          alert("scatter not installed : " + checkedValue);
          this.checked = checkedValue;
          this.$router.push({ path: "/RequestInstallView" });
          return;
        }

        const scatter = ScatterJS.scatter;
        const eos = scatter.eos(network, Eos);

        if (scatter.isExtension) {
          console.log("connected scatter");
          checkedValue = true;
          alert("scatter is installed! :" + checkedValue);
          this.checked = checkedValue;
          window.ScatterJS = null;
          this.$router.push({ path: "/LoginView" });
        }

        return;
      });
      console.log("load method end ~~~");
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
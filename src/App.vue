<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import Home from "./components/Home";
import LoginView from "./components/LoginView";
import RequestInstallView from "./components/RequestInstallView";

ScatterJS.plugins(new ScatterEOS());

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
        if (scatter.isExtension) {
          checkedValue = true;
          alert("scatter is installed! :" + checkedValue);
          this.checked = checkedValue;
          window.ScatterJS = null;
          this.$router.push({
            path: "/LoginView",
            props: { checked: "test hi htest~~ " }
          });
        }

        return;
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
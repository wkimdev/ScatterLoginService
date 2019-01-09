<template>
  <div class="app">
    <h1>{{ msg }}</h1>
    <button @click="identifyOrSend()">attach scatter identity</button>
    <button @click="logout()">remove identity</button>
    <p>{{ account_name }}</p>
    <p>randomId : {{ random_name }}</p>
    <!-- <p>publicKey : {{ publicKey }}</p> -->
    <!-- <p>checked : {{ checked }}</p> -->
  </div>
</template>

<script>
import networking from "../networking.json";

// mainnet
// const network = networking["mainnet"];
// testnet
const network = networking["junglenet"];

export default {
  name: "LoginView",
  props: ["checked"],
  data() {
    return {
      msg: "Welcome, A Scatter account is required",
      account_name: null,
      random_name: null,
      publicKey: null,
      scatter: null,
      eos: null
    };
  },
  created: function() {
    //this.load();
  },
  methods: {
    async identifyOrSend() {
      var _self = this;
      console.log("call scatter getIdentity api ");

      // get identity
      await scatter
        .getIdentity({ accounts: [network] })
        .then(async identity => {
          // this.setState({ identity })
          // identity는 hash와 account, public key, name 등을 반환...
          // 인증이 유효할 경우, 로그인이 허용되고, 화면에 accout를 뿌리게 된다.
          // console.log("test :" + identity.accounts[0].name);
          console.log(identity);

          _self.account_name =
            identity.accounts[0].name + "@" + identity.accounts[0].authority;
          _self.random_name = identity.name;

          // publickey는 가저오는 api가 따로 있다. 아래처럼 가져오면 eos pulickey가 아닌, 새로운 키를 반환함.
          //_self.publicKey = identity.publicKey;
        })
        .catch(error => {
          console.error(error.message);
        });

      //_self.eos = scatter.eos(network, Eos);
    },
    getPubliccKey() {
      /**
       * get publickey from eos blockchain
       * 아래의 api not founction error..
       * TODO : 만약 public key 를 가져와야 한다면 api 사용법을 더 찾아봐야 할 것 같다.
       */
      scatter.getPublicKey("eos").then(publicKey => {
        //...
        console.log("test :" + publicKey);
      });
    },
    logout() {
      console.log("call scatter forgetIdentity api ");
      scatter.forgetIdentity();
      this.account_name = null;
      this.random_name = null;
      this.publicKey = null;
    },
    suggestNetwork(network) {
      // mainnet이 아닌 네트워크를 사용하는 경우 suggestNetwork가 유리.
      // 아래 api 정상 작동
      var pubKey = scatter.suggestNetwork(network);
      console.log("pubKey :" + pubKey);
    },
    support() {
      this.load();
    },
    refund() {
      this.load();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

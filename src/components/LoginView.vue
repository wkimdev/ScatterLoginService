<template>
  <div class="app">
    <h1>{{ msg }}</h1>

    <h2>{{ account_name }}</h2>
    <h2>randomId : {{ random_name }}</h2>

    <button @click="login()">attach scatter identity</button>
    <button @click="logout()">remove identity</button>
    <br>
    <br>
    <button @click="authenticate()">Authenticate</button>
    <button @click="suggestNetwork()">suggestNetwork</button>
    <br>
    <br>
    <h2>wallet</h2>
    <br>Transfer to :
    <input v-model="transferTo" placeholder="transfer account">
    <br>
    <br>amount :
    <input v-model="TokenAmount" placeholder="1.0000 EOS">
    <br>Token symbol :
    <input placeholder="EOS">
    <br>
    <button @click="requestTransfer()">requestTransfer</button>
    <br>check trancsaction ID :
    <input v-model="transcationId">
    <br>
    <br>

    <h2>vote</h2>

    <button @click="vote()">vote</button>
    <!-- vote 는 컨트랙트 기반으로 따로 만들어야 할 듯.. -->
    <br>
    <p>getPublicKey는 이슈가 있어 불러오지 못함.
      <br>linkAccount, getArbitrarySignature api가 publickey api와 연결되어 있기 때문에 호출시error
    </p>
    <br>
    <button @click="getPublicKey()">getPublicKey</button>
    <button @click="linkAccount()">linkAccount</button>
    <button @click="getArbitrarySignature()">getArbitrarySignature</button>
    <!-- <p>publicKey : {{ publicKey }}</p> -->
    <!-- <p>checked : {{ checked }}</p> -->
  </div>
</template>

<script>
import networking from "../networking.json"; // app.vue에서 공통으로 처리하는 법 ?
import Eos from "eosjs"; // app.vue에서 공통으로 처리하는 법

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
      eos: null,
      transferTo: null,
      TokenAmount: null,
      transcationId: null
    };
  },
  created: function() {
    //this.load();
  },
  methods: {
    async login() {
      var _self = this;
      console.log("call scatter suggestNetwork, getIdentity api ");

      // suggestNetwork
      await scatter.suggestNetwork(network);
      this.eos = scatter.eos(network, Eos);

      // get identity
      await scatter
        .getIdentity({ accounts: [network] })
        .then(async identity => {
          console.log(identity);

          _self.account_name =
            identity.accounts[0].name + "@" + identity.accounts[0].authority;
          _self.random_name = identity.name;

          // publickey는 가저오는 api가 따로 있다. 아래처럼 가져오면 eos pulickey가 아닌, 새로운 키를 반환함.
          //_self.publicKey = identity.publicKey;
        })
        .catch(err => {
          console.error(err.message);
        });

      //_self.eos = scatter.eos(network, Eos);
    },
    logout() {
      console.log("call scatter forgetIdentity api ");
      scatter.forgetIdentity();
      this.account_name = null;
      this.random_name = null;
      this.publicKey = null;
    },
    authenticate() {
      console.log("call scatter authenticate api ");
      const getRandom = () => Math.round(Math.random() * 8 + 1).toString();
      let randomString = "";
      for (let i = 0; i < 12; i++) randomString += getRandom();
      scatter.authenticate(randomString).then(res => {
        console.log(res);
      });
    },
    async suggestNetwork() {
      // mainnet이 아닌 네트워크를 사용하는 경우 suggestNetwork가 유리.
      console.log("call scatter suggestNetwork api ");
      await scatter.suggestNetwork(network).then(res => console.log(res));
    },
    getPublicKey() {
      /**
       * get publickey from eos blockchain
       * Issue : Uncaught TypeError: scatter.getPublicKey is not a function
       * TODO : 만약 public key 를 가져와야 한다면 api 사용법을 더 찾아봐야 할 것 같다.
       */
      console.log(
        "call scatter getPublicKey api : there is TypeError issue: scatter.getPublicKey is not a function "
      );

      scatter
        .getPublicKey(this.eos) //this.eos도 똑같음...
        .then(res => {
          publicKey = res;
          console.log("res", res);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    linkAccount() {
      /**
       * linkAccount는 Scatter가 제공하는 온 보딩 도구의 일부이며 대부분의 경우 getPublicKey와 함께 사용됩니다.
       * 응용 프로그램은 사용자가 getIdentity를 사용할 때 응용 프로그램과 상호 작용하는 데 사용할 수있는 공개 키에 계정과 네트워크를 바인딩하라는 메시지를 표시 할 수 있습니다
       * public key가 필요한데 아직 이슈해결 못함.
       */
      const account = {
        name: "addressbook3",
        authority: "active",
        publicKey
      };

      scatter
        .linkAccount(account, network)
        .then(res => {
          console.log("res", res);
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    getArbitrarySignature() {
      // getArtrarySignature는 주어진 공개 키의 개인 키를 사용하여 임의의 데이터에 서명 할 수 있게합니다.
      console.log("call scatter getArbitrarySignature api ");
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );

      // User rejected the signature request
      // issue : account.publicKey 이 부분에서 publickey를 못가져옴..
      scatter
        .getArbitrarySignature(
          account.publicKey,
          "This should be able to be signed by anything",
          "Testing",
          false
        )
        .then(signed => {
          console.log("signed", signed);
        });
    },
    requestTransfer() {
      /**
       * 사용자에게 전송 요청을 보내는 api
       */
      console.log("call scatter requestTransfer api ");

      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      let transferToAccount = this.transferTo;
      let transferAmount = this.TokenAmount;
      console.log(transferToAccount);
      console.log(transferAmount);

      this.eos
        // from, to, quantity, memo
        // .transfer(account.name, "eosio", "1.0000 EOS", "", opts)
        // assertion failure with message: unable to find key","file":"wasm_interface.cpp","line_number":917,"method":"eosio_assert"
        // unable to find key error
        //.transfer(account.name, "oasistokenn1", "1.0000 OAS", "", opts)
        .transfer(account.name, transferToAccount, transferAmount, "", opts)
        .then(trx => {
          console.log("trx", trx);
          this.transcationId = trx.transaction_id;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // vote? 하는건 왜 없지???

    createTransaction() {
      /**
       * 거래를 작성하기위한 작업 배열을 허용
       * ScatterJS의 플러그인 제공 업체가 이 작업을 수행하기 때문에 특히 웹 응용 프로그램에는 필요하지 않다.
       */
    },
    requestSignature() {
      /**
       * Request Signature is not available for ScatterJS.
       * 네이티브 데스크톱, 모바일 어플 전용 api
       * For Web Applications see Signature Providers***
       */
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

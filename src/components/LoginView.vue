<template>
  <div class="app">
    <app-header></app-header>
    <div>
      <b-card bg-variant="dark" text-variant="white" title="Card Title">
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <b-button href="#" variant="primary">Go somewhere</b-button>
      </b-card>

      <h1>{{ msg }}</h1>

      <h2>{{ account_name }}</h2>
      <h2>randomId : {{ random_name }}</h2>

      <p>Available Funds: {{ account_funds }}</p>
      <p>RAM Usage : {{ ram_usage }} / {{ ram_max }}</p>
      <p>CPU Usage : {{ cpu_usage }} / {{ cpu_max }}</p>
      <p>NET Usage : {{ net_usage }} / {{ net_max }}</p>
      <button @click="login()">attach scatter identity</button>
      <button @click="logout()">remove identity</button>
      <br>
      <br>
      <button @click="getchainInfo()">check chain info</button>
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
      <br>
      <button @click="requestTransfer()">requestTransfer</button>
      <br>check trancsaction ID :
      <input v-model="transcationId">
      <br>
      <br>

      <h2>vote</h2>
      <br>
      <br>Voter :
      <input v-model="voter">
      <br>proxy :
      <input type="text">
      <br>
      <br>producers :
      <input v-model="producers">
      <br>

      <button @click="vote()">vote</button>
      <!-- vote 는 컨트랙트 기반으로 따로 만들어야 할 듯.. -->
      <br>
      <br>check trancsaction ID :
      <input v-model="voteTranscationId">
      <br>
      <br>
      <button @click="buyRam()">buyRam</button>
      <br>
      <button @click="sellRam()">sellRam</button>
      <br>
      <button @click="bidName()">bidname</button>
      <br>
      <button @click="bandwidthDelegate()">bandwidthDelegate</button>
      <br>
      <button @click="bandwidthUndelegate()">bandwidthUndelegate</button>
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
      <br>
      <br>
      <p>change Permission</p>
      <input type="text" placeholder="New Owner Key">
      <br>
      <input type="text" placeholder="New Active Key">
      <br>
      <button @click="changePermission()">change permission</button>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import networking from "../networking.json"; // app.vue에서 공통으로 처리하는 법 ?
import Eos from "eosjs"; // app.vue에서 공통으로 처리하는 법
import AppHeader from "@/components/template/AppHeader";
import AppFooter from "@/components/template/AppFooter";

// mainnet
// const network = networking["mainnet"];
// testnet
const network = networking["junglenet"];

const unintendedPublic =
  "EOS7H3tK2xkpGSm38a21Pxp8kZcxj2eds7AhHSEGLz4kdA7APqupy";
const intendedPublic = "EOS8XEuA1DsUwzbnsR9CAgkjifywWuKTuTtnvpD61urWBKhBA2j1o";
// active로 하니까 message: "Missing required accounts, repull the identity"

export default {
  name: "LoginView",
  props: ["checked"],
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      msg: "Welcome, A Scatter account is required",
      account_name: null,
      random_name: null,
      publicKey: null,
      eos: null,
      transferTo: null,
      TokenAmount: null,
      transcationId: null,
      account_funds: null,
      ram_usage: null,
      cpu_usage: null,
      net_usage: null,
      ram_max: null,
      cpu_max: null,
      net_max: null,
      voter: null,
      producers: null,
      voteTranscationId: null,
      permission: null,
      parent: null,
      auth: null,
      threshold: null,
      keys: null,
      code: null,
      type: null,
      authorization: null,
      ricardian: null,
      op_data: null
    };
  },
  created: function() {
    //this.load();
  },
  methods: {
    getchainInfo() {
      const baseURI = "https://jsonplaceholder.typicode.com";

      this.$http.get(`${baseURI}/posts`).then(result => {
        console.log(result);
        //this.posts = result.data
      });
    },
    async login() {
      var _self = this;
      console.log("call scatter suggestNetwork, getIdentity api ");

      // suggestNetwork
      await scatter.suggestNetwork(network);
      this.eos = scatter.eos(network, Eos);
      console.log(this.eos);

      // get identity
      await scatter
        .getIdentity({ accounts: [network] })
        .then(async identity => {
          console.log(identity);

          _self.account_name =
            identity.accounts[0].name + "@" + identity.accounts[0].authority;
          _self.random_name = identity.name;

          //.transfer(account.name, transferToAccount, transferAmount, "", opts)
          //console.log(this.eos.getAccount(identity.accounts[0].name));
          this.eos
            .getAccount(identity.accounts[0].name)
            .then(eos_account => {
              console.log(eos_account);
              _self.account_funds = eos_account.core_liquid_balance;

              // no
              _self.ram_max = _self.formatBytes(eos_account.ram_quota);
              _self.ram_usage = _self.formatBytes(eos_account.ram_usage);
              _self.net_usage = _self.formatBytes(eos_account.net_limit.used);
              _self.net_max = _self.formatBytes(eos_account.net_limit.max);

              _self.cpu_usage = _self.timeConversion(
                eos_account.cpu_limit.used
              );
              _self.cpu_max = _self.timeConversion(eos_account.cpu_limit.max);
            })
            .catch({});

          // publickey는 가저오는 api가 따로 있다. 아래처럼 가져오면 eos pulickey가 아닌, 새로운 키를 반환함.
          //_self.publicKey = identity.publicKey;
        })
        .catch(err => {
          console.error(err.message);
        });

      //_self.eos = scatter.eos(network, Eos);
    },
    // util로 빼기
    formatBytes(bytes, decimals) {
      if (bytes == 0) return "0 Bytes";
      var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    },
    timeConversion(microsec) {
      var millisec = (microsec / 1000).toFixed(1);
      var seconds = (microsec / 1000 / 1000).toFixed(1);
      var minutes = (microsec / (1000 * 60) / 1000).toFixed(1);
      var hours = (microsec / (1000 * 60 * 60) / 1000).toFixed(1);
      var days = (microsec / (1000 * 60 * 60 * 24) / 1000).toFixed(1);

      if (microsec < 1000) {
        return microsec + " µs ";
      } else if (millisec < 60) {
        return millisec + " ms";
      } else if (seconds < 60) {
        return seconds + " s";
      } else if (minutes < 60) {
        return minutes + " min";
      } else if (hours < 24) {
        return hours + " hr";
      } else {
        return days + " days";
      }
    },
    logout() {
      console.log("call scatter forgetIdentity api ");
      scatter.forgetIdentity();
      this.account_name = null;
      this.random_name = null;
      this.publicKey = null;
      this.account_funds = null;
      this.ram_usage = null;
      this.cpu_usage = null;
      this.net_usage = null;
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
       * 사용자에게 전송 요청을 보내는 api, 단순히 서명만 줌?!!
       */
      console.log("call scatter requestTransfer api ");

      // 어떻게 데이터를 주고 받길래 scatter가 뜰 수 있을까??

      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      let transferToAccount = this.transferTo;
      let transferAmount = this.TokenAmount;
      console.log(typeof transferAmount);

      // eosio.token 기반으로 transfer 수행, 다른 컨트랙 기반은 아직.
      this.eos
        .transfer(account.name, transferToAccount, transferAmount, "", opts)
        .then(trx => {
          console.log("trx", trx);
          this.transcationId = trx.transaction_id;
        })
        .catch(err => {
          console.error(err);
        });
    },
    vote() {
      var _self = this;
      let VoteProducers = this.producers; // 여러값이 선택될 수 있음
      let Voter = this.voter;

      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      // 글자는 정렬되어야 한다(sorted).
      let producer = [
        //"lioninjungle" // 한번 투표 이후 deadline exceeded
        "bigpolarbear",
        "eos42panther",
        "mosquitometa",
        "ohtigertiger",
        "proudrooster"
      ]; // 스트링하나씩 가져옴.

      console.log(this.eos);
      // eos 컨트랙의 내용을 가져온다.
      this.eos
        .voteproducer(account.name, "", producer, opts)
        .then(trx => {
          console.log("trx", trx);
          _self.voteTranscationId = trx.transaction_id;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // vote by proxy
    voteByProxy() {},
    // eos 단위 bytes 단위
    buyRam() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      console.log(account.name);
      // console.log();

      this.eos
        .buyram(account.name, "doublechain4", "1.0000 EOS")
        .then(trx => {
          console.log("trx", trx);
        })
        .catch(err => {
          console.error(err);
        });
    },
    sellRam() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      // account, byte
      this.eos
        .sellram(account.name, "1192")
        .then(trx => {
          console.log("trx", trx);
        })
        .catch(err => {
          console.error(err);
        });
    },
    bidName() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      console.log(account.name);

      // bidder, newname, bid
      this.eos
        .bidname(account.name, "cat2", "5.0000 EOS")
        .then(trx => {
          console.log("trx", trx);
        })
        .catch(err => {
          console.error(err);
        });
    },
    bandwidthDelegate() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };
      // from, receiver, stake_net_quantity, stake_cpu_quantity
      // 어디가 문제일까???...
      this.eos
        .delegatebw(0, account.name, account.name, "0.0002 EOS", 0.2)
        .then(trx => {
          console.log("trx", trx);
        })
        .catch(err => {
          console.error(err);
        });
    },
    bandwidthUndelegate() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );
      const opts = {
        authorization: [`${account.name}@${account.authority}`],
        requiredFields: {}
      };

      console.log(account.name);
      // console.log();

      // from, receiver, unstake_net_quantity, unstake_cpu_quantity
      this.eos
        .undelegatebw(account.name, "cat2", "5.0000 EOS")
        .then(trx => {
          console.log("trx", trx);
        })
        .catch(err => {
          console.error(err);
        });
    },
    async changePermission() {
      const account = scatter.identity.accounts.find(
        x => x.blockchain === "eos"
      );

      const accountName = account.name;
      const perms = await this.getNewPermissions(accountName); //
      const perms2 = perms[0];
      console.log("New permissions =>", JSON.stringify(perms2));

      const updateAuthResult = await this.eos.transaction(tr => {
        //for (const perm of perms2) {
        tr.updateauth(
          {
            account: accountName,
            permission: perms2.perm_name,
            parent: perms2.parent,
            auth: perms2.required_auth
          },
          { authorization: `${accountName}@owner` }
        );
        // }
      });
      console.log("Success =>", JSON.stringify(updateAuthResult));

      // console.log(account);
      //let pubkey = "EOS8XEuA1DsUwzbnsR9CAgkjifywWuKTuTtnvpD61urWBKhBA2j1o";
      //let pubkey = "EOS6xg86wexCzoHaSwhFYxswDB3ACPsKCUVSPKNz8tSMtKBwkp29Y";

      // owner계정으로 하면 Missing required accounts, repull the identity"
      // active계정으로 하면 {"code":3090003,"name":"unsatisfixed_authorization","what":"Provided keys, permissions, .. 에러 ==>
      // this.eos
      //   .updateauth({
      //     account: accountName,
      //     permission: "active", //바꾸는 permission - active 영역
      //     parent: "owner",
      //     auth: {
      //       threshold: 1,
      //       keys: [{ key: pubkey, weight: 1 }],
      //       accounts: [],
      //       waits: []
      //     },
      //     delay: 0
      //   })
      //   .then(trx => {
      //     console.log("trx", trx);
      //     this.transcationId = trx.transaction_id;
      //   })
      //   .catch(err => {
      //     console.error(err);
      //   });
    },
    async getNewPermissions(accountName) {
      const account = await this.eos.getAccount(accountName);
      const perms = JSON.parse(JSON.stringify(account.permissions)); // clone
      for (const perm of perms) {
        for (const key of perm.required_auth.keys) {
          if (key.key === unintendedPublic) {
            key.key = intendedPublic;
          }
        }
      }
      return perms;
    },
    buyRamByBytes() {},
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
<style>
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

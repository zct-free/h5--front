<template>
  <div>
    <div class="title">
      <h2>修改运营商状态</h2>
    </div>

    <div class="box">
      <label>移动 </label>
      <van-switch v-model="operator1" @change="change(2)">移动</van-switch>
      <label>联通 </label>
      <van-switch v-model="operator2" @change="change(3)">联通</van-switch>
      <label>电信 </label>
      <van-switch v-model="operator3" @change="change(4)">电信</van-switch>
      <!-- <van-checkbox v-model="operator1" shape="square">移动</van-checkbox>
      <van-checkbox v-model="operator2" shape="square">联通</van-checkbox>
      <van-checkbox v-model="operator3" shape="square">电信</van-checkbox> -->
    </div>
  </div>
</template>


<script>
import axios from "axios";

// const axiosConfig = {
//   timeout: 5 * 1000, // 超时时间五秒
//   withCredentials: false, // Check cross-site Access-Control
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//     deviceId: "123",
//   },
//   baseURL: "/",
// };
// const http = axios.create(axiosConfig);
export default {
  data() {
    return {
      operator3: true,
      operator2: true,
      operator1: true,
    };
  },
  methods: {
    getStatus() {
        console.log(123);
        axios
        .post("https://apparmy.81.mil.cn/vote/flow/getOperatorStatusList")
        .then((res) => {
            console.log(res);
          if (res.data.code == 1000) {
            res.data.data.map((a) => {
              switch (a.proTypeId) {
                case 2:
                  this.operator1 = a.status == '1' ? true : false;
                  break;
                case 3:
                  this.operator2 = a.status == '1' ? true : false;
                  break;
                case 4:
                  this.operator3 = a.status == '1' ? true : false;
                  break;
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    change(str) {
      let data = {};
      switch (str) {
        case 2:
          data = {
            proTypeld: str,
            status: this.operator1 == true ? 1 : 0,
          };
          break;
        case 3:
          data = {
            proTypeld: str,
            status: this.operator2 == true ? 1 : 0,
          };
          break;
        case 4:
          data = {
            proTypeld: str,
            status: this.operator3 == true ? 1: 0
          };
          break;
      }
      console.log(data);
      axios
        .post('https://apparmy.81.mil.cn/vote/flow/editOperatorStatus',`proTypeld=${str}&status=${data.status}`)
        .then((res) => {
          if (res.data.data == true) {
            this.$toast.success("修改成功");
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(str);
      console.log(this.operator3, this.operator2, this.operator1);
    },
  },
  mounted(){
    this.getStatus()
  }
};
</script>

<style scoped>
.title {
  text-align: center;
}
.box {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.button {
  text-align: center;
  /* margin-left: 50%; */
}
</style>
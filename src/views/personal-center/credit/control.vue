<template>
  <div id="exchange">
    <div>
      <i class="el-icon-s-tools">积分兑换后台控制</i>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="流量运营商兑换状态" name="1">
        <el-form ref="form" label-width="120px">
          <el-form-item label="修改运营商状态">
            <label>移动 </label>
            <el-switch v-model="operator1" @change="change(2)"> </el-switch>
            <label>联通 </label>
            <el-switch v-model="operator2" @change="change(3)"> </el-switch>
            <label>电信 </label>
            <el-switch v-model="operator3" @change="change(4)"> </el-switch>
          </el-form-item> </el-form
      ></el-tab-pane>
      <el-tab-pane label="积分兑换通知" name="2">
        <el-form ref="form1" label-width="90px">
          <el-form-item label="选择运营商">
            <el-select v-model="proTypeId" placeholder="请选择">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-form-item>
          <el-form-item label="通知内容">
            <el-input type="textarea" placeholder="请输入内容" v-model="text" />
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="subtext">提交</el-button>
          </el-form-item>
        </el-form></el-tab-pane
      >
      <el-tab-pane label="通知列表" name="3"
        ><div class="list">
          <el-table :data="list" style="width: 100%">
            <el-table-column prop="no" label="id" width="180">
            </el-table-column>
            <el-table-column prop="proTypeId" label="运营商" width="180">
            </el-table-column>
            <el-table-column prop="text" label="地址"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  @click="deleteNotice(scope.row.id)"
                  size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div></el-tab-pane
      >
      <el-tab-pane label="最新兑换记录查询" name="4">
        <el-form ref="form2" label-width="80px">
          <el-form-item label="手机号">
            <el-input v-model="phone"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="searchphone">提交</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="data" stripe style="width: 100%">
          <el-table-column prop="id" label="id" width="180"> </el-table-column>
          <el-table-column prop="respMsg" label="状态" width="180">
          </el-table-column>
          <el-table-column prop="orderId" label="订单号" width="180">
          </el-table-column>
          <el-table-column prop="proTypeId" label="运营商">
            <template slot-scope="scope">
              {{ options.find((a) => a.value == scope.row.proTypeId).label }}
            </template>
          </el-table-column>
          <el-table-column prop="transNo" label="trans号"> </el-table-column>
          <el-table-column prop="timeStamp" label="时间"> </el-table-column>
          <el-table-column prop="backUrl" label="回调地址"> </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="resetStatus(scope.row.id)"
                type="text"
                size="small"
                >重置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="充值流量" name="5">
        <el-form ref="form3" label-width="90px">
          <el-form-item label="选择运营商">
            <el-select v-model="proTypeId2" placeholder="请选择">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option> </el-select
          ></el-form-item>
          <el-form-item label="充值手机号">
            <el-input
              type="text"
              placeholder="手机号"
              v-model="exchangephone"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="exchange">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
axios.defaults.baseURL = "https://apparmy.81.mil.cn";
// axios.defaults.baseURL = "https://backend.soap.com/";
export default {
  data() {
    return {
      operator3: true,
      operator2: true,
      operator1: true,
      text: "",
      proTypeId: null,
      proTypeId2: null,
      activeName: "1",
      exchangephone: null,
      list: [],
      data: [],
      phone: null,
      options: [
        { label: "无关营业商", value: 1 },
        { label: "移动", value: 2 },
        { label: "联通", value: 3 },
        { label: "电信", value: 4 },
      ],
    };
  },
  methods: {
    getStatus() {
      console.log(123);
      axios
        .post("/vote/flow/getOperatorStatusList")
        .then((res) => {
          console.log(res);
          if (res.data.code == 1000) {
            res.data.data.map((a) => {
              switch (a.proTypeId) {
                case 2:
                  this.operator1 = a.status == "1" ? true : false;
                  break;
                case 3:
                  this.operator2 = a.status == "1" ? true : false;
                  break;
                case 4:
                  this.operator3 = a.status == "1" ? true : false;
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
            status: this.operator3 == true ? 1 : 0,
          };
          break;
      }
      console.log(data);
      axios
        .post(
          "/vote/flow/editOperatorStatus",
          `proTypeId=${str}&status=${data.status}`
        )
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
    gettext() {
      axios
        .post("/vote/flow/getNotice")
        .then((res) => {
          if (Object.keys(res.data.data)[0] === "data") {
            this.list = [];
          } else {
            this.list = [];
            Object.keys(res.data.data).forEach((key) => {
              console.log(key, "key");
              this.list.push({
                proTypeId: this.options.find(
                  (a) => a.value == res.data.data[key].proTypeId
                ).label,
                text: res.data.data[key].text,
                no: key,
                id: res.data.data[key].id,
              });
            });
            console.log(this.list);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    subtext() {
      if (this.proTypeId) {
        axios
          .post(
            "/vote/flow/addNotice",
            `proTypeId=${this.proTypeId}&text=${this.text}`
          )
          .then((res) => {
            if (res.data.msg == "success") {
              this.$toast.success("修改成功");
              this.text = "";
              this.gettext();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$toast("请选择运营商");
      }
    },
    deleteNotice(str) {
      console.log(str);
      this.$confirm("此操作将永久删除该通知, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("/vote/flow/delNotice", `ids=${str}`)
            .then((res) => {
              if (res.data.msg == "success") {
                this.$toast.success("修改成功");
                this.gettext();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    reset() {
      this.text = "";
      this.proTypeId = null;
      this.proTypeId2 = null;
      this.exchangephone = null;
      this.phone = null;
    },
    searchphone() {
      axios
        .post("/vote/flow/confirmByPhone?phoneNo=" + this.phone)
        .then((res) => {
          this.data = [];
          this.data.push(...res.data.data["list"]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkModbile(mobile) {
      var re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
      var result = re.test(mobile);
      if (!result) {
        this.$toast.fail("手机号码格式不正确");
        return false; //若手机号码格式不正确则返回false
      }
      return true;
    },
    resetStatus(id) {
      axios
        .post("/vote/flow/statusReset?id=" + id)
        .then((res) => {
          console.log(res);
          
          this.searchphone()
        })
        .catch((error) => {
          console.log(error);
        });
    },
    exchange() {
      if (this.exchangephone) {
        const validate = this.checkModbile(this.exchangephone);
        if (!validate) return;
        if (this.proTypeId2) {
          const data = {
            proTypeId: this.proTypeId2,
            phoneNo: this.exchangephone,
            userId: "707c85d1edb04964b5678305127e80b1",
          };
          // if (window.localStorage.getItem("phone")) {
          //   this.laterRequest();
          // } else {
          axios.post("/vote/flow/order", data).then((res) => {
            if (res.data.code == 1000) {
              this.$toast.success("充值完成，请查看充值记录是否充值成功");
              this.reset();
            }
          });
        } else {
          this.$toast.fail("请选择运营商");
        }

        // debugger
      } else {
        this.$toast.fail("请输入手机号");
      }
    },
  },
  mounted() {
    this.getStatus();
    this.gettext();
  },
};
</script>

<style scoped lang='less'>
* {
  font-size: 14px !important;
}
label {
  margin-left: 5px;
}
.el-icon-s-tools {
  font-size: 25px !important;
  color: #909399;
}
#exchange {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: #f4f4f4;
}
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
  margin-top: 0.2rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  padding: 0 30%;
  /* margin-left: 50%; */
}
.radio {
  display: flex;
  justify-content: space-around;
}
.van-cell {
  border: 0.01rem solid gar !important;
}
.listbox {
  display: flex;
  justify-content: space-between;
  span {
    overflow: scroll;
    white-space: nowrap;
  }
}
</style>
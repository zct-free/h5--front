<!--
 * @FORM: KALT
 * @Description: 无
-->
<template>
  <div class="personal-credit-container">
    <div class="header">
      <div class="top">
        <span class="record" @click="exchangeRecord">兑换记录</span>
        <span class="record" @click="gotoArticle">兑换说明</span>
      </div>
      <div class="mid">
        <div
          class="score"
          @touchstart="gtouchstart()"
          @touchmove="gtouchmove()"
          @touchend="showDeleteButton()"
        >
          {{ score }}
        </div>
        <div class="img">
          <img src="@/assets/reditrank/goldcoin.png" alt="" />
        </div>
        <div class="text">剩余可兑换积分</div>
      </div>
    </div>
    <div class="content-container">
      <van-tabs
        v-model="active"
        @change="changeTab"
        title-active-color="#e22516"
      >
        <van-tab
          v-for="(item, index) in typeList"
          :key="index"
          :title="item.type_name"
        >
          <van-notice-bar
            mode="closeable"
            left-icon="volume-o"
            :text="text"
            v-if="text"
            class="notice"
          />
          <div class="content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-if="detailList.length > 0"
                v-model="loading"
                :offset="12"
                :finished="finished"
                @load="onLoad"
                :immediate-check="false"
              >
                <div class="commodity-list">
                  <div
                    class="commodity-item"
                    v-for="(item, index) in exchangeList"
                    :key="index"
                  >
                    <span class="number"
                      ><span class="score">{{ item.eb_count }}</span
                      >积分</span
                    >
                    <img :src="item.product_pic" alt="" />

                    <div
                      class="button"
                      @click="
                        opentype(
                          index,
                          item.type_name == '流量包' ? 2 : 1,
                          item.eb_count,
                          item.product_id
                        )
                      "
                    >
                      <img src="@/assets/reditrank/button.png" alt="" />
                      <span>立即兑换</span>
                    </div>
                    <p>剩余数量：{{ item.store_count }}</p>
                  </div>
                </div>
              </van-list>
              <div class="no-more" v-else>暂无数据</div>
            </van-pull-refresh>
          </div>
          <van-dialog
            v-model="show"
            title="流量包兑换"
            :showConfirmButton="false"
            :before-close="beforeclose"
            width="90%"
          >
            <van-form :key="formKey" ref="form">
              <van-field
                v-model="tel"
                type="tel"
                label="手机号"
                maxlength="11"
                placeholder="请输入手机号"
              />
              <van-field name="radio" label="运营商">
                <template #input>
                  <van-radio-group v-model="proTypeId" direction="horizontal">
                    <!-- <van-radio name="1">移动</van-radio> -->
                    <!-- 2->移动，3->联通，4->电信 -->
                    <van-radio
                      :name="2"
                      :disabled="operator1"
                      @click="operator1 && openNotice(2)"
                      >移动</van-radio
                    >
                    <van-radio
                      :name="3"
                      :disabled="operator2"
                      @click="operator2 && openNotice(3)"
                      >联通</van-radio
                    >
                    <van-radio
                      :name="4"
                      :disabled="operator3"
                      @click="operator3 && openNotice(4)"
                      >电信</van-radio
                    >
                  </van-radio-group>
                </template>
              </van-field>
              <div class="button">
                <van-button type="default" class="btn" @click="cancel()"
                  >取消</van-button
                >
                <van-button
                  type="info"
                  class="btn"
                  @click="confirm()"
                  :loading="loading2"
                  >确认</van-button
                >
              </div>
            </van-form>
          </van-dialog>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";
import native from "../../../plugins/native";
import axios from "axios";
import { errcode } from "./data.js";
import { Dialog } from "vant";
const {
  SERVER_NAME: { credits },
} = baseConfig;
import {
  queryPrizesType,
  queryPrizesList,
  exchangePrizes,
  valiexchange,
  sendMsg,
  sendMsgInfo,
  verifyCode,
} from "../../../../serve/api/integral";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data: () => ({
    list: [],
    score: 0,
    loading: false,
    finished: true,
    active: "",
    detailList: [],
    exchangeList: [],
    refreshing: false,
    allTypes: [],
    pageSize: 10,
    pageNum: 1,
    typeList: [],
    typeId: "",
    userId: null,
    show: false,
    tel: "",
    proTypeId: undefined, // 2->移动，3->联通，4->电信
    allproType: {
      2: "移动",
      3: "联通",
      4: "电信",
    },
    formKey: 0,
    loading2: false,
    productId: "",
    operator3: true, //电信
    operator2: true, //联通
    operator1: true, //移动
    text: null,
  }),
  async created() {
    this.userId = window.localStorage.getItem("uuid");
    console.log(this.userId, "userId");
    this.getData();
    let res = await queryPrizesType({
      pageSize: 10,
      pqgeNum: 1,
      typeId: "",
      typeName: "",
      parentId: "",
    });
    let { code, data } = res.data;
    if (code === 1000) {
      console.log(JSON.parse(data), "data");
      this.allTypes = JSON.parse(data).response.body.typeList.typeVo;
      this.typeList = this.allTypes.filter((item) => item.parent_id !== -1);
      console.log(this.typeList, "typelist");
      this.changeTab(0, this.typeList[0].type_name);
    }
  },
  mounted() {
    this.getStatus();
    this.gettext();
    document.title = "学分银行";
  },
  methods: {
    gotoArticle() {
      const path = `xxqj://tkNews?id=d2d59e6c98e5459baef9c7f191b499ba&columnName=${"积分兑换说明"}`;
      native.appJump(path);
    },
    async getData() {
      try {
        const res = await this.$axios.get(credits + "/balance", {
          params: {
            userId: this.userId,
          },
        });
        if (res.data.code === 1000) {
          this.score = res.data.data.booksNumber;
        } else {
          this.$toast.fail(res.data.msg);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onLoad() {
      this.pageNum++;
      this.getList(this.typeId);
      this.loading = false;
    },
    onRefresh() {
      this.pageNum = 1;
      this.detailList = [];
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      // this.loading = true;
      this.getList(this.typeId);
    },
    async getList(typeId) {
      try {
        const res = await queryPrizesList({
          typeId,
          prizeId: "",
          pageSize: 10,
          pageNum: this.pageNum,
        });
        let { data } = res.data;
        console.log(data);
        data = JSON.parse(data);
        if (data.response.head.error_code === "00000") {
          const arr = data.response.body.proList.productVo.length
            ? data.response.body.proList.productVo
            : [data.response.body.proList.productVo];
          this.detailList = [...this.detailList, ...arr];
          this.exchangeList = this.detailList?.sort(function (x, y) {
            return x.eb_count - y.eb_count;
          });
          this.finished = arr.length < 9;
        }
      } catch (error) {
        this.finished = true;
      }
      console.log(this.detailList, "detailist");

      this.refreshing = false;
    },
    changeTab(val, title) {
      this.pageNum = 1;
      console.log(this.allTypes);
      let typeId = this.allTypes.find(
        (item) => item.type_name === title
      ).type_code;
      // console.log(this.allTypes);
      // console.log(this.allTypes.find(item => item.parent_id === typeId),'1111', typeId);
      // typeId = this.allTypes.find(item => item.parent_id === typeId)
      if (!typeId) {
        return;
      }
      this.typeId = typeId.type_code;
      this.detailList = [];
      this.getList(typeId);
    },
    async exchangeRecord() {
      this.$router.push("/personal-center/exchangeRecord");
    },
    async exchange(index, productId) {
      let timeArr = new Date().toLocaleDateString().split("/");
      const res = await exchangePrizes({
        userId: this.userId,
        productNumber: 1,
        productId: productId,
        clearTime: timeArr.join("-"),
      });
      let { response } = JSON.parse(res.data.data);
      if (response.head.error_code === "00000") {
        if (
          window.nativeHandler &&
          typeof window.nativeHandler.execute === "function"
        ) {
          window.nativeHandler.execute(
            "scoreFlow",
            `{"userId":${this.userId || ""}, "count": 1}`,
            null
          );
        }
        this.$toast.setDefaultOptions({ duration: 600 });
        this.$toast.success("奖品兑换成功");
      } else {
        this.$toast.fail("兑换失败");
      }
      this.getData();
      this.changeTab(this.active, this.typeList[this.active].type_name);
    },
    // 打开流量兑换弹窗
    openshow() {
      this.show = true;
    },
    //   运营商状态获取
    getStatus() {
      axios
        .get("https://apparmy.81.mil.cn/vote/flow/getOperatorStatusList")
        .then((res) => {
          if (res.data.code == 1000) {
            res.data.data.map((a) => {
              switch (a.proTypeId) {
                case 2:
                  this.operator1 = a.status == "0" ? true : false;
                  break;
                case 3:
                  this.operator2 = a.status == "0" ? true : false;
                  break;
                case 4:
                  this.operator3 = a.status == "0" ? true : false;
                  break;
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 开启通知
    openNotice(proTypeId) {
      let text = "";
      axios
        .post("https://apparmy.81.mil.cn/vote/flow/getNotice")
        .then((res) => {
          console.log(res.data);
          if (Object.keys(res.data.data)[0] === "data") {
            this.text = null;
          } else {
            var i = 1;
            Object.keys(res.data.data).forEach((key) => {
              if (res.data.data[key].proTypeId == proTypeId) {
                console.log(key, "key");
                console.log(res.data[key]);
                text += "第" + i + "条通知" + res.data.data[key].text + ";";
                i++;
              }
            });
            console.log(text, "text");
            if (text) {
              Dialog({ message: text });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    //提交流量兑换
    async confirm() {
      if (this.tel) {
        const validate = this.checkModbile(this.tel);
        if (!validate) return;
        if (this.proTypeId) {
          const data = {
            proTypeId: this.proTypeId,
            phoneNo: this.tel,
            userId: this.userId,
          };
          const msg = `您的${this.allproType[this.proTypeId]}手机号为${
            this.tel
          },请确认是否正确`;
          Dialog.confirm({
            title: "提示",
            message: msg,
          })
            .then(() => {
              let timeArr = new Date().toLocaleDateString().split("/");
              const parama = {
                userId: this.userId,
                productNumber: 1,
                productId: this.productId,
                clearTime: timeArr.join("-"),
              };
              exchangePrizes(parama).then((res) => {
                let { response } = JSON.parse(res.data.data);
                if (response.head.error_code == "00000") {
                  window.localStorage.setItem("exchangeRecordCount", 1);
                  if (
                    window.nativeHandler &&
                    typeof window.nativeHandler.execute === "function"
                  ) {
                    window.nativeHandler.execute(
                      "scoreFlow",
                      `{"userId":${this.userId || ""}, "count": 1}`,
                      null
                    );
                  }
                  axios
                    .post("https://apparmy.81.mil.cn/vote/flow/order", data)
                    .then((res2) => {
                      if (res2.data.code == 1000) {
                        // console.log(res.data,'res.data');
                        // this.$toast.success("奖品兑换成功");
                        this.show = false;
                        this.loading2 = false;
                        this.tel = "";
                        this.proTypeId = undefined;
                        // this.loadinOn();
                        // let transNo = res.data.data.transNo;
                        this.$router.push({
                          path: "/personal-center/credit/complete",
                          query: {
                            isSuccess: true,
                          },
                        });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                  this.getData();
                  this.changeTab(
                    this.active,
                    this.typeList[this.active].type_name
                  );
                } else if (response.head.error_code == "10028") {
                  this.$toast.fail("商品本月兑换上限");
                } else if (response.head.error_code == "10022") {
                  this.$toast.fail("商品总数量兑换上限");
                } else if (response.head.error_code == "10035") {
                  this.$toast.fail("记录不存在");
                } else if (response.head.error_code == "10012") {
                  if (count == 0) {
                    this.$toast.fail("该项目每月限兑换一次，已达上限");
                  } else if (count == 100) {
                    this.$toast.fail("该项目每月限兑换九次，已达上限");
                  } else {
                    this.$toast.fail("本月可兑换次数不足");
                  }
                } else {
                  this.$toast.fail(errcode[response.head.error_code]);
                }
              });
            })
            .catch(() => {
              // on cancel
            });

          // }
        } else {
          this.$toast.fail("请选择运营商");
        }

        // debugger
      } else {
        this.$toast.fail("请输入手机号");
      }
    },

    async valiState() {},
    //打开弹窗类型判断
    async opentype(index, type, count, productId) {
      this.productId = productId;

      if (this.score >= count) {
        if (type == 1) {
          this.exchange(index, productId);
        }
        if (type == 2) {
          //校验是否上一单是否兑换成功
          axios
            .post(
              "https://apparmy.81.mil.cn/vote/flow/confirmByUserId?userId=" +
                this.userId
            )
            .then((res) => {
              if (res.data.msg == "充值中") {
                this.$toast.fail("上一单尚未充值完成请稍候在充值");
              } else {
                let timeArr = new Date().toLocaleDateString().split("/");
                valiexchange({
                  userId: this.userId,
                  productNumber: 1,
                  productId: productId,
                  clearTime: timeArr.join("-"),
                }).then((res2) => {
                  let { response } = JSON.parse(res2.data.data);
                  if (response.head.error_code == "00000") {
                    window.localStorage.setItem("exchangeRecordCount", 1);
                    if (
                      window.nativeHandler &&
                      typeof window.nativeHandler.execute === "function"
                    ) {
                      window.nativeHandler.execute(
                        "scoreFlow",
                        `{"userId":${this.userId || ""}, "count": 1}`,
                        null
                      );
                    }
                    this.openshow(); //打开弹窗
                  } else if (response.head.error_code == "10028") {
                    this.$toast.fail("商品本月兑换上限");
                  } else if (response.head.error_code == "10022") {
                    this.$toast.fail("商品总数量兑换上限");
                  } else if (response.head.error_code == "10035") {
                    this.$toast.fail("记录不存在");
                  } else if (response.head.error_code == "10012") {
                    if (count == 0) {
                      this.$toast.fail("该项目每月限兑换一次，已达上限");
                    } else if (count == 100) {
                      this.$toast.fail("该项目每月限兑换九次，已达上限");
                    } else {
                      this.$toast.fail("本月可兑换次数不足");
                    }
                  } else {
                    this.$toast.fail(errcode[response.head.error_code]);
                  }
                });
              }
            });
        }
      } else {
        this.$toast.fail("您的积分不足");
      }
    },
    // async opentype(index, type, count, productId) {
    //   console.log(productId);
    //   if (this.score >= count) {
    //     if (type == 1) {
    //       this.exchange(index, productId);
    //     }
    //     if (type == 2) {
    //       let timeArr = new Date().toLocaleDateString().split("/");
    //       const res = await exchangePrizes({
    //         userId:this.userId,
    //         productNumber: 1,
    //         productId: productId,
    //         clearTime: timeArr.join("-"),
    //       });
    //       let { response } = JSON.parse(res.data.data);
    //       if (response.head.error_code == "00000") {
    //         window.localStorage.setItem("exchangeRecordCount", 1);
    //         if (
    //           window.nativeHandler &&
    //           typeof window.nativeHandler.execute === "function"
    //         ) {
    //           window.nativeHandler.execute(
    //             "scoreFlow",
    //             `{"userId":${
    //              this.userId|| ""
    //             }, "count": 1}`,
    //             null
    //           );
    //         }
    //         this.openshow();
    //       } else if (response.head.error_code == "10028") {
    //         this.$toast.fail("商品本月兑换上限");
    //       } else if (response.head.error_code == "10022") {
    //         this.$toast.fail("商品总数量兑换上限");
    //       } else if (response.head.error_code == "10035") {
    //         this.$toast.fail("记录不存在");
    //       } else if (response.head.error_code == "10012") {
    //         if (count == 0) {
    //           this.$toast.fail("该项目每月限兑换一次，已达上限");
    //         } else if (count == 100) {
    //           this.$toast.fail("该项目每月限兑换九次，已达上限");
    //         } else {
    //           this.$toast.fail("本月可兑换次数不足");
    //         }
    //       } else {
    //         this.$toast.fail(errcode[response.head.error_code]);
    //       }
    //     }
    //   } else {
    //     this.$toast.fail("您的积分不足");
    //   }
    // },
    gettext() {
      axios
        .post("https://backend.soap.com/vote/flow/getNotice")
        .then((res) => {
          console.log(res.data);
          if (Object.keys(res.data.data)[0] === "data") {
            this.text = null;
          } else {
            this.text = "";
            var i = 1;
            Object.keys(res.data.data).forEach((key) => {
              if (res.data.data[key].proTypeId == 1) {
                console.log(key, "key");
                console.log(res.data[key]);
                this.text +=
                  "第" + i + "条通知" + res.data.data[key].text + ";";
                i++;
              }
            });
            console.log(this.text, "text");
          }
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
    cancel() {
      this.getData();
      this.changeTab(this.active, this.typeList[this.active].type_name);
      this.show = false;

      this.loading2 = false;
      this.tel = "";
      this.sms = "";
      this.proTypeId = undefined;
      this.formKey++;
    },
    beforeclose(action, done) {
      // 点击了确定按钮
      if (action === "confirm") {
        // if()...也可以加入一些条件
        return done(false); //直接return它即可阻止
      }
      // 点击了取消按钮
      else {
        done(true); //关闭弹窗, true可以省略
      }
      this.tel = "";
      this.sms = "";
      this.proTypeId = undefined;
      this.formKey++;
    },
    gtouchstart() {
      var self = this;
      this.timeOutEvent = setTimeout(function () {
        self.longPress();
      }, 10000);
      return false;
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    showDeleteButton() {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（如onclick事件）
        console.log("点击但未长按");
      }
      return false;
    },
    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },
    //真正长按后应该执行的内容
    longPress(val) {
      this.timeOutEvent = 0;
      this.$prompt("请输入密码", "提示", {})
        .then(({ value }) => {
          if (value == "项目统筹组") {
            this.$router.push("/control");
          }
        })
        .catch(() => {});
      console.log("长按");
    },
  },
};
</script>

<style scoped lang='less'>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
}
.notice {
  // position: fixed;
  margin-bottom: 0.05rem;
  margin-top: -0.3rem;
  width: 100%;
}
.button {
  display: flex;
  justify-content: space-around;
  margin: 0.2rem 0;
  .btn {
    width: 30%;
  }
}
.personal-credit-container {
  height: 100%;
  width: 100%;
  .header-container {
    position: relative;
    width: 100%;
    height: 2.8rem;
    background: #c71f1f;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: #fff;
    .top {
      font-weight: bold;
      font-size: 0.3rem;
    }
    .center {
      font-size: 0.5rem;
    }
    .bottom {
      font-size: 0.25rem;
      height: 0.5rem;
      line-height: 0.5rem;
      background: #aa1e21;
      border-radius: 0.2rem;
      width: 3.1rem;
      text-align: center;
      i {
        margin-right: 0.1rem;
        color: #ffdf89;
      }
    }
    .record {
      position: absolute;
      top: 0.38rem;
      right: 0.25rem;
      font-size: 0.3rem;
      font-weight: bold;
    }
  }
  .header {
    width: 100%;
    height: 3.75rem;
    background: url("../../../assets/reditrank/banner.png");
    background-size: cover;
    .top {
      display: flex;
      justify-content: space-between;
      padding: 4%;
      .tips {
        font-size: 0.2rem;
        color: white;
      }
      .record {
        display: block;
        font-size: 0.3rem;
        color: white;
        // background-color: #f39d81;
        height: 0.6rem;
        line-height: 0.53rem;
        width: 1.6rem;
        text-align: center;
        border-radius: 0.34rem;
        border: 0.05rem solid #fbebc1;
        background: linear-gradient(#ff8726, #ffc678, #ff8726);
      }
    }
    .mid {
      width: 100%;
      text-align: center;
      padding-top: 0.2rem;
      .score {
        font-size: 0.58rem;
        // margin-bottom: 0.1rem;
        font-weight: 700;
        color: #ff4000;
      }
      .img {
        img {
          width: 0.5rem;
        }
      }
      .text {
        color: #f64601;
        margin-left: 35%;
        margin-top: 0.2rem;
        height: 0.4rem;
        font-weight: 600;
        width: 30%;
        background: linear-gradient(to bottom, #fbe5ab, #f9b80c);
        font-family: "宋体";
        font-size: 0.25rem;
        line-height: 0.4rem;
        border-radius: 0.4rem;
      }
    }
  }
  .content-container {
    height: 100%;
    .content {
      height: 100%;
      width: 100%;
      background-color: #f4f4f4;
      .no-more {
        text-align: center;
        color: #8b8b8b;
        padding-top: 0.2rem;
      }
    }
  }
  .commodity-list {
    display: flex;
    flex-wrap: wrap;
    .commodity-item {
      width: 3.42rem;
      height: 5.1rem;
      background: #fff5e6;
      margin-bottom: 0.17rem;
      border-radius: 0.08rem;
      border: 0.01rem solid #f3eae6;
      padding: 0.2rem 0.1rem 0;
      position: relative;
      &:nth-child(2n) {
        margin-left: 0.17rem;
      }
      &:nth-child(2n + 1) {
        margin-left: 0.25rem;
      }
      img {
        width: 3.42rem;
        height: 3.5rem;
        border-radius: 0.08rem 0.08rem 0 0;
        overflow: hidden;
      }
      .button {
        width: 100%;
        padding: 0 0.1rem;
        position: relative;
        margin: 0;
        margin-top: 0.1rem;
        img {
          height: 0.8rem;
        }
        span {
          position: absolute;
          // top: 0.35rem;
          color: white;
          font-size: 0.34rem;
          font-weight: 700;
          line-height: 0.8rem;
        }
      }
      p {
        font-size: 0.22rem;
        font-weight: 400;
        color: #7d7d7d;
        line-height: 0.35rem;
        text-align: center;
        // margin: 0.1rem 0.2rem 0 0.2rem;
        white-space: nowrap; /* 强制在一行显示 */
        overflow: hidden; /* 盒子溢出不显示 */
        text-overflow: ellipsis; /* 文字溢出省略 */
      }
      .number {
        font-weight: 500;
        color: #d73a19;
        position: absolute;
        top: 0;
        left: 0;
        background: #fff5e6;
        margin-top: 0.2rem;
        margin-left: 0.09rem;
        height: 0.6rem;
        border: 0;
        border-radius: 0 0 0.6rem 0;
        overflow: hidden;
        font-size: 0.2rem;
        font-weight: 600;
        padding-right: 0.4rem;
        padding-bottom: 0.01rem;
        .score {
          padding-left: 0.01rem;
          line-height: 0.6rem;
          font-size: 0.7rem;
        }
      }
      .description {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.2rem;
        align-items: center;
      }
    }
  }
}
</style>
<style lang='less'>
.van-tabs {
  height: 100%;
  .van-tabs__content {
    min-height: 100%;
    background: #f4f4f4;
    font-size: 0.27rem;
    padding: 0.3rem 0;
  }
  .van-tab__pane {
    height: 100%;
    .van-pull-refresh {
      height: 100%;
    }
  }
  .van-tab__text {
    font-weight: 550;
  }
}
.el-message-box {
  width: 80% !important;
  margin-top: 10% !important;
}
.van-list {
  min-height: 100vh;
}
.van-field__label {
  width: 1rem;
  margin-right: 0.2 rem;
}
</style>
<!--
 * @FORM: KALT
 * @Description: 无
-->
<template>
  <div class="personal-credit-container">
    <div class="header-container">
      <div class="top">我的剩余兑换积分</div>
      <div class="center">
        {{ score }}
      </div>
      <div class="bottom">
        <i class="iconfont icon-jifen"></i>
        <span>兑换不减少学习积分</span>
      </div>
      <div @click="exchangeRecord" class="record">兑换记录</div>
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
                    @click="detail"
                    v-for="(item, index) in detailList"
                    :key="item.product_id"
                  >
                    <img :src="item.product_pic" alt="" />
                    <p>{{ item.product_name }}</p>
                    <p>剩余数量：{{ item.store_count }}</p>
                    <div class="description">
                      <span class="number">{{ item.eb_count }}积分</span>
                      <van-button
                        type="primary"
                        size="mini"
                        @click="
                          opentype(index, item.type_name == '流量包' ? 2 : 1)
                        "
                        >兑换</van-button
                      >
                    </div>
                  </div>
                </div>
              </van-list>
              <div class="no-more" v-else>暂无数据</div>
            </van-pull-refresh>
          </div>
          <van-dialog
            v-model="show"
            title="流量包兑换"
            show-cancel-button
            @confirm="confirm()"
            :before-close="beforeclose"
          >
            <van-form :key="formKey" ref="form">
              <van-field
                v-model="tel"
                type="tel"
                label="手机号"
                maxlength="11"
              />
              <van-field v-model="sms" center clearable label="短信验证码">
                <template #button>
                  <van-button
                    native-type="button"
                    size="small"
                    type="primary"
                    :disabled="ifverify"
                    @click="verify"
                    >{{ timer }}</van-button
                  >
                </template>
              </van-field>
            </van-form>
          </van-dialog>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";
const {
  SERVER_NAME: { credits },
} = baseConfig;
import {
  queryPrizesType,
  queryPrizesList,
  exchangePrizes,
  sendMsg,
  sendMsgInfo,
  verifyCode,
} from "../../../../serve/api/integral";
export default {
  data: () => ({
    list: [],
    score: 0,
    loading: false,
    finished: true,
    active: "",
    detailList: [],
    refreshing: false,
    allTypes: [],
    pageSize: 10,
    pageNum: 1,
    typeList: [],
    typeId: "",
    ids: [],
    show: false,
    tel: "",
    sms: "",
    timer: "发送验证码",
    ifverify: false,
    formKey: 0,
    countdownInterval: null,
    productId: "",
  }),
  async created() {
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
    document.title = "学分银行";
  },
  methods: {
    async getData() {
      try {
        const res = await this.$axios.get(credits + "/balance", {
          params: {
            userId: window.localStorage.getItem("uuid"),
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
      this.ids = [];
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
        this.ids = [...this.ids, ...data.split('"product_id":')];
        console.log(data);
        data = JSON.parse(data);
        if (data.response.head.error_code === "00000") {
          const arr = data.response.body.proList.productVo.length
            ? data.response.body.proList.productVo
            : [data.response.body.proList.productVo];
          this.detailList = [...this.detailList, ...arr];
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
      this.ids = [];
      this.getList(typeId);
    },
    detail() {
      return;
      this.$router.push("/personal-center/productDetails");
    },
    async exchangeRecord() {
      this.$router.push("/personal-center/exchangeRecord");
    },
    async exchange(index) {
      // console.log(end,this.ids[index + 1]);

      // let productId = this.ids[index + 1].slice(0, end).trim();
      // console.log(productId);

      let timeArr = new Date().toLocaleDateString().split("/");
      const res = await exchangePrizes({
        userId: window.localStorage.getItem("uuid"),
        productNumber: 1,
        productId: this.productId,
        clearTime: timeArr.join("-"),
      });
      let { response } = JSON.parse(res.data.data);
      if (response.head.error_code === "00000") {
        this.$toast.setDefaultOptions({ duration: 600 });
        this.$toast.success("奖品兑换成功");
      } else {
        this.$toast.fail("兑换失败");
      }
      this.getData();
      this.changeTab(this.active, this.typeList[this.active].type_name);
    },
    openshow(index) {
      this.show = true;
    },
    async confirm() {
      if (!this.sms) {
        this.$toast.fail("请输入验证码");
      } else {
        const params = {
          // appVersion: "1.69.12",
          code: this.sms,
          phone: this.tel,
          region: "87",
        };
        let timeArr = new Date().toLocaleDateString().split("/");
        const res1 = await verifyCode(params);
        if (res1.data.code == 1000) {
          const data = {
            userId: window.localStorage.getItem("uuid"),
            productNumber: 1,
            productId: this.productId,
            clearTime: timeArr.join("-"),
          };
          // debugger
          exchangePrizes(data).then((res) => {
            if (res.data.code == 1000) {
              this.timer = "发送验证码";
              this.ifverify = false;
              this.show = false;
              this.$toast.success("奖品兑换成功");
              clearInterval(this.countdownInterval);
              this.tel = "";
              this.sms = "";
              this.getData();
              this.changeTab(this.active, this.typeList[this.active].type_name);
            }
          });
        }
      }
    },
    opentype(index, type) {
      let end = this.ids[index + 1].indexOf(",");

      this.productId = this.ids[index + 1].slice(0, end).trim();

      if (type == 1) {
        this.exchange(index);
      }
      if (type == 2) {
        this.openshow();
      }
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
      clearInterval(this.countdownInterval);
      this.timer = "发送验证码";
      this.ifverify = false;
      this.tel = "";
      this.sms = "";
      this.formKey++;
    },
    verify() {
      if (!this.tel) {
        this.$toast.fail("请输入手机号");
      } else {
        const params = {
          phone: this.tel,
          // region: "86",
        };

        sendMsg(params);
        this.ifverify = true;
        this.timer = 60;
        this.countdownInterval = setInterval(() => {
          this.timer--;
          if (this.timer <= 0) {
            clearInterval(this.countdownInterval);
            this.ifverify = false;
            this.timer = "发送验证码";
          }
        }, 1000);
      }
    },
  },
};
</script>

<style scoped lang='less'>
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
  .content-container {
    height: 100%;
    .content {
      height: 100%;
      width: 100%;
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
      height: 5rem;
      background: #ffffff;
      margin-bottom: 0.17rem;
      border-radius: 0.08rem;
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
      p {
        font-size: 0.25rem;
        font-weight: 400;
        color: #333333;
        line-height: 0.35rem;
        margin: 0.1rem 0.2rem 0 0.2rem;
        white-space: nowrap; /* 强制在一行显示 */
        overflow: hidden; /* 盒子溢出不显示 */
        text-overflow: ellipsis; /* 文字溢出省略 */
      }
      .description {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.2rem;
        align-items: center;
        .number {
          font-weight: 500;
          color: #fe2e24;
        }
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
.van-list {
  min-height: 100vh;
}
</style>
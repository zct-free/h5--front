<template>
  <div class="personal-credit-container">
    <div class="header">
      <div class="top">
        <span class="record" @click="exchangeRecord">兑换记录</span>
        <span class="record" @click="gotoArticle">兑换说明</span>
      </div>
      <div class="mid">
        <div class="score" @touchstart="gtouchstart()" @touchmove="gtouchmove()" @touchend="showDeleteButton()">
          {{ score }}
        </div>
        <div class="img">
          <img src="@/assets/reditrank/goldcoin.png" alt="" />
        </div>
        <div class="text">剩余可兑换积分</div>
      </div>
    </div>
    <div class="content-container">
      <div class="content">
        <div class="commodity-list">
          <div class="commodity-item" v-for="(item, index) in exchangeList" :key="index">
            <div class="product-name">{{ item.type_name }}</div>
            <div class="product-img">
              <img :src="getProductImage(index)" alt="商品图片" />
            </div>
            <div class="price">
              <span class="score">{{ item.eb_count }}</span>
              <span class="unit">积分</span>
            </div>
            <div class="button" @click="exchange(index)">
              <img src="@/assets/reditrank/button.png" alt="兑换按钮" />
              <span>立即兑换</span>
            </div>
            <div class="limit">*每月仅可兑换{{ item.limitCount }}次</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data: () => ({
    score: 1000,
    exchangeList: [],
    userId: "mock-user-123",
  }),
  created() {
    this.initMockData();
  },
  mounted() {
    document.title = "学分银行";
  },
  methods: {
    gotoArticle() {
      Dialog.alert({
        title: "兑换说明",
        message: "1. 积分可用于兑换各种商品\n2. 每月有兑换次数限制\n3. 兑换成功后积分将扣除",
      });
    },
    initMockData() {
      // 初始化mock数据
      this.exchangeList = [
        {
          product_id: "1",
          product_pic: "banner.png",
          eb_count: 100,
          limitCount: 5,
          type_name: "实物商品",
        },
        {
          product_id: "2",
          product_pic: "banner1.png",
          eb_count: 200,
          limitCount: 3,
          type_name: "虚拟商品",
        },
        {
          product_id: "3",
          product_pic: "可兑换积分.png",
          eb_count: 300,
          limitCount: 2,
          type_name: "流量包",
        },
        {
          product_id: "4",
          product_pic: "积分商城.png",
          eb_count: 500,
          limitCount: 1,
          type_name: "实物商品",
        },
      ];
    },
    getProductImage(index) {
      // 根据索引返回不同的本地图片
      const imageMap = [
        require("@/assets/reditrank/banner.png"),
        require("@/assets/reditrank/banner1.png"),
        require("@/assets/reditrank/可兑换积分.png"),
        require("@/assets/reditrank/积分商城.png"),
      ];
      return imageMap[index % imageMap.length];
    },
    async exchangeRecord() {
      return;
      this.$router.push("/personal-center/exchangeRecord");
    },
    async exchange(index) {
      const item = this.exchangeList[index];

      // 检查积分是否足够
      if (this.score < item.eb_count) {
        this.$toast.fail("您的积分不足");
        return;
      }

      // mock兑换逻辑
      setTimeout(() => {
        // 扣除积分
        this.score -= item.eb_count;

        // 提示兑换成功
        this.$toast.success("兑换成功");

        // 模拟刷新数据
        this.initMockData();
      }, 500);
    },
    // 触摸事件处理方法，与index.vue保持一致
    gtouchstart() {
      // 触摸开始处理
    },
    gtouchmove() {
      // 触摸移动处理
    },
    showDeleteButton() {
      // 显示删除按钮处理
    },
  },
};
</script>

<style scoped lang="less">
.personal-credit-container {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
  padding: 20px;
  background: #f4f4f4;
}

.content {
  background: #f4f4f4;
  padding: 15px;
}

.commodity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.commodity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #fff5e6;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.commodity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #ff6b6b;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.3;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.commodity-item .product-img {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.commodity-item .product-img img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.commodity-item:hover .product-img img {
  transform: scale(1.05);
}

.price {
  margin: 10px 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price .score {
  font-size: 24px;
  font-weight: bold;
  color: #e22516;
}

.price .unit {
  font-size: 14px;
  color: #e22516;
  font-weight: 500;
}

.commodity-item .button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  cursor: pointer;
  width: 100%;
  height: 40px;
  transition: all 0.3s ease;
}

.commodity-item .button:hover {
  transform: scale(1.05);
}

.commodity-item .button:active {
  transform: scale(0.95);
}

.commodity-item .button img {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  object-fit: cover;
}

.commodity-item .button span {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.limit {
  font-size: 12px;
  color: #999;
  margin: 5px 0 0 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .commodity-list {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }

  .header .mid .score {
    font-size: 40px;
  }

  .content-container {
    padding: 15px;
  }

  .content {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .commodity-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .header .mid .score {
    font-size: 36px;
  }

  .commodity-item {
    padding: 12px;
  }

  .product-name {
    font-size: 14px;
  }
}
</style>

<template>
  <div class="main">
    <div class="btn">
      <button @click="jumpUrl(1)" class="bt1">旧版本健康问诊</button>
      <button @click="jumpUrl(2)" class="bt2">新版本健康问诊</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      guid: "",
      token: "",
    };
  },
  created() {
    console.log(this.$route.query);
    this.type = this.$route.query.type || "";
    this.guid = this.$route.query.guid || "";
    this.token = this.$route.query.token || "";
  },
  methods: {
    jumpUrl(num) {
      let str = "";
      if (num === 1) {
          str = 'https://apparmy.81.mil.cn/im/sns/auth/code/?appId=1&guid='+ this.guid + '&token=' + this.token;
          if (window.nativeHandler && typeof window.nativeHandler.execute === "function") {
            window.nativeHandler.execute("showOrHideNaviBar", "1", null);
          }
      } else {
          str = 'https://apparmy.81.mil.cn/im/sns/auth/code/?appId=15&guid='+ this.guid + '&token=' + this.token;
          if (window.nativeHandler && typeof window.nativeHandler.execute === "function") {
            window.nativeHandler.execute("showOrHideNaviBar", "0", null);
          }
      }
      
      setTimeout(function () {
        window.location.href = str;
      }, 300);
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
  width: 100%;
  background: url("../../assets/jkwz/jkwz.png");
  background-size: cover;
}
.btn {
  width: 100%;
  height: 40%;
  padding: 10%;
  padding-top: 15%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  button {
    height: 1.5rem;
    line-height: 1.5rem;
    margin-top: 1rem;
    color: white;
    border-radius: 0.25rem;
    font-size: 0.4rem;
    letter-spacing: 0.05rem;
    font-weight: 600;
    border: 0;
  }
  .bt1 {
    background-color: #33c1bc;
  }
  .bt2 {
    background-color: #2e7dff;
  }
}
</style>
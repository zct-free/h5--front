<template>
  <div>
    <div class="box1">
      <div>
        <!-- <img src="../../../assets/reditrank/完成_已完成.png" alt=""> -->
        <van-icon name="checked" size="3rem" class="color"/>
        <p>兑换完成,10分钟内到账（请关注运营商短信提醒或自主去运营商app里查询）</p>
      </div>


      <van-button class="button" type="primary" size="large" @click="goback()"
        >兑换完成</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   isSuccess: true,
    };
  },
  methods: {
    goback() {
      this.$router.push("/personal-center/credit");
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.box1 {
  text-align: center;
  padding: 0 1rem;
  padding-top: 3rem;
}
.button {
  margin-top: 1rem;
}
.color{
  /* color: #bd2021; */
  color: #07c160;
}
</style>
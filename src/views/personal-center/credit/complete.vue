<template>
  <div>
    <div class="box1">
      <div>
        <van-icon name="checked" size="3rem" />
        <p>充值完成,5分钟内到账（请关注运营商短信提醒或自主去运营商app里查询）</p>
      </div>


      <van-button class="button" type="primary" size="large" @click="goback()"
        >完成</van-button
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
</style>
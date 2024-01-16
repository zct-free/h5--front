<template>
  <div>
    <div class="box1">
      <div v-if="isSuccess">
        <van-icon name="checked" size="3rem" />
        <p>充值成功</p>
      </div>

      <div v-else>
        <van-icon name="clear" size="3rem" />
        <p>充值失败</p>
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
  computed: {
    isSuccess() {
      if (this.$route.query.isSuccess && this.$route.query.isSuccess == 1) {
        return true;
      } else {
        return false;
      }
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
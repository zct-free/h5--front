<template>
  <div class="copyright">
    <vxe-table border :align="allAlign" :data="tableData">
      <vxe-column field="name" title="名称"></vxe-column>
      <vxe-column field="licence" title="许可证"></vxe-column>
      <vxe-column field="isModify" title="是否修改" align="center" width="80"></vxe-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allAlign: null,
      tableData: [
        {
          name: "Arouter",
          licence: "Apache-2.0",
          isModify: "否",
        },
        {
          name: "Android-PickerView",
          licence: "Apache-2.0",
          isModify: "否",
        },
        {
          name: "okhttp",
          licence: "Apache-2.0",
          isModify: "否",
        },
        {
          name: "glide",
          licence: "BSD, part MIT and Apache 2.0",
          isModify: "否",
        },
        {
          name: "Rxjava",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "retrofit",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "mmkv",
          licence: "BSD 3",
          isModify: "否",
        },
        {
          name: "jsoup",
          licence: "MIT",
          isModify: "否",
        },
        {
          name: "commons-codec",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "commons-io",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "json-smart",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "convenientbanner",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "Android-SpinKit",
          licence: "MIT",
          isModify: "否",
        },
        {
          name: "circleimageview",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "ucrop",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "Luban",
          licence: "Apache 2.0",
          isModify: "否",
        },
        {
          name: "DanmakuFlameMaster",
          licence: "Apache 2.0",
          isModify: "否",
        },
      ],
    };
  },
  mounted() {
    //this.clientSync.showTitle('学习强国隐私政策');
  },
  async created() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.copyright {
  padding: 20px;
}
</style>

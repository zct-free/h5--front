<template>
  <div class="receive-address-page">
    <!-- 地址列表页面 -->
    <div v-if="!showEditForm">
      <van-nav-bar title="收货地址" left-text="返回" left-arrow @click-left="goBack">
        <template #right>
          <van-icon name="plus" @click="addNewAddress" />
        </template>
      </van-nav-bar>

      <!-- 地址列表 -->
      <div v-if="addressList.length > 0">
        <van-address-list
          v-model="chosenAddressId"
          :list="addressList"
          :disabled-list="disabledList"
          disabled-text="以下地址超出配送范围"
          default-tag-text="默认"
          @add="addNewAddress"
          @edit="editAddress"
          @select="selectAddress"
        />
      </div>

      <!-- 空状态 -->
      <van-empty v-else description="暂无收货地址">
        <van-button type="primary" size="small" @click="addNewAddress"> 添加地址 </van-button>
      </van-empty>
    </div>

    <!-- 地址编辑表单 -->
    <div v-else>
      <van-nav-bar :title="isEditing ? '编辑地址' : '新增地址'" left-text="返回" left-arrow @click-left="cancelEdit" />

      <van-address-edit
        :area-list="areaList"
        :address-info="currentAddress"
        :is-saving="isSaving"
        :is-deleting="isDeleting"
        show-postal
        :show-delete="isEditing"
        show-set-default
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>
<script>
import { areaList } from "@vant/area-data";
import { Dialog, Toast } from "vant";

export default {
  data() {
    return {
      areaList,

      // 页面状态
      showEditForm: false,
      isEditing: false,
      isSaving: false,
      isDeleting: false,

      // 地址数据
      addressList: [],
      disabledList: [
        {
          id: "3",
          name: "王五",
          tel: "1320000000",
          address: "浙江省杭州市滨江区江南大道 15 号",
        },
      ], // 这里可以放置一些不可选的地址ID
      chosenAddressId: null,
      currentAddress: {},
      editingIndex: -1,
    };
  },

  created() {
    this.loadAddressList();
  },

  methods: {
    // 加载地址列表
    loadAddressList() {
      // 从localStorage获取地址数据，实际项目中应该调用API
      const savedAddresses = localStorage.getItem("userAddressList");
      if (savedAddresses) {
        this.addressList = JSON.parse(savedAddresses);
      } else {
        // 模拟一些初始数据
        this.addressList = [
          {
            id: "1",
            name: "张三",
            tel: "13800138000",
            province: "广东省",
            city: "深圳市",
            county: "南山区",
            addressDetail: "科技园南区深南大道1001号A座1楼",
            postalCode: "518000",
            isDefault: true,
          },
          {
            id: "2",
            name: "李四",
            tel: "13900139000",
            province: "",
            city: "深圳市",
            county: "南山区",
            addressDetail: "科技园南区深南大道1001号A座1楼",
            postalCode: "518000",
            isDefault: false,
          },
        ];
        this.saveAddressList();
      }
    },

    saveAddressList() {
      localStorage.setItem("userAddressList", JSON.stringify(this.addressList));
    },

    // 返回上一页
    goBack() {
      this.$router.go(-1);
    },

    // 添加新地址
    addNewAddress() {
      this.isEditing = false;
      this.currentAddress = {};
      this.editingIndex = -1;
      this.showEditForm = true;
    },

    // 编辑地址
    editAddress(item, index) {
      this.isEditing = true;
      this.currentAddress = { ...item };
      this.editingIndex = index;
      this.showEditForm = true;
    },

    // 选择地址
    selectAddress(item) {
      Toast(`已选择：${item.name} ${item.tel}`);
      // 如果是从其他页面跳转过来选择地址，可以返回选中的地址
      const { from } = this.$route.query;
      if (from) {
        // 返回选中的地址数据给调用页面
        this.$router.go(-1);
      }
    },

    // 取消编辑
    cancelEdit() {
      this.showEditForm = false;
      this.currentAddress = {};
      this.editingIndex = -1;
    },

    // 保存地址
    async onSave(addressInfo) {
      try {
        this.isSaving = true;

        // 生成ID（实际项目中由后端生成）
        if (!addressInfo.id) {
          addressInfo.id = Date.now().toString();
        }

        // 如果设为默认地址，需要取消其他地址的默认状态
        if (addressInfo.isDefault) {
          this.addressList.forEach(addr => {
            addr.isDefault = false;
          });
        }

        if (this.isEditing && this.editingIndex >= 0) {
          // 编辑现有地址
          this.addressList.splice(this.editingIndex, 1, addressInfo);
          Toast("地址修改成功");
        } else {
          // 添加新地址
          this.addressList.push(addressInfo);
          Toast("地址添加成功");
        }

        this.saveAddressList();
        this.cancelEdit();
      } catch (error) {
        Toast("操作失败，请重试");
        console.error("保存地址失败:", error);
      } finally {
        this.isSaving = false;
      }
    },

    // 删除地址 - 这里不是清空表单，而是删除当前编辑的地址记录
    async onDelete() {
      try {
        await Dialog.confirm({
          title: "确认删除",
          message: "确定要删除这个收货地址吗？删除后无法恢复。",
        });

        this.isDeleting = true;

        if (this.editingIndex >= 0) {
          // 从地址列表中删除
          this.addressList.splice(this.editingIndex, 1);
          this.saveAddressList();
          Toast("地址删除成功");
          this.cancelEdit();
        }
      } catch (error) {
        // 用户取消删除
        console.log("用户取消删除");
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.receive-address-page {
  min-height: 100vh;
  background: #f5f5f5;

  .van-nav-bar {
    background: #fff;
  }

  .van-address-list {
    padding: 0;
  }

  .van-empty {
    margin-top: 100px;
  }
}
.van-address-list__bottom {
  background-color: unset;
}
</style>

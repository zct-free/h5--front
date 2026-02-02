<template>
  <div class="points-transfer-page">
    <!-- 头部 -->
    <van-nav-bar title="积分转赠" left-arrow @click-left="$router.back()" fixed class="nav-bar" />

    <div class="content">
      <!-- 可转赠积分 -->
      <div class="transfer-info">
        <div class="info-header">
          <h3>可转赠积分</h3>
          <div class="daily-limit">
            <span class="used">今日已转0</span>
            <span class="total">/1,000</span>
          </div>
        </div>
        <div class="points-amount">
          <span class="number">2,940</span>
          <span class="unit">积分</span>
        </div>
      </div>

      <!-- 转赠记录按钮 -->
      <van-button round type="default" class="record-btn" @click="goToTransferRecord">
        <van-icon name="balance-list" />
        转赠记录
      </van-button>

      <!-- 安全提示 -->
      <div class="safety-tips">
        <van-icon name="warning" color="#fa5151" />
        <span
          >为保障账户安全，转赠需校验收款人信息；转赠成功后不可撤回。若收款人未找到，可尝试输入手机号或用户ID。</span
        >
      </div>

      <!-- 表单区域 -->
      <van-form @submit="onSubmit" class="transfer-form">
        <!-- 收款人选择 -->
        <div class="form-section">
          <h4 class="section-title">收款人</h4>
          <van-field
            v-model="receiver"
            readonly
            clickable
            name="receiver"
            placeholder="请选择或搜索收款人"
            right-icon="arrow"
            @click="showReceiverPicker = true"
          />
        </div>

        <!-- 转赠积分 -->
        <div class="form-section">
          <div class="section-header">
            <h4 class="section-title">转赠积分</h4>
            <van-button size="mini" type="primary" plain @click="transferAll"> 全部 </van-button>
          </div>

          <van-field
            v-model="transferPoints"
            type="digit"
            name="transferPoints"
            placeholder="请选择本次转赠积分数量"
            :rules="[{ validator: pointsValidator, message: '请输入有效积分数量' }]"
          >
            <template #right-icon>
              <span class="points-unit">积分</span>
            </template>
          </van-field>

          <!-- 额度提示 -->
          <div class="points-limit">
            <span>单次上限：1,000（同每日上限）</span>
            <span class="max-available">本次最多可转1,000</span>
          </div>

          <!-- 快捷金额按钮 -->
          <div class="quick-amount">
            <van-button
              v-for="amount in quickAmounts"
              :key="amount"
              size="small"
              :type="transferPoints == amount ? 'primary' : 'default'"
              @click="setTransferPoints(amount)"
            >
              {{ amount }}
            </van-button>
          </div>
        </div>
      </van-form>

      <!-- 底部安全提示 -->
      <div class="bottom-safety-tips">
        <van-icon name="info" color="#1989fa" />
        <span>为防刷分与误转，请核对收款人信息；如遇异常请联系管理</span>
        <van-button type="primary" size="mini" text="查看规则" class="rule-btn" />
        <span class="operator">员。</span>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-area">
        <van-button round type="primary" block native-type="submit" :disabled="!canSubmit" @click="onSubmit">
          确认转赠
        </van-button>
      </div>
    </div>

    <!-- 收款人选择器 -->
    <van-popup v-model="showReceiverPicker" position="bottom">
      <van-picker
        title="选择收款人"
        show-toolbar
        :columns="receiverList"
        @confirm="onConfirmReceiver"
        @cancel="showReceiverPicker = false"
      />
    </van-popup>
    <!-- 转赠记录modal -->
    <van-dialog
      v-model="show"
      title="转赠记录（最近）"
      show-cancel-button
      :show-confirm-button="false"
      :close-on-click-overlay="true"
    >
      <div class="transfer-records-content">
        <!-- 第一条记录 -->
        <div class="record-item">
          <div class="record-header">
            <span class="user-info">
              <strong>张三</strong>
              <span class="user-id">(u_10012)</span>
            </span>
            <div class="record-amount negative">-50</div>
          </div>
          <div class="record-details">
            <div class="record-time">2026-01-28 18:20</div>

            <div class="record-status success">成功</div>
          </div>
        </div>

        <!-- 第二条记录 -->
        <div class="record-item">
          <div class="record-header">
            <span class="user-info">
              <strong>王五</strong>
              <span class="user-id">(u_10018)</span>
            </span>
          </div>
          <div class="record-details">
            <div class="record-time">2026-01-20 09:05</div>
            <div class="record-amount negative">-100</div>
            <div class="record-status success">成功</div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "PointsTransfer",

  data() {
    return {
      // 表单数据
      receiver: "",
      transferPoints: "",

      // 已选择的收款人
      selectedReceiver: null,

      // 控制显示
      showReceiverPicker: false,

      // 快捷金额
      quickAmounts: [50, 100, 200, 500, 1000],

      // 模拟收款人列表
      receiverList: [
        {
          text: "张三 (138****1024 · u_10012 · 一营 · 学习组)",
          value: {
            name: "张三",
            phone: "138****1024",
            id: "u_10012",
            department: "一营·学习组",
            avatar: "https://img01.yzcdn.cn/vant/user.jpg",
          },
        },
        {
          text: "李四 (139****5678 · u_10013 · 二营 · 开发组)",
          value: {
            name: "李四",
            phone: "139****5678",
            id: "u_10013",
            department: "二营·开发组",
            avatar: "https://img01.yzcdn.cn/vant/user.jpg",
          },
        },
      ],
      // 模拟转赠记录
      show: false,
    };
  },

  computed: {
    // 计算是否可以提交
    canSubmit() {
      return this.selectedReceiver && this.transferPoints && this.transferPoints > 0;
    },
  },

  methods: {
    // 积分验证器
    pointsValidator(val) {
      const points = Number(val);
      return !isNaN(points) && points > 0 && points <= 1000 && points <= 2940;
    },

    // 设置转赠积分
    setTransferPoints(amount) {
      this.transferPoints = amount.toString();
    },

    // 全部转赠
    transferAll() {
      const maxTransfer = Math.min(1000, 2940); // 取每日上限和当前积分的较小值
      this.transferPoints = maxTransfer.toString();
    },

    // 选择收款人
    onConfirmReceiver(value) {
      this.selectedReceiver = value.value;
      this.receiver = value.text;
      this.showReceiverPicker = false;
    },

    // 提交表单
    onSubmit() {
      if (!this.canSubmit) return;

      this.$dialog
        .confirm({
          title: "确认转赠",
          message: `确认向 ${this.selectedReceiver.name} 转赠 ${this.transferPoints} 积分？`,
          confirmButtonText: "确认转赠",
          cancelButtonText: "再想想",
        })
        .then(() => {
          // 这里调用转赠接口
          this.$toast.loading({
            message: "转赠中...",
            forbidClick: true,
          });

          // 模拟API调用
          setTimeout(() => {
            this.$toast.success("转赠成功！");
            // 重置表单
            this.resetForm();
          }, 1500);
        });
    },

    // 重置表单
    resetForm() {
      this.receiver = "";
      this.transferPoints = "";
      this.selectedReceiver = null;
    },

    // 跳转到转赠记录
    goToTransferRecord() {
      this.show = true;
    },
  },
};
</script>

<style scoped lang="less">
.points-transfer-page {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px; /* 导航栏高度 */
  padding-bottom: 80px; /* 底部按钮区域 */
}
.nav-bar {
  background-color: #ee5a52;

  color: #fff;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}

.content {
  padding: 16px;
  /* 可转赠积分区域 */
  .transfer-info {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: normal;
}

.daily-limit .used {
  font-size: 14px;
}

.daily-limit .total {
  font-size: 14px;
  opacity: 0.8;
}

.points-amount {
  text-align: center;
}

.points-amount .number {
  font-size: 48px;
  font-weight: bold;
  line-height: 1.2;
}

.points-amount .unit {
  font-size: 16px;
  margin-left: 4px;
}

/* 转赠记录按钮 */
.record-btn {
  width: 100%;
  margin-bottom: 16px;
}

.record-btn .van-icon {
  margin-right: 4px;
}

/* 安全提示 */
.safety-tips {
  background-color: #fff6f6;
  border: 1px solid #ffeaea;
  border-radius: 6px;
  padding: 12px;
  font-size: 12px;
  color: #ff6b6b;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.safety-tips .van-icon {
  flex-shrink: 0;
  margin-right: 8px;
  margin-top: 1px;
}

/* 表单区域 */
.transfer-form {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* 收款人信息 */
.receiver-info {
  margin-top: 12px;
  padding: 12px;
  background-color: #f7f8fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

.receiver-details {
  margin-left: 12px;
  flex: 1;
}

.receiver-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.receiver-meta {
  font-size: 12px;
  color: #666;
}

.receiver-meta .separator {
  margin: 0 4px;
}

/* 积分单位 */
.points-unit {
  color: #999;
}

/* 额度提示 */
.points-limit {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
}

.max-available {
  color: #1989fa;
}

/* 快捷金额按钮 */
.quick-amount {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.quick-amount .van-button {
  flex: 1;
  min-width: 60px;
}

/* 底部安全提示 */
.bottom-safety-tips {
  font-size: 12px;
  color: #666;
  padding: 0 16px;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.bottom-safety-tips .van-icon {
  flex-shrink: 0;
  margin-right: 4px;
  margin-top: 1px;
}

.rule-btn {
  padding: 0 4px;
  height: auto;
  vertical-align: baseline;
}

.operator {
  margin-left: 2px;
}

/* 提交按钮区域 */
.submit-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: white;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
}

.submit-area .van-button {
  height: 44px;
  font-size: 16px;
}

/* 调整Vant组件样式 */
:deep(.van-field__control) {
  font-size: 16px;
}

:deep(.van-picker__toolbar) {
  background-color: #f7f8fa;
}

:deep(.van-picker__confirm) {
  color: #1989fa;
}
.transfer-records-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .record-item {
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .user-info {
      font-size: 16px;
      strong {
        font-weight: 600;
      }
      .user-id {
        font-size: 12px;
        color: #666;
        margin-left: 4px;
      }
    }
    .record-amount {
      font-size: 18px;
      &.negative {
        color: #ff4d4f;
      }
    }
    .record-details {
      display: flex;
      justify-content: space-between;
      .record-time {
        font-size: 12px;
        color: #999;
      }
      .record-status {
        font-size: 12px;
        &.success {
          color: #52c41a;
        }
      }
    }
  }
}
</style>

<template>
  <div class="credit-rank-container">
    <div class="my-rank-box friends-rank-list">
      <div class="content">
        <span>
          当前您排在第
          <span class="ranking">{{ ranking }}</span>
          位
        </span>
        <span class="score"
          >{{ (myRankInfo && myRankInfo.amountInAll) || "" }}分</span
        >
      </div>
    </div>
    <div class="all-rank-list">
      <van-list
        v-model="friendsLoading"
        :finished="friendsFinished"
        :offset="30"
        finished-text="没有更多了"
      >
      <!-- :immediate-check="false"
        @load="groupsOnLoad" -->
        <van-cell
          class="card-item"
          v-for="(item, index) in friendsRankList"
          :key="item.userId"
        >
          <div class="left">
            <span class="ranking">{{ index + 1 }}</span>
            <img :src="item.picture" alt="" />
            <div class="brief">
              <p class="name">{{ item.nick }}</p>
              <p class="level">{{ item.grade }}</p>
            </div>
          </div>
          <div>
            <p class="minute">{{ item.amountInAll }}分</p>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>
<script>
import { baseConfig } from "@/config/common.js";
const {
  SERVER_NAME: { credits },
} = baseConfig;
export default {
  data() {
    return {
      friendsRankList: [],
      friendsFinished: false,
      friendsLoading: false,
      ranking: "",
      myRankInfo: {
        rankingInAll: "",
        score: "",
        rankingInFriends: "",
      },
      pageNum: 1,
    };
  },
  created() {
    this.getFriendsRankList();
    this.getMyRank();
  },
  methods: {
    async getFriendsRankList() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: this.pageNum,
        pageSize: 10,
        type: 3,
        groupId: this.$route.params.groupId,
      };

      const res = await this.$axios.get(credits + "/ranking", {
        params,
      });
      let { data, code } = res.data;
      if (code === 1000) {
        this.friendsRankList = this.friendsRankList.concat(data.userBookList,[]).reverse();
        this.ranking = this.friendsRankList.findIndex(item => item.userId === window.localStorage.getItem("uuid")) + 1;
      }

      this.friendsLoading = false;
      // this.friendsFinished =
      //               data.userBookList.length < params.pageSize;
      this.friendsFinished = true;
    },
    groupsOnLoad() {
      // console.log(this.friendsLoading);
      // if(this.friendsLoading){
      //   return
      // }
      this.pageNum++;
      this.getFriendsRankList();
    },
    async getMyRank() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: 1,
        pageSize: 10,
        type: 0,
      };
      const res = await this.$axios.get(credits + "/ranking", { params });
      let { data, code } = res.data;
      if (code === 1000) {
        this.myRankInfo = data.userBookList[0];
      } else {
        this.myRankInfo = {
          rankingInAll: "",
          score: "",
          rankingInFriends: "",
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-list {
  .brief {
    width: calc(100% - 1.9rem);
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.credit-rank-container {
  width: 100%;
  height: 100%;
  background-color: #f5f6f8;
  padding-top: 0.3rem;
  // 我的排名
  .my-rank-box {
    height: 1.18rem;
    line-height: 1.18rem;
    padding: 0 0.1rem;
    margin-bottom: 0.6rem;
    .content {
      width: 100%;
      height: 100%;
      padding: 0 0.45rem;
      background-color: #ffffff;
      border-radius: 1rem;
      font-size: 0.36rem;
      display: flex;
      justify-content: space-between;
    }
    .ranking {
      color: #d31e22;
      font-weight: bolder;
    }
    .score {
      font-size: 0.24rem;
    }
    &.friends-rank-list {
      // margin-top: 0.3rem;
      margin-bottom: 0.28rem;
    }
  }
  // 全排名
  .all-rank-list {
    padding: 0 0.3rem;
    background-color: #f5f6f8;
  }
}

// 全排名
.all-rank-list .card-item.van-cell {
  height: 1.36rem;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0.2rem;
  .van-cell__value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7f8a93;
  }
  .left {
    display: flex;
    width: calc(100% - 60px);
  }
  .minute {
    margin-top: 0.2rem;
    line-height: 0.3rem;
    text-align: right;
  }
  .ranking {
    width: 0.52rem;
    height: 0.52rem;
    line-height: 0.52rem;
    background-color: #ffc0cb;
    border-radius: 50%;
    color: #d02022;
    margin-right: 0.44rem;
    margin-top: 0.2rem;
    text-align: center;
  }
  img {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    margin-right: 0.3rem;
  }
  .name {
    width: 3rem;
    font-size: 0.3rem;
    padding-bottom: 0.36rem;
    color: #52575a;
  }
  .level {
    font-size: 0.24rem;
  }
}
</style>

<style lang="less">
.credit-rank-container {
  .van-tabs.van-tabs--line {
    height: 100%;
    .van-tabs__wrap {
      height: 0.9rem;
      box-shadow: 0.05rem 0.05rem 1rem #dcd9d9;
    }
    .van-tab--active {
      color: #e12617;
    }
    .van-tabs__line {
      width: 1.6rem;
    }
  }
  .van-cell {
    line-height: 1;
  }
}
</style>

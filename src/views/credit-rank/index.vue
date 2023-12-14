<template>
  <!-- 学分排行 -->
  <div class="credit-rank-container">
    <van-tabs v-model="active" @click="onClick" v-if="true">
      <van-tab title="总排行" name="all">
        <div class="my-tips">
          <i class="iconfont icon-prompt-fill"></i
          >积分试行期间，积分规则将会适时调整，带来不便敬请谅解
        </div>
        <van-row class="top-three">
          <van-col
            class="top-three-item"
            span="8"
            v-for="(item, index) in topThreeList"
            :key="index"
          >
            <div class="img-box">
              <img
                class="huangguan"
                :src="topThreeHuangguan[item.orderVal]"
                alt=""
              />
              <img class="photo" :src="item.picture" alt="" />
            </div>
            <p class="name">{{ item.nick }}</p>
            <p class="level">{{ item.grade }}</p>
            <span class="score">{{ item.amountInAll }}</span>
          </van-col>
        </van-row>
        <div class="my-rank-box">
          <div class="content">
            <span>
              当前您排在第
              <span class="ranking">{{
                (myRankInfo && myRankInfo.orderVal) || ""
              }}</span>
              位
            </span>
            <span class="score"
              >{{ (myRankInfo && myRankInfo.amountInAll) || "" }}分</span
            >
          </div>
        </div>
        <div class="all-rank-list">
          <van-pull-refresh
            v-model="refreshing"
            :head-height="340"
            @refresh="onRefresh"
          >
            <van-list
              v-model="loading"
              :finished="finished"
              :offset="10"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                class="card-item"
                v-for="(item, index) in list"
                :key="index"
              >
                <div class="left">
                  <span class="ranking">{{ item.orderVal }}</span>
                  <img :src="item.picture" alt="" />
                  <div>
                    <p class="name">{{ item.nick }}</p>
                    <p class="level">{{ item.grade }}</p>
                  </div>
                </div>
                <div>{{ item.amountInAll }}分</div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="群组排行" name="group">
        <div class="my-tips">
          <i class="iconfont icon-prompt-fill"></i
          >群组总积分稍有延迟，请以积分详情为准，带来不便敬请谅解
        </div>
        <div class="all-rank-list group">
          <van-list
            v-model="groupsLoading"
            :finished="groupsFinished"
            :offset="10"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="groupsOnLoad"
          >
            <van-cell
              class="card-item"
              v-for="(item, index) in groupsRankList"
              :key="index"
              @click="groupsDetailed(item)"
            >
              <div class="left">
                <span class="ranking">{{ index + 1 }}</span>
                <img :src="item.groupCover || 'https://appresource.81.mil.cn/image/20210714/df00e6955af343b672f6feaaf34ba7f9.png'" alt="" />
                <div>
                  <p class="name">{{ item.groupName }}</p>
                  <p class="level">{{ item.totalScore }}</p>
                </div>
              </div>
              <div>{{ item.ranking }}</div>
            </van-cell>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="好友排行" name="friend">
        <div class="my-tips">
          <i class="iconfont icon-prompt-fill"></i
          >积分试行期间，积分规则将会适时调整，带来不便敬请谅解
        </div>
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
            :offset="10"
            finished-text="没有更多了"
          >
          <!-- :immediate-check="false"
            @load="friendsOnLoad" -->
            <van-cell
              class="card-item"
              v-for="(item, index) in friendsRankList"
              :key="item.userId"
            >
              <div class="left">
                <span class="ranking">{{ index + 1 }}</span>
                <img :src="item.picture" alt="" />
                <div>
                  <p class="name">{{ item.nick }}</p>
                  <p class="level">{{ item.grade }}</p>
                </div>
              </div>
              <div>{{ item.amountInAll }}分</div>
            </van-cell>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="月度排行" name="month">
        <div class="my-tips">
          <i class="iconfont icon-prompt-fill"></i
          >积分试行期间，积分规则将会适时调整，带来不便敬请谅解
        </div>
        <van-row class="top-three">
          <van-col
            class="top-three-item"
            span="8"
            v-for="item in monthTopThreeList"
            :key="item.userId"
          >
            <div class="img-box">
              <img
                class="huangguan"
                :src="topThreeHuangguan[item.orderVal]"
                alt=""
              />
              <img class="photo" :src="item.picture" alt="" />
            </div>
            <p class="name">{{ item.nick }}</p>
            <p class="level">{{ item.grade }}</p>
            <span class="score">{{ item.amountInAll }}</span>
          </van-col>
        </van-row>
        <div class="my-rank-box">
          <div class="content">
            <span>
              当前您排在第
              <span class="ranking">{{
                (monthMyRank && monthMyRank.orderVal > '10000' ? '10000+' : monthMyRank.orderVal) || ""
              }}</span>
              位
            </span>
            <span class="score"
              >{{ (monthMyRank && monthMyRank.amountInAll) || "" }}分</span
            >
          </div>
        </div>
        <div class="all-rank-list">
          <van-pull-refresh
            v-model="monthRefreshing"
            :head-height="340"
            @refresh="monthRefresh"
          >
            <van-list
              v-model="monthLoading"
              :finished="monthFinished"
              :offset="10"
              finished-text="没有更多了"
              @load="monthOnLoad"
            >
              <van-cell
                class="card-item"
                v-for="item in monthList"
                :key="item.userId"
              >
                <div class="left">
                  <span class="ranking">{{ item.orderVal }}</span>
                  <img :src="item.picture" alt="" />
                  <div>
                    <p class="name">{{ item.nick }}</p>
                    <p class="level">{{ item.grade }}</p>
                  </div>
                </div>
                <div>{{ item.amountInAll }}分</div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
      <van-tab title="专题积分" name="thematic" v-if="false">
        <!-- <thematic :source="source"></thematic> -->
        <van-tabs v-if="special.creditsLsit.length" v-model="special.creditActiveName" @change="choiceTab">
            <van-tab
                v-for="item in special.creditsLsit"
                :key="item.id"
                :title="item.name"
                :name="item.id"
            ></van-tab>
        </van-tabs>
        <div class="my-tips">
          <i class="iconfont icon-prompt-fill"></i
          >积分试行期间，积分规则将会适时调整，带来不便敬请谅解
        </div>
        <div class="my-rank-box friends-rank-list" v-if="special.rankList.length">
          <div class="content">
            <span>
              您的历史排名为:&nbsp;&nbsp;第
              <span class="ranking">{{ special.currentRanking }}</span>
              位
            </span>
            <span class="score"
              >实时积分为:&nbsp;&nbsp;{{ special.currentScore }}分</span
            >
          </div>
        </div>
        <div class="all-rank-list">
            <van-list
                v-model="special.loading"
                :finished="special.finished"
                :offset="10"
                finished-text="没有更多了"
                :immediate-check="false"
                @load="specialOnLoad"
            >
                <van-cell
                class="card-item"
                v-for="(item, index) in special.rankList"
                :key="index"
                >
                <div class="left">
                    <span class="ranking">{{ item.ranking }}</span>
                    <img :src="item.headUrl" alt="" />
                    <div class="brief">
                        <p class="name">{{ item.nickName }}</p>
                        <p class="level">{{ item.grade }}</p>
                    </div>
                </div>
                <div>
                    <p class="minute">{{ item.score }}分</p>
                    <p @click="specialDetail(item.userId)" class="detail">积分明细</p>
                </div>
                </van-cell>
            </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <div v-else>
      <div class="my-tips">
        <i class="iconfont icon-prompt-fill"></i
          >积分试行期间，积分规则将会适时调整，带来不便敬请谅解
      </div>
      <p style="text-align: center; font-size: 27px; font-weight: 600; line-height: calc(100vh - 32px); color: #ccc;">
        积分系统维护中
      </p>
    </div>
  </div>
</template>

<script>
import { baseConfig } from "@/config/common.js";
const {
  SERVER_NAME: { credits,special },
} = baseConfig;
import { debounce } from 'lodash'
export default {
  name: "CreditRank",
  data() {
    return {
      active: 0,
      topThreeHuangguan: {
        1: "/image/credit-rank/huangguan1.gif",
        2: "/image/credit-rank/huangguan2.gif",
        3: "/image/credit-rank/huangguan3.gif",
      },
      topThreeList: [], // 前三名
      myRankInfo: {
        rankingInAll: "",
        score: "",
        rankingInFriends: "",
      }, // 我的排名
      // 全军排行
      list: [], // 全军排行列表
      loading: false,
      finished: false,
      refreshing: false,
      timer: null,
      // 群组排行
      groupsRankList: [],
      groupsLoading: false,
      groupsFinished: false,
      groupsParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 好友排行
      friendsRankList: [], // 好友排行列表
      friendsLoading: false,
      friendsFinished: false,
      friendsRefreshing: false,
      friendsTimer: null,
      ranking: "--",
      pageNum: 0,
      fpageNum: 1,
      // 专题积分
      special: {
        ranking: '--',
        loading: false,
        finished: false,
        pageNum: 1,
        creditsLsit: [],
        creditActiveName: '',
        rankList: [],
        myRankInfo: {
            amountInAll: 0,
        },
        currentScore: 0,
        currentRanking: 1
      },
      changeTab: false,

      // 月度排行
      monthList: [],
      monthLoading: true,
      monthFinished: false,
      monthParams: {
        pageNum: 1,
        pageSize: 10,
        type: 5,
      },
      monthRanking: '--',
      monthRefreshing: false,

      monthTopThreeList: [], // 前三名
      monthMyRank: {
        score: "",
        rankingInFriends: "",
      }, // 我的排名
    };
  },
  mounted() {
    document.title = "学分排行";
    this.getTopThreeList();
    this.getMyRank();
    if (
      window.nativeHandler &&
      typeof window.nativeHandler.execute === "function"
    ) {
      window.nativeHandler.execute(
        "clickStatistic",
        '{"id": "click_all"}',
        null
      );
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.friendsTimer);
  },
  methods: {
    async getTopThreeList() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: 1,
        pageSize: 3,
        type: 1,
      };
      const res = await this.$axios.get(credits + "/ranking", { params });
      let { data, code, msg } = res.data;
      if (code === 1000) {
        this.topThreeList = data.userBookList;
        const [first, second, third] = this.topThreeList;
        this.topThreeList = [second, first, third];
      } else {
        this.$toast.fail(msg);
        this.topThreeList = [];
      }
    },
    async getMyRank() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: 1,
        pageSize: 1,
        type: 0,
      };
      const res = await this.$axios.get(credits + "/ranking", { params });
      let { data, code, msg } = res.data;
      if (code === 1000) {
        data.userBookList[0].orderVal = data.userBookList[0].orderVal > 10000 ? '10000+' : data.userBookList[0].orderVal;
        this.myRankInfo = data.userBookList[0];
      } else {
        this.$toast.fail(msg);
        this.myRankInfo = {
          rankingInAll: "",
          score: "",
          rankingInFriends: "",
        };
      }
    },
     /* 全军排行 start */
    async getAllList() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: this.pageNum,
        pageSize: 10,
        type: 1,
      };
      try {
        const res = await this.$axios.get(credits + "/ranking", {
          params,
        });
        let { data, code, msg } = res.data;
        if (code === 1000) {
          this.list = this.list.concat(data.userBookList);
        } else {
          this.$toast.fail(msg);
          this.list = [];
          this.finished = true;
        }

        this.refreshing = false;
        this.loading = false;
        this.finished = data.userBookList.length < params.pageSize;
      } catch (error) {
        this.refreshing = false;
        this.loading = false;
        this.finished = true;
      }
    },
    async onLoad() {
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
        this.pageNum = 0;
      }
      if (this.finished) {
        this.refreshing = false;
        this.loading = false;
        return;
      }
      this.pageNum++;
      await this.getAllList();
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    /**
     * 全军排行 end
     */

    /**
     * 好友排行 start
     */
    async getFriendsRankList() {
      const params = {
        userId: window.localStorage.getItem("uuid"),
        pageNum: this.fpageNum,
        pageSize: 10,
        type: 2,
      };
      try {
        const res = await this.$axios.get(credits + "/ranking", {
          params,
        });
        let { data, code, msg } = res.data;
        if (code === 1000) {
          this.friendsRankList = this.friendsRankList.concat(data.userBookList).reverse()
          this.ranking = this.friendsRankList.findIndex(item => item.userId === window.localStorage.getItem("uuid")) + 1;
          this.friendsRefreshing = false;
        } else {
          this.$toast.fail(msg);
          this.friendsRankList = [];
          this.friendsFinished = true;
        }

        this.friendsLoading = false;
        this.friendsRefreshing = false;
        // this.friendsFinished =
        //   data.userBookList.length < params.pageSize;
        this.friendsFinished = true;
      } catch (error) {
        this.friendsRefreshing = false;
        this.friendsLoading = false;
        this.friendsFinished = true;
      }
    },
    friendsOnLoad() {
      this.fpageNum++;
      this.getFriendsRankList();
    },
    async getGroupsRankList() {
      const params = {
        guid: window.localStorage.getItem("uuid"),
        ...this.groupsParams,
      };
      try {
        const res = await this.$axios.get(credits + "/groupsRank", {
          params,
        });
        let { data, code, msg } = res.data;
        if (code === 1000) {
          this.groupsRankList = this.groupsRankList.concat(data.rankList);
        } else {
          this.$toast.fail(msg);
        }

        this.groupsLoading = false;
        this.groupsFinished =
          data.rankList.length < params.pageSize;
      } catch (error) {
        this.groupsLoading = false;
        this.groupsFinished = true;
      }
    },
    groupsOnLoad() {
      this.groupsParams.pageNum++;
      this.getGroupsRankList();
    },
    groupsDetailed(item) {
      this.$router.push({
        path: "/groups-detailed",
        name: "GroupsDetailed",
        params: {
          groupId: item.groupId,
        },
      });
    },
    // 获取专题列表
    async getCreditsLsit() {
      const res = await this.$axios.get(special + "/creditsLsit");
      let { code, data } = res.data;
      if (code === 1000) {
        this.special.creditsLsit = data;
        this.special.creditActiveName = data[0].id;
        this.getSpecialRankList();
      }
    },
    // 专题积分列表
    getSpecialRankList:debounce(async function(){
      const params = {
            userId: window.localStorage.getItem("uuid"),
            pageNum: this.special.pageNum,
            pageSize: 10,
            fromActId: this.special.creditActiveName
        };
        try {
            const res = await this.$axios.get(credits + "/friendsSpecialScore", {
                params,
            });
            let { data, code } = res.data.data;
            if (code === 1000) {
                this.special.rankList = [...this.special.rankList,...data.userList];
                this.special.currentScore = data.currentScore
                this.special.currentRanking = data.currentRanking
                if(params.pageNum === 1) {
                    this.special.ranking = data.ranking === null? '--' : data.ranking;
                }
            } else {
                this.special.rankList = [];
                this.special.finished = true;
            }

            this.special.loading = false;
            this.special.finished = data.userList.length < params.pageSize;
        } catch (error) {
            this.special.loading = false;
            this.special.finished = true;
        }
    },200),
    // 切换专题
    choiceTab() {
        this.changeTab = true
        this.clearSpecial();
        this.getSpecialRankList();
    },
    specialOnLoad(){
      setTimeout(()=>{
        if(!this.changeTab){
          this.special.pageNum++;
          this.getSpecialRankList();
        }
        this.changeTab = false
      },200)
    },
    // 清空专题数据
    clearSpecial() {
        this.special.ranking = '--';
        this.special.loading = false;
        this.special.finished = false;
        this.special.pageNum = 1;
        this.special.rankList = [];
        this.special.myRankInfo.amountInAll = 0;
        this.special.currentScore= 0;
        this.special.currentRanking= 1
    },
    // 专题积分详情
    specialDetail(userId) {
        this.$router.push({
            path: "/thematic-ranking",
            query: {
                taskSubject: this.special.creditActiveName,
                userId,
            }
        });
    },
    onClick(name) {
      if (name === "all") {
        if (
          window.nativeHandler &&
          typeof window.nativeHandler.execute === "function"
        ) {
          window.nativeHandler.execute(
            "clickStatistic",
            '{"id": "click_all"}',
            null
          );
        }
      } else if (name === "group") {
        if (!this.groupsRankList.length) {
          this.getGroupsRankList();
        }
      } else if(name === 'thematic'){
        if(!this.special.rankList.length) {
            this.clearSpecial();
            this.getCreditsLsit();
        }
      
      } else if( name === 'month' ){
        if (!this.monthList.length) {
            this.getMonthList();
        }
      }else {
        if (
          window.nativeHandler &&
          typeof window.nativeHandler.execute === "function"
        ) {
          window.nativeHandler.execute(
            "clickStatistic",
            '{"id": "click_friend"}',
            null
          );
        }
        if (!this.friendsRankList.length) {
          this.getFriendsRankList();
        }
      }
    },
    /**
     * 好友排行 end
     */

     getMonthList(){
      this.$axios.get(credits + "/ranking",{
        params: {...this.monthParams, userId: window.localStorage.getItem("uuid"),}
      }).then(res=>{
        let { code, data, msg } = res.data
        if(code === 1000){
          this.monthList = [...this.monthList, ...data.userBookList];
          if(this.monthParams.pageNum === 1){
            const [first, second, third]= data.userBookList.slice(0,3);
            this.monthTopThreeList  = [second, first, third];
            this.monthMyRank = data.currentUser[0];
          }
        } else {
          this.$toast.fail(msg);
          this.monthList = [];
          this.monthFinished = true;
        }
        this.monthLoading = false;
        this.monthRefresh = false;
        this.monthFinished = data.userBookList.length < this.monthParams.pageSize;
      }).catch(()=>{
        this.monthRefresh = false;
        this.monthLoading = false;
        this.monthFinished = true;
      })
    },
    monthRefresh(){
      // 清空列表数据
      this.monthFinished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.monthLoading = true;
      this.monthOnLoad();
    },
    async monthOnLoad() {
      if (this.monthrefreshing) {
        this.list = [];
        this.monthRefresh = false;
        this.monthParams.pageNum = 0;
      }
      if (this.monthFinished) {
        this.monthrefreshing = false;
        this.monthLoading = false;
        return;
      }
      this.monthParams.pageNum++;
      await this.getMonthList();
    },
  },
};
</script>

<style lang="less" scoped>
.my-tips {
  color: #fb7e36;
  font-size: 13px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #fbecec;
}
.credit-rank-container {
  width: 100%;
  min-height: 100%;
  background-color: #f5f6f8;
  // 排名前三
  .top-three {
    width: 100%;
    min-height: 100%;
    height: 4.7rem;
    background-color: #d02022;
    display: flex;
  }
  // 我的排名
  .my-rank-box {
    height: 1.18rem;
    line-height: 1.18rem;
    padding: 0 0.1rem;
    margin-top: -0.59rem;
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
      margin-top: 0.32rem;
      margin-bottom: 0.28rem;
    }
  }
  // 全排名
  .all-rank-list {
    padding: 0 0.3rem;
  }
  .group {
    margin-top: 0.3rem;
  }
}

// 排名前三
.top-three .top-three-item {
  color: #ffffff;
  text-align: center;
  padding-top: 1rem;
  .img-box {
    position: relative;
  }
  .huangguan {
    width: 0.46rem;
    height: 0.36rem;
    position: absolute;
    left: 50%;
    top: -0.35rem;
    transform: translateX(-50%);
  }
  .photo {
    width: 1.12rem;
    height: 1.12rem;
    border-radius: 50%;
    margin-bottom: 0.3rem;
    border: 0.02rem solid #bec2c1;
  }
  .name {
    font-size: 0.32rem;
    padding: 0 0.4rem 0.16rem;
    white-space: nowrap; /* 强制在一行显示 */
    overflow: hidden; /* 盒子溢出不显示 */
    text-overflow: ellipsis; /* 文字溢出省略 */
  }
  .level {
    font-size: 0.24rem;
    padding-bottom: 0.2rem;
  }
  .score {
    font-size: 0.18rem;
    font-weight: bolder;
    background-color: #a7191b;
    padding: 0.12rem 0.1rem;
    border-radius: 0.2rem;
  }

  &:nth-child(2) {
    padding-top: 0.5rem;
    .photo {
      width: 1.62rem;
      height: 1.62rem;
      border: 0.02rem solid #ffbd25;
    }
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
    max-width: 3rem;
    font-size: 0.3rem;
    padding-bottom: 0.36rem;
    color: #52575a;
    white-space: nowrap; /* 强制在一行显示 */
    overflow: hidden; /* 盒子溢出不显示 */
    text-overflow: ellipsis; /* 文字溢出省略 */
  }
  .level {
    font-size: 0.24rem;
  }
}
.minute {
    margin: 0.2rem 0 0.05rem;
    line-height: 0.3rem;
    text-align: right;
  }
.detail {
    padding: 5px;
    background-color: navajowhite;
    border-radius: 0.05rem;
    font-size: 12px;
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
    margin-bottom: 0.2rem;
  }
}
</style>

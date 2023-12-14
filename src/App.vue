<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
    mounted() {
        this.native.getAppInfo()
    }
}
</script>
<style lang="less">
@import './assets/normalize.less';
@import './assets/font/font.less';
// rem
#app {
    font-size : 0.3rem;
}

.queue {
    margin: 0 .4rem;
    padding: .36rem 0;
    border-bottom: 1px solid #f7f8f9;

    .queue-title {
        font-size: .36rem;
        color: #3e3f43;
        font-weight: bolder;
        line-height: .46rem;
        margin-bottom: .26rem;
    }

    .queue-origin {
        font-size: .26rem;
        color: #b7b8b9;
    }

    .queue-info {
        flex: 1;
    }    


    // type
    .queue-img {
        display: flex;

        img {
            width: 2.25rem;
            height: 1.5rem;
            margin-left: .32rem;
        }
    }

    .queue-book {
        display: flex;
        align-items: center;

        img {
            width: 1.5rem;
            height: 2.46rem;
            margin-right: .36rem;
        }        

    }

    .queue-video {
        img {
            margin-bottom: .2rem;
        }
    }

    .queue-video {
        .queue-thumb {
            position: relative;
        }

        .queue-play {
            position: absolute;
            bottom: .5rem;
            left: .2rem;
            width: 1rem;
            height: 1rem;
            background: rgba(0, 0, 0, .5);
            border-radius: 100%;
            text-align: center;
            line-height: 1rem;
        }

        .iconfont {
            color: #fff;
            font-size: .5rem;
        }
    }    
}
</style>
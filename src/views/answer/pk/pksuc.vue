<template>
    <div class="pksuc">
        <div class="bg">
            <div class="head"></div>
        </div>
        <div class="text">匹配成功</div>
        <div class="pkbg">
            <div class="left" ref="obox">
                <div class="leftatva">
                    <img :src="myavat" alt="">
                </div>
            </div>
            <div class="rigt">
                <div class="rightatva">
                    <img :src="eachavat" alt="">
                </div>
            </div>
        </div>
        <div class="icon" v-show="showIcon">
            <img :src="icon" alt="" />
        </div>
    </div>
</template>
<script >
export default {
    props:{
         myavat:{
            default:''
        },
        eachavat:{
            default:''
        }
    },
    data() {
        return {
            icon: require("@/assets/img/vs.png"),
            red: require("@/assets/img/pkred.png"),
            blue: require("@/assets/img/pkblue.png"),
            showIcon: false,
        };
    },
    mounted() {
        let oBox = this.$refs.obox;
        oBox.addEventListener("animationend", () => {
            this.showIcon = true;
        });
    },
};
</script>
<style lang="less" scoped>
.pksuc {
    background: #f5f5f5;
    height: 100vh;
    z-index: 99;
    .bg {
        position: absolute;
        z-index: 99;
        top: 0;
        left: 0;
        width: 100%;
        height: 1.12rem;

        .head {
            padding: 0 0.2rem;
            display: flex;
            justify-content: space-between;
            height: 1.12rem;
            line-height: 1.12rem;
            margin-bottom: 0.2rem;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 90;
        }
    }
    .text {
        width: 80%;
        margin: 0 auto;
        text-align: center;
        position: absolute;
        top: 25%;
        left: 10%;
        text-align: center;
        z-index: 99;
        font-size: 0.6rem;
        font-weight: 600;
        color: #fff;
    }
    .pkbg {
        height: 100%;
        .left {
            position: absolute;
            background-image: url(../../../assets/img/pkred.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: 100%;
            width: 100%;
            animation: leftmove 0.5s linear 1;
            display: flex;
            align-items: center;

            .leftatva {
                border: 2px solid #ffffff;
                height: 2rem;
                width: 2rem;
                border-radius: 50%;
                margin-left: 15%;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .rigt {
            position: absolute;
            background-image: url(../../../assets/img/pkblue.png);
            background-repeat: no-repeat;
            background-size: 100% 100%;
            height: 100%;
            width: 100%;
            animation: rightmove 0.5s linear 1;
            display: flex;
            align-items: center;
            flex-direction: row-reverse;
            .rightatva {
                border: 2px solid rgba(0, 138, 255, 1);
                height: 2rem;
                width: 2rem;
                border-radius: 50%;
                margin-right: 15%;
                 overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        @keyframes leftmove {
            from {
                left: -100px;
            }
            to {
                left: 0;
            }
        }
        @keyframes rightmove {
            from {
                right: -100px;
            }
            to {
                right: 0;
            }
        }
    }
    .icon {
        width: 0.9rem;
        height: 0.9rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-0.45rem, -0.45rem);
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
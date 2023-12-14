<template>
    <div>
        <div class="my-tips"><i class="iconfont icon-prompt-fill"></i>积分试行期间，积分规则将会适时调整，带来不便敬请谅解</div>
        <div class="content">
            <p>学习积分，是用户在“学习强军”进行学习所产生的行为分析数据。相关规则解释权和技术开发知识产权归“学习强军”所有。</p>
            <p><span class="strong">严禁利用刷分软件等恶意刷分，</span>一经发现，从严处罚。</p>
            <p>“学习强军”平台学习行为积分规则如下：</p>
            <ul>
                <li>
                    <h2>登录</h2>
                    <p>每日首次登录积1分，每日上限1分。</p>
                </li>
                <!-- <li>
                    <h2>文章学习</h2>
                    <p>每日有效阅读一篇时事热点/强军先锋/强军号/课程号/军营文化栏目的文章积1分，每日上限6分。</p>
                </li>
                <li>
                    <h2>视听学习</h2>
                    <p>每日有效观看课程号/影视/强军微视/三个半小时/云听/强军微视栏目的音视频积1分，每日上限6分。</p>
                </li>
                <li>
                    <h2>课程学习</h2>
                    <p>每学完一门课程中所有课件积5分，每日上限20分。选择课程加入课程表积1分，每日上限5分。</p>
                </li> -->
                <li>
                    <h2>订阅</h2>
                    <p>每订阅一个强军号、课程号、微视号积1分，不可重复订阅，每日上限3分。</p>
                </li>
                <li>
                    <h2>收藏</h2>
                    <p>每收藏一次文章、音视频积1分，每日上限3分。</p>
                </li>
                <li>
                    <h2>分享</h2>
                    <p>每分享一次文章、音视频、课程、图书给好友或群组积1分，每日上限6分。</p>
                </li>
                <li>
                    <h2>评论</h2>
                    <p>每发表一次有效评论积2分，满10字为有效评论，每日上限10分。</p>
                </li>
                <li>
                    <h2>文章阅读</h2>
                    <p>每日阅读文章、报刊或图书累计2分钟积1分，每日上限15分。</p>
                </li>
                <li>
                    <h2>课程学习</h2>
                    <p>每日学习课程类音视频时间累计3分钟积1分，每日上限20分。</p>
                </li>
                <li>
                    <h2>视听品鉴</h2>
                    <p>每日收听观看微视、军营文化类等音视频累计5分钟积1分，每日上限12分。</p>
                </li>
                <!-- <li>
                    <h2>热点新闻</h2>
                    <p>每有效不重复阅读/收听/观看首页热点新闻积2分，每日上限6分。</p>
                </li>
                <li>
                    <h2>热点微视</h2>
                    <p>每有效不重复观看首页热点微视频积1分，每日上限5分。</p>
                </li>
                <li>
                    <h2>图书学习</h2>
                    <p>每有效不重复阅读图书积2分，每日上限10分。</p>
                </li> -->
            </ul>
            <p class="bottom">积分规则随时调整，请以页面说明为准</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
.my-tips {
    color: #FB7E36;
    font-size: 13px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #FBECEC;
}

.content {
    padding: 13px 15px;

    & > p {
        color: #505558;
        font-size: 16px;
        margin-bottom: 15px;

        .strong {
            font-weight: bolder;
        }
        
        &:nth-of-type(3) {
            margin-bottom: 0;
        }
    }


    ul {
        padding: 15px 0 20px;

        li {
            margin-bottom: 15px;

            &:last-of-type {
                margin-bottom: 0;
            }

            h2 {
                color: #505558;
                font-size: 17px;
                font-weight: bolder;
                position: relative;
                padding-left: 9px;

                &::before {
                    content: '';
                    width: 4px;
                    height: 14px;
                    background: #D21F22;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }

            p {
                color: #868C92;
                font-size: 14px;
            }
        }
    }

    .bottom {
        padding-top: 15px;
        text-align: center;
        color: #868C92;
        font-size: 12px;
        border-top: 2px solid #DFDFDD;
    }
}
</style>
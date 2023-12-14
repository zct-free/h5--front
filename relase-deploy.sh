#!/bin/sh

pwd

echo '安装依赖'
yarn

echo '编译工程'
yarn build:relase

tar -zcf h5.relase.source.tar.gz dist

echo '压缩完成'

# echo '删除本地tar包'
# rm -rf h5.relase.source.tar.gz

## relase环境部署说明：
# 第一步：连接堡垒机：
# 换成自己的工号
# ssh 0112257@jps.bonc.local
#
# 第二步：选择服务器
# 选择ip为：172.16.18.134 的服务器的 ID
#
# 第三步：切换到前端的目录：
# cd /data/apps/xx (xx 是各自服务的目录名称)
# 目录说明：
# 1、cms-采编； 2、collection-强军号； 3、course-课程号； 4、culture-军营文化； 5、h5-h5服务;
# 每个目录中都有一个 remark 目录，目的是每次部署前，先把上一次的内容备份一下，命名格式：年月日时分秒.tar.gz
# 执行的命令：tar -zcf remark/202107091430.tar.gz dist
#
# 第四步：部署服务：
# 1、先执行 rz 命令传包：将本地的 tar包 传到对应的服务目录内；
# 例如：cms服务：把 cms.relase.source.tar.gz 传到 /data/apps/cms 目录内
# 2、执行命令： 切换到服务对应的目录 && 执行备份命令 && 删除原本的 dist 文件 && 解压缩tar包 && 删除tar包
# 例如 cms服务：cd /data/apps/cms && tar -zcf remark/202107091430.tar.gz dist && rm -rf dist && tar -zxf cms.relase.source.tar.gz && rm -rf cms.relase.source.tar.gz

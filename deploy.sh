#!/bin/sh

pwd

echo '安装依赖'
yarn

echo '编译工程'
yarn build:dev

tarfolder="dist"
tar -zcf h5.source.tar.gz dist

echo '压缩完成'
scp h5.source.tar.gz root@10.0.0.8:/home/project/html5
# 服务器密码：  :uDe@~T1a@%z70@x

echo '删除本地tar包'
rm -rf h5.source.tar.gz

echo '******* 已经上传到远程服务器，本地yar包已删除，脚本执行结束 *******'
echo '******* 请登录服务器继续进行后续操作 *******'

echo '设置解压命令 cd /home/project/html5 '
echo '删除以前的文件 rm -rf dist'
echo '执行解压缩tag包 tar -zxf h5.source.tar.gz'
echo '执行解压缩tag包 rm -rf h5.source.tar.gz'

ssh root@10.0.0.8
# 服务器密码：  :uDe@~T1a@%z70@x
cd /home/project/html5 && rm -rf dist && tar -zxf h5.source.tar.gz && rm -rf h5.source.tar.gz

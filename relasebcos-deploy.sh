#!/bin/sh

pwd

echo '安装依赖'
yarn

echo '编译工程'
yarn build:relasebcos

tar -zcf h5.relasebcos.source.tar.gz dist

echo '压缩完成'

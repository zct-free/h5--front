#!/bin/sh

pwd

echo '安装依赖'
yarn

echo '编译工程'
yarn build:k8sproduction

tar -zcf h5.k8sprod.source.tar.gz dist
echo '压缩完成'

# echo '删除本地tar包'
# rm -rf h5.k8sprod.h5.tar.gz

#!/bin/sh

pwd

echo '安装依赖'
yarn

echo '编译工程'
yarn build:production

tar -zcf h5.prod.source.tar.gz dist
echo '压缩完成'

# echo '删除本地tar包'
# rm -rf h5.prod.source.tar.gz

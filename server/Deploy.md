###  server deploy doc

nodejs
PM2
nginx


由于项目使用了SQLite3  linux 可能出现的问题 version `CXXABI_1.3.8' not found

吐槽: nodejs 有点 stupid 尤其部署的时候，win环境到Linux环境，各种依赖问题就蹦出来，没有 golang build 酸爽 ，后面改写成golang, 已经润了一部分，  先处理这个问题

解决方法如下，需要安装gcc 相应的库

```

find / -name "libstdc++.so*"

strings /usr/lib64/libstdc++.so.6|grep CXXABI

# 备份原来的libstdc++.so.6

mv libstdc++.so.6 libstdc++.so.6.bak

# 下载一个libstdc++.so.6.0.26  已经为你准备好见根目录
# 创建新的的libstdc++.so.6

ln -s libstdc++.so.6.0.26 libstdc++.so.6
# 查看是否有你需要的版本
strings /usr/lib64/libstdc++.so.6|grep CXXABI


```





###  server deploy doc

nodejs
PM2
nginx


由于项目使用了SQLite3  linux  yarn 安装依赖运行的时候，可能出现的问题 version `CXXABI_1.3.8' not found

解决方法如下，需要安装gcc 相应的库

```

npm install node-fetch@2

find / -name "libstdc++.so*"

strings /usr/lib64/libstdc++.so.6|grep CXXABI

# 备份原来的libstdc++.so.6

mv libstdc++.so.6 libstdc++.so.6.bak

# 下载一个libstdc++.so.6.0.26  已经为你准备好见根目录
# 创建新的的libstdc++.so.6

ln -s libstdc++.so.6.0.26 libstdc++.so.6
# 查看是否有你需要的版本
strings /usr/lib64/libstdc++.so.6|grep CXXABI

# 完成所有步骤 

# cd  到server目录

npm install

or

yarn

# 安装好所有依赖 我们测试下是否可以运行

node server.js

# 如果可以起来就下一步

# 注意端口是否冲突问题

# 这时候需要先配置下 nginx 反向代理

location ^~ /
{
    proxy_pass 你运行的node server 地址;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
}

# 域名访问测试 如果可以访问 那就下一步 配置 PM2
# 安装PM2 
npm install pm2 -g

# 使用 PM2 启动我们的sever 

# 启动
pm2 start server.js --name DocServerApi

# 重启
pm2 restart server.js --name DocServerApi 

# 停止
pm2 stop server.js --name DocServerApi 


注意: 如果项目已经运行一段时间了 database 不要覆盖，网站基本数据存在SQLite 数据库存储

```





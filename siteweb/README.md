# siteweb

##  siteweb deploy

### edit config

```
cd  src/config


# 修改你支持的网络，目前只是单一支持

export const CHAIN_ID = 修改成你要支持的网络ID

# 去这里https://admin.moralis.io/web3apis 注册个key 勾选你需要的网络 创建应用 获取key
export const BASE_API_KEY =  "你的key"

# 你的部署的server 访问地址
export const BASE_SITE_API =  "你的部署的server 访问地址"

# 你合约设置的费用
export const DOC_PRICE =  "0.99" # 修改成你自己合约定的价格就可以了，单位是ether

# 完成配置文件就可以编译项目了

# 编译项目  
yarn build 

# 等待完成后，项目根目录就会看到 build 目录 将build目录里面的文件拷贝到sever public目录里面，就可以了，然后访问域名测试

```
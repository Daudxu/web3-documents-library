from multiprocessing import pool
from python_graphql_client import GraphqlClient
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
import time
from selenium.webdriver.common.by import By
import csv
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

s = Service('/www/wwwroot/library.web3devtest.xyz/public/pyworkspace/demo1/chromedriver')
options = Options()
options.add_argument('--headless')
options.add_argument('--no-sandbox')
options.add_argument('--window-size=1920,1080')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--allow-running-insecure-content')
options.add_argument('--disable-extentions')
options.add_argument("--proxy-server='direct://'")
options.add_argument('--proxy-bypass-list=*')
options.add_argument('--start-maximized')
options.add_argument('--disable-gpu')
options.add_argument('--no--sandbox')
options.add_argument('--log-level=3')

dict = {}

with open("apy.csv","w") as f:
  
  def uniswap():
    f.write("Uniswap\n")
    client = GraphqlClient(endpoint="https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2")
    pools = {  "USDT-ETH":"0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
              "USDC-ETH":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
              "DAI-ETH":"0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
              "WBTC-ETH":"0xbb2b8038a1640196fbe3e38816f3e67cba72d940",
              "USDC-USDT":"0x3041cbd36888becc7bbcbc0045e3b1f144466f5f"}

    def uniswapQuery(address):
      
      query = """
              {
          pairDayDatas(first:8 ,where:{
            pairAddress: "%s"
          }orderBy:date
            orderDirection: desc
          ){
            date
            token0 {
              symbol
            }
            token1 {
              symbol
            }
            pairAddress
            reserveUSD
            dailyVolumeUSD
          }
        }""" %(address)
      
      data = client.execute(query)
      #print(data)

      uniswap_volume =[]
      uniswap_tvl =[]
      uniswap_date=[]
      
      for dat in data['data']['pairDayDatas']:
        uniswap_volume.append(float(dat['dailyVolumeUSD']))
        uniswap_tvl.append(float(dat['reserveUSD']))
        uniswap_date.append(datetime.fromtimestamp(dat['date']))

      average_tvl = sum(uniswap_tvl)/len(uniswap_tvl)
      fee = (sum(uniswap_volume)/len(uniswap_volume))*0.003
      apy = (fee*365)/average_tvl*100

      #print(fee)
      #print(average_tvl)
      apy = "{:.2f}".format(apy)
      f.write(str(apy)+"%\n")
      return str(apy)+"%"

    uniswap_list = []

    for pool in pools:
      f.write(pool+",")
      poolapy = uniswapQuery(pools[pool])
      uniswap_list.append({pool:poolapy})
    
    dict["uniswap"] = uniswap_list
  uniswap()
  def curve():
    f.write("Curve\n")
    client = GraphqlClient(endpoint="https://api.thegraph.com/subgraphs/name/messari/curve-finance-ethereum")
    pools = {  '3pool':['0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7',0.00005] ,
                  'BUSDv2':['0x4807862aa8b2bf68830e4c8dc86d0e9a998e085a', 0.0002],
                  'sUSD':['0xa5407eae9ba41422680e2e00537571bcc53efbfd', 0.0002],
                  'Compound':['0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56', 0.0002],
                  'aave':['0xdebf20617708857ebe4f679508e7b7863a8a8eee', 0.0002],
                  'Ironbank':['0x2dded6da1bf5dbdf597c45fcfaa3194e53ecfeaf',0.0002] 
                  }

    def curveQuery(address):
      
      query = """
              {
          liquidityPoolDailySnapshots(where:
          {
          pool_: {
          id: "%s"
          }},
          first:8,
          orderBy: timestamp,
          orderDirection: desc
          ){
          pool{
          name
          id
          }
          timestamp
          dailyVolumeUSD
          inputTokenBalances
          totalValueLockedUSD
          rewardTokenEmissionsUSD
          }
          }""" %(address[0])
      
      data = client.execute(query)
      #print(data)

      curve_volume =[]
      curve_tvl =[]
      curve_date=[]
      reward =[]
      
      for dat in data['data']['liquidityPoolDailySnapshots']:
        curve_volume.append(float(dat['dailyVolumeUSD']))
        reward.append(float(dat["rewardTokenEmissionsUSD"][0]))
        curve_tvl.append(float(dat['totalValueLockedUSD']))
        curve_date.append(datetime.fromtimestamp(int(dat['timestamp'])))

      average_tvl = sum(curve_tvl)/len(curve_tvl)
      fee = ((sum(curve_volume)/len(curve_volume))*address[1])+ sum(reward)/len(reward)
      apy = (fee*365)/average_tvl*100

      #print(fee)
      #print(average_tvl)
      apy = "{:.2f}".format(apy)
      f.write(str(apy)+"%\n")
      return str(apy)+"%"

    curve_list = []

    for pool in pools:
      f.write(pool+",")
      poolapy = curveQuery(pools[pool])
      curve_list.append({pool:poolapy})

    dict["curve"] = curve_list
  curve()

  def yearn():
    f.write("Yearn\n")
    driver = webdriver.Chrome(service=s, options=options)

    urls = {    "BUSDv2":"https://yearn.finance/#/vault/0x6Ede7F19df5df6EF23bD5B9CeDb651580Bdf56Ca",
                "sUSD":"https://yearn.finance/#/vault/0x5a770DbD3Ee6bAF2802D29a901Ef11501C44797A",
                "Compound":"https://yearn.finance/#/vault/0x4A3FE75762017DB0eD73a71C9A06db7768DB5e66",
                "AAVE":"https://yearn.finance/#/vault/0xd9788f3931Ede4D5018184E198699dC6d66C1915",
                "Ironbank":"https://yearn.finance/#/vault/0x27b7b1ad7288079A66d12350c828D3C00A6F07d7",
    }

    def webscrape(address):
        url= address
        driver.get(url)
        driver.refresh()

        time.sleep(5)
        soup = BeautifulSoup(driver.page_source, 'lxml')

        apy = soup.find('div', class_="VaultDetailPanels__TextWithIcon-sc-aq6lr1-19 inZpTh").find("span",class_="Text__StyledDiv-sc-19kpfxp-0 cJMfVv VaultDetailPanels__StyledText-sc-aq6lr1-16 hwtCxO").find("span").text

        
        f.write(str(apy)+"\n")

        return str(apy)

    yearn_list =[]

    for url in urls:
        f.write(url+",")
        poolapy = webscrape(urls[url])
        yearn_list.append({url:poolapy})
    dict["yearn"] = yearn_list
    
    driver.quit()
  yearn()

  def convex():
    f.write("Convex\n")
    driver = webdriver.Chrome(service=s, options=options)

    list = ["Compound", "sUSD", "BUSD", "3pool", "aave", "ironbank","mim"]
    url= "https://www.convexfinance.com/stake"
    driver.get(url)
    time.sleep(5)
    button = driver.find_element(by = By.XPATH, value="/html/body/div[@id='__next']/div[@class='jsx-2555380618']/div[@class='jsx-3321502169 container']/div[@class='jsx-3321502169 content-container']/div[@class='jsx-3321502169 content']/div[@class='jsx-3559009320 searchable-table']/div[@class='jsx-543379019 sortable-table']/button[@class='MuiButtonBase-root MuiButton-root MuiButton-outlined show-all-pools-button   MuiButton-outlinedSizeLarge MuiButton-sizeLarge']/span[@class='MuiButton-label']")
    button.click()
    time.sleep(5)

    soup = BeautifulSoup(driver.page_source, 'lxml')
    apy = soup.find_all("div", class_="MuiPaper-root MuiAccordion-root MuiAccordion-rounded MuiPaper-elevation0 MuiPaper-rounded")

    convex_list=[]

    for x in apy:
        #print(x.find("div", class_="jsx-495322019 container").contents[0])
        pool = x.find("div", class_="jsx-495322019 container").contents[0]
        if pool in list:
            f.write(pool+",")
            apy = x.find_all("span", class_="small")[1].contents[0][9:13].replace("%","")
            f.write(str(apy)+"%\n")
            poolapy = str(apy)+"%"
            convex_list.append({pool: poolapy})
     
    dict["convex"] = convex_list
    driver.quit()
  convex()

  def maven():
    f.write("Maple\n")
    driver = webdriver.Chrome(service=s, options=options)

    list = ["Principal Coverage","APY"]
    url= "https://app.maple.finance/#/earn/pool/0x6f6c8013f639979c84b756c7fc1500eb5af18dc4"
    driver.get(url)
    time.sleep(3)
    button = driver.find_element(by = By.XPATH, value="/html/body/div[@id='root']/div[@class='MuiBox-root css-6zwm2m']/div[@class='MuiContainer-root MuiContainer-maxWidthXl css-1ny2m14']/div[@class='MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-1vlvrzs']/div[@class='MuiCardContent-root css-1s1z66w']/div[@class='css-1j4mlb9']/div[@class='MuiTabs-root tabsButton css-108f3fm']/div[@class='MuiTabs-scroller MuiTabs-fixed css-18jpbi7']/div[@class='MuiTabs-flexContainer css-7sga7m']/button[@class='MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary tabButton css-7988zp'][1]")
    button.click()
    time.sleep(3)

    soup = BeautifulSoup(driver.page_source, 'lxml')
    apy = soup.find_all("div", class_="css-11gront")

    maven_list =[]
    for x in apy:
        #print(x.find("div", class_="jsx-495322019 container").contents[0])
        pool = x.find("div", class_="css-kzz04y").contents[0]
        pool = pool.text
        if pool in list:
            f.write(pool+",")
            apy = x.find("div", class_="css-14ehq6i").text
            f.write(str(apy)+"\n")

            poolapy = str(apy)
            maven_list.append({pool:poolapy})
    dict["Maple"] = maven_list
    driver.quit()  
  maven()

  def vesper():
    f.write("Vesper\n")
    driver = webdriver.Chrome(service=s, options=options)
    url= "https://app.vesper.finance/eth/pools/0x0538C8bAc84E95A9dF8aC10Aad17DbE81b9E36ee"
    driver.get(url)
    time.sleep(5)

    soup = BeautifulSoup(driver.page_source, 'lxml')
    apy = soup.find_all("span", class_="block mt-1 text-gray-900 text-2xl font-semibold")
    
    apy = apy[1]
    vesper_list =[]
    f.write("Dai Pool,")
    f.write(str(apy.text)+"\n")
    vesper_list.append({"Dai Pool":apy.text})
    
    dict["vesper"] = vesper_list
    driver.quit()
  vesper()

  def truefi():
    #f.write("TrueFi\n")
    driver = webdriver.Chrome(service=s, options=options)
    url= "https://app.truefi.io/home"
    driver.get(url)
    time.sleep(5)


    soup = BeautifulSoup(driver.page_source, 'lxml')
    apy = soup.find_all("a", class_="sc-jWWnA vOCmr")

    truefi_list =[]
    for i in apy:
      pool = i.find("h4", class_="sc-ctKHVw evzdAr").text
      ap = i.find("span",class_="sc-iQLbEm aPwYB").text

      truefi_list.append({pool:ap})
      f.write(pool+",")
      f.write(str(apy.text)+"\n")

    dict["Truefi"] = truefi_list
    driver.quit()
  truefi()

js_string = json.dumps(dict, indent=2)

with open("data.json", 'w') as f:
  f.write(js_string)
  f.close
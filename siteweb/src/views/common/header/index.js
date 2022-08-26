
import React, { Component } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/MenuItem';
import { getAssets } from '../../../api/evmApi'
import { DOC_TOKEN_ADDRESS } from '../../../config/setting'
// import { OpenSeaSDK, Network } from 'opensea-js'
import { getMetadata } from '../../../utils/tools'
import { actionCreators } from './store';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom'
import { MainWrapper } from './style'
import dappWalletModal from "dapp-wallet-modal";
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3'
import { CHAIN_ID } from '../../../config/setting'
import logo from "../../../assets/images/logo.png"

const pages = [
  { "name" : "Home", "path": ""},
  { "name" : "OUR SERVICE", "path": "service"},
  { "name" : "ABOUT US", "path": "abount"},
  { "name" : "PERSPECTIVES", "path": "prespectives"},
  { "name" : "RESOURCES", "path": "resource"}
];

class Header extends Component {
    constructor(props) {
      super(props);
      this.state = {anchorElNav: '', anchorElUser: ''}
    }

    componentDidMount() {

     var wallet =  sessionStorage.getItem('injected')
     if(wallet){
      this.props.login()
     }
    }

     handleOpenNavMenu =  (event) => {
      this.setState({
        anchorElNav: event.currentTarget
      })
    }

     handleCloseNavMenu = () => {
      this.setState({
        anchorElNav: null
      })
    };

     handleOpenUserMenu =  (event) => {
      this.setState({
        anchorElUser: event.currentTarget
      })
    }

    handleCloseUserMenu = () => {
      this.setState({
        anchorElUser: null
      })
    };
  
    render() {
      const {anchorElNav, anchorElUser } = this.state
        return (
          <MainWrapper>
            <AppBar position="static" className="cl-header">
              <Container maxWidth="xl">
                <Toolbar disableGutters>
       
                <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          <img
            src={`${logo}`}
            srcSet={`${logo}`}
            alt={"www.serenity-research.com"}
            loading="lazy"
            width={"80px"}
          />
          </Typography>
                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={this.handleOpenNavMenu}
                      color="inherit"
                    >
                      <MenuIcon />
                    </IconButton>
          
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElNav}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      open={Boolean(anchorElNav)}
                      onClose={this.handleCloseNavMenu}
                      sx={{
                        display: { xs: 'block', md: 'none' },
                      }}
                    >
                      {pages.map((page,key) => (
                        <Link to={'/'+page.path} key={page.name+key}>
                          <MenuItem  onClick={this.handleCloseNavMenu}>
                            <Typography textAlign="center">{page.name}</Typography>
                          </MenuItem>
                        </Link>
                      ))}
                    </Menu>
                  </Box>
                  <Typography
                    noWrap
                    component="a"
                    sx={{
                      display: { xs: 'flex', md: 'none' },
                      flexGrow: 0.8,
                    }}
          >
          <img
            src={`${logo}`}
            srcSet={`${logo}`}
            alt={"www.serenity-research.com"}
            loading="lazy"
            width={"80px"}
          />
          </Typography>
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page, key) => (
                      <Link to={'/'+page.path}  key={page.path+key}>
                        <Button
                          sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                          {page.name}111
                        </Button>
                      </Link>
                    ))}

                  </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip  title="Open settings">
                <IconButton  sx={{ p: 0 }}   onClick={this.handleOpenUserMenu}>
                  <Avatar alt="Remy Sharp"  /> 
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={this.handleCloseUserMenu}
              >
      
                      { this.props.account ? 
                    <div className="login">
                
    
                        <MenuItem >      
                            <Link to="/profile" className="btu-spac">
                                profile
                            </Link> 
                        </MenuItem>
                        <MenuItem onClick={() => this.props.disconnect()}>Disconnect</MenuItem> 
                        <MenuItem >{this.props.chainName} </MenuItem>
                        <MenuItem >{getStarAccount(this.props.account)} </MenuItem>
                
                    </div>
                    :
                    <MenuItem  onClick={() => this.props.login(this.props)}>
                        connect wallet
                    </MenuItem>
                    }
                
              </Menu>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
          </MainWrapper>
        )
    }
}


const getStarAccount = (str, frontLen = 6, endLen = 4, cha = '...') => {
  // if()
  if (str.length > 0) {
    var len = str.length - frontLen - endLen
    var xing = ''
    for (var i = 0; i < len; i++) {
      xing += cha
    }
    var stt = str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    return stt.slice(0, 7) + stt.substr(-6, 6)
  }
}

const providerOptions = {
  logo: "",
  maskColor:'rgb(30, 30, 30, 0.8)',
  bgColor:'#363636',
  borderColor:'#faba30',
  chainId: CHAIN_ID,
  walletOptions: {
    metamask: {
      displayView: {
        logo: "https://docs.metamask.io/metamask-fox.svg", // your Wallet logo
        name: "MetaMask", // your Wallet name
      },
      options: {
        drive: detectEthereumProvider,  //  drive package
      }
    },
    walletconnect: {
      displayView: {
        logo: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/c4fc942cf04c827e98bddcd66188b7955caf4297/Logo/Blue%20(Default)/Logo.svg",
        name: "WalletConnect",
      },
      options: {
        drive: WalletConnectProvider,
        rpc: {
          1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          4: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          137: 'https://polygon-rpc.com',
          80001: 'https://rpc.ankr.com/polygon_mumbai'
        },
        chainId: CHAIN_ID,
        bridge: 'https://bridge.walletconnect.org'
      }
    },
  }
}

const mapState = (state) => ({
    walletProvider: state.getIn(['header', 'walletProvider']),
    account: state.getIn(['header', 'account']),
    chainId: state.getIn(['header', 'chainId']),
    chainName: state.getIn(['header', 'chainName']),
    opensea: state.getIn(['header', 'opensea'])
})

const fetcher = async (...args) => fetch(...args).then((res) => res.json());

const getBlockChainNameByChainId = async (chainId = 137) => {
  const chains = await fetcher('https://chainid.network/chains.json');
  let newArr = chains.filter(item => item.chainId === chainId)
  return  newArr[0]
}

const networkMap = {
  137: {
    chainId: Web3.utils.toHex(137), 
    chainName: "Matic(Polygon) Mainnet", 
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
  },
  80001: {
    chainId: Web3.utils.toHex(80001),
    chainName: "Matic(Polygon) Mumbai Testnet",
    nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};

const mapDispatch = (dispatch) => ({
    async login() {
      const walletModal = new dappWalletModal(providerOptions);
      const provider = await walletModal.connect();
    
      if(provider){
        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
          dispatch(actionCreators.setAccount(accounts[0]));
        });

        // Subscribe to chainId change
        provider.on("chainChanged", async (chainId) => {
          var changedChainId= Web3.utils.hexToNumberString(chainId)
          dispatch(actionCreators.setChainId(Number(changedChainId)));
          var chain = await  getBlockChainNameByChainId(Number(changedChainId))
          dispatch(actionCreators.setChainName(chain.name)); 
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
          console.log(info);
        });
        
        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {
          console.log(error);
        });
        var web3Obj = new Web3(provider)
        var chainId = await web3Obj.eth.net.getId()
        console.log("chainId", chainId)
       if( Number(chainId) === Number(CHAIN_ID)) {

            var accounts = await web3Obj.eth.getAccounts()
            var chain = await  getBlockChainNameByChainId(chainId)
            var myAssets = await getAssets(accounts[0], DOC_TOKEN_ADDRESS, Web3.utils.toHex(chainId))
            
            dispatch(actionCreators.setWellatProvider(provider));
            dispatch(actionCreators.setAccount(accounts[0]));
            dispatch(actionCreators.setChainId(chainId)); 
            dispatch(actionCreators.setChainName(chain.name)); 
            // dispatch(actionCreators.setOpensea(openSeaobjsdk)); 
            myAssets.result.forEach(async (item, key) => {
                if(item.token_uri) {
                    myAssets.result[key].metadata = await getMetadata(item.token_uri);
                }
            });
            dispatch(actionCreators.setMyNftAssets(myAssets.result)); 
       } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: Web3.utils.toHex(CHAIN_ID)
            }
          ]
        }).then(async () => {
            this.login()
        }).catch(async (err) => {
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [networkMap[CHAIN_ID]],
            }).then(()=> {
                this.login()
            }).catch(err =>{
                console.log("error", err)
            })
          } else {
            return Promise.reject(err)
          }
        })
       }
      }else{
         console.log("error")
      }
    },

    async setLoginState(e) {

    },
    async disconnect() {
      console.log(this.props)
      const walletModal = new dappWalletModal(providerOptions);
      await walletModal.disconnect();
      localStorage.clear();
      dispatch(actionCreators.setAccount(''));
      dispatch(actionCreators.setWellatProvider(''));
      dispatch(actionCreators.setChainId(''));
      dispatch(actionCreators.setChainName(""));
      dispatch(actionCreators.setOpensea("")); 
      dispatch(actionCreators.setMyNftAssets([])); 
    } 
})

export default connect(mapState, mapDispatch)(Header);



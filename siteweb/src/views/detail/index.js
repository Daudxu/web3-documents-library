import React, { PureComponent } from 'react';

// import { actionCreators } from './store';
import { connect } from 'react-redux';
import { HomeContainer, GoodsPrice } from './style.js'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { getMetadata } from '../../utils/tools'
// import { OpenSeaSDK, Network } from 'opensea-js'
import Web3 from 'web3'
// import createDOMPurify from 'dompurify'
// import { JSDOM } from 'jsdom'
// import LazyLoad from 'react-lazyload';

import { BASE_SITE_API, DOC_TOKEN_ADDRESS, DOC_TOKEN_ABI, DOC_PRICE } from '../../config/setting'
import { actionCreators } from '../common/header/store';
import { getAssets } from '../../api/evmApi'
import axios from "axios";
import Parser from 'html-react-parser';

// const window = (new JSDOM('')).window
// const DOMPurify = createDOMPurify(window)

const vertical = 'top'
const horizontal = 'right'

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {asset: '', open: false, price: "", order: "", isOwner: false, SnackbarOpen: false, message: ""}
    } 
    
    async componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        const { match } = this.props
        axios({
            method:"get",
            url:`${BASE_SITE_API}/assets/${Number(match.params.tokenId)}`,
        }).then(res=>{
            if(res) {
                this.setState({
                    asset: res.data.data
                })
            }else{
                this.setState({
                    asset: ''
                })
            }
            
        }).catch(err => {
            console.log(err)
        })
    }

    handleCliockShowSellBox = () => {
         this.setState({
            open: true
          });
    }

    handleCliockBuyNow = async () => {
         const { account, match, walletProvider, chainId } = this.props
         if(account){
            var webObj = new Web3(walletProvider)
            var myContract = new webObj.eth.Contract(DOC_TOKEN_ABI, DOC_TOKEN_ADDRESS)
             var price = await Web3.utils.toWei(DOC_PRICE, 'ether')
            await myContract.methods.mint(account, match.params.tokenId, 1, []).send({from:account,value:(price*1)}).then(()=>{
                this.setState({
                    SnackbarOpen: true,
                    message: "success"
                  })
                  var _this = this
                  this.props.upodateMyAssets(account, chainId)
                  setTimeout(()=>{
                    _this.props.history.push('/academy')
                  }, 3000)
            }).catch(err=>{
                this.setState({
                    SnackbarOpen: true,
                    message: err.message
                });
            })
 
         }else{
            this.setState({
                SnackbarOpen: true,
                message: "Please click the wallet in the upper right corner to login"
            });
         }
    }
    handleCliockSell = async () => {
        const { price } = this.state
        const { account, opensea } = this.props
        const { tokenAddress, tokenId } = this.props.match.params
        if(account){
            if(price){
                // SELL Fixed price
                const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)
                opensea.createSellOrder({
                asset: {
                    tokenAddress: tokenAddress, 
                    tokenId: tokenId, 
                },
                accountAddress: account,
                startAmount: price,
                expirationTime
                }).then(() => {
                    this.setState({
                        open: false,
                        SnackbarOpen: true,
                        message: "success"
                      })
                }).catch( err =>{
                    this.setState({
                        open: false,
                        SnackbarOpen: true,
                        message: err.message
                    });
                })
           
            }else{
                this.setState({
                    SnackbarOpen: true,
                    message: "Please enter a fixed price"
                });
            }
        }else{
            this.setState({
                SnackbarOpen: true,
                message: "Please click the wallet in the upper right corner to login"
            });
        }
    }

    handleClose = () => {
        this.setState({
          open: false
        });
    }

    handleCloseSnackbar = () => {
        this.setState({
            SnackbarOpen: false
        });
    }

    handleCnhange = e => {
        const data = e.target.value
        this.setState({
            price: data
        });
    }

    htmlDecode(content) {
        let e = document.createElement('div');
        e.innerHTML = content;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    render() {
        const { asset, open, price, SnackbarOpen, message } = this.state
        
        return (
            <HomeContainer>

    
                {asset ?
                <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                justifyContent="center"
                sx={{ margin: `20px 4px 10px 4px` }}
                columns={{ xs: 4, sm: 8, md: 12 }}             
                  >
                    <Grid item  xs={8} sm={12} md={4} >
                        <Card >
                            <Typography sx={{ height: `156px`, display: "flex", justifyContent: "center", alignContent: "center" }} >
                                <CardMedia
                                    component="img"
                                    image={asset.image}
                                    width= "100%"
                                    height={"100%"}
                                />
                            </Typography>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                {asset.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8} sm={12} md={8}>
                    <Typography variant="body2" color="text.secondary">
                        {/* {asset.collection.name} */}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" className='cl-nftname' >
                                  {asset.name}
                    </Typography>
         
                    <GoodsPrice variant="h6" color="text.secondary" >
                                     <span className='cl-price'>{DOC_PRICE} </span> MATIC
                    </GoodsPrice>
                    <Button  variant="contained"   onClick={()=>this.handleCliockBuyNow()}>Buy now</Button>
                    <Typography sx={{ paddingTop: `30px` }} gutterBottom variant="body" component="div" className='cl-nftname' >
                       {asset.content? Parser(asset.content) : ""}
                    </Typography>
                    </Grid>
                 
                </Grid>
                   : "" }

                <Dialog
          
                    open={open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Price setting</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                       Please enter a fixed price.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="price"
                        label="fixed price"
                        type="name"
                        fullWidth
                        variant="standard"
                        value={price} 
                        onChange={this.handleCnhange}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} >Close</Button>
                        <Button onClick={this.handleCliockSell}>confirm</Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    autoHideDuration={6000} 
                    open={SnackbarOpen}
                    onClose={this.handleCloseSnackbar}
                    message={message}
                    key={vertical + horizontal}
                />
            </HomeContainer>
        )
    }

}

const mapState = (state) => ({
    walletProvider: state.getIn(['header', 'walletProvider']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})

const mapDispatch = (dispatch) => ({
     async upodateMyAssets(accounts, chainId){
        var myAssets = await getAssets(accounts, DOC_TOKEN_ADDRESS, Web3.utils.toHex(chainId))
        myAssets.result.forEach(async (item, key) => {
            if(item.token_uri) {
               myAssets.result[key].metadata = await getMetadata(item.token_uri);
            }
       });
        dispatch(actionCreators.setMyNftAssets(myAssets.result));
     }
})
export default connect(mapState, mapDispatch)(Profile);
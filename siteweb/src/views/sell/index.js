import React, { PureComponent } from 'react';

// import { actionCreators } from './store';
import { connect } from 'react-redux';
import { HomeWrapper } from './style.js'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions } from '@mui/material';
// import { Link } from 'react-router-dom'

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {tokenAddress: '', tokenId: "", price:""}
    } 

    handleChange = e => {
        const data = e.target.value
        this.setState({
            [e.target.name]: data
        });
    }

    handleClickSell = () => {
        const { price, tokenId, tokenAddress } = this.state
           // SELL Fixed price
           const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24)

           const { opensea, account } = this.props
           opensea.createSellOrder({
           asset: {
               tokenAddress: tokenAddress, 
               tokenId: tokenId, 
           },
           accountAddress: account,
           startAmount: price,
           expirationTime
           }).then((listing) => {
               console.log("listing", listing)
            //    this.setState({
            //        open: false
            //      });
           }).catch(err=>{
               console.log("err", err)
            //    this.setState({
            //        open: false
            //    });
           })
        console.log(price)
        console.log(tokenId)
        console.log(tokenAddress)
    }

    
    render() {
        // const { myNftAssets } = this.props
       const { price, tokenId, tokenAddress } = this.state
    //    console.log(asset.imageUrl)
        return (
            <HomeWrapper>
                <Box sx={{ flexGrow: 1 }} className="cl-grid">
                <TextField
                    lab el="token address"
                    multiline
                    name="tokenAddress"
                    value={tokenAddress}
                    onChange={(e)=>this.handleChange(e)}
                    variant="standard"
                />
                </Box>
                <Box sx={{ flexGrow: 1 }} className="cl-grid">
                <TextField
                    label="token id"
                    multiline
                    name="tokenId"
                    value={tokenId}
                    onChange={this.handleChange}
                    variant="standard"
                />
                </Box>
                <Box sx={{ flexGrow: 1 }} className="cl-grid">
                <TextField
                    label="price"
                    multiline
                    name="price"
                    value={price}
                    onChange={this.handleChange}
                    variant="standard"
                />
                </Box>
    
                <Button variant="contained" onClick={()=>{this.handleClickSell()}}>confirm</Button>
            </HomeWrapper>
        )
    }

}

const mapState = (state) => ({
    opensea: state.getIn(['header', 'opensea']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})


export default connect(mapState)(Profile);
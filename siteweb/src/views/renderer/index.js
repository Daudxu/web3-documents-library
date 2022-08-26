import React, { PureComponent } from 'react';

// import { actionCreators } from './store';
import { connect } from 'react-redux';
import { HomeContainer } from './style'
import Grid from '@mui/material/Grid';
import PdfViewer from "./components/PdfViewer";
// import PDF from "../../assets/pdf/1.pdf";
import { DOC_TOKEN_ADDRESS } from '../../config/setting'
import Web3 from 'web3'
import { getTokenIdOwners } from '../../api/evmApi';

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', balanceOf: 0, pdfPath: ""}
    } 
    async componentDidMount(){
        const { account, match, walletProvider, chainId } = this.props
        if(walletProvider && match.params.tokenId){
            // var webObj = new Web3(walletProvider)
            // var myContract = new webObj.eth.Contract(DOC_TOKEN_ABI, DOC_TOKEN_ADDRESS)
            // var balanceOf = await myContract.methods.balanceOf(account, match.params.tokenId).call({from:account}).then((res)=>{
            //     console.log("res", res)
            // }).catch(err => {
            //     console.log("err", err)
            // })
           await getTokenIdOwners(DOC_TOKEN_ADDRESS, match.params.tokenId, Web3.utils.toHex(chainId)).then((res)=>{
               var isTrue = false
                 res.result.forEach((item) => {
                        if(item.owner_of.toLocaleUpperCase()=== account.toLocaleUpperCase()) {
                            isTrue = true
                        }
                });
                this.setState({
                    balanceOf: isTrue
                })

                if(!isTrue) {
                    this.props.history.push('/buy/'+ encodeURIComponent(match.params.tokenId))
                }else{
                    this.setState({
                        pdfPath: `./doc/${match.params.tokenId}.xyz`
                    })
                // const result = require(response.path)
                }

            }).catch(err=>{
                console.log(err)
            })
        }
    }

    handleOpenNavMenu =  (event) => {
        this.setState({
          anchorElNav: event.currentTarget
        })
    }


    render() {
        const { balanceOf, pdfPath } = this.state
        return ( 
            <HomeContainer>
                <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                className='cl-grid'
                >
                {balanceOf?<PdfViewer pdf={pdfPath} /> : "no data" }
                  
                </Grid>
                
            </HomeContainer>
        )
    }

}

const mapState = (state) => ({
    opensea: state.getIn(['header', 'opensea']),
    walletProvider: state.getIn(['header', 'walletProvider']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})


export default connect(mapState)(Profile);
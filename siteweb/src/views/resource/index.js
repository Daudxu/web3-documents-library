import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeContainer, GoodsPrice, GoodsAlert } from './style'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { BASE_SITE_API } from "../../config/setting";
import axios from "axios";

// import LazyLoad from 'react-lazyload';

const vertical = 'top'
const horizontal = 'right'

class Resource extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', libData: ""}
    } 

    componentDidMount(){
        this.loadData()
    }

    loadData = () => {
        axios({
            method:"get",
            url:`${BASE_SITE_API}/assets`,
        }).then(res=>{
            if(res) {
                this.setState({
                    libData: res.data.data
                })
            }else{
                alert('error: login fail')
            }
            
        }).catch(err => {
            console.log(err)
        })
    }
    handleOpenNavMenu =  (event) => {
        this.setState({
          anchorElNav: event.currentTarget
        })
    }

    handleOpenDoc =  (e) => {
        if(this.props.account){
            this.props.history.push('/renderer/'+ encodeURIComponent(e))
        }else{
            this.setState({
                SnackbarOpen: true,
                message: "Please click the wallet in the upper right corner to login"
            });
        }
    }

    handleCloseSnackbar = () => {
        this.setState({
            SnackbarOpen: false
        });
    }
    render() {
        // const { myNftAssets } = this.props
        const { SnackbarOpen, message, libData } = this.state;
        return (
            <HomeContainer>
                <GoodsAlert severity="warning" className='cl-alert'>You haven't installed metamask, please refer to this tutorial <a href='https://drive.google.com/file/d/1DL3Vy2dkdnChof4ZuhCCUMJA6-l9vHG8/view' >click here view</a></GoodsAlert>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  justifyContent="flex-start"
                  sx={{ margin: `20px 4px 10px 4px` }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                         
                { libData? libData.map((item, key) => (  
                   
                    <Grid item xs={2} sm={2} md={3} key={key} className="cl-card" onClick={()=>this.handleOpenDoc(item.token_id)}>
                        
                          <Card sx={{ maxWidth: 345, mixHeight: 320 }}>
                            <CardActionArea>
                                <Typography sx={{ height: `156px`, display: "flex", justifyContent: "center", alignContent: "center" }} >
                                    <CardMedia
                                        component="img"
                                        image={item.image}
                                        width= "100%"
                                        height={"100%"}
                                    />
                                </Typography>
                                <CardContent>
                                <Typography gutterBottom variant="h6"  sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }} component="div" className='cl-nftname'>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-description'>
                                   {item.description}
                                </Typography>
                                <GoodsPrice variant="h6" color="text.secondary" >
                                     <span className='cl-price'>0.99 </span> MATIC
                                </GoodsPrice>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    
                 ) ) : ""}
            
                </Grid>
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
    opensea: state.getIn(['header', 'opensea']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})


export default connect(mapState)(Resource);
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeContainer } from './style'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { BASE_SITE_API } from "../../config/setting";
import axios from "axios";


const vertical = 'top'
const horizontal = 'right'

class Prespectives extends PureComponent {
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
            url:`${BASE_SITE_API}/prespectives`,
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

    handleJumpLink =  (url) => {
        window.open(url)
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
                <Grid
                 container
                 spacing={{ xs: 2, md: 3 }}
                 justifyContent="flex-start"
                 sx={{ margin: `20px 4px 10px 4px` }}
                 columns={{ xs: 4, sm: 8, md: 12 }}
                >
                { libData? libData.map((item, key) => (  
                   
                <Grid item xs={2} sm={2} md={3} key={key} className="cl-card" onClick={()=>this.handleJumpLink(item.url)}>
                        
                   <Card sx={{ maxWidth: 345, maxHeight: 390 }}>
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
                                <Typography gutterBottom variant="h6" component="div" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-nftname'>
                                  {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-description'>
                                   {item.description}
                                </Typography>
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


export default connect(mapState)(Prespectives);
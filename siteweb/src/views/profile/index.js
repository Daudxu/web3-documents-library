import React, { PureComponent } from 'react';

// import { actionCreators } from './store';
import { connect } from 'react-redux';
import { HomeContainer } from './style'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
// import { Link } from 'react-router-dom'
import placeholder from "../../assets/images/placeholder.png"

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: ''}
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

    render() {
        const { myNftAssets } = this.props
        return (
            <HomeContainer>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    justifyContent="flex-start"
                    sx={{ margin: `20px 4px 10px 4px` }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                >
                { myNftAssets? myNftAssets.map((item, key) => (  
                   
                    <Grid item xs={2} sm={2} md={3}  key={key} className="cl-card" onClick={()=>this.handleOpenDoc(item.token_id)}>
                        
                          <Card sx={{ maxWidth: 345, mixHeight: 320 }}>
                         
                {(() => {
                        if (item.metadata) {
                            return (
                                <CardActionArea>
                                    <CardContent>
                                    <Typography component="div" sx={{ height: `170px`, display: "flex", justifyContent: "center", alignContent: "center", overflow: "hidden"}} >
                                    <CardMedia
                                        component="img"
                                        image={item.metadata.image}
                                        width= "100%"
                                        height={"100%"}
                                    />
                                   </Typography>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-nftname'>
                                    {item.metadata.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}   className='cl-description'>
                                    {item.metadata.description}
                                    </Typography>
                                    </CardContent>
                                 </CardActionArea>
                            )
                        } else {
                            return (
                                <CardActionArea>
                                    <Typography component="div" sx={{ height: `170px`, display: "flex", justifyContent: "center", alignContent: "center", overflow: "hidden"}} >
                                    <CardMedia
                                        component="img"
                                        image={placeholder}
                                        width= "100%"
                                        height={"100%"}
                                    />
                                   </Typography>
                                    <CardContent>
                                    <Typography gutterBottom variant="h6" component="div" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-nftname'>
                                     no metadata
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ height: `56px`, textOverflow: "ellipsis", overflow: "hidden" }}  className='cl-description'>
                                      no metadata
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                            )
                        }
                    })()}
                      
                        </Card>
                     
                    </Grid>
                    
                 ) ) : ""}
            
                </Grid>
                
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


export default connect(mapState)(Profile);
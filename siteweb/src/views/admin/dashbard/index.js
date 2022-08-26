import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeWrapper } from './style'
import {Grid, Button, Typography} from '@mui/material';

// import { Link } from 'react-router-dom'


class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', name: '', description: '', image: '', doc_path:''}
    } 

    componentDidMount(){
        var authorization = sessionStorage.getItem("authorization")
        if(!authorization) {
            this.props.history.push('/admin/login')
        }
    }

    componentDidUpdate(){
        var authorization = sessionStorage.getItem("authorization")
        if(!authorization) {
            this.props.history.push('/admin/login')
        }
    }


    handleOpenLink =  (type) => {
        var linkUrl = "/admin/resource"
        if(type === 1){
            linkUrl = "/admin/prespectives"
        }
        this.props.history.push(linkUrl)
    }

   



    render() {
        return (
            <HomeWrapper>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className='cl-grid'
                >
                        <Typography variant="h5" gutterBottom component="div">
                            Dashboard
                        </Typography>
                        <div className='cl-nav'>
                        <Button variant="outlined" onClick={()=>this.handleOpenLink(1)}>Add prespectives</Button>
                        <Button variant="outlined" onClick={()=>this.handleOpenLink(2)}>Add Resource</Button>
                        </div>
                
                </Grid>
             
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
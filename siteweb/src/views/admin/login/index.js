import React, { PureComponent } from 'react';

// import { actionCreators } from './store';
import { connect } from 'react-redux';
import { HomeWrapper } from './style'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import axios from "axios";
import { BASE_SITE_API } from "../../../config/setting";
// import { Button, CardActionArea, CardActions } from '@mui/material';
// import { Link } from 'react-router-dom'

const vertical = 'top'
const horizontal = 'right'

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', name: '', password: ''}
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

    handleClickChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClickSubmit = () => {
        const { name, password } = this.state
        var data = {
            name: name,
            password: password
        }
        axios({
            method:"post",
            url:`${BASE_SITE_API}/login`,
            data:data
        }).then(res=>{
            if(res.data.data.token) {
                sessionStorage.setItem("authorization", res.data.data.token)
                this.props.history.push('/admin')
            }else{
                alert('error: login fail')
            }
            
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        // const { myNftAssets } = this.props
        const { SnackbarOpen, message } = this.state;
        return (
            <HomeWrapper>
                <Grid
                    container
                    direction="row"
                    justifyContent="cneter"
                    alignItems="center"
                    className='cl-grid'
                >
                    <TextField id="outlined-basic" label="User Name" name="name" onChange={this.handleClickChange} sx={{
                        '& > :not(style)': { m: 1, width: '600px' },
                    }} variant="outlined" />
                 
                     <TextField id="outlined-basic" label="Password" name="password" onChange={this.handleClickChange}  sx={{
                        '& > :not(style)': { m: 1, width: '600px' },
                    }} variant="outlined" />

                    <Stack spacing={2} direction="row">
                       <Button variant="contained" onClick={this.handleClickSubmit}>Submit</Button>
                    </Stack>

                </Grid>

                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    autoHideDuration={6000} 
                    open={SnackbarOpen}
                    onClose={this.handleCloseSnackbar}
                    message={message}
                    key={vertical + horizontal}
                />
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
import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeWrapper } from './style'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { BASE_SITE_API } from '../../../config/setting'
import { Typography } from '@mui/material';
// import { Link } from 'react-router-dom'

const vertical = 'top'
const horizontal = 'right'

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
    
    fileChangeHandlerImage = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    fileChangeHandlerDocPath = (e) => {
        this.setState({
            doc_path: e.target.files[0]
        })
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmitHandler = () => {
        const { name, description, image, doc_path } = this.state
        if(name && description && image && doc_path) {
            const data = new FormData();
   
            data.append("name", name);
            data.append("description", description);
            data.append("image", image);
            data.append("doc_path", doc_path);

            fetch(`${BASE_SITE_API}/assets`, {
              method: "POST",
              headers: {
                'authorization': sessionStorage.getItem("authorization")
              },
              body: data,
            }).then(() => {
                alert("success")
                window.location.reload()
            }).catch((err) => {
                console.log(err);
            });
        } else {
            alert("error：Incomplete parameters")
        }
     
    }

    render() {
        // const { myNftAssets } = this.props
        const { SnackbarOpen, message } = this.state;
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
                        Add Resource
                    </Typography>
                   <form onSubmit={() => this.onSubmitHandler} method="post" className='cl-form' encType="multipart/form-data">
                    <TextField id="outlined-basic" label="name" name="name" className='cl-text' onChange={this.changeHandler}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1, width: '500px' },
                    }}/>

                    <TextField
                        id="outlined-multiline-static"
                        label="description"
                        name="description" 
                        multiline
                        rows={6}
                        onChange={this.changeHandler}
                        className='cl-text'
                        sx={{
                            '& > :not(style)': { m: 1, width: '500px' },
                        }}
                    />

                    <div className='cl-text'>
                        <span>cover：</span>
                        <input type="file" onChange={this.fileChangeHandlerImage} placeholder="1111"/>
                    </div>
                    <div className='cl-text'>
                        <span>PDF file：</span>
                        <input type="file" onChange={this.fileChangeHandlerDocPath} placeholder="1111"/>
                    </div>
                    <br/>
                    <Button variant="contained" onClick={this.onSubmitHandler}>Submit</Button>

                    <br/>
                </form>
              

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
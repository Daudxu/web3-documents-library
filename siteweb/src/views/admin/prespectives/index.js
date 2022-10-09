import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeWrapper } from './style'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { BASE_SITE_API } from '../../../config/setting'
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import moment from 'moment';

const vertical = 'top'
const horizontal = 'right'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', title: '', description: '', image: '', url:'', prespectivesRows: "", openAdd: false, openEdit: false, editData: "", id:""}
    } 

    componentDidMount(){
        this.loadData()
        var authorization = sessionStorage.getItem("authorization")
        if(!authorization) {
            this.props.history.push('/admin/login')
        }
    }

    componentDidUpdate(){
        // this.loadData()
        var authorization = sessionStorage.getItem("authorization")
        if(!authorization) {
            this.props.history.push('/admin/login')
        }
    }
    loadData = () => {
        axios({
            method:"get",
            url:`${BASE_SITE_API}/prespectives`,
        }).then(res=>{
            if(res) {
                this.setState({
                    prespectivesRows: res.data.data
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
    
    fileChangeHandlerImage = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClickAdd = () => {
        this.setState({
            openAdd:true
        })
    }

    handleCloseAdd = (e) => {
        this.setState({
            openAdd:false
        })
    }

    handleClickEdit = (row) => {
        this.setState({
            openEdit:true,
            title:row.title,
            description:row.description,
            url:row.url,
            id:row.id,
            editData: row
        })
    }
    
    handleCloseEdit = () => {
        this.setState({
            openEdit:false
        })
    }

    onSubmitHandler = () => {
        const { title, description, image, url, id } = this.state

        if(title && description && image && url) {
            const data = new FormData();
   
            data.append("id", id);
            data.append("title", title);
            data.append("description", description);
            data.append("image", image);
            data.append("url", url);

            fetch(`${BASE_SITE_API}/prespectives`, {
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
    
    onSubmitHandlerUpdate = () => {
        const { title, description, image, url, id } = this.state

        if(title && description && id && url) {
            const data = new FormData();
   
            data.append("id", id);
            data.append("title", title);
            data.append("description", description);
            data.append("image", image);
            data.append("url", url);

            fetch(`${BASE_SITE_API}/prespectives/${id}`, {
              method: "PUT",
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

    handleOpenLink =  (type) => {
        var linkUrl = "/admin/resource"
        if(type === 1){
            linkUrl = "/admin/prespectives"
        }
        this.props.history.push(linkUrl)
    }

    render() {
        // const { myNftAssets } = this.props
        const { SnackbarOpen, message, prespectivesRows, openAdd, openEdit, editData } = this.state;
        return (
            <HomeWrapper>
                <Grid
                    className='cl-grid'
                >
                <Typography variant="body" sx={{ marginBottom: "30px" }}>
                    <Button variant="outlined" onClick={()=>this.handleOpenLink(1)}>Prespectives</Button>
                    <Button variant="outlined" onClick={()=>this.handleOpenLink(2)}>Resource</Button>
                </Typography>
                <Typography variant="h5" gutterBottom component="div">
                        Add prespectives
                </Typography>
                <TableContainer component={Paper}>
                <Button variant="contained" onClick={this.handleClickAdd}>ADD</Button>

                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Image</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Option</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        { prespectivesRows? prespectivesRows.map((row, index) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="left">{row.title}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="center">
                            <Typography sx={{ height: `30px`, display: "flex", justifyContent: "center", alignContent: "center" }} >
                                    <CardMedia
                                        component="img"
                                        image={row.image}
                                        width= "100%"
                                        height={"100%"}
                                    />
                                </Typography>
                            </TableCell>
                            <TableCell align="center">{moment(row.date*1000).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                            <TableCell align="center">
                            <Button variant="contained" onClick={() =>this.handleClickEdit(row)}>Edit</Button>
                            </TableCell>
                            </TableRow>
                        )):  
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                               <TableCell align="right">no data</TableCell>
          
                        </TableRow>
                        
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                   
              

                </Grid>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    autoHideDuration={6000} 
                    open={SnackbarOpen}
                    onClose={this.handleCloseSnackbar}
                    message={message}
                    key={vertical + horizontal}
                />

   
            <Modal
            open={openAdd}
            onClose={this.handleCloseAdd}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                Add 
                </Typography>
                <form onSubmit={() => this.onSubmitHandler} method="post" className='cl-form' encType="multipart/form-data">
                    <TextField id="outlined-basic" label="title" fullWidth name="title" className='cl-text' onChange={this.changeHandler}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1},
                    }}/>

                    <TextField
                        id="outlined-multiline-static"
                        label="description"
                        name="description" 
                        multiline
                        fullWidth
                        rows={6}
                        onChange={this.changeHandler}
                        className='cl-text'
                        sx={{
                            '& > :not(style)': { m: 1},
                        }}
                    />
                    <TextField id="outlined-basic" label="URL" fullWidth name="url" className='cl-text' onChange={this.changeHandler}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1},
                    }}/>
                    <div className='cl-text'>
                        <span>cover：</span>
                        <input type="file" onChange={this.fileChangeHandlerImage} placeholder="cover"/>
                    </div>

                    <br/>
                    <Button sx={{marginTop:"30px"}} variant="contained" onClick={this.onSubmitHandler}>Submit</Button>
                    <br/>
                </form>
            </Box>
            </Modal>
            <Modal
            open={openEdit}
            onClose={this.handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                 Update
                </Typography>
                <form onSubmit={() => this.onSubmitHandler} method="post" className='cl-form' encType="multipart/form-data">
                    <TextField id="outlined-basic" label="title" fullWidth name="title" className='cl-text' defaultValue={editData.title}  onChange={this.changeHandler}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1 },
                    }}/>
                    <TextField
                        id="outlined-multiline-static"
                        label="description"
                        name="description" 
                        multiline
                        fullWidth
                        rows={6}
                        defaultValue={editData.description}
                        onChange={this.changeHandler}
                        className='cl-text'
                        sx={{
                            '& > :not(style)': { m: 1 },
                        }}
                    />
                    <TextField id="outlined-basic" label="URL" name="url" fullWidth className='cl-text' onChange={this.changeHandler}  defaultValue={editData.url}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1 },
                    }}/>
                    <div className='cl-text'>
                        <span>cover：</span>
                        <input type="file" onChange={this.fileChangeHandlerImage} placeholder="cover"/>
                    </div>
             
                    <br/>
                    <Button  sx={{marginTop:"30px"}}  variant="contained" onClick={this.onSubmitHandlerUpdate}>Submit</Button>
                    <br/>
                </form>
            </Box>
            </Modal>
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


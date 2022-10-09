import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeWrapper } from './style'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { BASE_SITE_API } from '../../../config/setting'
import { Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';
import axios from "axios";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {EditorState, ContentState} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dtohtml from "draftjs-to-html"
import htmlToDraft from 'html-to-draftjs'
import moment from 'moment';
// import { Link } from 'react-router-dom'

const vertical = 'top'
const horizontal = 'right'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
const editorStyle = {
     border: "1px solid #000000",
     minHeight: "100px"
  };

class Profile extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', name: '', description: '', image: '', doc_path:'', resourceRows: "", openAdd: false, openEdit: false, editData: "", token_id: "", editorState: EditorState.createEmpty(), contentState: ""}
    } 

    componentDidMount(){
        this.loadData()
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
    loadData = () => {
        axios({
            method:"get",
            url:`${BASE_SITE_API}/assets`,
        }).then(res=>{
            if(res) {
                this.setState({
                    resourceRows: res.data.data
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

    handleClickAdd = () => {
        this.setState({
            openAdd:true
        })
    }

    handleCloseAdd = () => {
        this.setState({
            openAdd:false
        })
    }

    handleClickEdit = (row) => {
        if (row.content) {
            const contentBlock = htmlToDraft(row.content);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState
            })
        }
        this.setState({
            openEdit:true,
            token_id:row.token_id,
            contentState:row.content,
            name:row.name,
            description:row.description,
            editData: row
        })
    }
    
    handleCloseEdit = () => {
        this.setState({
            openEdit:false
        })
    }

    onSubmitHandler = () => {
        const { name, description, image, doc_path, contentState } = this.state
        if(name && description && image && doc_path) {
            const data = new FormData();

            data.append("name", name);
            data.append("description", description);
            data.append("content", contentState);
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
    onSubmitHandlerUpdate = () => {
        const { name, description, image, doc_path, token_id, contentState } = this.state
        if(name && description && token_id && contentState) {
            const data = new FormData();
            data.append("token_id", token_id);
            data.append("name", name);
            data.append("description", description);
            data.append("content", contentState);
            data.append("image", image);
            data.append("doc_path", doc_path);

            fetch(`${BASE_SITE_API}/assets/${token_id}`, {
              method: "PUT",
              headers: {
                'authorization': sessionStorage.getItem("authorization")
              },
              body: data,
            }).then((res) => {
                alert("success")
                window.location.reload()
            }).catch((err) => {
                console.log(err);
            });
        } else {
            alert("error：Incomplete parameters")
        }
    }


    editorStateChange(editorState) {
        this.setState({
          editorState
        })
      }

      contentStateChange(contentState) {
        this.setState({
            contentState:dtohtml(contentState)
        })
      }

      handleOpenLink =  (type) => {
        var linkUrl = "/admin/resource"
        if(type === 1){
            linkUrl = "/admin/prespectives"
        }
        this.props.history.push(linkUrl)
    }

    render() {
        const { SnackbarOpen, message, resourceRows, openAdd, openEdit, editData, editorState } = this.state;
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
                    Resource
                </Typography>

                    <TableContainer component={Paper}>
                <Button variant="contained" onClick={this.handleClickAdd}>ADD</Button>

                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Image</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Option</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        { resourceRows? resourceRows.map((row, index) => (
                            <TableRow
                            key={row.token_id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="center">{row.token_id}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
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
                {/* MetaMask is a cryptocurrency wallet that allows its users to interact with Web 3 applications. It has over 30 million monthly active users globally and is an essential tool of Web3 space.  */}

                <form onSubmit={() => this.onSubmitHandler} method="post" className='cl-form' encType="multipart/form-data">
                    <TextField id="outlined-basic" label="name" name="name" fullWidth className='cl-text' onChange={this.changeHandler}  variant="outlined" sx={{
                        '& > :not(style)': { m: 1  },
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
                    <br/>
                    <Editor editorState={editorState} onEditorStateChange={this.editorStateChange.bind(this)} editorStyle={editorStyle}
                            onContentStateChange={this.contentStateChange.bind(this)}></Editor>
                    <br/>
                    <div className='cl-text'>
                        <span>cover：</span>
                        <input type="file" onChange={this.fileChangeHandlerImage} placeholder=""/>
                    </div>
                    <div className='cl-text'>
                        <span>PDF file：</span>
                        <input type="file" onChange={this.fileChangeHandlerDocPath} placeholder=""/>
                    </div>
                    <Button 
                             sx={{
                                marginTop:"30px"
                              }}
                    variant="contained" onClick={this.onSubmitHandler}>Submit</Button>

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
                    <TextField  label="name" name="name" className='cl-text' fullWidth  defaultValue={editData.name} onChange={this.changeHandler}   variant="outlined" sx={{
                        '& > :not(style)': { m: 1, width: '100%' },
                    }}/>
                    <TextField
                        label="description"
                        name="description" 
                        defaultValue={editData.description}
                        multiline
                        fullWidth
                        rows={6}
                        onChange={this.changeHandler}
                        className='cl-text'
                        sx={{
                            '& > :not(style)': { m: 1},
                        }}
                    />
               
                    <br/>
                    <Editor editorState={editorState} onEditorStateChange={this.editorStateChange.bind(this)} editorStyle={editorStyle}
                            onContentStateChange={this.contentStateChange.bind(this)}></Editor>
                    <div className='cl-text'>
                        <span>cover：</span>
                        <input type="file" onChange={this.fileChangeHandlerImage} placeholder=""/>
                    </div>
                    <div className='cl-text'>
                        <span>PDF file：</span>
                        <input type="file" onChange={this.fileChangeHandlerDocPath} placeholder=""/>
                    </div>
                    <Button 
                    sx={{
                      marginTop:"30px"
                    }}
                    variant="contained" onClick={this.onSubmitHandlerUpdate}>Submit</Button>
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
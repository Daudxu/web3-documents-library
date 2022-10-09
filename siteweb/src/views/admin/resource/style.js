import styled from "styled-components";

export const HomeWrapper = styled.div`
  overflow: hidden;
  width:1536px;
  margin:0 auto;
  display:flex ;
  height: 100vh;
  .cl-editorStyle {
    /* border: 1px solid #000000 ; */
  }
  .cl-grid {
    padding:24px ;
    display:flex ;
    flex-direction: column;
  }
  .cl-form {
    display: flex;
    flex-direction: column;
    
  }
  .cl-text {
    margin-bottom: 30px;
  }
  .cl-nftname {
    height:64px ;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .cl-card {
    margin-bottom: 30px;
  }
  .cl-images {
    text-align: center ;
    height: 300px;
    display:flex ;
    justify-content: center ;
    align-items: center;
    img {
        width:100% ;
    }
  }
  .cl-description {
     height:63.6px;
     overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
.demo-editor {
  height: 300px;
    border: solid;
}

`
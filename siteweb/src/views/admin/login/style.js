import styled from "styled-components";

export const HomeWrapper = styled.div`
  overflow: hidden;
  width:1536px;
  margin:0 auto;
  display:flex ;
  justify-content: center;
  align-items: center;
  height:100vh ;
  .cl-grid {
    padding: 24px;
    display: flex;
    flex-direction: column;
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
`
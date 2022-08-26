import styled from "styled-components";

export const FooterLogo = styled("img")(({ src }) => ({
  src: `url(${src})`,
  width: "20%",
}));
export const LinkList = styled.div`
     a {
      text-decoration:none;
      color: #ffffff ;
      margin-right:30px ;
      i {
         font-size:32px ;
      }
  }
`
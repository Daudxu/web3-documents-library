// import styled from "styled-components";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HomeContainer = styled(Container)(() => ({
    padding: "30px 15px",
}));


export const ProductImage = styled("img")(({ src, theme }) => ({
    src: `url(${src})`,
    width: "100%",
    background: "#fff",
    padding: '10px',
    [theme.breakpoints.down("md")]: {
      width: "80%", 
      padding: '24px',
    },
  }));
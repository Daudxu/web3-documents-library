// import styled from "styled-components";
import { Container, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HomeContainer = styled(Container)((theme) => ({
    padding: "30px 15px",
}));

export const GoodsPrice = styled(Typography)(() => ({
    color: "#000000",
    paddingTop:"10px" ,
    "span" : {
        color: "#1b0ded",
    }
}));

export const GoodsAlert = styled(Alert)(() => ({
     marginBottom: "30px"
}));

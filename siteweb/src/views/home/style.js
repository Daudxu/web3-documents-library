// import styled from "styled-components";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HomeContainer = styled(Container)(() => ({
  ".tsparticles": {
    zIndex: "-1",
    position: "fixed"
  }
}));

export const BannerContainer = styled(Box)(({ matches, theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  height: "100vh",
  padding: "0px 0px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
  },
}));

export const BannerContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: "820px",
  padding: "30px",
}));

export const Bannerprc = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "30px",
}));

export const BannerImage = styled("img")(({ src, theme }) => ({
  src: `url(${src})`,
  width: "300px",
  [theme.breakpoints.down("md")]: {
    width: "350px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "320px",
  },
}));
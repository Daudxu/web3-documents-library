
import {
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { FooterLogo, LinkList } from './style'
import { Colors } from "../../../assets/styles/theme";
import Link from '@mui/material/Link';
import logo from "../../../assets/images/logo.png"

export default function Footer() {
  return (
    <Box
      sx={{
        background: Colors.shaft,
        color: Colors.white,
        p: { xs: 4, md: 10 },
        pt: 12,
        pb: 12,
        fontSize: { xs: '12px', md: '14px' }
      }}
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
   
        <Grid item md={6} lg={6} textAlign="center">
        <FooterLogo src={logo} />
        </Grid>

        <Grid item md={6} lg={6}>
          <Typography variant="caption2">
          <i className="icon iconfont icon-locationfill"></i> 2 Venture Drive, Vision Exchange #24-01 to #24-32, Singapore 608526
          </Typography>
          <Box
            sx={{
              mt: 4,
              color: Colors.dove_gray,
            }}
          >
            <LinkList>
          <Link  href="https://twitter.com/SerenityFund">CONTACT</Link>
          <Link  href="/disclaimer">DISCLAIMER</Link>
          <Link  href="https://serenityfund.medium.com/"><i className="icon iconfont icon-medium"></i></Link>
          <Link  href="https://twitter.com/SerenityFund" ><i className="icon iconfont icon-twitter" ></i></Link>
            </LinkList>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

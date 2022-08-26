import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeContainer } from './style'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from "../../assets/images/logo.png"

class Abount extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', libData: ""}
    } 

    render() {
        return (
            <HomeContainer>
              <Box sx={{ width: '100%', maxWidth: 800, height:'100vh' }} >
     
                <Typography variant="h5" gutterBottom className="cl-box">
                    ABOUT US
                </Typography>
                <img
                  src={`${logo}`}
                  srcSet={`${logo}`}
                  alt={"www.serenity-research.com"}
                  loading="lazy"
                  width={"30%"}
                  />
                <Typography variant="subtitle1" gutterBottom className="cl-p">
                    We are a proprietary investment group focusing on cryptocurrency. Our flagship product is a stablecoin-denominated portfolio that has diversified investments in leading decentralised finance ("De-Fi") protocols.
                </Typography>
                <Typography variant="body1" gutterBottom className="cl-p">
                        We have strong research capacity backing our investments and we share these knowledges periodically with people who are interested in De-Fi. Follow our <a href="https://twitter.com/serenityfund">Twitter</a> or <a href="https://serenityfund.medium.com/">Medium</a> @serenityfund for more in-depth and updated reviews of the industry.
                </Typography>
            </Box>
            </HomeContainer>
        )
    }

}

const mapState = (state) => ({
    opensea: state.getIn(['header', 'opensea']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})

export default connect(mapState)(Abount);
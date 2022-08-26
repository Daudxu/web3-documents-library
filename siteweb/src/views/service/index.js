import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeContainer } from './style'
import { Stack, Typography} from '@mui/material';
import servicePic from '../../assets/images/service-bg.png'

class Service extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', libData: ""}
    } 

    render() {
        return (
            <Stack spacing={2} >

                <HomeContainer >
                    <Typography variant="h5" gutterBottom className="cl-box">
                        OUR SERVICE
                    </Typography>
                    <Typography variant="h6" gutterBottom className="cl-box">
                        Premium Strategy Paper
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom className="cl-p">
                    We publish strategy papers for advanced investors. These papers will be a 10-20 page due diligence report focusing on the risks of high-yield protocols. This is to aid your research investment work, by providing a set of comprehensive information and a second opinion on these high-risk, high return opportunities.                </Typography>
                    <Typography variant="body1" gutterBottom className="cl-p">
                    This will be a paid report, issued on a biweekly basis, and each time covering one protocol and its related farming strategy. If you are interested in the content, please contact our Twitter for a free trial copy.                
                    </Typography>

                    <Typography variant="h6" gutterBottom className="cl-box">
                    DeFi On-Boarding Course for Individuals
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom className="cl-p">
                    We organise periodic training sessions for individual to understand DeFi. These are practical sessions where you get your hands dirty doing real DeFi transactions. The contents are from the basics of using MetaMask wallets and interaction with simple DeFi contracts, to advanced topics like assessing the risks of DeFi protocols. Course comprises of 4 sessions over 2 weeks, and each session is 90 mins to 2 hours. Course is on-line for a max group of 6 persons. For booking of courses, please fill up the form here .
                    </Typography>

                    <Typography variant="h6" gutterBottom className="cl-box">
                        DeFi On-Boarding Course for Corporates
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom className="cl-p">
                        We help companies or institutions seeking exposure in cryptocurrencies to understand what's DeFi. The On-Boarding session includes training of corporate personnel the basics of DeFi (covered in On-Boarding Course for Individuals) and set up the infrastructure for corporate governance related to DeFi. These include risk profile assessment, strategy advices, and multi-signature set-ups. For enquiries of services, please fill up the form here .
                    </Typography>
                    <img src={servicePic} alt={"OUR SERVICE"} width="100%"/>
                </HomeContainer>
            </Stack>
        )
    }

}

const mapState = (state) => ({
    opensea: state.getIn(['header', 'opensea']),
    chainId: state.getIn(['header', 'chainId']),
    account: state.getIn(['header', 'account']),
    myNftAssets: state.getIn(['header', 'myNftAssets']),
})


export default connect(mapState)(Service);
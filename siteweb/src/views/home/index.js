import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { HomeContainer, BannerContainer, BannerContent, Bannerprc, BannerImage } from './style'
import logoPic from '../../assets/images/logo-2.png'
import {Typography, Stack} from '@mui/material';
import Typical from 'react-typical'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";


const options = {
    "background": {
        "color": {
            "value": "#ffffff"
        },
        "position": "50% 50%",
        "repeat": "no-repeat",
        "size": "cover"
    },
    "fpsLimit": 120,
    "fullScreen": {
        "zIndex": 1
    },
    "interactivity": {
        "events": {
            "onClick": {
                "enable": true,
                "mode": "push"
            },
            "onHover": {
                "enable": true,
                "mode": "slow"
            }
        },
        "modes": {
            "push": {
                "quantity": 3,
            },
            "bubble": {
                "distance": 200,
                "duration": 2,
                "opacity": 0.8,
                "size": 20,
                "divs": {
                    "distance": 200,
                    "duration": 0.4,
                    "mix": false,
                    "selectors": []
                }
            },
            "grab": {
                "distance": 400
            },
            "repulse": {
                "divs": {
                    "distance": 200,
                    "duration": 0.4,
                    "factor": 100,
                    "speed": 1,
                    "maxSpeed": 50,
                    "easing": "ease-out-quad",
                    "selectors": []
                }
            },
            "slow": {
                "factor": 2,
                "radius": 200,
            },
            "attract": {
                "distance": 200,
                "duration": 0.4,
                "easing": "ease-out-quad",
                "factor": 3,
                "maxSpeed": 50,
                "speed": 1

            },
        }
    },
    "particles": {
        "color": {
            "value": "#c4c8cb"
        },
        "collisions": {
            "enable": true,
        },
        "links": {
            "color": {
                "value": "#c4c8cb"
            },
            "distance": 150,
            "enable": true,
            "warp": true
        },
        "move": {
            "attract": {
                "rotate": {
                    "x": 600,
                    "y": 1200
                }
            },
            "enable": true,
            "outModes": {
                "bottom": "out",
                "left": "out",
                "right": "out",
                "top": "out"
            },
            "speed": 6,
            "warp": true
        },
        "number": {
            "density": {
                "enable": true
            },
            "value": 40
        },
        "opacity": {
            "value": 0.5,
            "animation": {
                "speed": 3,
                "minimumValue": 0.1
            }
        },
        "size": {
            "random": {
                "enable": true
            },
            "value": {
                "min": 1,
                "max": 3
            },
            "animation": {
                "speed": 20,
                "minimumValue": 0.1
            }
        }
    }
}
const particlesInit = async (main) => {
    await loadFull(main);
};


const particlesLoaded = (container) => {
    // console.log("container", container);
};

class Service extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {anchorElNav: '', SnackbarOpen: false, message: '', libData: ""}
    } 

    render() {
        return (
            <Stack spacing={2} >
          
                <HomeContainer >
                <Particles
                    className='tsparticles'
                    init={particlesInit}
                    loaded={particlesLoaded}
                    options={options}
                />
                     <BannerContainer >
                        <BannerContent>
                                <Typography variant="h2" gutterBottom>
                                    Web3 Drives The Future
                                </Typography>
                                <Typography variant="h4" gutterBottom>
                                Upskill your tech core competitivenesswith our online, on-demand course created to help you team or enterprise  make the leap from Web2 to Web3.
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                Here you will learn：
                                <Typical
                                    steps={['Smart Contract Development', 2500, 'Blockchain  Consulting', 2000, 'Blockchain  Consulting', 1500, 'DeFi Product Development', 1000, 'Metaverse technology', 500]}
                                    loop={Infinity}
                                    wrapper="p"
                                    />
                            </Typography>
                        </BannerContent>
                        <Bannerprc>
                            <BannerImage src={logoPic} />
                        </Bannerprc>
                     </BannerContainer>
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
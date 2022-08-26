// import axios from 'axios';
import * as constants from './constants';
// import { fromJS } from 'immutable';

export const setWellatProvider = (walletProvider) =>({
    type: constants.WELLAT_PROVIDER,
    walletProvider
})

export const setOpensea = (opensea) =>({
    type: constants.WELLAT_OPENSEA,
    opensea
})

export const setAccount = (account) =>({
    type: constants.WELLAT_ACCOUNT,
    account
})

export const setChainId = (chainId) =>({
    type: constants.WELLAT_CHAINID,
    chainId
})

export const setChainName = (chainName) =>({
    type: constants.WELLAT_CHAIN_NAME,
    chainName
})

export const setMyNftAssets = (myNftAssets) =>({
    type: constants.WELLAT_MY_NFT_ASSETS,
    myNftAssets
})


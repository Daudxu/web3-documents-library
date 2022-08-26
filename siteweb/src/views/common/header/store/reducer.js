import { fromJS } from 'immutable';
import * as constants from './constants';
const defaultState = fromJS({
    walletProvider: '',
    account: '',
    chainId: "",
    chainName: "",
    opensea: "",
    myNftAsset: "",
});

const stateFn = (state = defaultState, action) => {
    switch (action.type) {
        case constants.WELLAT_PROVIDER:
            return state.set('walletProvider', action.walletProvider)
        case constants.WELLAT_ACCOUNT:
            return state.set('account', action.account)
        case constants.WELLAT_CHAINID:
            return state.set('chainId', action.chainId)
        case constants.WELLAT_CHAIN_NAME:
            return state.set('chainName', action.chainName)
        case constants.WELLAT_OPENSEA:
            return state.set('opensea', action.opensea)
        case constants.WELLAT_MY_NFT_ASSETS:
            return state.set('myNftAssets', action.myNftAssets)
        default:
            return state;
    }
};

export default stateFn;
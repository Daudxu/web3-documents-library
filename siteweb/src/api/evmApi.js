import { api } from './http'
// process.env.REACT_APP_API_KEY
export const getAssets = async (owner, tokenAddress, chainId) => {
  return await api.get(`/v2/${owner}/nft/${tokenAddress}?chain=${chainId}&format=decimal&limit=100`)
}

export const getAssetById = async (tokenAddress, tokenId, chainId) => {
  return await api.get(`/v2/nft/${tokenAddress}/${tokenId}?chain=${chainId}&format=decimal`)
}

export const getTokenIdOwners = async (tokenAddress, tokenId, chainId) => {
  return await api.get(`/v2/nft/${tokenAddress}/${tokenId}/owners?chain=${chainId}&format=decimal`)
}

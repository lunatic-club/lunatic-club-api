import Web3 from 'web3'

const web3 = new Web3()
const {soliditySha3} = web3.utils

const sign = async (
  msg,
  privKey = process.env.PRIV_KEY
) => {
  return await web3
    .eth
    .accounts
    .sign(msg, privKey)

}
const getRevivalPassMsg = (
  terraTxHash,
  ethAddress,
  amount,
  data,
  version
) => {
  return soliditySha3(
    {type: 'address', value: process.env.LUNATICS_CLUB_NFT_CONTRACT},
    {type: 'address', value: ethAddress},
    {type: 'uint128', value: version},
    {type: 'string', value: terraTxHash},
    {type: 'string', value: `${amount / 10**6}`},
    {type: 'bytes', value: data},
  )
}

export const createRebirthPassSig = async (
  terraTxHash,
  ethAddress,
  amount,
  data,
  version // by default this is version 1 i.e Terra classic and not Terra 2.0
) => {
  const msg = getRevivalPassMsg(
    terraTxHash,
    ethAddress,
    amount,
    data,
    version
  )

  const {v, r, s} = await sign(msg)

  return {v, r, s}
}

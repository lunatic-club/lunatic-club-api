import {
  createBasicResponse,
  throwWithError
} from '../utils/api.js'
import {getTransfersFromTo} from '../services/terra.js'
import {verifyBytes} from '../services/verifyBytes.js'
import {createRebirthPassSig} from '../services/web3.js'

export const createRebirthPass = async ctx => {
  const {
    sig,
    terraAddress,
    terraTxHash,
    ethAddress,
    version=1,
    data=''
  } = ctx.request.body
  
  try {
    const msg = Buffer.from(`${terraTxHash}::${ethAddress}`)
    const verifyResult = await verifyBytes(msg, sig)

    if(!verifyResult) {
      return throwWithError('Wrong signature')
    }

    const transfer = await getTransfersFromTo(terraTxHash, terraAddress, process.env.TREASURY)

    if(transfer.amount > 0) {
      const amount = transfer.amount
      const pass = await createRebirthPassSig(terraTxHash, ethAddress, amount, data, version)
      const result = {
        msg: {terraTxHash, ethAddress, amount},
        pass
      }

      createBasicResponse(ctx, result)
    }
    else {
      throw new Error('Invalid transaction')
    }
  }
  catch(error) {
    console.log(`Error creating a new pass ${JSON.stringify({sig, terraAddress, terraTxHash, ethAddress})}`)
    throwWithError(ctx, 'Internal Server Error')
  }
}

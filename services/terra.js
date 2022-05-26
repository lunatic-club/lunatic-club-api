import fetch from 'isomorphic-fetch'
import terra from '@terra-money/terra.js'

let lcd = null

export const createLcd = async () => {
  const gasPrices = await fetch('https://bombay-fcd.terra.dev/v1/txs/gas_prices')
  const gasPricesJson = await gasPrices.json()
  const gasPricesCoins = new terra.Coins(gasPricesJson) 
  
  lcd = new terra.LCDClient({
    URL: 'https://lcd.terra.dev', // use https://bombay-lcd.terra.dev/ testnet, Use 'https://lcd.terra.dev' for prod 'http://localhost:1317' for localterra.
    chainID: 'columbus-5', // bombay-12 for testnet, Use 'columbus-5' for production or 'localterra'.
    gasPrices: gasPricesCoins,
    gasAdjustment: '1.5', // Increase gas price slightly so transactions go through smoothly.
    gas: 10000000,
  })
}

export const getTransactionStatus = async txHash => {
  return await lcd.tx.txInfo(txHash)
}

export const getTransfers = async txHash => {
  const txData = await getTransactionStatus(txHash)

  return txData.logs[0].events
    .filter(e => e.type === 'transfer')
}

export const getTransfersFromTo = async (txHash, from, to) => {
  const transfers = await getTransfers(txHash)

  return transfers.reduce((acc, t) => {
    const sender = t.attributes.find(a => a.key == 'sender')?.value
    const recipient = t.attributes.find(a => a.key == 'recipient')?.value
    const amount = t.attributes.find(a => a.key == 'amount')?.value

    if(sender === from && recipient === to) {
      return {...acc, sender, recipient, amount: amount.split('uluna')[0]}
    }

    return acc
  }, {})
}

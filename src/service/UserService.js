import BaseService from '../model/BaseService'
import Web3 from 'web3'
import _ from 'lodash' // eslint-disable-line
import WalletService from '@/service/WalletService'
import { WEB3, CONTRACTS } from '@/constant'
import { callTxCode, ntyToWei } from '../util/help'

export default class extends BaseService {
  async decryptWallet (privatekey) {
    const userRedux = this.store.getRedux('user')

    let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))

    const NTFToken = web3.eth.contract(WEB3.PAGE['NTFToken'].ABI)
    const NTFTokenContract = NTFToken.at(WEB3.PAGE['NTFToken'].ADDRESS)

    const NextyManager = web3.eth.contract(WEB3.PAGE['NextyManager'].ABI)
    const NextyManagerContract = NextyManager.at(WEB3.PAGE['NextyManager'].ADDRESS)
    const contract = {
      NTFToken: NTFTokenContract,
      NextyManager: NextyManagerContract
    }

    const wallet = new WalletService(privatekey)
    const walletAddress = wallet.getAddressString()

    if (!walletAddress) {
      return
    }

    web3.eth.defaultAccount = walletAddress
    wallet.balance = web3.eth.getBalance(walletAddress)

    await this.dispatch(userRedux.actions.wallet_update(walletAddress))

    // const owner = contract.owner()
    /*
        const owner = {
            NTFToken: NTFTokenContract.owner(),
            NextyManager : NextyManagerContract.owner()
        }
*/
    // const owner = contract.owner()
    const contractAdress = {
      NTFToken: WEB3.PAGE['NTFToken'].ADDRESS,
      NextyManager: WEB3.PAGE['NextyManager'].ADDRESS
    }
    // console.log("owner=" + owner)
    // console.log("address=" + walletAddress)
    /*
        if (walletAddress === owner) {
            await this.dispatch(userRedux.actions.is_admin_update(true))
        }
        */
    sessionStorage.setItem('contract-adress', contractAdress) // eslint-disable-line
    await this.dispatch(userRedux.actions.is_login_update(true))
    await this.dispatch(userRedux.actions.profile_update({
      web3,
      wallet,
      contract
    }))
    await this.dispatch(userRedux.actions.login_form_reset())

    return true
  }

  async metaMaskLogin (address) {
    const userRedux = this.store.getRedux('user')
    const contractsRedux = this.store.getRedux('contracts')
    // let web3 = new Web3(new Web3.providers.HttpProvider(WEB3.HTTP))
    let web3 = new Web3(window.ethereum)

    const contracts = {
      VolatileToken: new web3.eth.Contract(CONTRACTS.VolatileToken.abi, CONTRACTS.VolatileToken.address),
      StableToken: new web3.eth.Contract(CONTRACTS.StableToken.abi, CONTRACTS.StableToken.address),
      Seigniorage: new web3.eth.Contract(CONTRACTS.Seigniorage.abi, CONTRACTS.Seigniorage.address)
    }

    web3.eth.defaultAccount = address
    this.dispatch(userRedux.actions.is_login_update(true))
    this.dispatch(userRedux.actions.wallet_update(address))
    this.dispatch(userRedux.actions.web3_update(web3))
    this.dispatch(contractsRedux.actions.volatileToken_update(contracts.VolatileToken))
    this.dispatch(contractsRedux.actions.stableToken_update(contracts.StableToken))
    this.dispatch(contractsRedux.actions.seigniorage_update(contracts.Seigniorage))

    return true
  }

  loadBlockNumber () {
    const storeUser = this.store.getState().user
    let { web3 } = storeUser
    web3.eth.getBlockNumber().then((blockNumber) => {
      const userRedux = this.store.getRedux('user')
      this.dispatch(userRedux.actions.blockNumber_update(blockNumber))
    })
  }

  getBalance () {
    const storeUser = this.store.getState().user
    let { web3, wallet } = storeUser
    web3.eth.getBalance(wallet).then((balance) => {
      const userRedux = this.store.getRedux('user')
      this.dispatch(userRedux.actions.balance_update(balance))
    })
  }

  async logout () {
    const userRedux = this.store.getRedux('user')
    const tasksRedux = this.store.getRedux('task')

    return new Promise((resolve) => {
      this.dispatch(userRedux.actions.is_login_update(false))
      this.dispatch(userRedux.actions.is_admin_update(false))
      this.dispatch(userRedux.actions.loginMetamask_update(false))
      this.dispatch(userRedux.actions.profile_reset())
      this.dispatch(tasksRedux.actions.all_tasks_reset())
      // sessionStorage.clear() // eslint-disable-line
      resolve(true)
    })
  }

  async sendTxCode(binary, maxValue) {
    const store = this.store.getState()
    store.user.web3.eth.sendTransaction({
      from: store.user.wallet,
      to: "0x1111111111111111111111111111111111111111",
      data: binary,
      value: ntyToWei(maxValue),
    })
  }
}

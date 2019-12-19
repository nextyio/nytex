import { createContainer } from '@/util'
import Component from './Component'
import UserService from '@/service/UserService'
import VolatileTokenService from '@/service/contracts/volatileTokenService'
import StableTokenService from '@/service/contracts/stableTokenService'
import SeigniorageService from '@/service/contracts/seigniorageService'
var curWallet = null
export default createContainer(Component, (state) => {
  const userService = new UserService()
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  async function loadOnInit () {
    load()
    seigniorageService.loadProposals()
  }

  async function load () {
    userService.loadBlockNumber()
    userService.getBalance()

    volatileTokenService.loadMyVolatileTokenBalance()
    stableTokenService.loadMyStableTokenBalance()
  }

  if (state.user.wallet !== curWallet && !curWallet) {
    curWallet = state.user.wallet
    loadOnInit()
    setInterval(() => {
      load()
    }, 5000)
  }

  return {
    wallet: state.user.wallet,
    balance: state.user.balance,
    volatileTokenBalance: state.user.volatileTokenBalance,
    stableTokenBalance: state.user.stableTokenBalance,
    volAllowance: state.user.volAllowance,
    stbAllowance: state.user.stbAllowance,
    globalParams: state.seigniorage.globalParams,
    lockdown: state.seigniorage.lockdown,
    proposals: state.seigniorage.proposals
  }
}, () => {
  const volatileTokenService = new VolatileTokenService()
  const stableTokenService = new StableTokenService()
  const seigniorageService = new SeigniorageService()

  return {
    async propose(amount, stake, slashingRate, lockdownExpiration) {
      const have = BigInt(stake)
      const mnty = BigInt(this.volatileTokenBalance)
      let value = undefined
      if (have > mnty) {
        value = (have - mnty)
        if (value > BigInt(this.balance)) {
          throw "insufficient balance"
        }
        value = value.toString()
      }
      return await volatileTokenService.propose(amount, stake, slashingRate, lockdownExpiration, value)
    },
    async revoke(maker) {
      return await seigniorageService.revoke(maker)
    },
    async vote(maker, up) {
      return await seigniorageService.vote(maker, up)
    },
    async approve(spender, amount, isVolatile) {
      if (isVolatile) {
        return await volatileTokenService.approve(spender, amount) 
      } else {
        return await stableTokenService.approve(spender, amount)
      } 
    },
    // TEST
    async reload() {
      return await seigniorageService.loadProposals()
    },
  }
})

import BaseService from '../../model/BaseService'
import _ from 'lodash'
import { truncateShift, thousands, weiToMNTY, weiToNUSD } from '@/util/help'

const crypto = require('crypto');

export default class extends BaseService {
    async loadMyVolatileTokenBalance () {
        const userRedux = this.store.getRedux('user')
        const store = this.store.getState()
        let methods = store.contracts.volatileToken.methods
        let wallet = store.user.wallet
        const inflated = await methods.totalInflated().call()
        this.dispatch(userRedux.actions.inflated_update(inflated))
        const exVol = await methods.balanceOf(store.contracts.seigniorage._address).call()
        this.dispatch(userRedux.actions.exVol_update(exVol))
        let volAllowance = await methods.allowance(wallet, store.contracts.seigniorage._address).call()
        this.dispatch(userRedux.actions.volAllowance_update(volAllowance))
        let _volatileTokenBalance = await methods.balanceOf(wallet).call()
        await this.dispatch(userRedux.actions.volatileTokenBalance_update(_volatileTokenBalance))
        return await _volatileTokenBalance
    }

    async propose(amount, stake, slashingRate, lockdownExpiration) {
        slashingRate = truncateShift(slashingRate, 3);
        console.log('propose', thousands(weiToNUSD(amount)), thousands(weiToMNTY(stake)), slashingRate, lockdownExpiration);
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        await contract.methods.propose(amount, stake, slashingRate, lockdownExpiration)
            .send({from:store.user.wallet})
    }

    async trade(_haveAmount, _wantAmount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        const index = '0x' + crypto.randomBytes(32).toString('hex');
        console.log('index = ', index)
        await contract.methods.trade(index, _haveAmount.toString(), _wantAmount.toString(), [0])
            .send({from:store.user.wallet})
    }

    async deposit(amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken
        await contract.methods.deposit()
            .send({from: store.user.wallet, value: amount})
    }

    async withdraw(amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken
        await contract.methods.withdraw(amount)
            .send({from: store.user.wallet})
    }

    async approve(spender, amount) {
        const store = this.store.getState()
        const contract = store.contracts.volatileToken;
        await contract.methods.approve(spender, amount)
            .send({from:store.user.wallet})
    }
}
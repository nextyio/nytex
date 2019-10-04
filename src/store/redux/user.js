import BaseRedux from '@/model/BaseRedux'

class UserRedux extends BaseRedux {
  defineTypes () {
    return ['user']
  }

  defineDefaultState () {
    return {
      is_login: false,
      is_admin: false,

      login_form: {
        privatekey: '',
        loading: false
      },

      web3: null,
      blockNumber: 0,
      wallet: null,
      balance: 0,
      volatileTokenBalance: 0,
      stableTokenBalance: 0,
      inflated: 0,
      loginMetamask: true,
      volatileTokenAllowance: 0,
      stableTokenAllowance: 0
    }
  }
}

export default new UserRedux()

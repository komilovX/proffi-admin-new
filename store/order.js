export const state = () => ({
  orders:[],
  ordersLength: 0,
})

export const mutations = {
  setOrder(state, orders) {
    state.orders = orders,
    state.ordersLength = orders.length
  }
}

export const actions = {
  async getAllOrder({commit}) {
    try {
      return this.$axios.$get('api/orders')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getAllCanceledOrders({commit}) {
    try {
      return this.$axios.$get('api/orders/canceled')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async getAllDeliveredOrders({commit}) {
    try {
      return this.$axios.$get('api/orders/delivered')
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async changeStatus({commit}, {id, status}) {
    try {
      return this.$axios.$put(`api/orders/${id}`,{status})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async findById({commit}, id) {
    try {
      return await this.$axios.$get(`api/orders/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
    }
  },
  SOCKET_newOrder({commit}, orders) {
    commit('setOrder', orders)
  },
  SOCKET_checkRemainder({commit}, data) {
    console.log('SOCKET_checkRemainder', data);
  },
}

export const getters = {
  orders: state => state.orders,
  ordersLength: state => 2
}

export const actions = {
  async createProduct({commit}, form) {
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('category_id', form.category_id)
      fd.append('category_name', form.category_name)
      fd.append('brand', form.brand)
      fd.append('brand_id', form.brand_id)
      fd.append('image', form.image, form.image.name)
      fd.append('cost_netto', form.cost_netto)
      fd.append('cost', form.cost)
      fd.append('percent', form.percent)
      fd.append('comment', form.comment)
      return await this.$axios.$post('api/menu/product', fd)
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async findAllProducts({commit}) {
    try {
      return await this.$axios.$get('api/menu/product')
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async findProductById({commit}, id) {
    try {
      return await this.$axios.$get(`api/menu/product/${id}`)
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async updateProductById({commit}, form) {
    try {
      const fd = new FormData()
      if (form.image) {
        fd.append('name', form.name)
        fd.append('category_id', form.category_id)
        fd.append('category_name', form.category_name)
        fd.append('image', form.image, form.image.name)
        fd.append('cost_netto', form.cost_netto)
        fd.append('cost', form.cost)
        fd.append('percent', form.percent)
        fd.append('comment', form.comment)
      }
      else {
        fd.append('name', form.name)
        fd.append('category_id', form.category_id)
        fd.append('category_name', form.category_name)
        fd.append('cost_netto', form.cost_netto)
        fd.append('cost', form.cost)
        fd.append('percent', form.percent)
        fd.append('comment', form.comment)
      }
      return await this.$axios.$put(`api/menu/product/${form.id}`, fd)
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async hideProductById({commit}, { id, hide }) {
    try {
      return await this.$axios.$put(`api/menu/product/hide/${id}`,{hide})
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  },
  async delteProductById({commit}, id ) {
    try {
      return await this.$axios.$delete(`api/menu/product/${id}`)
    } catch (e) {
      commit('setError', e, {root: true})
      throw e
    }
  }
}

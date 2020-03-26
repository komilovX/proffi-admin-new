export const actions = {
  async createProduct({commit}, form) {
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('category_id', form.category_id)
      fd.append('category_name', form.category_name)
      fd.append('brand', form.brand)
      fd.append('brand_id', form.brand_id)
      fd.append('barcode', form.barcode)
      fd.append('image', form.image, form.image.name)
      fd.append('comment', form.comment)
      return await this.$axios.$post('api/menu/product', fd)
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async findAllProducts({commit}, {page=1, limit=30}) {
    try {
      return await this.$axios.$get(`api/menu/product?page=${page}&limit=${limit}`)
    } catch (error) {
      commit('setError',error, { root: true })
      throw error
    }
  },
  async findAllProductsWithoutPagination({commit}) {
    try {
      return await this.$axios.$get(`api/menu/product`)
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
        fd.append('brand', form.brand)
        fd.append('brand_id', form.brand_id)
        fd.append('barcode', form.barcode)
        fd.append('image', form.image, form.image.name)
        fd.append('comment', form.comment)
      }
      else {
        fd.append('name', form.name)
        fd.append('category_id', form.category_id)
        fd.append('category_name', form.category_name)
        fd.append('brand', form.brand)
        fd.append('brand_id', form.brand_id)
        fd.append('barcode', form.barcode)
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

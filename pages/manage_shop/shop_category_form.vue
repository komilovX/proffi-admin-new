<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новая категория</h2>
    </div>
    <div class="form p1">
      <el-form
        :model="shopCategoryForm"
        status-icon :rules="rules"
        ref="shopCategoryForm"
        label-width="120px"
      >
        <el-form-item label="Название" prop="title" >
          <el-input type="text" v-model="shopCategoryForm.title" class="maxW35"></el-input>
        </el-form-item>
        <el-form-item
          label-width="0"
          prop="products"
        >
          <el-table
            :data="shopCategoryForm.products"
          >
            <el-table-column
              label="Товар"
              width="350"
            >
              <template slot-scope="{row,$index}">
                <el-select v-model="shopCategoryForm.products[$index].id"
                  style="width: 100%"
                >
                  <el-option v-for="s in productList" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="Тип"
              align="center"
            >
              <template slot-scope="{$index}">
                <el-select v-model="shopCategoryForm.products[$index].tip" style="width: 200px">
                  <el-option v-for="s in tipList" :key="s" :label="s" :value="s" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              fixed="right"
            >
              <template slot-scope="{row,$index}">
                <el-button @click="deleteItem($index)"
                  type="danger"
                  style="display: inline"
                  size="small"
                  icon="el-icon-delete"
                  plain circle
                />
              </template>
            </el-table-column>
          </el-table>
          <div class="df addmore">
            <el-button type="text" icon="el-icon-plus" @click="addMore">
              Добавить еще
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button
            type="success"
            @click="submitForm('shopCategoryForm')"
            :loading="loading"
          >
            Сохранить
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store}){
    try {
      const products = await store.dispatch('product/findAllProductsWithoutPagination')
      return {products}
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    const itemsValidator = (rule, value, callback) => {
      let checkIsEmpty = false
      if (value.length < 4) {
        callback(new Error('Товар должен быть не менее 6'))
        return
      }
      value.forEach(v => {
        Object.keys(v).forEach((i) => {
          if (!v[`${i}`]) {
            checkIsEmpty = true
            return
          }
        })
      })
      if (checkIsEmpty) {
        callback(new Error('пожалуйста, заполните форму правильно'))
      }
      else {
        callback()
      }
    }
    return{
      loading: false,
      tipList: ['NEW', 'HOT', 'HIT', 'SALE'],
      shopCategoryForm: {
        title: '',
        products: [{id: '', tip: ''}]
      },
      rules:{
        title: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' },
        ],
        products: [
          { type: 'array', required: true, trigger: 'submit', validator: itemsValidator }
        ]
      }
    }
  },
  computed: {
    productList() {
      return this.products.map(v => ({id: v.id, name: v.name}))
    }
  },
  methods:{
    goToBack() {
      this.$router.back()
    },
    deleteItem(index) {
      this.shopCategoryForm.products.splice(index, 1)
    },
    addMore() {
      this.shopCategoryForm.products.push({id: '', tip: ''})
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.shopCategoryForm.products = this.shopCategoryForm.products.map(v => {
            let product = this.products.find(p => p.id == v.id)
            delete product.createdAt
            delete product.updatedAt
            product.tip = v.tip
            return product
          })
          const formData = {
            title: this.shopCategoryForm.title,
            products: JSON.stringify(this.shopCategoryForm.products),
          }
          try {
            await this.$store.dispatch('shop/createCategory', formData)
            this.$message.success('категория успешна добавлен')
            this.$router.push('/manage_shop/shop_category')
          } catch (error) {
            this.loading = false
          }
        } else {
          return false;
        }
      });
    },
  },
  validate({store}) {
    const role = store.getters['auth/userRole']
    if (role != 3) {
      return true
    }
    store.dispatch('setAuthError', true)
    return false
  },
}

</script>
<style>
  .el-form label {
    text-align: left;
  }
</style>
<style lang="scss" scoped>
  .header i{
    font-weight: 800;
    font-size: 20px;
    color:#2688cd;
    cursor: pointer;
  }
  img{
    max-width: 368px;
    max-height: 180px;
  }
</style>

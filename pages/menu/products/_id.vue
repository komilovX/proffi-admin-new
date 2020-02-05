<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактирование товара</h2>
    </div>
    <div class="form p1">
      <el-form :model="productForm" status-icon :rules="rules" ref="editProductForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="productForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Категория" prop="category">
            <el-select v-model="productForm.category" style="min-width:35vw">
              <el-option v-for="c in categoryList" :key="c.id" :label="c.name" :value="c.id" :style="{'padding-left':c.padding+'px'}"/>
            </el-select>
          </el-form-item>
          <el-form-item label="Цена" prop="price">
          <div class="df" style="max-width:35vw">
            <label class="mr1">
              <span>Себестоимость</span>
              <el-input
              type="text"
              label="Себестоимость без НДС"
              placeholder="0"
              @input="checkValue()"
              v-model="productForm.price[0]"
              >
              <template slot="append">СУМ</template>
              </el-input>
            </label>
            <label class="mr1">
              <span>Наценка</span>
              <el-input
              type="text"
              label="Себестоимость без НДС"
              @input="calculatePercent()"
              placeholder="0"
              v-model="productForm.price[1]"
              >
              <template slot="append">%</template>
              </el-input>
            </label>
            <label>
              <span>Итого</span>
              <el-input
              type="text"
              label="Себестоимость без НДС"
              placeholder="0"
              v-model="productForm.price[2]"
              @input="checkTotal()"
              >
              </el-input>
            </label>
          </div>
        </el-form-item>
        <el-form-item label="Комментарий" prop="comment">
          <el-input
            class="maxW35"
            type="textarea"
            :rows="3"
            placeholder="Please input"
            v-model="productForm.comment">
          </el-input>
        </el-form-item>
          <el-form-item label="Фотография">
            <img v-image="product.photo" class="mb1">
            <el-upload
            ref="uploadCategoryId"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleAvatarChange"
            :on-remove="handleRemove"
            :auto-upload="false"
            :limit="1"
            :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">Загрузить...</el-button>
              <div slot="tip" class="el-upload__tip">файлы с расширением jpg/png</div>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="success" @click="submitForm('editProductForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import categoryList from '@/mixins/categoryList';
export default {
  async asyncData({store, route}) {
    try {
      if (store.getters['category/categories'].length == 0) {
        await store.dispatch('category/findAllCategories')
      }
      const product = await store.dispatch('product/findProductById', route.params.id)
      return { product }
    } catch (error) {

    }
  },
  data(){
    const validatePrice = (rule, value, callback) => {
      const isNumber = (parseFloat(value[0]) && (parseFloat(value[1]) || parseFloat(value[1]) == 0) && parseFloat(value[2]))
      if (!isNumber || +value[3] <= 0) {
        callback(new Error('Пожалуйста, введите корректное значение'))
      } else {
        callback()
      }
    }
    return{
      loading: false,
      file: null,
      productForm: {
        name: '',
        category: null,
        price: ['', '', '',],
        comment: '',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'blur' }
        ],
        price: [
          { type: 'array', trigger: 'submit', validator: validatePrice },
        ],
        comment: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' }
        ]
      }
    }
  },
  mixins: [categoryList],
  mounted() {
    this.productForm.name = this.product.name
    this.productForm.category = this.product.category_id
    this.productForm.price[0] = this.product.cost_netto
    this.productForm.price[1] = this.product.percent
    this.productForm.price[2] = this.product.cost
    this.productForm.comment = this.product.comment
  },
  methods:{
  goToBack() {
    this.$router.back()
  },
  handleAvatarChange(file, fileList) {
    let type = file.raw.type
    const isJPG = type === 'image/jpeg' || type === 'image/png'
    if (!isJPG) {
      this.imgUrl = ''
      fileList = []
      this.$refs.uploadCategoryId.clearFiles()
      this.$message.error('файлы толка с расширением jpg/png ')
      return
    }
    this.file = file
  },
  handleExceed(files, fileList) {
    this.$message.warning('Вы можете загрузить только один файл')
  },
  handleRemove(file, fileList){
    fileList = []
  },
  calculatePercent() {
    const price = this.productForm.price
    const isNumber = (parseFloat(price[0]) && (parseFloat(price[1]) || parseFloat(price[1]) == 0))
    if (price[0] && price[1] && isNumber) {
      this.productForm.price[2] = Number(+price[0]*((100+(+price[1]))/100)).toFixed(2)
    }
  },
  checkValue() {
    const price = this.productForm.price
    const isNumber = (parseFloat(price[0]) && parseFloat(price[1]))
    if (isNumber) {
      this.productForm.price[2] = Number(+price[0]*((100+(+price[1]))/100)).toFixed(2)
    }
  },
  checkTotal() {
    const price = this.productForm.price
    const isNumber = (parseFloat(price[1]) && parseFloat(price[2]))
    if (isNumber) {
      this.productForm.price[0] = Number(+price[2] / ((100+(+price[1]))/100)).toFixed(2)
    }
  },
  submitForm(formName) {
    this.$refs[formName].validate( async (valid) => {
      if (valid) {
        this.loading = true
        let {name} = this.$store.getters['category/categories'].find(f => f.id == this.productForm.category)
        const [cost_netto, percent, cost] = this.productForm.price
        const formData = {
          id: this.$route.params.id,
          name: this.productForm.name,
          category_id: this.productForm.category,
          category_name: name,
          image: this.file?this.file.raw : null,
          cost_netto,
          cost,
          percent,
          comment: this.productForm.comment
        }
        try {
          await this.$store.dispatch('product/updateProductById', formData)
          this.loading = false
          this.$message.success('продукт успешно обновлен')
          this.$router.push('/menu/products')
        } catch (error) {
          this.loading = false
          console.log(error);
        }
      } else {
        return false;
      }
    });
    },
  },
}
</script>
<style lang="scss" scoped>
  .header i{
    font-weight: 800;
    font-size: 20px;
    color:#2688cd;
    cursor: pointer;
  }
  img{
    max-width: 125px;
    max-height: 95px;
  }
  label span{
    color: #888;
    font-size: .9em
  }
</style>

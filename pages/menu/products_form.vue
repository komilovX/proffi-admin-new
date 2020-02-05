<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новый товар</h2>
    </div>
    <div class="form p1">
      <el-form :model="productForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
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
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            action="http://localhost:3000"
            :on-change="handleAvatarChange"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
            >
            <template v-if="!imgUrl">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Перетащите картинку <em>или нажмите</em></div>
              <div class="el-upload__tip" slot="tip">файлы с расширением jpg/png</div>
            </template>
            <img :src="imgUrl" alt="">
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm('ruleForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import categoryList from '@/mixins/categoryList';
export default {
  async fetch({store}) {
    try {
      if (store.getters['category/categories'].length === 0) {
        await store.dispatch('category/findAllCategories')
      }
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
      imgUrl: '',
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
        category: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'change' }
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
        this.$refs.upload.clearFiles()
        this.$message.error('файлы толка с расширением jpg/png ')
        return
      }
      this.imgUrl = URL.createObjectURL(file.raw);
      this.file = file
    },
    handleExceed(files, fileList) {
      this.$message.warning('Вы можете загрузить только один файл')
    },
    handleRemove(file, fileList){
      this.imgUrl = ''
      fileList = []
    },
    calculatePercent() {
      const price = this.productForm.price
      const isNumber = (parseFloat(price[0]) && (parseFloat(price[1]) || parseFloat(price[1]) === 0))
      if (price[0] && price[1] && isNumber) {
        this.productForm.price[2] = Number(+price[0]*((100+(+price[1]))/100)).toFixed(2)
      }
    },
    checkValue() {
      const price = this.productForm.price;
      const isNumber = (parseFloat(price[0]) && parseFloat(price[1]));
      if (isNumber) {
        this.productForm.price[2] = Number(+price[0]*((100+(+price[1]))/100)).toFixed(2)
      }
    },
    checkTotal() {
      const price = this.productForm.price;
      const isNumber = (parseFloat(price[1]) && parseFloat(price[2]));
      if (isNumber) {
        this.productForm.price[0] = Number(+price[2] / ((100+(+price[1]))/100)).toFixed(2)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.file) {
          this.loading = true
          let {name} = this.$store.getters['category/categories'].find(f => f.id === this.productForm.category)
          const [cost_netto, percent, cost] = this.productForm.price
          const formData = {
            name: this.productForm.name,
            category_id: this.productForm.category,
            category_name: name,
            image: this.file.raw,
            cost_netto,
            cost,
            percent,
            comment: this.productForm.comment
          }
          try {
            await this.$store.dispatch('product/createProduct', formData)
            this.loading = false
            this.$message.success('товар успешна добавлена')
            await this.$router.push('/menu/products')
          } catch (error) {
            this.loading = false
            console.log(error);
          }
        } else {
          if (!this.file) {
            this.$message.error('фото не выбрано')
          }
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
    max-width: 368px;
    max-height: 180px;
  }
  label span{
    color: #888;
    font-size: .9em
  }
</style>

<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактировать категорию</h2>
    </div>
    <div class="form p1">
      <el-form :model="brandsForm" status-icon :rules="rules" ref="brandsForm" label-width="120px" class="demo-ruleForm">
        <div class="bb mb1">
          <el-form-item label="Название" prop="name" >
            <el-input type="text" v-model="brandsForm.name" class="maxW35"></el-input>
          </el-form-item>
          <el-form-item label="Фотография">
            <img v-image="brand.photo" class="mb1">
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
          <el-button type="success" @click="submitForm('brandsForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import categoryList from '@/mixins/categoryList';
export default {
  middleware: ['admin-auth'],
  async asyncData({store, route}) {
    try {
      const brand = await store.dispatch('brands/findById', route.params.id)
      return { brand }
    } catch (e) {
      console.log(e)
    }
  },
  data(){
    return{
      loading: false,
      file: null,
      brandsForm: {
        name: '',
        category: '',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {
    this.brandsForm.name = this.brand.name
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
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const formData = {
            id: this.$route.params.id,
            name: this.brandsForm.name,
            image: this.file ? this.file.raw : null
          }
          this.loading = true
          try {
            await this.$store.dispatch('brands/updateById', formData)
            this.loading = false
            this.$router.push('/menu/brands')
          } catch (error) {
            this.loading = false
            console.log('error', error)
          }
        }
        else {
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
</style>

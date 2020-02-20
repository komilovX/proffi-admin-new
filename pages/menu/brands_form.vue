<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новый бренд</h2>
    </div>
    <div class="form p1">
      <el-form :model="brandForm" status-icon :rules="rules" ref="brandForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="Название" prop="name" >
          <el-input type="text" v-model="brandForm.name" class="maxW35"></el-input>
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
          <el-button type="success" @click="submitForm('brandForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ['admin-auth'],
  data(){
    return{
      loading: false,
      imgUrl: '',
      file: null,
      brandForm: {
        name: '',
      },
      rules:{
        name: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
          { min: 3, message: 'Длина должна быть не менее 3 букв', trigger: 'blur' }
        ],
      }
    }
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
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && this.file) {
          this.loading = true
          const formData = {
            name: this.brandForm.name,
            photo: this.file.raw
          }
          try {
            await this.$store.dispatch('brands/createBrand', formData)
            this.$message.success('Бренд успешна добавлена')
            this.$router.push('/menu/brands')
          } catch (error) {
            this.loading = false
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
    max-width: 368px;
    max-height: 180px;
  }
</style>

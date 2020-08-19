<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Изменить слайд</h2>
    </div>
    <div class="form p1">
      <el-form
        :model="carouselForm"
        status-icon
        :rules="rules"
        ref="carouselForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="Товар" prop="category">
          <el-select v-model="carouselForm.product_id" style="min-width:35vw">
            <el-option
              v-for="c in products"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Фотография">
          <img
            :src="`http://localhost:3000/uploads${carousel.image_small}`"
            class="mb1"
          />
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
            <div slot="tip" class="el-upload__tip">
              файлы с расширением jpg/png
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            @click="submitForm('carouselForm')"
            :loading="loading"
            >Сохранить</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  middleware: ["admin-auth"],
  async asyncData({ store, route }) {
    try {
      const { carousel, products } = await store.dispatch(
        "shop/findCarouselById",
        route.params.id
      );
      return { carousel, products };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      loading: false,
      imgUrl: "",
      file: null,
      carouselForm: {
        product_id: ""
      },
      rules: {
        product_id: [
          {
            required: true,
            message: "Пожалуйста, введите название деятельности",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.carouselForm.product_id = this.carousel.product_id;
  },
  methods: {
    goToBack() {
      this.$router.back();
    },
    handleAvatarChange(file, fileList) {
      let type = file.raw.type;
      const isJPG = type === "image/jpeg" || type === "image/png";
      if (!isJPG) {
        this.imgUrl = "";
        fileList = [];
        this.$refs.upload.clearFiles();
        this.$message.error("файлы толка с расширением jpg/png ");
        return;
      }
      this.imgUrl = URL.createObjectURL(file.raw);
      this.file = file;
    },
    handleExceed(files, fileList) {
      this.$message.warning("Вы можете загрузить только один файл");
    },
    handleRemove(file, fileList) {
      this.imgUrl = "";
      fileList = [];
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid && this.file) {
          this.loading = true;
          const product = this.products.find(
            p => p.id == this.carouselForm.product_id
          );
          const formData = {
            id: this.$route.params.id,
            product_id: this.carouselForm.product_id,
            product_name: product.name,
            image: this.file ? this.file.raw : undefined
          };
          try {
            await this.$store.dispatch("shop/updateCarouselById", formData);
            this.$message.success("слайд успешна добавлен");
            this.$router.push("/manage_shop/shop_carousel");
          } catch (error) {
            this.loading = false;
          }
        } else {
          if (!this.file) {
            this.$message.error("фото не выбрано");
          }
          return false;
        }
      });
    }
  },
  validate({ store }) {
    const role = store.getters["auth/userRole"];
    if (role != 3) {
      return true;
    }
    store.dispatch("setAuthError", true);
    return false;
  }
};
</script>
<style lang="scss" scoped>
.header i {
  font-weight: 800;
  font-size: 20px;
  color: #2688cd;
  cursor: pointer;
}
img {
  max-width: 368px;
  max-height: 180px;
}
</style>

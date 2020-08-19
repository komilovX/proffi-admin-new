<template>
  <div>
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Новый слайд</h2>
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
        <el-form-item label="Товар" prop="product_id">
          <el-select v-model="carouselForm.product_id" style="min-width:35vw">
            <el-option
              v-for="c in productList"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Фотография">
          <el-upload
            ref="upload"
            action="http://localhost:3000"
            :on-change="
              (...props) => handleAvatarChange(...props, 'file_large')
            "
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
          >
            <el-button size="small" type="primary">Загрузить</el-button>
            <div>Большая фотография(1300px - 500px)</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="Фотография">
          <el-upload
            ref="upload"
            action="http://localhost:3000"
            :on-change="
              (...props) => handleAvatarChange(...props, 'file_small')
            "
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :limit="1"
          >
            <el-button size="small" type="primary">Загрузить</el-button>
            <div>Маленькая фотография(640px - 400px)</div>
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
  async asyncData({ store }) {
    try {
      const products = await store.dispatch(
        "product/findAllProductsWithoutPagination"
      );
      return { products };
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      loading: false,
      file_large: null,
      file_small: null,
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
  computed: {
    productList() {
      return this.products.map(v => ({ id: v.id, name: v.name }));
    }
  },
  methods: {
    goToBack() {
      this.$router.back();
    },
    handleAvatarChange(file, fileList, file_type) {
      let type = file.raw.type;
      const isJPG = type === "image/jpeg" || type === "image/png";
      if (!isJPG) {
        this.imgUrl = "";
        fileList = [];
        this.$refs.upload.clearFiles();
        this.$message.error("файлы толка с расширением jpg/png ");
        return;
      }
      this[file_type] = file;
    },
    handleExceed(files, fileList) {
      this.$message.warning("Вы можете загрузить только один файл");
    },
    handleRemove(file, fileList) {
      fileList = [];
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid && this.file_large && this.file_small) {
          this.loading = true;
          const product = this.products.find(
            p => p.id == this.carouselForm.product_id
          );
          const formData = {
            product_id: this.carouselForm.product_id,
            product_name: product.name,
            image_small: this.file_small.raw,
            image_large: this.file_large.raw
          };
          try {
            await this.$store.dispatch("shop/createCarousel", formData);
            this.$message.success("слайд успешна добавлен");
            this.$router.push("/manage_shop/shop_carousel");
          } catch (error) {
            this.loading = false;
          }
        } else {
          if (!this.file_large || !this.file_small) {
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

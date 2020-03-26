<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Картинки для слайдера</h2>
      <el-button type="success" size="medium" @click="goToForm()">Добавить</el-button>
    </div>
    <div class="table p05 ctg">
      <el-table
        :data="carousel"
        row-key="id"
        style="width: 100%"
      >

        <el-table-column
          label="Картинка"
          width="250"
        >
          <template slot-scope="{row:{photo}}" class="ml1">
            <div class="img-part df">
              <img :src="`http://localhost:3000/uploads${photo}`" width="48" height="35" class="mr05">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Товар"
          prop="product_name"
          align="left"
          header-align="left"
          show-overflow-tooltip
        />
        <el-table-column
          width="100"
          fixed="right"
        >
          <template slot-scope="{row:{id}}">
            <div class="red df">
              <nuxt-link :to='`/manage_shop/shop_carousel/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
                trigger="click"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-delete" :command="{id, command: 'delete'}">Удалить</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['admin-auth'],
  async asyncData({store, error}) {
    try {
      const carousel = await store.dispatch('shop/findAllCarousels')
      return {carousel}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
  }),
  methods:{
    goToForm(){
      this.$router.push(`/manage_shop/carousel_form`)
    },
    async handleCommand({id}){
      try {
        const text = 'Уверены что хотите удалить эту слайду?'
        this.$confirm(text,'Подтверждение',{
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning'
        }).then(async () => {
          try {
            await this.$store.dispatch('shop/deleteCarouselById', id)
            this.carousel = this.carousel.filter(t => t.id != id)
            this.$message.success('Cлай удален')
          } catch (e) {
            console.log(e)
          }
        }).catch(() => {})
      } catch (error) {
        console.log(error);
      }
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
  .search{
    max-width: 300px;
  }
  .df{
    display: flex;
    align-items: center
  }
  .img-part span{
    margin-left: .5rem;
  }
  .table i {
    font-size: 18px;
    cursor: pointer;
    color: #2688cd;
  }
  .red{
    color: #2688cd;
  }

</style>

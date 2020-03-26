<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Категории</h2>
      <el-button type="success" size="medium" @click="goToForm()">Добавить</el-button>
    </div>
    <div class="table p05 ctg">
      <el-table
        :data="categories"
        row-key="id"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-table
            :data="JSON.parse(row.products)"
            tooltip-effect="light"
            :header-row-class-name="rowClassName"
            style="width: 100%"
            >
              <el-table-column
                prop="name"
                size="small"
                label="Товар"
                width="500"
                show-overflow-tooltip
              />
              <el-table-column
                prop="tip"
                label="Тип"
                align="center"
              >
                <template slot-scope="{row:{tip}}">
                  <el-tag type="primary">{{tip}}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
        />
        <el-table-column
          label="Титул"
          prop="title"
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
              <nuxt-link :to='`/manage_shop/shop_category/${id}`' tag="a" class="mr1">Ред</nuxt-link>
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
      const categories = await store.dispatch('shop/findAllCategories')
      return {categories}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
  }),
  methods:{
    goToForm(){
      this.$router.push(`/manage_shop/shop_category_form`)
    },
    async handleCommand({id}){
      try {
        const text = 'Уверены что хотите удалить эту категорийу?'
        this.$confirm(text,'Подтверждение',{
          confirmButtonText: 'Да',
          cancelButtonText: 'Отменить',
          type: 'warning'
        }).then(async () => {
          try {
            await this.$store.dispatch('shop/deleteCategoryById', id)
            this.categories = this.categories.filter(t => t.id != id)
            this.$message.success('Cлай удален')
          } catch (e) {
            console.log(e)
          }
        }).catch(() => {})
      } catch (error) {
        console.log(error);
      }
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
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
  .el-table .table-header {
    color:#999999;
    font-size: 12px;
  }
</style>
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

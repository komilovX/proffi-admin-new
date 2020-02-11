<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Бренды</h2>
      <el-button type="success" size="medium" @click="goToForm()">Добавить</el-button>
    </div>
    <div class="p1 search">
      <el-input
        v-model="search"
        placeholder="Быстрый поиск"
        prefix-icon="el-icon-search"
        size="medium"
      >
      </el-input>
    </div>
    <div class="table p05 ctg">
      <el-table
      :data="brands.filter(val => !search || val.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
      >
        <el-table-column
        label="Бренд"
        class="df"
        >
          <template slot-scope="{row:{photo,name}}" class="ml1">
            <div class="img-part df">
              <img v-image="photo" width="48" height="35" class="mr05">
              <span>{{name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          fixed="right"
        >
          <template slot-scope="{row:{id}}">
            <div class="red df">
              <nuxt-link :to='`/menu/brands/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
              trigger="click"
              @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-delete" :command="{id,command:'delete'}">Удалить</el-dropdown-item>
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
  async asyncData({store, error}) {
    try {
      const brands = await store.dispatch('brands/findAllBrands')
      return {brands}
    } catch (e) {
      error(e)
    }
  },
  data: () => ({
    search: ''
  }),
  methods:{
    goToForm(){
      this.$router.push(`/menu/brands_form`)
    },
    async handleCommand({command, id}){
      try {
          const text = 'Уверены, что хотите удалить эту брендю?'
          this.$confirm(text,'Подтверждение',{
            confirmButtonText: 'Да',
            cancelButtonText: 'Отменить',
            type: 'warning'
          }).then(async () => {
            try {
              await this.$store.dispatch('brands/deleteById', id)
              this.brands = this.brands.filter(t => t.id != id)
              this.$message.success('Бренд удалена')
            } catch (e) {
              console.log(e)
            }
          }).catch(() => {})
      } catch (error) {
        console.log(error);
      }
    }
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

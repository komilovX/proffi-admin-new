<template>
  <div>
    <div class="header df-sb p1 bb">
      <h2>Товары</h2>
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
    <div class="table p05">
      <el-table
      :data="products.filter(val => !search || val.name.toLowerCase().includes(search.toLowerCase()) || val.category_name.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="light"
      :row-class-name="tableRowClassName"
      :header-row-class-name="rowClassName"
      style="width: 100%">

        <el-table-column
        min-width="250"
        label="Название"
        show-overflow-tooltip
        >
          <template slot-scope="{row:{name, photo}}">
            <div class="img-part df">
              <img v-image="photo" width="48" height="35" class="mr05">
              <span>{{name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
        min-width="200"
        prop="category_name"
        label="Категория"
        align="left"
        show-overflow-tooltip
        />
        <el-table-column
        min-width="200"
        label="Себестоимость"
        align="center"
        >
          <template slot-scope="{row: {cost_netto} }">
            {{ formatCurrency(cost_netto) }}
          </template>
        </el-table-column>
        <el-table-column
        label="Цена"
        >
          <template slot-scope="{row: {cost} }">
            {{ formatCurrency(cost) }}
          </template>
        </el-table-column>
        <el-table-column
        label="Наценка"
        align="center"
        >
          <template slot-scope="{row: {percent} }">
            {{ percent+'%' }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{row:{id}}">
            <div class="red df">
              <nuxt-link :to='`/menu/products/${id}`' tag="a" class="mr1">Ред</nuxt-link>
              <el-dropdown
              trigger="click"
              @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-open" :command="{id,command:'hide'}">{{hideOrShow(id)}}</el-dropdown-item>
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
      const products = await store.dispatch('product/findAllProducts')
      return {products}
    } catch (e) {
      error(e)
    }
  },
  data: () => ({
    search: '',
    hiddenRows: [],
    hideStatus: 'Скрыть во всех заведениях',
  }),
  mounted() {
    this.products.filter(f => {
      if (f.hidden == 1) {
        this.hiddenRows.push(f.id)
      }
    })
  },
  methods:{
    goToForm(){
      this.$router.push(`/menu/products_form`)
    },
    tableRowClassName({row, rowIndex}) {
      if (this.hiddenRows.includes(row.id)) {
        return 'hidden-row';
      }
      return '';
    },
    async handleCommand({command, id}){
      try {
       if (command == 'hide') {
          if (this.hiddenRows.includes(id)) {
            await this.$store.dispatch('product/hideProductById', {id, hide: false  })
            this.hiddenRows = this.hiddenRows.filter(f => f != id)
          }
          else{
            await this.$store.dispatch('product/hideProductById', {id, hide: true})
            this.hiddenRows.push(id)
          }
        }
        else {
          const text = 'Уверены, что хотите удалить эту товар?'
          this.$confirm(text,'Подтверждение',{
            confirmButtonText: 'Да',
            cancelButtonText: 'Отменить',
            type: 'warning'
          }).then(async () => {
            await this.$store.dispatch('product/delteProductById', id)
            this.products = this.products.filter(t => t.id != id)
            this.$message.success('Товар удалена')
          }).catch(() => {})
        }
      } catch (error) {
        console.log(error)
      }
    },
    hideOrShow(id) {
      if (this.hiddenRows.includes(id)) {
        return 'Показать во всех заведениях'
      }
      return 'Скрыть во всех заведениях'
    },
    formatCurrency(cost) {
      return new Intl.NumberFormat('ru').format(cost)
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
    }
  }
}
</script>
<style>
  .el-table .hidden-row{
    opacity: 0.5;
  }
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

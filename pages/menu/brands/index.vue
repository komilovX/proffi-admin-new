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
        @input="onInput"
      >
      </el-input>
    </div>
    <div class="table p05 ctg">
      <el-table
      :data="data"
      v-loading="loading"
      style="width: 100%"
      >
        <el-table-column
        label="Бренд"
        class="df"
        >
          <template slot-scope="{row:{photo,name}}" class="ml1">
            <div class="img-part df">
              <img :src="`http://207.154.223.158:8000/uploads${photo}`" width="48" height="35" class="mr05">
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
      <app-pagination
        v-if="size > 30 && pagination"
        :size="size"
        :currentPage="+($route.query.page)"
        @paginationChange="currentChange($event)"/>
    </div>
  </div>
</template>

<script>
import AppPagination from '@/components/AppPagination'
export default {
  middleware: ['admin-auth'],
  async asyncData({store, route, error}) {
    try {
      const {data, size} = await store.dispatch('brands/findAllBrands',
        {page: route.query.page || 1})
      return {brands: data, size}
    } catch (e) {
      console.log(e)
    }
  },
  data: () => ({
    data: [],
    search: '',
    pagination: true,
    loading: false,
  }),
  components: {AppPagination},
  mounted() {
    this.data = this.brands
  },
  methods:{
    goToForm(){
      this.$router.push(`/menu/brands_form`)
    },
    async onInput(val) {
      if (!val) {
        this.data = this.brands
        this.pagination = true
      } else {
        try {
          const brands = await this.$store.dispatch('brands/searchBrands', val);
          this.data = brands
          this.pagination = false
        } catch (e) {
          console.log(e)
        }
      }
    },
    async currentChange(val) {
      try {
        this.loading = true
        const response = await this.$store.dispatch('brands/findAllBrands', {page: val})
        this.$router.push({ path: this.$route.path, query: {page: val } })
        this.data = response.data
        this.size = response.size
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
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

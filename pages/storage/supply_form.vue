<template>
  <div id="scrollinElement">
    <div class="header p1 df bb">
      <i class="el-icon-arrow-left mr1" @click="goToBack()"></i>
      <h2>Редактирование карточки поставщика</h2>
    </div>
    <div class="form p1">
      <el-form :model="supplyForm" status-icon :rules="rules" ref="supplyForm" label-width="200px" class="demo-ruleForm">
          <el-form-item label="Дата и время поставки" prop="date" >
            <el-date-picker
              v-model="supplyForm.date"
              type="datetime"
              format= "dd-MM-yyyy HH:mm"
              placeholder="Select date and time">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Поставщик" prop="supplier">
            <el-select v-model="supplyForm.supplier" style="min-width:35vw">
              <el-option v-for="s in suppliers" :key="s.id" :label="s.name" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Склад" prop="store">
            <el-select v-model="supplyForm.store" style="min-width:35vw">
              <el-option v-for="s in stores" :key="s.id" :label="s.name" :value="s.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="Комментарий" prop="comment" class="mb4">
            <el-input
              class="maxW35"
              type="textarea"
              :rows="2"
              placeholder="Комментарий"
              v-model="supplyForm.comment">
            </el-input>
          </el-form-item>
          <el-form-item
          label-width="0"
          prop="items"
          >
            <el-table
            :data="supplyForm.items"
            >
              <el-table-column
              label="Наименование"
              width="300"
              >
                <template slot-scope="{$index}">
                  <el-select v-model="supplyForm.items[$index].id" style="width: 100%">
                    <el-option v-for="s in products" :key="s.id" :label="s.name" :value="s.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
              label="Количество"
              width="220"
              >
                <template slot-scope="{$index}">
                  <el-input type="text" @input="checkValue($index)" v-model="supplyForm.items[$index].amount" style="width: 160px" class="mr1">
                    <template slot="append">ШТ</template>
                  </el-input>
                  <span><i class="el-icon-close"></i></span>
                </template>
              </el-table-column>
              <el-table-column
              label="Цена за единицу"
              width="250"
              >
                <template slot-scope="{$index}">
                  <el-input @input="multiplyValue($index)" type="text" v-model="supplyForm.items[$index].cost">
                    <template slot="append">СУМ</template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
              label="Общая сумма"
              width="320"
              >
                <template slot-scope="{$index}">
                  <el-input type="text" @input="checkTotal($index)" v-model="supplyForm.items[$index].total" style="width: 230px" class="mr1">
                    <template slot="append">СУМ</template>
                  </el-input>
                  <el-button @click="deleteItem($index)" type="warning" style="display: inline" size="small" icon="el-icon-delete" plain circle />
                </template>
              </el-table-column>
            </el-table>
            <div class="df addmore" @click="addMore">
              <i class="el-icon-plus"></i>
              <span>Добавить еще</span>
            </div>
          </el-form-item>

        <el-form-item label-width="0" id="submit-button">
          <el-button type="success" @click="submitForm('supplyForm')" :loading="loading">Сохранить </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({store}) {
    try {
      const {suppliers, stores, products} = await store.dispatch('supply/findAllDetails')
      return { suppliers, stores, products }
    } catch (e) {

    }
  },
  data(){
    const itemsValidator = (rule, value, callback) => {
      let checkIsEmpty = false
      let isNumber = true
      value.forEach(v => {
        Object.keys(v).forEach((i, index) => {
          if (!v[`${i}`]) {
            checkIsEmpty = true
            return
          }
          if (index != 0 && !parseFloat(v[`${i}`])) {
            isNumber = false
            return
          }
        })
      })
      if (checkIsEmpty) {
        callback(new Error('пожалуйста, заполните форму правильно'))
      }
      if (!isNumber) {
        callback(new Error('пожалуйста, заполните форму правильно'))
      }
      else {
        callback()
      }
    }
    return{
      loading: false,
      file: null,
      supplyForm: {
        date: new Date(),
        supplier: '',
        store: '',
        comment: '',
        items: [ { id: '', amount: '', cost: '', total: '' } ]
      },
      rules:{
        date: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        supplier: [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        store : [
          { required: true, message: 'Пожалуйста, введите название деятельности', trigger: 'blur' },
        ],
        items: [
          { type: 'array', required: true, trigger: 'submit', validator: itemsValidator }
        ]
      }
    }
  },
  methods:{
  goToBack() {
    this.$router.back()
  },
  addMore() {
    const body = document.getElementsByTagName('body')[0]
    this.supplyForm.items.push({ id: '', amount: '', cost: '', total: '' })
    window.scrollTo(0,document.querySelector("#scrollinElement").scrollHeight);
  },
  deleteItem(index) {
    this.supplyForm.items.splice(index, 1)
  },
  checkValue(index) {
    const {amount, cost, total} = this.supplyForm.items[index]
    const isNumber = (parseFloat(amount) && parseFloat(cost))
    if (isNumber) {
      this.supplyForm.items[index].total = Number(+amount * cost ).toFixed(2)
    }
  },
  multiplyValue(index) {
    const {amount, cost, total} = this.supplyForm.items[index]
    const isNumber = (parseFloat(amount) && parseFloat(cost))
    if (isNumber) {
      this.supplyForm.items[index].total = Number(+amount * cost ).toFixed(2)
    }
  },
  checkTotal(index) {
    const {amount, cost, total} = this.supplyForm.items[index]
    const isNumber = (parseFloat(amount) && parseFloat(total))
    if (isNumber) {
      this.supplyForm.items[index].cost = Number(+total/ amount).toFixed(2)
    }
  },
  submitForm(formName) {
    this.$refs[formName].validate(async (valid) => {
      if (valid) {
        const total = this.supplyForm.items.reduce((acc, cur) => acc + Number(cur.total),0)
        let supplier_name = this.suppliers.find(f => f.id == +this.supplyForm.supplier)
        let store_name = this.stores.find(f => f.id == +this.supplyForm.store)
        let products = []
        this.supplyForm.items.forEach(p => {
          let {name} = this.products.find(f => f.id == p.id)
          products.push({...p,name})
        })
        const formData = {
          date: this.supplyForm.date,
          supplier_name: supplier_name.name,
          supplier_id: this.supplyForm.supplier,
          store_name: store_name.name,
          store_id: this.supplyForm.store,
          comment: this.supplyForm.comment,
          products: JSON.stringify(products),
          total: parseFloat(total)
        }
        this.loading = true
        try {
          await this.$store.dispatch('supply/createSupply', formData)
          this.loading = false
          this.$message.success('поставка успешна добавлена')
          this.$router.push('/storage/supply')
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      } else {
        return false;
      }
    });
    },
  },
}
</script>
<style>
  .el-form label {
    text-align: left;
  }
</style>
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
  .el-table i {
    font-size: 20px;
    font-weight: 800;
    line-height: 40px;
    vertical-align: -webkit-baseline-middle;
  }
  .addmore{
    display: inline;
    cursor: pointer;
    color: #2688cd;
  }
  #submit-button{
    margin-bottom: 0!important;
  }
</style>

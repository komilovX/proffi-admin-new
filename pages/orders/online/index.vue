<template>
  <div>
    <div class="header p1">
      <h2>Онлайн заказы</h2>
    </div>
    <el-tabs type="border-card" stretch>
      <el-tab-pane :label="`Новый заказы (${newOrders.length})`">
        <el-table
        :data="newOrders"
        :header-row-class-name="rowClassName"
        tooltip-effect="light"
        style="width: 100%"
        size="medium"
        >
          <el-table-column
          width="100"
          prop="id"
          label="ID"
          />
          <el-table-column
            width="200"
            label="Дата"
            align="center"
            sortable
            >
            <template slot-scope="{row: {date} }">
              <i class="el-icon-time"></i>
              {{ formaterDate(date) }}
            </template>
          </el-table-column>
          <el-table-column
          width="300"
          label="Имя"
          prop="name"
          align="center"
          show-overflow-tooltip
          />
          <el-table-column
          width="200"
          prop="order_type"
          align="center"
          label="Тип платежа"
          />
          <el-table-column
            label="Управлять"
            align="center"
          >
            <template slot-scope="{row: {id}}">
              <el-button type="primary"
              size="small"
              icon="el-icon-view"
              plain
              @click="goToId(id)"
              >
              Посмотреть
              </el-button>
            </template>
          </el-table-column>
      </el-table>
      </el-tab-pane>
        <el-tab-pane :label="`Ожидающий заказы (${processOrders.length})`">
          <el-table
          :data="processOrders"
          :header-row-class-name="rowClassName"
          tooltip-effect="light"
          style="width: 100%"
          size="medium"
          >
            <el-table-column
            width="100"
            prop="id"
            label="ID"
            />
            <el-table-column
              width="200"
              label="Дата"
              align="center"
              sortable
              >
              <template slot-scope="{row: {date} }">
                <i class="el-icon-time"></i>
                {{ formaterDate(date) }}
              </template>
            </el-table-column>
            <el-table-column
            width="300"
            label="Имя"
            prop="name"
            align="center"
            show-overflow-tooltip
            />
            <el-table-column
            width="200"
            prop="order_type"
            align="center"
            label="Тип платежа"
            />
            <el-table-column
              label="Управлять"
              align="center"
            >
              <template slot-scope="{row: {id}}">
                <el-button type="primary"
                size="small"
                icon="el-icon-view"
                plain
                @click="goToId(id)"
                >
                Посмотреть
                </el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="`Оформлений заказы (${activeOrders.length})`">
        <el-table
          :data="activeOrders"
          :header-row-class-name="rowClassName"
          tooltip-effect="light"
          style="width: 100%"
          size="medium"
          >
          <el-table-column type="expand">
            <template slot-scope="{row}">
              <el-table
              :data="JSON.parse(row.products)"
              tooltip-effect="light"
              :header-row-class-name="rowClassName"
              style="width: 100%"
              :id="`row-product-${row.id}`"
              >
                <el-table-column
                prop="name"
                size="small"
                label="Товар"
                width="300"
                show-overflow-tooltip
                />
                <el-table-column
                prop="amount"
                label="Кол-во"
                align="center"
                width="250"
                />
                <el-table-column
                label="Цена за единицу"
                align="center"
                width="250"
                >
                  <template slot-scope="{row: {cost}}">
                    {{ formatCurrency(cost) }}
                  </template>
                </el-table-column>
                <el-table-column
                label="Общая сумма"
                align="right"
                >
                  <template slot-scope="{row: {cost, amount}}">
                    {{ formatCurrency(cost*amount) }}
                  </template>
                </el-table-column>
              </el-table>
          </template>
        </el-table-column>
            <el-table-column
            width="100"
            prop="id"
            label="ID"
            />
            <el-table-column
              width="200"
              label="Дата"
              align="center"
              >
              <template slot-scope="{row: {date} }">
                <i class="el-icon-time"></i>
                {{ formaterDate(date) }}
              </template>
            </el-table-column>
            <el-table-column
            width="300"
            label="Имя"
            prop="name"
            align="center"
            show-overflow-tooltip
            />
            <el-table-column
            width="200"
            prop="order_type"
            align="center"
            label="Тип платежа"
            />
            <el-table-column
              label="Управлять"
              align="center"
            >
              <template slot-scope="{row: {id}}">
                <el-button @click="printMe(id)" type="primary" plain icon="el-icon-printer" size="small"/>
                <el-button
                type="primary"
                size="small"
                @click="openDialog(id)"
                >
                инфо
                </el-button>
                <el-button
                type="success"
                size="small"
                @click="addToDelivered(id)"
                >
                доставлена
                </el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
    title="Xabar jo'natish"
    :visible.sync="dialogVisible"
    width="50%"
    id="dialog"
    >
      <div class="text item info">
        <div><strong>Имя клиента: </strong>{{currentOrder.name}}</div>
        <div><strong>Телефон клиента: </strong>{{currentOrder.phone}}</div>
        <div><strong>Оплата: </strong>{{currentOrder.order_type}}</div>
        <div><strong>Система: </strong>{{currentOrder.system}}</div>
        <div><strong>Адрес клиента: </strong>{{currentOrder.address}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">закрыть</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  async asyncData({store, error}) {
    try {
      const orders = await store.dispatch('order/getAllOrder')
      const newOrders = orders.filter(o => o.status == 1)
      const processOrders = orders.filter(o => o.status == 2)
      const activeOrders = orders.filter(o => o.status == 3)
      return {newOrders, processOrders, activeOrders}
    } catch (e) {
      error(e)
    }
  },
  data: () => ({
    loading: false,
    dialogVisible: false,
    currentOrder: {},
  }),
  methods: {
    formatCurrency(cost) {
      return new Intl.NumberFormat('ru').format(cost)
    },
    formaterDate(date) {
     const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: false
      }

      return new Date(date).toLocaleString('ru-RU', options)
    },
    goToId(id) {
      this.$router.push(`/orders/online/${id}`)
    },
    openDialog(id) {
      const order = this.activeOrders.find(f => f.id == id)
      this.currentOrder = order
      this.dialogVisible = true
    },
    printMe(id) {
      const order = this.activeOrders.find(f => f.id == id)
      let table = document.getElementById(`row-product-${id}`)
      let product = JSON.parse(order.products)

      let html = `
        <div><strong>Имя клиента: </strong>${order.name}</div>
        <div><strong>Телефон клиента: </strong>${order.phone}</div>
        <div><strong>Оплата: </strong>${order.order_type}</div>
        <div><strong>Система: </strong>${order.system}</div>
        <div><strong>Адрес клиента: </strong>${order.address}</div>
        <table>
          <tr>
            <th>Товар</th>
            <th>Кол-во</th>
            <th>Цена</th>
          </tr>
           ${product.map(p =>{
             return `
             <tr>
              <td>${p.name}</td>
              <td>${p.amount}</td>
              <td>${p.cost}</td>
             </tr>
             `
           }).join('')}
        </table>
      `
      console.log('html', html)
      let newWin= window.open("");
      newWin.document.write(html);
      newWin.print();
      newWin.close();
    },
    async addToDelivered(id) {
      this.$confirm('Вы действительно уверенно что этот заказ доставлен?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async () => {
        try {
          this.loading = true
          await this.$store.dispatch('order/changeStatus',{id, status: 4})
          this.loading = false
          this.activeOrders = this.activeOrders.filter(f => f.id != id)
          this.$message.success("Заказ успешно добавлен в список недоставленных заказов!")
        } catch (e) {
          this.loading = false
          console.log(e)
        }
      })
    },
    rowClassName({row, rowIndex}) {
      return 'table-header'
    },
  },
  computed: {
    ioOrder() {
      return this.$store.getters['order/orders']
    }
  },
  watch:{
    ioOrder(val) {
      this.newOrders = val
    }
  }
}
</script>
<style scoped lang="scss">
  .info div{
    margin-bottom: 8px;
  }
  .info strong{
    font-weight: 600;
    letter-spacing: .8px;
    color: #304156;
  }
  .info span{
    text-align: center
  }
</style>

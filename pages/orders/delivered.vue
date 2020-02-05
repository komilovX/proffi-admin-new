<template>
  <div>
    <div class="header p1 bb">
      <h2>Доставление заказы</h2>
    </div>
        <el-table
          :data="orders"
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
          sortable
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
            <el-button
            type="primary"
            size="small"
            @click="openDialog(id)"
            class="mr1"
            >
            инфо
            </el-button>
          </template>
        </el-table-column>
        </el-table>
    <el-dialog
    title="Xabar jo'natish"
    :visible.sync="dialogVisible"
    width="50%"
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
export default {
  async asyncData({store, error}) {
    try {
      const orders = await store.dispatch('order/getAllDeliveredOrders')
      return {orders}
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
    openDialog(id) {
      const order = this.orders.find(f => f.id == id)
      this.currentOrder = order
      this.dialogVisible = true
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

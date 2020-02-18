<template>
  <div class="p1">
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="currentChange"
      :total="size*10/limit">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    size: Number,
    limit: {
      type: Number,
      default: 30
    }
  },
  methods: {
    currentChange( val ) {
      this.$emit('paginationChange', val)
    }
  }
}
</script>

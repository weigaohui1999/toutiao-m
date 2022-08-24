<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete" v-else @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon  v-if="isDeleteShow" name="close" ></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false,
      thisSearchHistories: this.searchHistories
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        this.thisSearchHistories.splice(index, 1)
      } else {
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped>

</style>

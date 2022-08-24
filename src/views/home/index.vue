<template>
  <div class="home-container">

    <van-nav-bar class="page-nav-bar" fixed>
      <van-button slot="title"
                  type="info"
                  size="small"
                  round
                  icon="search"
                  class="search-btn"
                  to="/search"
      >搜索</van-button>
    </van-nav-bar>

    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name"
               v-for="item in channels"
               :key="item.id"
      >
        <article-list :channel="item"/>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="more-btn" @click="isChennelEditShow = true">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <channel-edit :my-channels="channels" :active="active" @update-active="onUpdateActive"/>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from '@/views/home/components/article-list'
import ChannelEdit from '@/views/home/components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ChannelEdit,
    ArticleList
  },
  data () {
    return {
      active: 0,
      channels: [],
      isChennelEditShow: false
    }
  },
  created: function () {
    this.loadUserChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadUserChannels () {
      let channels = []
      if (this.user) {
        await getUserChannels().then(data => {
          this.channels = data.data.data.channels
        }).catch()
      } else {
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (localChannels) {
          // eslint-disable-next-line no-unused-vars
          channels = localChannels
        } else {
          await getUserChannels().then(data => {
            this.channels = data.data.data.channels
          }).catch()
        }
      }
    },
    onUpdateActive (val, isChennelEditShow = true) {
      this.active = val
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0;
    }
    .more-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;
      i.iconfont {
        font-size: 33px;
      }
      &:before {
        content: '';
        width: 1px;
        height: 100%;
        background-image: url(@/assets/gradient-gray-line.png);
        position: absolute;
        left: 0;
        background-size: contain;
      }
    }
  }
}
</style>

<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
      >{{ isEdit ? '完成' :'编辑' }}
      </van-button>
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        v-for="(channel, index) in  myChannels"
        :key="index"
        class="grid-item"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon v-show="isEdit && !fiexChannels.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>

    <van-cell>
      <div slot="title">频道推荐</div>
    </van-cell>

    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        icon="plus"
        v-for="(channel, index) in reCommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAddChannel(channel)"
      ></van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import { addUserChannel, delUserChannel, getAllChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false,
      myEditChannels: this.myChannels,
      fiexChannels: [0]
    }
  },
  created () {
    this.loadAllChannels()
  },
  computed: {
    reCommendChannels () {
      // const channels = []
      // this.allChannels.forEach(channel => {
      //   const ret = this.myChannels.find(myChannel => {
      //     return myChannel.id === channel.id
      //   })
      //   // 如果我的频道中不包含推荐频道里的数据，就把他们放进channels
      //   if (!ret) {
      //     channels.push(channel)
      //   }
      // })
      // return channels

      return this.allChannels.filter(channel => {
        return !this.myEditChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
      })
    },
    ...mapState(['user'])
  },
  methods: {
    async loadAllChannels () {
      await getAllChannels().then(data => {
        this.allChannels = data.data.data.channels
      })
    },
    async onAddChannel (channel) {
      this.myEditChannels.push(channel)

      //  数据持久化
      //  已登录
      if (this.user) {
        await addUserChannel([{
          id: channel.id,
          seq: this.myEditChannels.length
        }]).then().catch(() => {
          this.$toast('保存失败，请重试！')
        })
      } else {
      //  未登录，存储在本地
        setItem('TOUTIAO_CHANNELS', this.myEditChannels)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        if (this.fiexChannels.includes(channel.index)) {
          return
        }
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        this.myEditChannels.splice(index, 1)

        //  删除持久化
        this.deleteChannel(channel)
      } else {
        this.$emit('update-active', index, false)
      }
    },
    async deleteChannel (channel) {
      if (this.user) {
        await delUserChannel(channel.id).then().catch(() => {
          this.$toast('操作失败，请重试！')
        })
      } else {
        setItem('TOUTIAO_CHANNELS', this.myEditChannels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
  /deep/.my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 15px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>

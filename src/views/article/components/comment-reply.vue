<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '未有回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')"/>
    </van-nav-bar>
    <div class="scroll-warp">
      <comment-item :comment="comment"/>

      <van-cell title="全部回复">
        <comment-list :list="commentList" :source="comment.com_id" type="c"/>
      </van-cell>
    </div>
    <div class="post-wrap">
      <van-button size="small" round>写评论</van-button>
    </div>

    <van-popup v-model="isPostShow" position="bottom" style="height: 100%">
      <!--  由于弹层是懒加载的，里面数据不会销毁重新加载， v-if为false的 的时候会销毁组件，为true会重新加载组件   -->
      <comment-post :target="comment.com_id" :post-success="onPostSuccess"/>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from '@/views/article/components/comment-item'
import CommentList from '@/views/article/components/comment-list'
import CommentPost from '@/views/article/components/comment-post'
export default {
  name: 'CommentReply',
  components: { CommentPost, CommentList, CommentItem },
  // inject: ['articleId'],
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  methods: {
    onPostSuccess (data) {
      // eslint-disable-next-line vue/no-mutating-props
      this.comment.reply_count++
      this.isPostShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-warp {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .van-button {
    width: 60%;

  }
}
</style>

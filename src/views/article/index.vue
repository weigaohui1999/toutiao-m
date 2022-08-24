<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name}}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime}}</div>
          <!--   当我们要传递给子组件的参数既要修改又要传递的时候 可以给子组件使用v-model   -->
          <!--   v-model 的简写形式是
                 默认:value= "article.is_followed" 和 @input="article.is_followed = $event" 的结合

                   // 修改自定义组件 v-model 的 数据形式在子组件中修改
                  model: {
                    prop: 'isFollowed',
                    event: 'updata-is_followed'
                  },
                 -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
           />
          <!--          <van-button-->
<!--            class="follow-btn"-->
<!--            v-if="article.is_followed"-->
<!--            round-->
<!--            :loading="followLoading"-->
<!--            size="small"-->
<!--            @click="onFollow"-->
<!--          >已关注</van-button>-->
<!--          <van-button-->
<!--            v-else-->
<!--            class="follow-btn"-->
<!--            :loading="followLoading"-->
<!--            type="info"-->
<!--            color="#3296fa"-->
<!--            round-->
<!--            size="small"-->
<!--            icon="plus"-->
<!--            @click="onFollow"-->
<!--          >关注</van-button>-->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div class="article-content markdown-body"
             v-html="article.content"
             ref="article.content"/>
        <van-divider>正文结束</van-divider>

        <comment-list
          :list="commentList"
          :source="article.art_id"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >写评论</van-button>
          <van-icon
            name="comment-o"
            :info="totalCommentCount"
            color="#777"
          />

          <collect-article class="btn-item" v-model="article.is_collected" :article-id="article.art_id"/>
          <!--      <van-icon-->
          <!--        color="#777"-->
          <!--        name="star-o"-->
          <!--      />-->
          <like-article class="btn-item" v-model="article.attitude" :article-id="article.art_id"/>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post :target="article.art_id" @post-success="onPostSuccess"/>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errorStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <van-popup v-model="isReplytShow" position="bottom" style="height: 100%">
    <!--  由于弹层是懒加载的，里面数据不会销毁重新加载， v-if为false的 的时候会销毁组件，为true会重新加载组件   -->
      <comment-reply v-if="isReplytShow" :comment="currentComment" @close="isReplytShow = false"/>
    </van-popup>

  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from '@/views/article/components/comment-list'
import CommentPost from '@/views/article/components/comment-post'
import CommentReply from '@/views/article/components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: { CommentReply, CommentPost, CommentList, LikeArticle, CollectArticle, FollowUser },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  // 给所有后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      article: {},
      loading: true,
      errorStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false,
      commentList: [],
      isReplytShow: false,
      currentComment: {}
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      await getArticleById(this.articleId).then(data => {
        this.article = data.data.data

        //  初始化图片点击预览
        //  因为这时候页面还没加载完毕 所以用延时函数
        setTimeout(() => {
          this.previewImage()
        }, 0)
      }).catch(err => {
        console.log(err)
        if (err.response && err.response.status === 404) {
          this.errorStatus = 404
        }
      })
      this.loading = false
    },
    previewImage () {
      const content = this.$refs['article.content']
      const imgs = content.querySelectorAll('img')
      const images = []

      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },
    async onFollow () {
      this.followLoading = true
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        await addFollow(this.article.aut_id).catch(err => {
          if (err.response && err.response.status === 400) {
            this.$toast('你不能关注你自己！')
          }
        })
      }
      this.followLoading = false
      this.article.is_followed = !this.article.is_followed
    },
    onPostSuccess (val) {
      this.isPostShow = false
      this.commentList.unshift(val.new_obj)
    },
    onReplyClick (comment) {
      this.currentComment = comment
      this.isReplytShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>

/**
* 具体配置见 https://github.com/overtrue/share.js
 */
<template>
  <div class="social-share" data-initialized="true">
    <a href="#" class="social-share-icon icon-weibo"></a>
    <a href="#" class="social-share-icon icon-wechat"></a>
    <!-- <a href="#" class="social-share-icon icon-qq"></a>
    <a href="#" class="social-share-icon icon-douban"></a>     -->
</div>
</template>

<script>
import './js/social-share.min.js'
export default {
  name: 'share',
  props: {
    config: {
      type: Object
    }
  },
  mounted() {
    window.socialShare(this.$el, this.config)
  }
}
</script>
<style src="./css/share.min.css"></style>

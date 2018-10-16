<template>
  <div class="latest-news-wrapper" ref="container" id="box">
    <img src="@/assets/img/activity-icon/latest-news.png" height="18px">
    <div ref="ul-container" class="ul-container" @mouseover="clearTimer" @mouseout="setTimer">
       <ul :style="{left:left+'px',width:ul_width+'px'}" ref="ul">
        <li>云市场火热公测中</li>
        <li>第二届“天翼云杯”竞赛结束</li>
        <li>“天翼云”开发大赛</li>
      </ul>
    </div>
   
    <a href="http://market.ctyun.cn/market/#/news"><img src="@/assets/img/arrow-right.png"></a>
  </div>
</template>
<script>
export default {
  data(){
    return{
      timer:null,
      left:340,
      ul_width:340*6
    }
  },
  mounted(){
    let oDiv=document.getElementById('box');
    let oUl=oDiv.getElementsByTagName('ul')[0];
    oUl.innerHTML+=oUl.innerHTML;
    this.setTimer();
  },

  methods:{
    clearTimer(){
      clearInterval(this.timer);
    },
    move(){     
      if(this.left<-(this.ul_width/2)){       
          this.left = 0;
        }
        if(this.left>0){
          this.left=-this.ul_width/2;
        }
         this.left-=2;
      },
    setTimer(){
      this.clearTimer();
      this.timer = setInterval(_=>{
        this.move();
      },30)
    }
  }
}
</script>

<style lang="scss" scoped>
.latest-news-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #606466;
  
 .ul-container{
   overflow: hidden;
 }
  img {
    display: block;
  }

  ul {
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    margin-left: 30px;
    padding: 0;
    list-style: none;
    font-size: 16px;
    line-height: 18px;

    position: relative;
    overflow: hidden;

    li {
      width: 340px;
      &::before {
        content: "";
        height: 18px;
        position: relative;
        margin-right: 10px;
        border-right: 1px solid #606466;
      }
    }
  }
}
</style>

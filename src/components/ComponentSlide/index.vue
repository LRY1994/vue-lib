/*
匀速轮播
template 每个li的模板
slideEach 每次滚动几个
showCount 一次展示几个
inverter 自由滚动时间间隔（毫秒）
height
data 
*/
<template>
    <div class="content" ref="content" :style="{height:config.height+'px'}">
        <!--分割线-->
        <div v-for="i in (showCount-1)" :key="i"  class="seperator"       
        :style="{left:li_width*i+'px'}"></div>

        <div class="links_list">
            <a id="link_prev" class="link_btn" href="javascript:;" hidefocus="true" title="上一组" 
                @mouseout="onMouseout('prev')" 
                @mouseover="onMouseover('prev')"
                @click="link_prev_event">&lt;</a>
            <div class="links" >
                <ul :style="{width : li_width*(maxCount+showCount)+'px',left:left+'px'}" >
                    <li v-for="(item,index) in data" :key="index" :style="{width:li_width+'px'}"
                        @mouseover="onMouseover('link');"
                        @mouseout="onMouseout('link');">
                        <component :is="template" :data="item"></component>
                    </li>
                </ul>
            </div>
            <a id="link_next" class="link_btn" href="javascript:;" hidefocus="true" title="下一组" 
                @mouseout="onMouseout('next')" 
                @mouseover="onMouseover('next')"
                @click="link_next_event">&gt;</a> 
        </div>
    </div>
</template>

<script>

export default {
props:['config'],
data(){
    return {
        template:this.config.template,
        slideEach:this.config.slideEach,
        showCount:this.config.showCount,
        inverter:this.config.inverter,
        data:this.config.data,

        maxCount:this.config.data.length,//一共要轮播多少个
        sTimer:null,//自动滚动定时器，
        l_hover :false, //悬浮在prev按钮上
        m_hover :false,//悬浮在li上
        r_hover : false,//悬浮在next按钮上

        li_width:0,//每个li的宽度
        left:0

    }
},
created(){
     this.data = [...this.data,...this.data.slice(0,this.showCount)]//防止最后出现空位
},
mounted(){   
    this.calLiWidth();  
    this.setInverterTimer(); 
},
watch:{
    left(val){
        let a =this.li_width*this.maxCount;
        if(val===-a){//滚到头了重新滚
            this.left = 0;
        }        
    }
},
methods:{
    //计算每个li的宽度
    calLiWidth(){
        let content_width = this.$refs['content'].clientWidth   
        this.li_width = content_width/this.showCount;  
    },
    //自由滚动
    setInverterTimer() {
        clearInterval(this.sTimer);
        this.sTimer = setInterval(_=> {
            this.link_next_event();
        }, this.inverter);
    },
    //点击下一组
    link_next_event() { 
        this.left -=(this.li_width*this.slideEach);
    },
    //点击上一组
    link_prev_event(){
        if(this.left===0) return
        this.left += (this.li_width*this.slideEach);
    },
    onMouseover(type){
        switch(type){
            case 'link':{
                this.m_hover = true;break;
            }
            case 'prev':{
                this.l_hover = true;
                this.r_hover = true;
                break;
            }
            case 'next':{
                this.l_hover = true;
                this.r_hover = true;
                break;
            }
        }
        clearInterval(this.sTimer);
    },
    onMouseout(type){
        switch(type){
            case 'link':{
                this.m_hover = false;break;
            }
            case 'prev':{
                this.l_hover = false;
                this.r_hover = false;
                break;
            }
            case 'next':{
                this.l_hover = false;
                this.r_hover = false;
                break;
            }
        }
        setTimeout(_=> {
            if (!this.l_hover && !this.m_hover && !this.r_hover) {
                this.setInverterTimer();
            }
        }, 500);
        
    }
}
}
</script>

<style lang="scss" scoped>
.seperator{
    width: 1px;
    height: 100%;
    background: #ddd;
    position: absolute;
}
.content {
    width: 100%;
    margin: 15px auto 0;
    position: relative;
    .links_list {
        position: relative;
        z-index: 3;
        height: 100%;
    }
    .link_btn{
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        width:30px;
        height: 30px;
        font-size: 30px;
        font-weight: 400;
        padding: 10px;
        display: block;
        text-decoration: none;
        border-radius:50%;
        text-align: center;
        color:#fff;
        background: #e9e9e9;;       
    }
    #link_prev, {     
        left:-55px;       
    }
    #link_next {       
        right:-55px;      
    }
   
    .links {
        width:100%;
       height:100%;
        overflow: hidden;
        float: left;
        ul{ 
            list-style: none; 
            padding: 0;
            position: relative;
            left:0;
            z-index:0;
            overflow: hidden;
            height: 100%;
        }
        li{     
            box-sizing: border-box; 
            display: inline-block;
            height: 100%;   
            &:hover{
                cursor: pointer;
            } 
         }
        
    }
}

</style>

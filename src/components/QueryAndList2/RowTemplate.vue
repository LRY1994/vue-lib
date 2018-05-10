<template>
  <el-row >
      <el-col :span="6" >
        <span class="product-name">商品名称 {{item.name}}</span><br/>
        <span class="small-font">更新时间 {{item.updateDate}}</span><br/>
        <span class="small-font">订单编号 {{item.orderId}}</span>
      </el-col>
        <el-col :span="6" >
          <el-col :span="8">
            <img :src="item.logo" style="height:80px;width:80px;border-radius:50%"/>
          </el-col>
          <el-col :span="16">
            <span class="small-font">{{item.company}}</span><br/>
            <span class="small-font">联系方式 {{item.tele}}</span>
          </el-col>
        </el-col>
        <el-col :span="6" ><span style="color:#d32b2b">￥{{item.price}}</span></el-col>
        <el-col :span="4" ><span class="state">{{item.state}}</span></el-col>
        <el-col :span="2"><a href="www.baidu.com" class="link"><i class="el-icon-info" style="margin-right: 15px;"></i>详情</a></el-col>
  </el-row>
</template>
<script>
export default {
  props:{      
       item:{
         type:Object,
         require:true
      }
  },
   filters:{
      orderState(input){               
          let dict = {
              'new':'新创建',
              'submitted':'已提交',
              'deliver':'交付中',		
              'finished':'已完成',
              'failed':'提交失败',
              'canceled':'已取消',
              'abolished':'废除',
              'refunding':'退款中',
              'refunded':'已退款',
              'deleted':'已删除'						
          };
          return dict[input] || input;
      }
  }
}
</script>
<style scoped>
.state{
  background-color: rgb(227, 248, 255);
    font-size: 14px;
    color: rgb(12, 117, 232);
    padding: 5px;
    border: 1px solid;
    border-radius: 5px;
}
.small-font{
    font-size: 14px;
    color: #373d41;
    padding-top: 9px;
    display: inline-block;
}
.link{
  font-size: 14px;
  color: #3a88fc;
  text-decoration: none;
}
.product-name{
  color: #2f2f2f;
  font-size: 18px;
  font-weight: bolder;
  display: inline-block;
  margin-bottom: 22px;
}
</style>


<template>
<div style="margin-bottom:10px">
<p>
当前处于 <span class="tip">{{now}}</span> 
<template v-if="next!==''">，下一步<span class="tip">{{next}}</span></template>
<el-button type="text" v-if="show===false" @click="look">查看完整流程</el-button>
<el-button type="text" v-else @click="show=false">收起</el-button>   
</p>
<div >
<process-go style="height:250px" v-if="firstClick" v-show="show"  :model-data="dataObj.graph" :category="category"> </process-go>

</div>

</div>
</template>
<script>
import processGo from '@/components/common/process-go/index'

import * as deliverG from './deliver.js' 
import * as complainG from './complain.js' 
import * as invoiceG from './invoice.js' 
import * as refundG from './refund.js' 
import * as serviceG from './service.js' 

export default{
    
components:{processGo},
props:{
    type:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
},

data(){  
    var User={
            category:"User",
            shape:"RoundedRectangle",
            shapeOptions:{
                fill:"bluegrad",
                stroke: "black"
            }   

        };
    var Supplier={
        category:"Supplier",
        shape:"RoundedRectangle",
        shapeOptions:{
            fill:"greengrad",
            stroke: "black"
        }  
    };   
    return{
        show:false,
         firstClick:false,
        category:[User,Supplier],
        dataObj:null,
        next:'',
        now:''
                               
    }
},
created(){
    this.init();
    this.$once('firstClick',()=>{
        this.firstClick = true
    })
},
methods:{
    init(){
        switch(this.type){               
            case 'deliver': this.dataObj = deliverG;break;
            case 'complain':this.dataObj = complainG;break;
            case 'refund':this.dataObj = refundG;break;
            case 'invoice':
            case 'contract':this.dataObj = invoiceG;break;
            case 'service':this.dataObj= serviceG;break;                               
        }
        this.dataObj&&(this.now = this.dataObj.tip[this.state].now);
        this.dataObj&&(this.next = this.dataObj.tip[this.state].next||'');
    },
    look(){//用v-if切换会报错，只有第一次点击查看用v-if,其他用v-show
        this.$emit('firstClick');
        this.show = true;
    }
}
}
</script>
<style scoped>
p{
background-color:#EEEEEE;
margin:0;
font-size:0.9em
}
.tip{
color:#f56c6c;
font-weight:bold;
padding:5px;
}
</style>
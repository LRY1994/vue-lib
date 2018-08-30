<template>
<div style="margin-bottom:10px">
<p>
当前处于 <span class="tip">{{now}}</span> 
<template v-if="next!==''">，下一步<span class="tip">{{next}}</span></template>
<el-button type="text" v-if="show===false" @click="show=true">查看完整流程</el-button>
<el-button type="text" v-else @click="show=false">收起</el-button>   
</p>
<div >
<process-joint :graph-data="dataObj.graphData" :paper-data="dataObj.paperData" v-if="show" > </process-joint>

</div>

</div>
</template>
<script>
import processJoint from '@/components/common/process-joint/index'

import * as deliverG from './deliver.js' 
import * as complainG from './complain.js' 
import * as invoiceG from './invoice.js' 
import * as refundG from './refund.js' 
import * as serviceG from './service.js' 


export default{
props:['type','state'],
components:{processJoint},

data(){        
    return{
        show:false,
        dataObj:null  ,
        now:'',
        next:''                        
    }
},
created(){
    this.init();
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
    }
},
watch:{
    type(val){
        this.init()
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
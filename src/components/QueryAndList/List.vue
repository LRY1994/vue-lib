/*
*List列表组件
*    list-config         {Object,必填}  //设置每一列标题thead和宽度span。例如
*        listConfig:{
*            thead:['商品基本信息','服务商','金额','订单状态','操作'],
*            span: [ 5,            5,       5,     5,        4]    //数组之和需等于24
*        }
*    get-list-func         {Function,必填} //获取列表数据的方法
*    rowTemplateComponent  {component,必填} //列表每一行的模板
*/

<template>
<div>
    
    <!--列表头-->
    <el-row class="list-head">
        <el-col v-for ="(th,index) in listConfig.thead" :span="listConfig.span[index]" :key="index" >
            {{th}}
        </el-col>
    </el-row>

    <!--列表内容-->
    <p v-if="!list.length&&!loading" class="none-data">暂无数据</p>
    <div v-else  v-loading="loading">                         
        <template  v-for ="item in list" >    
            <div class="list-item" v-if="useSlot">
                <slot :item="item" name="row"></slot>
            </div>        
            <component :is="rowTemplateComponent" :item="item" class="list-item" v-else></component>
        </template> 
    </div>
    
    <!--分页-->  
    <el-pagination 
        class="pagination"
        @current-change="handleCurrentChange" 
        @size-change="handleSizeChange" 
        :current-page.sync="pager.currentPage" 
        :page-sizes="pager.sizes" 
        :page-size="pager.limit" 
        :layout="pager.layout" 
        :total="pager.total">
    </el-pagination>
   
</div>

</template>
<script type="text/javascript">

export default {   
    props:{
        rowTemplateComponent: {
            type: Object
        },
        useSlot: {
            type: Boolean,
            default: false
        },
        listConfig:{
            type:Object,
            required: true
        },      
        getListFunc: {
            type: Function,
            required: true
        }
    }, 
    data(){
        return {
            list: [],//列表数据            
            pager: {//分页
                offset: 0,
                limit: 10,
                currentPage: 1,
                total: 0,
                layout: 'sizes, total, prev, pager, next',
                sizes: [10, 20, 40, 70]
            },
            query:{},
            loading:false
        }
    },
    methods:{      
        //获取列表数据
        getList(query,reset) {
            this.loading = true;
            if(reset){
                this.pager.offset = 0;  
                this.pager.currentPage = 1;        
            }
           
            let params = {
                offset: this.pager.offset,
                limit: this.pager.limit,
            };

            if(query){ 
                this.query =query;//保存起来供翻页用
                Object.assign(params,query);
            }
                
            this.getListFunc(params).then(data => {           
                this.list = data.list;
                this.pager.total = data.total || 0;  
                this.loading = false;          
            });           
        },
        //分页
        handleCurrentChange(val) {
            this.pager.offset = this.pager.limit * (val - 1);
            this.getList(this.query);
        },
        handleSizeChange(val) {
            this.pager.limit = val;
            this.getList(this.query);
        },
    }
}
</script>
<style lang="scss" scoped>
.list-head{
     padding:10px 25px;
     padding-left: 33px;
     font-size:14px;
     color: #373d41;
}
.list-item{
    padding:24px 25px ;
    margin-bottom:20px ;
    border-radius:5px;
    border:1px solid #d3d3d3;
     &:nth-child(3n+0){
        border-left:8px solid #3f81ef;
    }   
    &:nth-child(3n+1){
        border-left:8px solid #a86aec;
    }
    &:nth-child(3n+2){
        border-left:8px solid #00c1de;
    }    
}
.none-data{
    font-size:20px;
    color:#d3d3d3;
    text-align: center;
    margin:20px 0;
}
.pagination{
     text-align: center;
}

</style>
<style>
.footer-style{
    z-index: 10000!important;
}
</style>

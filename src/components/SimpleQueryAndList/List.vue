<!--
prop:
    table-col   {Array,必填}  //列表项配置 ,主要是配置每一列的label和prop。例子见 order_list/list.vue
    get-list-interface    {Function,必填} //获取列表数据的后台接口
    before-get(params)  {Function,选填} //getList方法请求数据之前，对参数进行处理 ,返回处理后的参数;                     
    after-get(data) {Function,选填} //getList方法请求数据之后，可对后台返回的数据data进行操作
-->

<template>
<div>
    <!--表格-->
    <div class="min-height-350 margin-top-10">
        <el-table :data="list">           
            <slot></slot>  
        </el-table>
   </div>
   <!--分页-->
    <div class="margin-top-10 text-align-center">
        <el-pagination 
            @current-change="handleCurrentChange" 
            @size-change="handleSizeChange" 
            :current-page="pager.currentPage" 
            :page-sizes="pager.sizes" 
            :page-size="pager.limit" 
            :layout="pager.layout" 
            :total="pager.total">
        </el-pagination>
    </div>
</div>  
</template>
<script type="text/javascript">
export default {
    props:{
        query:{
            type:Object,
            default:null
        },
        tableCol:{
            type:Array,
            required: true
        },      
        getListInterface: {
            type: Function,
            required: true
        },
        beforeGet:{
            type: Function
        },
        afterGet:{
            type: Function
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
        }
    },
   
    created(){
        this.getList(this.query);
    },
    methods:{
        //获取列表数据
        getList(query) {
            let params = {
                offset: this.pager.offset,
                limit: this.pager.limit,
            };
            
            if(query)Object.assign(params, query);

            if(this.beforeGet) {
                params = this.beforeGet(params);
            }

            this.getListInterface(params).then(data => {
              
                if(this.afterGet) {
                    data = this.afterGet(data);
                }
                this.list = data;
                this.pager.total = data.total || 0;
            

            
            });

        },
        //分页
        handleCurrentChange(val) {
            this.pager.offset = this.pager.limit * (val - 1);
            this.getList();
        },
        handleSizeChange(val) {
            this.pager.limit = val;
            this.getList();
        },
    }
}
</script>
<style scoped>
    .text-align-center {
        text-align: center;
    }
</style>

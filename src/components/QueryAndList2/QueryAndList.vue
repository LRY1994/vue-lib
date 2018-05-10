/*
*QueryAndList组件 (例子见 components/order/list/OrderList.vue)
*   query-items        {Array,必填}      //查询条件 ,
*   list-config        {Object,必填}     //设置每一列标题thead和宽度span,例如
*        listConfig:{
*            thead:['商品基本信息','服务商','金额','订单状态','操作'],
*            span:[5,5,5,5,4]
*        },
*    get-list-func       {Function,必填}  //获取列表数据方法
*    before-get(params)  {Function,选填}  //getList方法请求数据之前，对参数进行处理 ,返回处理后的参数;                     
*    after-get(data)     {Function,选填}  //getList方法请求数据之后，可对后台返回的数据data进行操作
*    rowTemplateComponent     {component,必填} //列表每一行的模板
*/

<template>
    <div>
        <!--查询搜索组件-->
        <query
            :query-items="queryItems" 
            @search="search">
        </query>

        <!--列表组件-->
        <list ref="List"
            :list-config= "listConfig"
            :get-list-func = "getListFunc"
            :before-get= "beforeGet"
            :after-get = "afterGet"
            :row-template-component="rowTemplateComponent">       
        </list>

    </div>
</template>

<script type="text/javascript">
    import Query from './Query';
    import List from './List';
    export default {
        components: {Query,List},
        props: {    
            rowTemplateComponent:{required:true},        
            queryItems: {
                type: Array,
                required: true
            },
            listConfig: {
                thead:{
                    type: Array,
                    required: true
                },
                span:{
                    type:Array,
                    required: true
                },
                required: true
            },
            getListFunc: {
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
        methods: {
            //查询
            search(query) {
                this.$refs['List'].getList(query);
            },
        }
    }
</script>

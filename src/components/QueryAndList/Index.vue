<!--
prop:
    query-items {Array,必填} //查询条件 ,例子见 demo/QueryAndList.vue
    table-col   {Array,必填}  //列表项 ,例子见 demo/QueryAndList.vue
    get-list-interface    {Function,必填} //获取列表数据的后台接口
    before-get(params)  {Function,选填} //getList方法请求数据之前，对参数进行处理 ,返回处理后的参数;                     
    after-get(data) {Function,选填} //getList方法请求数据之后，可对后台返回的数据data进行操作
-->



<template>
    <div>
        <!--查询条件组件-->
        <query
            :query-items="queryItems" 
            @search="search"
        ></query>

        
        <div class="border-gray"></div>

        <!--列表组件-->
        <list ref="List"
            :table-col= "tableCol"
            :get-list-interface = "getListInterface"
            :before-get= "beforeGet"
            :after-get = "afterGet"
        >
            <template v-for="col in tableCol" >
                <slot v-if="col.slot" :name="col.slot"></slot>
                <el-table-column v-else v-bind="col" ></el-table-column>
            </template>
        </list>

        

    </div>
</template>

<script type="text/javascript">
    import Query from './Query';
    import List from './List';
    export default {
        components: {Query, List },
        props: {            
            queryItems: {
                type: Array,
                required: true
            },
            tableCol: {
                type: Array,
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
        methods: {
            //查询
            search(query) {
                this.$refs['List'].getList(query);
            },
        }
    }
</script>

<style lang="scss" scoped>

    .min-height-350 {
        min-height: 350px;
    }

    .margin-top-10 {
        margin-top: 10px;
    }

    .text-align-center {
        text-align: center;
    }

    .border-gray {
        border-bottom: 1px dashed #ddd;
    }
</style>
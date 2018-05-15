<template>
    <div>
        <el-card class="box-card">
            <query-and-list
                :query-items="queryItems"
                :table-col="tableCol"
                :get-list-interface="getListInterface"
                :before-get="beforeGet"                             
                :after-get="afterGet">

                <el-table-column label="状态" slot="updateDate" fixed="right">
                    <template slot-scope="{row}">
                     	{{row.updateDate|dateformat}}<span class="state">{{row.state|orderState}}</span> 
                    </template>
                </el-table-column>
                <el-table-column label="操作" slot="operation" fixed="right" width="80">
                    <template slot-scope="{row}">
                        <router-link :to="{name: 'supplier.order.info', 
                        params: {orderId: row.orderId},
                        query: {userId:row.userId}}">详情</router-link>
                    </template>
                </el-table-column>
                
            </query-and-list>

        </el-card>
    </div>
</template>

<script type="text/javascript">
    import QueryAndList from '@alogic/alogic-cty-base/src/components/common/QueryAndList';
   
    export default {
        components: { QueryAndList}, 
        data() {
            return {
                tenantId:this.__tid,
                getListInterface: this._$http.tenant.orderList,            
                queryItems: [{
                    label: '订单编号',
                    editor: 'input',
                    prop: 'orderId',
                }, {
                    label: '商品名称',
                    editor: 'input',
                    prop: 'name',
                },  {
                    label: '订单状态',
                    editor: 'select',
                    prop: 'state',
                    options: [{
                        label: '全部',
                        value: 'all'
                    },{
                        label:'新创建',
                        value:'new'
                    },{
                        label:'已提交',
                        value:'submitted'
                    },{
                        label:'交付中',
                        value:'deliver'
                    },{
                        label:'已完成',
                        value:'finished'
                    },{
                        label:'提交失败',
                        value:'failed'			
                    },{
                        label:'已取消',
                        value:'canceled'
                    },{
                        label:'废除',
                        value:'abolished'
                    }]                
                }, {
                    label: '订单更新时间',
                    editor: 'daterange',
                    prop: 'updateDate'
                }],
                tableCol: [{  
                    label: '订单编号',                
                    prop: 'orderId'
                }, {
                    label: '商品名称',
                    prop: 'name'
                },{
                    label:'客户邮箱',
                    prop:'email'
                },{
                    slot: 'updateDate'
                }, {
                    slot: 'operation'
                }]
            }
        },
        methods:{
            
            beforeGet(paramsPass){
                let cleanParams = this.filterDataBeforeQuery(paramsPass);
                const tenantId = this.__tid;
                let _default = {
                    id: tenantId                                                                      
                }
                let params = Object.assign({},_default,cleanParams);
                return params;
                           
            },
            filterDataBeforeQuery(obj){
                let nobj={};
                for(let o in obj){
                    if(o=='state'&&obj[o]=='all') continue
                    if(o=='updateDate' && obj[o]){
                        nobj.start = this.$options.filters.dateformat(obj[o][0], 'yyyy-mm-dd HH:MM:ss');
                        nobj.end = this.$options.filters.dateformat(obj[o][1], 'yyyy-mm-dd HH:MM:ss');
                        continue
                    }
                    if(obj[o]!==""){
                        nobj[o] = obj[o];
                    }
                }
               
                return nobj;
            },

            afterGet(data) {
                let result = null;
                if (data) {
                    result = data.list;
                    result.total = data.total;
                };
                return result || [];
            }
        }
    }
</script>
<style scoped>
 .state{
     background-color:#9E9E9E;
     color: white;
     padding:0 5px;
 }
 </style>

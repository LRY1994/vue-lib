<template>    
    <query-and-list
        :query-items="queryItems"
        :list-config="listConfig"
        :get-list-func="getListFunc"
        :before-get="beforeGet"                             
        :after-get="afterGet"
        :row-template-component="$options.components.RowTemplate">
    </query-and-list>      
</template>

<script type="text/javascript">
    import QueryAndList from './QueryAndList/QueryAndList';
    import RowTemplate from './RowTemplate'
    export default {
        data() {
            return {
                tenantId:this.__tid,
                getListFunc: this._$http.tenant.orderList,  
                listConfig:{
                    thead:['商品基本信息','服务商','金额','订单状态','操作'],
                    span:[6,6,6,4,2]
                },   
                queryItems: [{
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
                    label: '时间',
                    editor: 'daterange',
                    prop: 'updateDate'
                }]
            }
        },
        components: { QueryAndList ,RowTemplate}, 
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

/*
*List列表组件
*    list-config         {Object,必填}  //设置每一列标题thead和宽度span
*    get-list-func       {Function,必填} //获取列表数据的方法
*    before-get(params)  {Function,选填} //getList方法请求数据之前，对参数进行处理 ,返回处理后的参数;                     
*    after-get(data)     {Function,选填} //getList方法请求数据之后，可对后台返回的数据data进行操作
*/

<template>
<div>

    <!--列表头-->
        <el-row class="list-head">
        <el-col v-for ="(th,index) in listConfig.thead" :span="listConfig.span[index]" :key="index">{{th}}</el-col>
    </el-row>
    <!--列表内容-->
    <template v-for ="item in list" >        
        <component :is="rowTemplateComponent" :item="item" class="list-item"></component>
    </template> 

   <!--分页-->  
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
</template>
<script type="text/javascript">

export default {   
    props:{
        rowTemplateComponent:{require:true},
        listConfig:{
            type:Object,
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
    data(){
        return {
            // list: [],//列表数据
            list:[
                {
                    name:'ASSS',
                    updateDate:'2018-1-1',
                    orderId:'3123123123112',
                    logo:'http://img1.imgtn.bdimg.com/it/u=2673145205,1622960238&fm=27&gp=0.jpg',
                    company:'中国电信云计算',
                    tele:'11111111111',
                    price:'100.8',
                    state:'交付中'
                },
                {
                    name:'ASSS',
                    updateDate:'2018-1-1',
                    orderId:'3123123123112',
                      logo:'http://img1.imgtn.bdimg.com/it/u=2673145205,1622960238&fm=27&gp=0.jpg',
                    company:'中国电信云计算',
                    tele:'11111111111',
                    price:'100.8',
                    state:'交付中'
                },
                {
                    name:'ASSS',
                    updateDate:'2018-1-1',
                    orderId:'3123123123112',
                      logo:'http://img1.imgtn.bdimg.com/it/u=2673145205,1622960238&fm=27&gp=0.jpg',
                    company:'中国电信云计算',
                    tele:'11111111111',
                    price:'100.8',
                    state:'交付中'
                }
            ],
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

            // this.getListFunc(params).then(data => {
              
            //     if(this.afterGet) {
            //         data = this.afterGet(data);
            //     }
            //     this.list = data;
            //     this.pager.total = data.total || 0;            
            // });

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
<style lang="scss" scoped>

.list-head{
     padding:23px 25px;
     font-size:14px;
     color: #373d41;
}
.list-item{
    padding:24px 25px;
    margin-bottom:20px ;
    border-radius:5px;
    border:1px solid #9e9e9e54;
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
</style>

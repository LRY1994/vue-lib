/*
*Query 查询搜索组件，需配合List列表组件使用
*    form-config {Object,选填} //自定义el-form 设置项
*    query-items {Array,必填} //查询条件 ,例子见 OrderList.vue
*       item:{
*           label,                  {String,必需}    //前端显示的字段名 
*           prop,                   {String,必需}    //用于请求后台的字段名
*           editor,                 {String,必需}    //input\daterange\cascader\select
*           options:{               {Object,必需}    //editor为select\cascader时的选项
*               value,
*               label,
*               children            {Array},        //editor为cascader时使用,与elementUI一致            
*           }
*           props:{                 {Object,可选}   //editor为cascader时使用,与elementUI一致 
*                value,
*                label,
*                children,
*                disabled
*           }
*        }
*/

<template>
    <div class="query-box">
        <el-form v-bind="formConfig" v-model="queyForm" ref="queyForm">
            <el-form-item 
                v-for="item in queryItems"
                :key="item.prop"
                v-bind="item">
                <!--item.editor == 'input'-->
                <el-input 
                    v-if="item.editor == 'input'" 
                    v-model="queyForm[item.prop]" 
                    :placeholder="item.placeholder||item.label">
                </el-input> 

                <!--item.editor == 'daterange'-->
                <el-date-picker
                    v-if="item.editor == 'daterange'"
                    v-model="queyForm[item.prop]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    :placeholder="item.label">
                </el-date-picker>

                <!--item.editor == 'cascader'动态加载次级选项-->
                <el-cascader
                    v-if="item.editor == 'cascader'&&item.activeItemChange"
                    v-model="queyForm[item.prop]"
                    :options="item.options"
                    :props="item.props"                    
                    @active-item-change="item.activeItemChange">                                     
                </el-cascader>
                
                <!--item.editor == 'cascader'-->
                <el-cascader
                    v-if="item.editor == 'cascader'&&!item.activeItemChange"
                    v-model="queyForm[item.prop]"
                    :options="item.options"
                    :props="item.props">                                     
                </el-cascader>

                <!--item.editor == 'select'-->
                <el-select v-if="item.editor == 'select'" 
                           v-model="queyForm[item.prop]" 
                          :placeholder="item.label">
                    <el-option v-for="option in item.options" 
                        :label="option.label" 
                        :value="option.value" 
                        :key="option.value">
                    </el-option>
                </el-select>

            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit"><i class="el-icon-search"></i>查询</el-button>
                <el-button type="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">
    export default {
        props: {
            queryItems: {
                type: Array,
                required: true
            },
            formConfig: {
                type: Object,
                default: () => {
                    return {
                        inline: true,
                        size: "mini"
                    }
                }
            },
        },
       
        data() {
            return {
                queyForm: this.getFormModel()
            }
        },
        mounted(){
            this.submit();
        },
    
        methods: {
            //搜索触发事件
            submit() {
                this.$emit('search',[this.queyForm,true] );
            },
            //清空筛选条件
            reset() {
                this.queyForm = this.getFormModel();
                this.submit();
            },
            
            /**
             * 组装表单
             * check/radio/select都默认第一个值
             * cascader默认每一级的第一个值
             * 其余默认为空
             */
            getFormModel() {
                if(this.queryItems && this.queryItems.length > 0) {
                    let result = {};
                                      
                    this.queryItems.forEach(item => {
                        switch(item.editor){                           
                            case 'cascader':{
                                const children = item.props.children || 'children';  
                                const value = item.props.value || 'value';   
                                const label = item.props.label || 'label';                            

                                let tmp = item.options[0],
                                    val = tmp[value]; 
                                                           
                                result[item.prop] = [val];
                                           
                                while(tmp[children]&&tmp[children].length){                                   
                                    tmp = tmp[children];
                                    val = tmp[0][value];
                                    result[item.prop].push(val);
                                }
                                break;
                            }
                            case 'check':{
                                 result[item.prop] = [item.options[0].value];
                                 break;
                            }
                            case 'radio':
                            case 'select':{
                                result[item.prop] = item.options[0].value;
                                 break;
                            }
                            default:{
                                result[item.prop]= '';
                            }
                        }
                    });
                   
                    return result;
                };
            return null;
        }
    }       
}
</script>
<style lang="scss" scoped>
.query-box{
    padding: 15px 15px 10px 32px;
    border-radius:5px;
    border:1px solid #d3d3d3;
    .el-form-item{
        margin-bottom: 5px;
    }
}
</style>

/*
*Query 查询搜索组件，需配合List列表组件使用
*    form-config {Object,选填} //自定义el-form 设置项
*    query-items {Array,必填} //查询条件 ,例子见 OrderList.vue
*       item:{
*           label,                  {String,必需}    //前端显示的字段名 
*           prop,                   {String,必需}    //用于请求后台的字段名
*           editor,                 {String,必需}    //input\daterange\cascader\select
*           isRquired,              {Boolean,可选}   //后台请求数据是否需要此字段
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
                    :placeholder="item.label"
                    @active-item-change="item.activeItemChange">                                     
                </el-cascader>
                
                <!--item.editor == 'cascader'-->
                <el-cascader
                    v-if="item.editor == 'cascader'&&!item.activeItemChange"
                    v-model="queyForm[item.prop]"
                    :options="item.options"
                    :props="item.props"
                    :placeholder="item.label">                                     
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
        methods: {
            //搜索触发事件
            submit() {
                this.$emit('search', this.queyForm);
            },
            //清空筛选条件
            reset() {
                this.queyForm = this.getFormModel();
                this.submit();
            },
            //组装表单
            getFormModel() {
                if(this.queryItems && this.queryItems.length > 0) {
                    let result = {},arr= this.queryItems
                                         
                    arr.forEach(item => {
                       // 对checkbox多选框做兼容
                        if(item.editor == 'check' || item.editor == 'cascader') {
                            result[item.prop] = []
                        } else {
                            result[item.prop] = '';
                        }

                        // 对check和radio, select的表单项进行处理
                        if (item.editor == 'check' || item.editor == 'radio' || item.editor == 'select') {
                            if(item.options && item.options.length > 0) {
                                let tmp = item.options[0].value;
                                if(item.editor != 'check') {
                                    result[item.prop] = tmp;//默认第一个
                                } else {
                                    if(item.isRequired) {
                                        result[item.prop] = [tmp];
                                    }
                                }
                            };
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
    padding: 25px;
    border-radius:5px;
    border:1px solid #9e9e9e54;
    .el-form-item{
        margin-bottom: 5px;
    }
}
</style>

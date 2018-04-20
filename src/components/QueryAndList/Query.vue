<!--
prop:
    query-items {Array,必填} //查询条件 ,例子见 order_list/list.vue
        display,prop,editor,label,options{label,value}
    form-config {Object,选填} //el-form 设置项
-->

<template>
    <div>
        <el-form v-bind="formConfig" v-model="queyForm" ref="queyForm">
            <el-form-item 
                v-for="row in queryItems"
                v-if="row.display != 'none'"
                :key="row.prop"
                v-bind="row">
                <el-input v-if="row.editor == 'input'" v-model="queyForm[row.prop]" :placeholder="'请输入' + row.label"></el-input> 
                <el-date-picker
                    v-if="row.editor == 'daterange'"
                    v-model="queyForm[row.prop]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    >
                </el-date-picker>
                <el-cascader
                    v-if="row.editor == 'cascader'"
                    v-model="queyForm[row.prop]"
                    :options="row.options"
                    :props="row.props"
                ></el-cascader>
                <el-select v-if="row.editor == 'select'" v-model="queyForm[row.prop]" :placeholder="'请选择' + row.label">
                    <el-option v-for="option in row.options" :label="option.label" :value="option.value" :key="option.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submit">搜索</el-button>
                <el-button type="default" @click="reset">重置条件</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/javascript">

    export default {

        props: {
            //查询条件
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
                            let isRequired = item.isOption == "false";
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
                                        result[item.prop] = tmp;
                                    } else {
                                        if(isRequired) {
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
        },
        
        mounted() {
            if (this.queryItems && this.queryItems.length > 0) {
                this.submit();
            }
        }
    }
</script>
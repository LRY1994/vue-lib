<template>
    <div>
        <el-form v-bind="formConfig" v-model="form" ref="form">
            <el-form-item 
                v-for="row in itemConfigs"
                v-if="row.display != 'none'"
                :key="row.prop"
                v-bind="row">
                <el-input v-if="row.editor == 'input'" v-model="form[row.prop]" :placeholder="'请输入' + row.label"></el-input> 
                <el-date-picker
                    v-if="row.editor == 'daterange'"
                    v-model="form[row.prop]"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    >
                </el-date-picker>
                <el-cascader
                    v-if="row.editor == 'cascader'"
                    v-model="form[row.prop]"
                    :options="row.options"
                    :props="row.props"
                ></el-cascader>
                <el-select v-if="row.editor == 'select'" v-model="form[row.prop]" :placeholder="'请选择' + row.label">
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
    import compute_query_form_mixin from './compute_query_form_mixin';
    export default {
        mixins: [compute_query_form_mixin],
        props: {
            itemConfigs: {
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
                form: this.getFormFromConfigs()
            }
        },
        methods: {
            submit() {
                this.$emit('submit', this.form);
            },
            reset() {
                this.form = this.getFormFromConfigs();
            }
        },
        watch: {
            itemConfigs(val) {
                this.form = this.getFormFromConfigs();
                this.submit();
            }
        },
        created() {
            if (this.itemConfigs && this.itemConfigs.length > 0) {
                this.submit();
            }
        }
    }
</script>
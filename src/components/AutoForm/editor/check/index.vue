<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <div class="plain" v-if="disabled">{{plainValue}}</div>
        <el-checkbox-group v-else v-model="model" @change="handleChange">
            <el-checkbox v-for="i in options" :label="i.value" :key="i.value">{{i.label}}</el-checkbox>
        </el-checkbox-group>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import o_mixin from '../options.mixin';
    import range_mixin from '../range.mixin';
    export default {
        mixins: [mixin, o_mixin, range_mixin],
        name: 'alogic-check',
        methods: {
            handleChange (value) {
                // 通知上级form
                this.emitChange(value);

                // 触发blur回调
                this.handleBlur();
            },
            encode() {
                return this.model.join(',');
            },
            decode(data) {
                if (data) {
                    this.model = data.split(',');
                } else {
                    this.model = [];
                }
            }
        },
        computed: {
            plainValue() {
                let result = '';
                this.options.forEach(item => {
                    if (item.value == this.model) {
                        result = item.label;
                    }
                });
                return result;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .plain {
        padding: 0px 10px;
        border: 1px solid #eee;
        min-height: 42px;
    }
</style>
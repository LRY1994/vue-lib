<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <div v-if="disabled" class="plain">{{plainValue}}</div>
        <el-select v-else v-model="model" @change="handleChange">
            <el-option v-for="i in options" :key="i.value" :label="i.label" :value="i.value">
            </el-option>
        </el-select>
        <div v-show="!disabled">
            <slot></slot>
        </div>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import o_mixin from '../options.mixin';
    export default {
        mixins: [mixin, o_mixin],
        name: 'alogic-select',
        methods: {
            handleChange (value) {
                // 通知上级form
                this.emitChange(value);

                // 触发blur回调
                this.handleBlur();
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
        padding: 0 10px;
        border: 1px solid #eee;
        min-height: 42px;
    }
</style>
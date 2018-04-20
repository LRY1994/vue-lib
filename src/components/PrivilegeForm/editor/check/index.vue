<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <el-checkbox-group v-model="model" @change="handleChange" :disabled="disabled">
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
        }
    }
</script>
<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules" :ref="formItemRef">
        <el-select v-model="model" @change="handleChange" :disabled="disabled">
            <el-option v-for="i in options" :key="i.value" :label="i.label" :value="i.value">
            </el-option>
        </el-select>
        <slot></slot>
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
        }
    }
</script>
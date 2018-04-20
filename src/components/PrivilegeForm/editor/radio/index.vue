<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules">
        <el-radio-group v-model="model" @change="handleChange" :disabled="disabled">
            <el-radio v-for="i in options" :label="i.value" :key="i.value">{{i.label}}</el-radio>
        </el-radio-group>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import o_mixin from '../options.mixin';
    export default {
        mixins: [mixin, o_mixin],
        name: 'alogic-radio',
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
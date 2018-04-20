<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules">
        <el-input type="textarea" :rows="3" @change="handleChange" :placeholder="'请输入' + label" v-model="model" @blur="handleBlur" :disabled="disabled">
        </el-input>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin.js';
    export default {
        mixins: [mixin],
        name: 'alogic-textarea'
    }
</script>
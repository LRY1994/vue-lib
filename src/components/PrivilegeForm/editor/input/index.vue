<template>
    <el-form-item v-if="display" ref="form-item" :label="label" :prop="prop" :rules="rules">
        <el-input v-model="model"
            @change="handleChange" 
            :disabled="disabled" 
            :placeholder="'请输入' + label"
            @blur="handleBlur">
        </el-input>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin.js';
    export default {
        mixins: [mixin],
        name: 'alogic-input'
    }
</script>
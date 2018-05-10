<template>
    <el-form-item v-if="display" ref="form-item" :label="label" :prop="prop" :rules="rules">
        <div class="plain" v-if="disabled">{{model}}</div>
        <el-input v-model="model" @change="handleChange" v-else :placeholder="'请输入' + label" @blur="handleBlur"></el-input>
        <div v-show="!disabled">
            <slot ></slot>
        </div>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin.js';
    export default {
        mixins: [mixin],
        name: 'alogic-input'
    }
</script>

<style lang="scss" scoped>
    .plain {
        padding: 0 10px;
        border: 1px solid #eee;
        min-height: 42px;
    }
</style>
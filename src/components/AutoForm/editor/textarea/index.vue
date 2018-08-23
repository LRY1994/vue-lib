<template>
    <el-form-item v-if="display" :label="label" :prop="prop" :rules="rules">
        <div class="plain" v-show="disabled" ref="displayText"></div>
        <el-input v-show="!disabled" type="textarea" :rows="3" @change="handleChange" :placeholder="'请输入' + label" v-model="model" @blur="handleBlur">
        </el-input>
        <div v-if="!disabled">
            <slot></slot>
        </div>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin.js';
    export default {
        mixins: [mixin],
        name: 'alogic-textarea',
        watch: {
            model(val) {
                this.$refs.displayText.innerText = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .plain {
        padding: 0 10px;
        border: 1px solid #eee;
        min-height: 42px; 
    }
</style>
<template>
    <el-form-item 
        v-if="display"
        :label="label" 
        :prop="prop" 
        :rules="rules"
        :ref="formItemRef"
        >

        <el-date-picker 
            v-model="model" 
            type="daterange" 
            range-separator="至" 
            :start-placeholder="'开始日期'" 
            :end-placeholder="'结束日期'" 
            @blur="handleBlur"
            @change="handleRangeChange"
            value-format="timestamp" 
            :disabled="disabled">
        </el-date-picker>

        <el-checkbox 
            v-model="isForever" 
            @change="handleForeverChange" 
            :disabled="disabled">至永久</el-checkbox>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import rangeMixin from '../range.mixin';
    export default {
        mixins: [mixin, rangeMixin],
        data() {
            return {
                isForever: false
            }
        },
        name: 'alogic-daterange',
        methods: {
            handleForeverChange() {
                // 触发blur回调，因为checkbox没有blur,所以用change事件代替blur事件
                this.handleBlur();
            },
            // 因为独有的编码和解码，所以不能重复利用mixin了
            decode(r) {
                let to, from, isForever;
                if (r) {
                    let timeArr, arr = r.split('_');
                    timeArr = arr[0].split('-');

                    from = parseInt(timeArr[0]);
                    to = parseInt(timeArr[1]);

                    if (arr.length > 1) {
                        isForever = arr[1] == 'true' ? true : false;
                    };
                }

                this.model = [from, to];
                this.isForever = isForever;
                
            },
            encode() {
                let daterangeModel = this.model, isForever = this.isForever;
                let r = daterangeModel.join('-');
                if (isForever) {
                    r += '_' + isForever;
                };
                return r;
            }
        }
    }
</script>
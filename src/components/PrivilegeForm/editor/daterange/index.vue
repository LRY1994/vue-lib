<template>
    <el-form-item 
        v-if="display"
        :label="label" 
        :prop="prop" 
        :rules="rules"
        :ref="formItemRef"
        >

        <div v-if="disabled" class="plain">{{plainValue}}</div>
        <div v-else>
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
        </div>
        <div v-show="!disabled">
            <slot></slot>
        </div>
        
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import rangeMixin from '../range.mixin';
    import dateformat from 'dateformat';

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
        },
        computed: {
            plainValue() {
                let result = '', start, end;
                if (this.model[0] && this.model[1]) {
                    start = this.$options.filters.timeFormat(this.model[0], 'yyyy-mm-dd');
                    end = this.$options.filters.timeFormat(this.model[1], 'yyyy-mm-dd');
                    if (this.isForever) {
                        result = `${start} 至 永久`;
                    } else {
                        result = `${start} 至 ${end}`;
                    }
                }
                
                return result;
            }
        },
        filters: {
            timeFormat(input, format) {
                let reg = /^\d+$/g;
                if(!format) {
                    format = 'yyyy-mm-dd HH:MM:ss';
                }
                if(!reg.test(input)) {
                    return input;
                }
                return dateformat(parseInt(input), format);
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
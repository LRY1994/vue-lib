<template>
    <el-form-item 
        v-if="display"
        :label="label" 
        :prop="prop" 
        :rules="rules"
        :ref="formItemRef">

        <div v-if="disabled" class="plain">{{plainValue}}</div>
        <div v-else>
            <el-time-picker 
                is-range 
                v-model="model" 
                range-separator="至" 
                start-placeholder="开始时间" 
                end-placeholder="结束时间" 
                placeholder="选择时间范围, 如：9:00-18:00" 
                value-format="timestamp" 
                @blur="handleBlur" 
                @change="handleRangeChange">
            </el-time-picker>
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
        name: 'alogic-timerange',
        methods: {
            // 因为独有格式，所以不能重复利用mixin了
            decode(r) {
                let to, from;
                if (r) {
                    let timeArr = r.split('-');

                    from = parseInt(timeArr[0]);
                    to = parseInt(timeArr[1]);
                };

                this.model = [from, to];
                
            },
            encode() {
                let timerange = this.model;

                let r = timerange.join('-');
                return r;
            }
        },
        computed: {
            plainValue() {
                let result = '', start, end;
                if (this.model[0] && this.model[1]) {
                    start = this.$options.filters.timeFormat(this.model[0], 'HH:MM:ss');
                    end = this.$options.filters.timeFormat(this.model[1], 'HH:MM:ss');
                    result = `${start} 至 ${end}`;
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
        border: 1px solid #eee;
        min-height: 42px;
        padding: 0 10px;
    }
</style>
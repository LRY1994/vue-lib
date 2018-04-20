<template>
    <el-form-item 
        v-if="display"
        :label="label" 
        :prop="prop" 
        :rules="rules"
        :ref="formItemRef">

        <el-time-picker 
            is-range 
            v-model="model" 
            range-separator="至" 
            start-placeholder="开始时间" 
            end-placeholder="结束时间" 
            placeholder="选择时间范围, 如：9:00-18:00" 
            @blur="handleBlur" 
            @change="handleRangeChange"
            :disabled="disabled">
        </el-time-picker>
        <slot></slot>
    </el-form-item>
</template>

<script type="text/javascript">
    import mixin from '../editor.mixin';
    import rangeMixin from '../range.mixin';
    export default {
        mixins: [mixin, rangeMixin],
        name: 'alogic-timerange',
        methods: {
            // 因为独有的编码和解码，所以不能重复利用mixin了
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
        }
    }
</script>
export default {
    props: ['item'],
    data() {
        return {
            model: '',
            disabled: false,
            rules: [{}],
            display: true,
            formItemRef: 'form-item-ref'
        }
    },
    methods: {
        emitChange(value) {
            // 此处用于通知上级form修改，不要触发blur事件，否则会导致setter的调用
            this.$emit('input', value);
        },
        handleChange(value) {
            // 通常会触发emitChange，但是有些情况会触发blur
            this.emitChange(value);
        },
        getValue() {
            console.log("您需要在外部重写此方法, 用于初始化值，并且将初始化的值通过input事件通知到上级form");
        },
        getDisabled() {
            console.log("您需要在外部重写此方法, 用于初始化本表单是否disabled");
        },
        getDisplay() {
            console.log("您需要在外部重写此方法, 用于初始化本表单是否显示");
        },
        getRules() {
            console.log("您需要在外部重写此方法, 用于初始化本表单的校验规则");
        },
        handleBlur() {
            console.log("您需要在外部重写此方法, 用于处理blur事件，通常是发送请求服务将值写入后台，别忘了将值通过blur事件传递到上一级的form");
        },
        init() {
            this.getValue();
            this.initWithoutValue();
        },
        initWithoutValue() {
            this.getDisabled();
            this.getRules();
            this.getDisplay();
        }
    },
    mounted() {
        this.init();
    }
}
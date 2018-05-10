export default {
    methods: {
        calcValue() {
            let value;

            if (this.model && this.model.length > 0) {
                value = this.encode();
            }
            
            return value;
        },
        handleChange() {
            this.encodeUpdateChange();
        },
        encodeUpdateChange() {
            let value = this.calcValue();

            // 通知上级form
            this.emitChange(value);
        },
        handleRangeChange() {
            this.handleChange();

            // 手动触发校验，因为有可能使用了daterange的clearable
            this.$refs[this.formItemRef].validate('blur');
        },
        getValue() {
            this.config.getter(this.item).then(data => {
                if (data) {
                    this.decode(data);

                    // 初始化通知上级form
                    this.encodeUpdateChange();
                }
            })
        },
        handleBlur() {
            // 通知上级更改
            this.encodeUpdateChange();

            let value = this.calcValue();

            if (value) {
                let params = {
                    item: this.item,
                    value
                };
                this.config.setter(params).then(data => {
                    this.config.setterCallback && this.config.setterCallback(this.item);
                });
            }

            this.$emit('blur', this.model);
        },
    }
}
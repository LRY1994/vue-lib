import mixin from '../editor.mixin';
import AsyncValidator from 'async-validator';

export default {
    props: ['config', 'label', 'prop'],
    mixins: [mixin],
    methods: {
        getValue() {
            this.config.getter(this.item).then(data => {
                this.model = data;

                // 手动触发change事件，通知上级form
                this.emitChange(data);
            })
        },
        getDisabled() {
            this.config.genDisabled(this.item).then(data => {
                this.disabled = data;
            })
        },
        getRules() {
            this.config.genRules(this.item).then(data => {
                this.rules = data;
            })
        },
        getDisplay() {
            this.config.genDisplay(this.item).then(data => {
                this.display = data;
            })
        },
        handleBlur() {
            let params = {
                item: this.item,
                value: this.model
            }, p;

            p = this.validate();
            p.then(valid => {
                if (valid) {
                    this.config.setter(params).then(data => {
                        this.config.setterCallback && this.config.setterCallback(this.item);
                    });

                    if (this.$refs[this.formItemRef]) {
                        this.$refs[this.formItemRef].clearValidate();
                    }
                }
            })

            this.$emit('blur', this.model);
        },
        validate() {
            const descriptor = {};
            let rules = [...this.rules];
            if (rules && rules.length > 0) {
                rules.forEach(rule => {
                    delete rule.trigger;
                });
            }
            descriptor[this.prop] = rules;
            const validator = new AsyncValidator(descriptor);
            const model = {};
            model[this.prop] = this.model;

            let p = new Promise((resolve, reject) => {
                validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
                    try {
                        resolve(!errors);
                    } catch (err) {
                        reject(err);
                    }
                    
                });
            })

            return p;
        }
    },
    watch: {
        config: {
            handler(val) {
                this.initWithoutValue();
            },
            deep: true
        }
    }
}

export default {
    methods: {
        getFormFromConfigs() {
            if(this.itemConfigs && this.itemConfigs.length > 0) {
                let result = {},
                    arr = this.itemConfigs;
                if(arr.length > 0) {
                    arr.forEach(item => {
                        let isRequired = item.isOption == "false";
                        // 对checkbox多选框做兼容
                        if(item.editor == 'check' || item.editor == 'cascader') {
                            result[item.prop] = []
                        } else {
                            result[item.prop] = '';
                        }

                        // 对check和radio, select的表单项进行处理
                        if (item.editor == 'check' || item.editor == 'radio' || item.editor == 'select') {
                            if(item.options && item.options.length > 0) {
                                let tmp = item.options[0].value;
                                if(item.editor != 'check') {
                                    result[item.prop] = tmp;
                                } else {
                                    if(isRequired) {
                                        result[item.prop] = [tmp];
                                    }
                                }
                            };
                        }
                        
                    });
                };
                return result;
            };
            return null;
        }
    }
}
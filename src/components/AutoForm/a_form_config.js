const valuekey = 'value';
const labelKey = 'name';
const propKey = 'property';
const orderKey = 'placeOrder';
const isRequiredKey = 'isOption';
const tooltipsKey = 'tooltips';
const slotNameKey = 'property';
const slotEditor = 'slot';
const editorKey = 'editor';


const writableScopesKey = 'writableScopes';
const displayScopesKey = 'visibleScopes';
const optionsArrKey = 'parameters';
const validatorKey = 'validator';
const maxLengthKey = 'maxLength';

const editorDict = {
    check: 'alogic-check',
    daterange: 'alogic-daterange',
    file: 'alogic-file',
    htmleditor: 'alogic-htmleditor',
    image: 'alogic-image',
    input: 'alogic-input',
    radio: 'alogic-radio',
    select: 'alogic-select',
    textarea: 'alogic-textarea',
    timerange: 'alogic-timerange'
}
const triggerDict = {
    check: 'blur',
    daterange: 'change',
    file: 'change',
    htmleditor: 'blur',
    image: 'change',
    input: 'blur',
    radio: 'change',
    select: 'change',
    textarea: 'blur',
    timerange: 'change'
}

const getter = (item) => {
    return Promise.resolve(item[valuekey]);
}


const genRules = (item) => {
    let arr = [];
    if (item[isRequiredKey] == 'false') {
        arr.push({
            required: true,
            message: '请输入' + item[labelKey],
            trigger: 'blur'
        });
    };

    if(item[validatorKey]) {
        let validator = (rule, value, callback) => {
            if(value) {
                let p = item[validatorKey];
                if(new RegExp(p).test(value)) {
                    callback();
                } else {
                    callback(new Error('输入的' + item[labelKey] + '格式不正确'));
                }
            } else {
                callback();
            }
        };

        arr.push({
            validator: validator,
            trigger: 'blur'
        })
    }

    if (item[maxLengthKey]) {
        let max = parseInt(item[maxLengthKey]);

        let validator2 = (rule, value, callback) => {
            if(value) {
                if(new RegExp('^[\\s\\S]{0,' + max + '}$').test(value)) {
                    callback();
                } else {
                    callback(new Error('输入的内容字数超过限制，最长字数:' + max));
                }
            } else {
                callback();
            }
        };

        arr.push({
            validator: validator2,
            trigger: 'blur'
        })
    }
    return Promise.resolve(arr);
};


const genOptions = (item) => {
    let result = [], p = item[optionsArrKey];
    if(p) {
        let tmp = p.split(';');
        tmp.forEach(item => {
            result.push({
                label: item.split('=')[1],
                value: item.split('=')[0]
            })
        })
    };
    return Promise.resolve(result);
}

const genTooltips = (item) => {
    return Promise.resolve(item[tooltipsKey]);
}
//匹配visiable和writtable
const matchScope = (curr, scopes) => {
    //形如 '*'
    if(scopes=='*') return true;

    let arr = scopes.split(',');
    let arr2 = curr.split('_');
    
    //形如'tenant_new'		
    if(arr.indexOf(curr) >= 0) return true;

    //形如'tenant'或'new'
    for(let i=0;i<arr2.length;i++){
        if(arr.indexOf(arr2[i]) >= 0){
            return true;        
        } 
    }
    
    return false;
};
const dynamicGenDisabled = (currentScope) => {
    return (item) => {
        let result = matchScope(currentScope,item[writableScopesKey]);
        return Promise.resolve(!result);
    }
};
const dynamicGenDisplay = (currentScope) => {
    return (item) => {
        let result = matchScope(currentScope,item[displayScopesKey]);
        return Promise.resolve(result);
    }
}

export {getter, genRules, dynamicGenDisabled, genOptions, genTooltips, dynamicGenDisplay};

export default {
    keys: {
        valuekey,
        labelKey,
        propKey,
        orderKey,
        isRequiredKey,
        tooltipsKey,
        slotNameKey,
        slotEditor,
        editorKey
    },
    editorConfig: [{
        editor: ['*'], 
        detail: {
            getter,
            genDisabled: dynamicGenDisabled(),
            genRules,
            genOptions,
            genTooltips,
            genDisplay: dynamicGenDisplay()
        }
    }],
    editorDict
}
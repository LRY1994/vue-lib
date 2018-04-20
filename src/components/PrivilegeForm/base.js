const valuekey = 'value';
const labelKey = 'name';
const propKey = 'property';
const orderKey = 'placeOrder';
const isRequiredKey = 'isOption';
const tooltipsKey = 'tooltips';
const slotNameKey = 'property';
const slotEditor = 'slot';
const readonlyScopesKey = 'readonlyScopes';
const displayScopesKey = 'displayScopes';
const optionsArrKey = 'parameters';

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
    }
    return Promise.resolve(arr);
};
const dynamicGenDisabled = (currentScope) => {
    return (item) => {
        let result = false, scopes = item[readonlyScopesKey];

        if(scopes == '*' || scopes.split(',').indexOf(currentScope) >= 0) {
            result = true
        }

        return Promise.resolve(result);
    }
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

const dynamicGenDisplayScopes = (currentScope) => {
    return (item) => {
        let result = false, scopes = item[displayScopesKey];

        if(scopes == '*' || scopes.split(',').indexOf(currentScope) >= 0) {
            result = true
        }

        return Promise.resolve(result);
    }
}

export {getter, genRules, dynamicGenDisabled, genOptions, genTooltips, dynamicGenDisplayScopes};

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
    },
    editorConfig: [{
        editor: ['*'], 
        detail: {
            getter,
            genDisabled: dynamicGenDisabled(),
            genRules,
            genOptions,
            genTooltips,
            genDisplay: dynamicGenDisplayScopes()
        }
    }],
    editorDict: {
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
}
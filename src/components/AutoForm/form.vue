<template>
    <div>
        <el-form class="my-form" :model="form" v-if="form && sortedItems && configForEditor" ref="form" label-width="150px" label-position="left">
            <slot v-for="item in sortedItems" v-if="item.editor == basic.keys.slotEditor" :name="item[basic.keys.slotNameKey]" :item="item" :form="form"></slot>
            <component v-else 
                :is="basic.editorDict[item.editor] || item.editor" 
                :item="item" 
                v-model="form[item[basic.keys.propKey]]" 
                :config="configForEditor[basic.editorDict[item.editor] || item.editor]"
                :label="item[basic.keys.labelKey]"
                :prop="item[basic.keys.propKey]"
            >
                <div v-if="item[basic.keys.tooltipsKey]" class="tooltips" v-html="item[basic.keys.tooltipsKey]"></div>
            </component>
        </el-form>
    </div>
</template>

<script type="text/javascript">
    let editors = {}, editorConfigs = {};

    function importAll (r) {
        r.keys().forEach(key => {
            let editComp = r(key).default;
            editors[editComp.name] = editComp;
        });
    }

    importAll(require.context('./editor', true, /index.vue$/));

    function registerEditor(editor) {
        if (editor && editor.name && editor.component) {
            if (editors[editor.name]) {
                console.info('编辑器名称已经被占用');
            } else {
                editors[editor.name] = editor.component;
            }
        }
    }


    export {
        registerEditor
    }

    import baseConfig from './base';
    export default {
        name: 'awesome-form',
        props: {
            items: {
                required: true,
                type: Array
            },
            config: {
                type: Array,
                default: []
            },
            basic: {
                type: Object,
                default: () => {
                    return baseConfig;
                }
            }
        },
        data() {
            return {
                sortedItems: [],
                form: {},
                configForEditor: null
            }
        },
        components: editors,
        methods: {
            validate() {
                let result = false;
                this.$refs.form.validate(valid => {
                    result = valid;
                });
                return result;
            },
            validateAsync() {
                let p = new Promise((resolve, reject) => {
                    try {
                        this.$refs.form.validate(valid => {
                            resolve(valid)
                        });
                    } catch (err) {
                        reject(err);
                    }
                })
                
                return p;
            },
            getFormModel() {
                this.items.forEach(item => {
                    this.form[item[this.basic.keys.propKey]] = '';
                })
            },
            initEditorConfig() {
                let result = {};

                Object.keys(editors).forEach(key => {
                    result[key] = {};
                });

                return result;
            },
            calcConfigForEditor() {
                // 针对所有的editor都有配置
                let result = this.initEditorConfig();

                //基于base进行修改
                let allConfig = [...this.basic.editorConfig, ...this.config];
                allConfig.forEach(item => {
                    for(let e in result) {
                        if (item.editor.indexOf('*') >= 0 || item.editor.indexOf(e.split('-')[1]) >= 0) {
                            result[e] = Object.assign({}, result[e], item.detail);
                        }
                    }
                });
                return result;
            },
            sortItem() {
                let result = [...this.items];
                result.sort((a, b) => {
                    return parseInt(a[this.basic.keys.orderKey]) - 
                        parseInt(b[this.basic.keys.orderKey]);
                });
                return result;
            }
        },
        mounted() {
            this.configForEditor = this.calcConfigForEditor();
            if (this.items) {
                this.sortedItems = this.sortItem();
                this.getFormModel();
            }
        },
        watch: {
            items: {
                handler(val) {
                    if (val) {
                        this.sortedItems = this.sortItem();
                    }
                },
                deep: true
            },
            config: {
                handler(val) {
                    if(val && val.length > 0) {
                        this.configForEditor = this.calcConfigForEditor();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tooltips {
        color: #bbb;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: relative;
    }
</style>

<style type="text/css" scoped>
    .my-form >>> .el-form-item__error {
        background: #fff;
        width: 100%;
    }
</style>
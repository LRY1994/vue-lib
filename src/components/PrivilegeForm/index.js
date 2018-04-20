import dynamicForm from './form.vue';
import editorMixin from './editor.mixin.js';

const install = (Vue, o) => {
    if (o && o.globalOptions) {
        dynamicForm.props.basic.default = () => o.globalOptions
    }
    Vue.component(dynamicForm.name, dynamicForm)
}

const DynamicForm = { dynamicForm, install }

export default DynamicForm;
export { dynamicForm, install, editorMixin};
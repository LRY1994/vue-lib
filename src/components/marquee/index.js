/*
 * @Author: zhangzengyang 
 * @Date: 2018-11-27 20:36:34 
 * @Description 跑马灯指令
 */
import Vue from 'vue';
import Marquee from './Marquee.vue';

const appendChilds = (el, subs) => {
    subs.forEach(sub => {
        el.appendChild(sub);
    })
};
const removeChilds = el => {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}
const copyNodes = els => {
    const cache = [];
    els = Array.prototype.slice.call(els);
    els.forEach(el => {
        cache.push(el.cloneNode(true));
    })
    return cache;
}
const Tpl = Vue.extend(Marquee);
const Plugin = {
    install(vue, options) {
        Vue.directive('marquee', {
            inserted(el, binding, vnode) {
                const firstChild = el.firstChild;
                // 元素设置成可定位，mask才可完全覆盖它
                if (!/^(fixed|absolute|relative)$/.test(el.style.position)) {
                    el.style.position = 'relative';
                }
                // 第一个子元素设置成可定位，z-index才会生效
                if (!/^(fixed|absolute|relative)$/.test(firstChild.style.position)) {
                    firstChild.style.position = 'relative';
                }
                firstChild.style.zIndex = 2;
                const mask = new Tpl({
                    el: document.createElement('div'),
                    data: { name: binding.value }
                });
                el.appendChild(mask.$el);
            }
        })
    }
};
export default Plugin;
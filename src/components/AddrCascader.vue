/*
  * 传递参数 - props
  * note {String} - 选填，位置全部文字信息，需要传递sync，格式"省-市-区县"
  * id {Number,String} - 选填，位置ID，需要传递sync
  * (note、id都可以有初始值，note优先级高)
  * 使用 ： <addr-cascader :note.sync="form.locationNote"  :id.sync="form.locationId" ></addr-cascader>
  */
<template>
	<el-cascader size="small" 
	class="addr"
	v-model.lazy="selected" 
	:rules="rules"
	:options="options" 
	:props="props" 
	:disabled="disabled"
	 @active-item-change="itemChange" 
	 @change="change"></el-cascader>
</template>
<script>
let map = {};// 地址的缓存,以id为key存储地区信息，避免树查找children
let provincesCache = []; //省份的缓存
export default {
	props: {
		note: String,
		id: [Number, String],
		disabled:{
			type: Boolean,
			default: false
		},
		rules:Object
	},
	data() {
		return {
			selected: [],
			options: [],
			props: {
				value: 'id',
				label: 'name'
			}
		};
	},
	created() {
		// 都没有初始值
		if (!this.note && !this.id) {
			this.loadByParent().then(data => this.options = data);
			return;
		}
		// note 有初始值
		if (this.note) {
			this.initialLoadByNote(this.note);
			return;
		}
		// id 有初始值
		if (this.id) {
			this.initialLoadById(this.id);
			return;
		}
	},
	methods: {
		// 根据位置信息描述，执行初始化加载
		initialLoadByNote(note) {
			let idArr = [];
			let nameArr = note.split('-');
			//this.district = nameArr[nameArr.length - 1];
			this.loadByParent()
				.then(data => {// 省份
					let province = findByName(nameArr[0], data);
					this.options = data;
					idArr.push(province.id);
					// console.log('province', province)
					return province.id;
				})
				.then(provinceId => {// 市
					return this.loadByParent(provinceId).then(data => {
						if (!provinceId) {
							return;
						}
						let city = findByName(nameArr[1], data);
						idArr.push(city.id);
						// console.log('city', city)
						if (nameArr.length === 2) { //直辖市，没有下一级了
							return;
						}
						return city.id;
					})
				})
				.then(cityId => {// 县区
					return this.loadByParent(cityId).then(data => {
						if (!cityId) {
							return;
						}
						let county = findByName(nameArr[2], data);
						idArr.push(county.id);
						// console.log('county', county)
						return county.id;
					})
				}).then(() => { this.selected = idArr });

			function findByName(name, data) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].name === name) {
						return data[i];
					}
				}
			};
		},
		// 根据loactionId加载
		initialLoadById(id) {
			this.loadById(id).then(data => {
				this.initialLoadByNote(data.note);
			});
		},
		/**
 		* @description  把从服务端拉取的数据放入map中
 		* @param {Number|String} parentId -父节点Id
 		* @param {Array} data - 后台拉取的数据
 		**/
		data2Map(parentId, data) {
			data.forEach((item, index) => {
				let id = item.id;
				let isCounty = _isCounty(item);
				if (map[id]) {
					return;
				}
				if (!isCounty) {
					item.children = [];
				}
				map[id] = item;
			});
			// parentId为'0'或者undefined，则说明是省级代码，没有父节点
			if (parentId !== '0' && parentId !== undefined) {
				map[parentId].children = data;
				//长度为0，说明没有子节点，删除children属性
				if (data.length <= 0) {
					delete map[parentId].children;
				}
			}
			return map;
			function _isCounty(area) {
				// 市辖区虽然属于city级别，但没有子节点，此处做县区处理
				return area.id.substr('4') !== '00' || area.name == '市辖区';
			}
		},
		change() {
			let locationId = this.selected[this.selected.length - 1];
			this.$emit('update:note', map[locationId].note);
			this.$emit('update:id', locationId);
		},
		itemChange(val) {
			let id = val[val.length - 1];
			this.loadByParent(id);
		},
		loadByParent(id) {
			let param = {};
			if (id === undefined) {
				if (provincesCache.length > 0) { // 省份的缓存处理
					return new Promise((resolve, reject) => {
						resolve(provincesCache);
					});
				}
			}
			else {// 后台参数处理
				param.id = id;
			}
			// 如果id存在map中，并且map[id].children中有数据，则说明已经加载过，不需要再向服务器拉取
			if (id !== undefined && map[id] && Array.isArray(map[id].children) && map[id].children.length > 0) {
				return new Promise((resolve, reject) => {
					resolve(map[id].children);
				});
			}
			// 后台拉取数据
			return this._$http.util.locationList(param).then(data => {
				if (id === undefined) {// id为空，说明是获取省份列表
					provincesCache = data;
				}
				this.data2Map(id, data);
				return data;
			});
		},
		loadById(id) {
			let param = { id };
			// 如果id存在map中，则说明已经加载过，不需要再向服务器拉取
			if (map[id]) {
				return new Promise((resolve, reject) => {
					resolve(map[id]);
				});
			}
			// 后台拉取数据
			return this._$http.util.locationQuery(param).then(data => {
				return data[0];
			});
		}
	},
	watch: {
		// district:function(newVal,oldVal){// el-input在失去焦点时才会触发change时间，所以district添加watch
		// 	this.change();
		// }
	}
}
</script>
<style lang="scss" scoped>
.addr {
	/deep/ .el-input__inner{
		width:300px!important;
	}
}
</style>


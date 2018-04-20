export default {
	methods: {
		sortData(data) {			
			data.sort((a, b) => {
				return parseInt(a.placeOrder) - parseInt(b.placeOrder);
			});
			return data;
			
		},
		genRules(data) {
			let rules = {};
			data.forEach(item => {
				if(item.isOption == 'false') {
					rules[item.property] = [{
						required: true,
						message: '请输入' + item.name,
						trigger: 'blur'
					}];
				};

				if(item.validator) {
					let name = item.name;
					let pattern = item.validator;
					let validator = (function(name, pattern) {

						return(rule, value, callback) => {
							if(value) {								
								if(new RegExp(pattern).test(value)) {
									callback();
								} else {
									callback(new Error('输入的' + name + '格式不正确'));
								}
							} else {
								callback();
							}
						};
					})(name,pattern);

					if(!rules[item.property]) {
						rules[item.property] = [];
					};

					rules[item.property].push({
						validator: validator,
						trigger: 'blur'
					})
				}
			});
			return rules;
		},
		parseOptions(p) {
			let result = [];
			if(p) {
				let tmp = p.split(';');
				tmp.forEach(item => {
					result.push({
						label: item.split('=')[1],
						value: item.split('=')[0]
					})
				})
			};
			return result;
		},
		genItemConfigs( data,curState) {
			let result = [];
			data.forEach(item => {
				let tmp = {},
					options = [];
				//检测当前item是否显示
				let display = this.findState( curState, item.visibleScopes );
				if(display == true) {
					switch(item.editor) {
						case 'check':
						case 'radio':
						case 'select':
							options = this.parseOptions(item.parameters);
							
							tmp = {
								options
							};
			
							break;
						case 'file':
						case 'image':
							tmp = {
								span: 6,
								inBase64: '',
								inUrl: ''
							};							
							if(this.genAction) {
								tmp.action = this.genAction(item);
							} else {
								alert(item.editor)
								throw 'need define genAction func outside mixin';
							}

							if(this.genInUrl) {
								if(item.value) {
									tmp.inUrl = this.genInUrl(item);
								}
							} else {
								throw 'need define genInUrl func outside mixin';
							}

							break;

						case 'input':
						case 'textarea':
							if (item.maxLength) {
								item.maxLength = parseInt(item.maxLength);
							}
							break;

						case 'htmleditor':
							tmp = {
								htmlUrl: ''
							};

							if(this.genHtmlUrl) {
								if(item.value) {
									tmp.htmlUrl = this.genHtmlUrl(item);
								}
							} else {
								throw 'need define genHtmlUrl func outside mixin';
							}

						default:
							break;
					};
					//检测当前item是否可读
					let writable = this.findState(curState, item.writableScopes);

					result.push(Object.assign({}, item, tmp, {writable}, {label: item.name}, {prop: item.property}));
				}
			});

			return result;
		},
		/**
		 * 数据库里的writableScopes形式
		 *  tenant      无论在什么状态下，供应商角色，这个字段是可写的
		 *  tenant_new  在new状态下，供应商角色，这个字段是可写的
		 *  new         无论什么角色，在new状态下 ，这个字段是可写的
		 *	*           无论什么角色, 无论在什么状态下,这个字段是可写的
		 */
		findState(curState, states) {
			//形如 '*'
			if(states=='*') return true;

			let arr = states.split(',');
			let arr2 = curState.split('_');
			
			//形如'tenant_new'		
			if(arr.indexOf(curState) >= 0) return true;

			//形如'tenant'或'new'
			for(let i=0;i<arr2.length;i++){
				if(arr.indexOf(arr2[i]) >= 0){
					return true;
				
				} 
			}
			
			return false;
		},
		daterangeEncode({
			record,
			value
		}) {
			let r = value.join('-');
			if(record.isForever) {
				r += '_' + record.isForever;
			};
			return r;
		}
	}
}
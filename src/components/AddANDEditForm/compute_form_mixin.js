export default {
	methods: {
		//从itemConfigs里提取value,输出result[item.property] = item.value
		getFormFromConfigs() {
			if(this.itemConfigs && this.itemConfigs.length > 0) {
				let result = {},
					arr = this.itemConfigs;
				if(arr.length > 0) {
					arr.forEach(item => {


						if(item.value) {
							result[item.property] = item.value;

							
							// 对image和file进行处理
							if (item.editor == 'image' || item.editor == 'file') {

								if (!item.inUrl) {
									throw 'need define inUrl for image during parent component or his mixin'
								}
							}

							// 对daterange进行处理
							if (item.editor == 'daterange') {
								let r = this.daterangeDecode(item.value);
								if (r.from && r.to) {
									result[item.property] = [r.from, r.to];
								};
								result[item.property + '_isForver'] = r.isForever ? true : false;
							}
							
							//对checkbox进行处理
							if(item.editor == 'check') {
								result[item.property] = item.value.split(',');
							}

							//对htmleditor进行处理
							if (item.editor == 'htmleditor') {
								if (!item.htmlUrl) {
									throw 'need define htmlUrl for htmleditor during parent component or his mixin';
								}

								this.getHtmlEditorContent(item);
								
								result[item.property] = '';
							}
						} else {
							let isRequired = item.isOption == "false";
							// 对checkbox多选框做兼容
							if(item.editor == 'check') {
								result[item.property] = []
							} else {
								result[item.property] = '';

                                // 初始化htmleditor备份
                                if (item.editor == 'htmleditor') {
                                    this.htmlEditorThingsBackup[item.property] = '';
                                }
							}

							if (item.editor == 'daterange') {
								result[item.property + '_isForver'] = false;
							}

							// 对有option的表单项进行处理
							if(item.options && item.options.length > 0) {
								let tmp = item.options[0].value;
								if(item.editor != 'check') {
									result[item.property] = tmp;
								} else {
									if(isRequired) {
										result[item.property] = [tmp];
									}
								}
							};
						}

					});
				};
				return result;
			};
			return null;
		},
        daterangeDecode(r) {
            let to, from, isForever, timeArr, arr = r.split('_');

            timeArr = arr[0].split('-');

            from = parseInt(timeArr[0]);
            to = parseInt(timeArr[1]);

            if (arr.length > 1) {
                isForever = arr[1] == 'true' ? true : false;
            };
            return {to, from, isForever};
        },
        getHtmlEditorContent(item) {
            let params = {
                offerInfoId: item.infoId,
                type: 'detail'
            };

            this._$http.tenant.offerExtendDownload(params).then(data => {
                this.form[item.property] = data;
                this.htmlEditorThingsBackup[item.property] = data;
            });
        }
	}
}
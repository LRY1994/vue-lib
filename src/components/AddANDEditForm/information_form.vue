<template>
	<div>
		<el-form :model="form" :rules="rules" v-if="form" ref="form" label-width="150px" label-position="left">
			<template v-for="row in itemConfigs">
				<slot v-if="row.slot" :name="row.name" :item="row"></slot>
				<el-form-item v-else v-bind="row">
					<template v-if="row.editor == 'asyncSelect'">
						<service-template :offerId="$route.params.offerId" :infoId="row.infoId" :value.sync="form[row.property]" :disabled="!row.writable">
						</service-template>
					</template>
					<template v-if="row.editor == 'input'">
						<el-input  v-model="form[row.property]" :placeholder="'请输入' + row.label" :maxlength="row.maxLength" @blur="blur(row)" :disabled="!row.writable"></el-input>
					</template>
					<template v-if="row.editor == 'textarea'">
						<el-input  type="textarea" :rows="row.rows || 3" :placeholder="'请输入' + row.label" v-model="form[row.property]" :maxlength="row.maxLength" v-on:blur="blur(row)" :disabled="!row.writable">
						</el-input>
					</template>
					<template v-if="row.editor == 'daterange'">
						<el-date-picker v-model="form[row.property]" type="daterange" range-separator="至" :start-placeholder="'开始日期'" :end-placeholder="'结束日期'" v-on:blur="blur(row)" value-format="timestamp" :disabled="!row.writable">
						</el-date-picker>
						<el-checkbox v-model="form[row.property + '_isForver']" @change="handleForever(row)" :disabled="!row.writable">永久</el-checkbox>
					</template>
					<template v-if="row.editor == 'radio'">
						<el-radio-group v-model="form[row.property]" @change="blur(row)" :disabled="!row.writable">
							<el-radio v-for="item in row.options" :label="item.value" :key="item.value">{{item.label}}</el-radio>
						</el-radio-group>
					</template>
					<template v-if="row.editor == 'select'">
						<el-select v-model="form[row.property]" @change="blur(row)" :disabled="!row.writable">
							<el-option v-for="item in row.options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</template>
					<template v-if="row.editor == 'check'">
						<el-checkbox-group v-model="form[row.property]" @change="blur(row)" :disabled="!row.writable">
							<el-checkbox v-for="item in row.options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
						</el-checkbox-group>
					</template>
					<template>
						<el-time-picker v-if="row.editor == 'timerange'" is-range v-model="form[row.property]" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围, 如：9:00-18:00" v-on:blur="blur(row)" :disabled="!row.writable">
						</el-time-picker>
					</template>
					
					<template v-if="row.editor == 'image'">
						<el-upload class="avatar-uploader" :ref="row.property" :action="row.action" :show-file-list="false" :auto-upload="false" :with-credentials="true" :on-change="handleFileChange(row)" :before-upload="beforeAvatarUpload" :disabled="!row.writable">
							<img v-if="row.inBase64 || row.inUrl" :src="row.inBase64 || row.inUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</template>
					<template v-if="row.editor == 'file'">
						<span v-if="row.value"><i class="el-icon-document"></i><a :href="row.inUrl">资源文件</a></span>
						<span v-else>无</span>
					</template>
					<div v-if="row.editor == 'htmleditor'" class="htmleditor">
						<el-tabs value="first" type="border-card">
							<el-tab-pane label="编写" name="first">
								<p class="operation">
									<el-button type="success" @click="saveHtmlEditorThings(row)" size="mini" :disabled="!row.writable">保存</el-button>
									<el-button @click="restoreHtmlEditorThing(row)" size="mini" :disabled="!row.writable">丢弃更改</el-button>
								</p>
								<quill-editor class="my-html-editor" :options="quillOptions" v-model="form[row.property]" :ref="row.property" :disabled="!row.writable">
								</quill-editor>
							</el-tab-pane>
							<el-tab-pane label="预览" name="second">
								<div class="htmleditor-content">
									<div v-html="form[row.property]"></div>
								</div>
							</el-tab-pane>
						</el-tabs>
					</div>
					<span v-if="row.tooltips" class="tooltips" v-html="row.tooltips"></span>
				</el-form-item>
			</template>
		</el-form>
	</div>
</template>

<script type="text/javascript">
	import compute_form_mixin from './compute_form_mixin';
	import ServiceTemplate from './ServiceTemplate';

	import 'quill/dist/quill.core.css';
	import 'quill/dist/quill.snow.css';
	import 'quill/dist/quill.bubble.css';

	import { quillEditor } from 'vue-quill-editor';

	export default {
		props: {
			rules: {
				required: true,
				type: Object
			},
			itemConfigs: {
				required: true,
				type: Array
			},
			formData: {
				type: Object
			}
		},
		components: {
			quillEditor,
			ServiceTemplate
		},
		mixins: [compute_form_mixin],
		data() {
			let form = null;
			if(this.itemConfigs && this.itemConfigs.length > 0) {
				form = this.getFormFromConfigs();

				if(this.formData) {
					Object.assign(form, this.formData);
				}
			}
			return {
				form,
				htmlEditorThingsBackup: {},
				quillOptions: {
					modules: {
			        	toolbar:  [['bold', 'italic', 'underline', 'strike'],[{ 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['image'], ['clean']]
			        }
				}
			}
		},
		watch: {
			itemConfigs(val) {
				if(val && val.length > 0) {
					this.form = this.getFormFromConfigs();
				}
			},
			$route(val) {
				// 路由更改清除页面
				this.form = null;
			}
		},
		methods: {
			validateField(prop) {
				this.$refs.form.validateField(prop);
			},
			handleFileChange(row) {
				return(file, fileList) => {
					file = file.raw;
					let reader = new FileReader();
					reader.onload = (event) => {
						this.duplicate = event.target.result;
						this.$set(row, 'inBase64', event.target.result);
						this.form[row.property] = event.target.result;
						this.validateField(row.prop);
						this.blur(row);
					};
					reader.readAsDataURL(file);
				}
			},
			beforeAvatarUpload(file) {
				//jpg png bmp
				const isType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/bmp');
				const isLt3M = file.size / 1024 / 1024 <= 3;
				if(!isType) {
					this.$message.error('上传头像图片只能是 JPG/PNG/BMP格式!');
					return;
				}
				if(!isLt3M) {
					this.$message.error('上传头像图片大小不能超过 3MB!');
					return;
				}
				return isType && isLt3M;
			},
			blur(record) {
				this.$refs.form.validateField(record.prop,(errorMsg) =>{
					if(errorMsg == '') {
							if(this.form[record.property]) {
							let params = {
								record,
								value: this.form[record.property]
							};
							this.$emit('item-blur', params);
						}
					}
				});
			},
			handleForever(record) {
				if(this.form[record.property]) {
					record.isForever = this.form[record.property + '_isForver'];
					this.blur(record);
				}
			},
			saveHtmlEditorThings(row) {
				var blob = new Blob([this.form[row.property]], {
					type: 'text/html,charset=UTF-8'
				});

				let params = {
					file: blob,
					__option: {
						url: `/gw/tenant/offer/extend/Upload?tenantId=${this.__tid}&offerId=${this.$route.params.offerId}&offerInfoId=${row.infoId}`
					}
				};

				this._$http.tenant.offerExtendUpload(params).then(data => {
					this.htmlEditorThingsBackup[row.property] = this.form[row.property];
					this.validateField(row.prop);
					this.$message({
						type: 'success',
						message: `保存${row.label}成功`
					})
				});

			},
			restoreHtmlEditorThing(row) {
				this.$confirm('确认丢弃当前更改, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.form[row.property] = this.htmlEditorThingsBackup[row.property];
				}).catch(() => {});
			},
			checkIfHtmlEditorRestored() {
				// 检查富文本有没有保存
				let result = [];
				Object.keys(this.htmlEditorThingsBackup).forEach(key => {
					if(this.htmlEditorThingsBackup[key] != this.form[key]) {
						result.push(key);
					}
				});
				return result;
			},
			alertHtmlNotSaved(tmp) {
				let labels = [];
				this.itemConfigs.forEach(item => {
					if(tmp.indexOf(item.property) >= 0) {
						labels.push(item.label);
					}
				});

				this.$alert(labels.join(','), '以下内容尚未保存，请先保存再提交', {
					confirmButtonText: '确定',
					callback: action => {}
				});
			},
			submitCheckAndAlert() {
				let result = false;
				this.$refs.form.validate((valid) => {
					if(valid) {

						let tmp = this.checkIfHtmlEditorRestored();

						if(tmp.length <= 0) {
							result = true;
						} else {
							this.alertHtmlNotSaved(tmp);
						}
					}
				});
				return result;
			}
		},
	}
</script>

<style lang="scss" scoped>

	@import '../../../assets/css/variable.scss';

	.htmleditor-content {
		padding: 20px;
	    @include htmleditor-content;
	}

	.overflow-visible {
		overflow:visible;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	
	.ql-picker-label {
		display: flex !important;
	}

	.my-html-editor {
		@extend .overflow-visible;
		padding-bottom: 30px;

	}
	
	.operation {
		text-align: right;
		margin: 0;
		border-bottom: 1px solid #ccc;
		padding-right: 20px;
	}

	.tooltips {
		color: #ddd;
		font-size: 12px;
		line-height: 1;
		padding-top: 4px;
		position: absolute;
		top: 100%;
		left: 0;
	}
</style>

<style type="text/css" scoped>
	.htmleditor>>>.ql-toolbar {
		border: none;
		border-bottom: 1px solid #ccc;
	}
	
	.htmleditor>>>.ql-container {
		border: none;
	}
	
	.htmleditor>>>.el-tabs__content {
		padding: 0;
	}

	.htmleditor >>> .el-tabs__content {
		overflow: visible;
	}

	.avatar-uploader >>> .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader >>> .el-upload:hover {
		border-color: #409EFF;
	}

	.el-form >>> .el-form-item__error {
		background: #fff;
		width: 100%;
	}
</style>
<template>
	<el-select v-model="templateId" placeholder="请选择" size="small" @change="setTemplateId" :disabled="disabled">
		<el-option v-for="(item,index) in templateList " :key="index" :label="item.name" :value="item.templateId">
		 	{{ item.name }}
		</el-option>
	</el-select>
</template>

<script>
export default {
	props: ['offerId', 'infoId', 'value', 'disabled'],
	data() {
		return {
			templateId: this.value,
			templateList: []
		}
	},
	created() {
		let params = {
			providerId: this.__tid,
			templateType: 'service'
		}
		this._$http.tenant.templateList(params).then(data => {
			this.templateList = data.list;
		});
	},
	methods: {
		setTemplateId(val) {
			if(this.value != val) {
				this.templateId = val;
				let params = {
					tenantId: this.__tid,
					offerId: this.offerId,
					offerInfoId: this.infoId,
					propertyValue: this.templateId
				}
				this._$http.tenant.offerExtendUpdate(params).then(data => {
					this.$emit('update:value', this.templateId);
					this.$message.success('服务单模板选择成功！');
				})
			}
		}
	}
}
</script>

<style>
</style>
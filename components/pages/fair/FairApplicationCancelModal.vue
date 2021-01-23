<template>
	<modal
		name="modal-application-cancel"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-horizontal">
			<div class="uk-text-right">
				<button type="button" class="close-button" @click="$modal.hide('modal-application-cancel')">
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="vm--title uk-card-title">
				{{ fair_dt.organization_name }}<br>への説明会申込をキャンセルしますか
			</div>
			<div class="uk-modal-footer uk-text-center">
				<div
					class="uk-text-center"
				>
					<button
						type="button"
						class="sc-button sc-button-flat uk-modal-close"
						@click="$modal.hide('modal-application-cancel')"
					>
						いいえ
					</button>
					<button
						class="sc-button sc-button-secondary waves-effect waves-button waves-light"
						:class="{'sc-button-progress': btnLoading}"
						:disabled="btnLoading"
						@click.prevent="cancelApplication()"
					>
						<span v-if="!btnLoading">はい</span>
						<ScProgressCircular v-else light></ScProgressCircular>
					</button>
				</div>
			</div>
		</div>
	</modal>
</template>
<script>
import { CONST } from '~/const.js';
import { ScProgressCircular } from "~/components/ui/progress";
export default {
	components: {
		ScProgressCircular
	},
	data: () => ({
		fair_dt: "",
		btnLoading: false,
	}),

	async asyncData ( {app, params, error} ) {
	},
	methods: {
		beforeOpen (event) {
			this.fair_dt = event.params;
		},
		beforeClose (event) {
		},
		async cancelApplication () {
			this.btnLoading = true;
			let res;
			res = await this.$axios.put(`/api/fairApplication`, {
				application_id: this.fair_dt.applied_application.application_id,
				application_status: CONST.application_status.CANCEL.value,
			});
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				await this.$emit('update');
				UIkit.notification("キャンセルしました");
				this.btnLoading = false;
				this.$modal.hide('modal-application-cancel');
			}
		},
	},
}
</script>
<style scoped lang="scss">
	.flexmiddle{
		display: flex;
		align-items: center;
	}
</style>

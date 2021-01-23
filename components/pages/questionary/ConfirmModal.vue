<template>
	<modal
		name="modal-confirm"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-horizontal">
			<div class="uk-padding-small uk-padding-remove-bottom flexmiddle">
				<div class="vm--title uk-card-title">
					アンケートを登録しますか？
				</div>
				<button
					type="button"
					class="close-button"
					@click="$modal.hide('modal-confirm')"
				>
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="uk-modal-footer uk-text-center">
				<div
					class="uk-text-center"
				>
					<button
						type="button"
						class="sc-button sc-button-flat"
						@click="$modal.hide('modal-confirm')"
					>
						いいえ
					</button>
					<button
						v-waves.button.light
						class="sc-button sc-button-secondary waves-effect waves-button waves-light"
						:class="{'sc-button-progress': btnLoading}"
						:disabled="btnLoading"
						@click.prevent="saveQuestionary()"
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
		questionary_dt: "",
		btnLoading: false,
	}),

	computed: {
	},
	methods: {
		beforeOpen (event) {
			this.questionary_dt = event.params;
		},
		beforeClose (event) {
		},
		async saveQuestionary () {
			this.btnLoading = true;
			let res = await this.$axios.post('api/questionary', this.questionary_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("登録しました");
				this.btnLoading = false;
				this.$emit('afterSave');
				this.$modal.hide('modal-confirm');
			}
		},
	},
}
</script>
<style lang="scss">
</style>

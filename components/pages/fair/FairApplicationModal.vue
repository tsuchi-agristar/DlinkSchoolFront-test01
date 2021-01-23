<template>
	<modal
		name="modal-application"
		:draggable="$device.isDesktop"
		:adaptive="true"
		:reset="true"
		width="50%"
		height="auto"
		@before-open="beforeOpen"
		@before-close="beforeClose"
	>
		<div class="uk-card uk-form-stacked">
			<div class="uk-text-right">
				<button type="button" class="close-button" @click="$modal.hide('modal-application')">
					<span class="mdi mdi-close"></span>
				</button>
			</div>
			<div class="uk-padding-small">
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="fair_format">
							<span class="contact_label required">必須</span>説明会形式
						</label>
						<div class="uk-margin-small-top">
							<client-only>
								<Select2
									v-model="$v.application_dt.format.$model"
									:error-state="$v.application_dt.format.$error"
									:validator="$v.application_dt.format"
									class="uk-select2"
									:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
								>
									<option
										v-for="data in fairFormat"
										:key="data.value"
										:value="data.value"
									>
										{{ data.text }}
									</option>
								</Select2>
								<ul class="sc-vue-errors">
									<li v-if="!$v.application_dt.format.required">
										必須項目です
									</li>
								</ul>
							</client-only>
						</div>
					</div>
				</div>
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="estimate_participant_number">
							<span class="contact_label required">必須</span>参加予定人数
						</label>
						<div class="uk-margin-small-top">
							<ScInput
								id="estimate_participant_number"
								v-model="$v.application_dt.estimate_participant_number.$model"
								:error-state="$v.application_dt.estimate_participant_number.$error"
								:validator="$v.application_dt.estimate_participant_number"
								placeholder="1,000"
								mode="outline"
							>
							</ScInput>
							<ul class="sc-vue-errors">
								<li v-if="!$v.application_dt.estimate_participant_number.integer">
									数値を入力してください
								</li>
								<li v-if="!$v.application_dt.estimate_participant_number.required">
									必須項目です
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="uk-grid" data-uk-grid>
					<div class="uk-width-1-1@m uk-first-column">
						<label class="uk-form-label" for="comment">
							<span class="contact_label">任意</span>コメント
						</label>
						<div class="uk-margin-small-top">
							<ScTextarea
								id="comment"
								v-model="$v.application_dt.comment.$model"
								:error-state="$v.application_dt.comment.$error"
								:validator="$v.application_dt.comment"
								placeholder=""
								mode="outline"
							>
							</ScTextarea>
						</div>
					</div>
				</div>
			</div>
			<div class="uk-padding-small uk-text-center">
				<button
					v-waves.button.light
					class="sc-button sc-button-secondary"
					:class="{'sc-button-progress': btnLoading}"
					:disabled="btnLoading"
					@click.prevent="saveApplication()"
				>
					<span v-if="!btnLoading">申込</span>
					<ScProgressCircular v-else light></ScProgressCircular>
				</button>
			</div>
		</div>
	</modal>
</template>
<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { CONST } from "~/const.js";
import { ScProgressCircular } from "~/components/ui/progress";
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs, integer } from "vuelidate/lib/validators";
export default {
	name: 'FairApplicationModal',
	components: {
		ScInput,
		ScTextarea,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		application_dt: {
			format: null,
			estimate_participant_number: null,
			comment: null
		},
	}),
	computed: {
		fairFormat () {
			return CONST.getCode("fair_format").filter((dt) => dt.value != CONST.fair_format.INDIVIDUAL.value);
		},
	},
	mounted () {
	},
	methods: {
		beforeOpen (event) {
			this.fair_dt = event.params;
			this.application_dt.format = null;
			this.application_dt.format = null;
			this.application_dt.estimate_participant_number = null;
			this.application_dt.comment = null;
			this.$nextTick(() => { this.$v.$reset() });
		},
		beforeClose (event) {
		},
		async saveApplication () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}
			let res;
			this.btnLoading = true;
			this.application_dt.school_id = this.$store.state.user.organization_id;
			this.application_dt.fair_id = this.fair_dt.fair_id;
			this.application_dt.application_status = CONST.application_status.APPLYING.value;
			if (this.fair_dt.applied_application) {
				this.application_dt.application_id = this.fair_dt.applied_application.application_id;
				res = await this.$axios.put(`/api/fairApplication`, this.application_dt);
			}
			else {
				res = await this.$axios.post(`/api/fairApplication`, this.application_dt);
			}
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
          		await this.$emit('update');
				UIkit.notification("申し込みました");
				this.$modal.hide('modal-application');

			}
			this.btnLoading = false;
		},
	},
	validations: {
		application_dt: {
			format: {
				required
			},
			estimate_participant_number: {
				required,
				integer
			},
			comment: {
			},
		}
	}
}
</script>

<style scoped lang="scss">
</style>

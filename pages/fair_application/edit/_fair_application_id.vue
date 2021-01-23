<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/fair_application/">
							説明会申込履歴
						</nuxt-link>
					</li>
					<li>
						<span>
							編集画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>説明会申込情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="format">
											<span class="contact_label required">必須</span>説明会形式
										</label>
										<div class="uk-form-controls ">
											<client-only>
												<Select2
													id="format"
													v-model="$v.application_dt.fair_application.format.$model"
													:error-state="$v.application_dt.fair_application.format.$error"
													:validator="$v.application_dt.fair_application.format"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in fairFormats"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
												<ul class="sc-vue-errors">
													<li v-if="!$v.application_dt.fair_application.format.required">
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
										<div class="uk-form-controls ">
											<ScInput
												id="estimate_participant_number"
												v-model="$v.application_dt.fair_application.estimate_participant_number.$model"
												:error-state="$v.application_dt.fair_application.estimate_participant_number.$error"
												:validator="$v.application_dt.fair_application.estimate_participant_number"
												placeholder="1,000"
												mode="outline"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.application_dt.fair_application.estimate_participant_number.required">
													必須項目です
												</li>
												<li v-if="!$v.application_dt.fair_application.estimate_participant_number.integer">
													数値を入力してください
												</li>
												<li v-if="!$v.application_dt.fair_application.estimate_participant_number.maxLength">
													入力可能桁数を超過しています
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
										<div class="uk-form-controls">
											<ScTextarea
												id="comment"
												v-model="$v.application_dt.fair_application.comment.$model"
												:error-state="$v.application_dt.fair_application.comment.$error"
												:validator="$v.application_dt.fair_application.comment"
												placeholder=""
												mode="outline"
											>
											</ScTextarea>
											<ul class="sc-vue-errors">
												<li v-if="!$v.application_dt.fair_application.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
								<span>説明会情報</span>
							</h4>
							<div>
								<div>
									<table class="uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>{{ application_dt.fair.organization.organization_name }}</td>
											</tr>
											<!-- <tr>
												<th class="uk-width-medium">
													病院種別
												</th>
												<td>hospital_type</td>
											</tr> -->
											<tr>
												<th class="uk-width-medium">
													説明会種別
												</th>
												<td>
													<ul class="uk-list">
														<li v-for="fairType in fairTypes" :key="fairType.value">
															<label>
																<input
																	:checked="checkedTest(fairType.value)"
																	class="uk-checkbox"
																	type="checkbox"
																	disabled="disabled"
																	:value="fairType.value"
																>
																{{ fairType.text }}
															</label>
														</li>
													</ul>
												</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													受付開始日
												</th>
												<td>{{ application_dt.fair.plan_start_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													受付終了日
												</th>
												<td>{{ application_dt.fair.plan_end_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													説明会状態
												</th>
												<td>{{ application_dt.fair.fair_status | view("fair_status") }}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button sc-button-secondary"
									:class="{'sc-button-progress': btnLoading}"
									:disabled="btnLoading"
									@click.prevent="saveApplication()"
								>
									<span v-if="!btnLoading">変更</span>
									<ScProgressCircular v-else light></ScProgressCircular>
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength, email, sameAs, integer } from "vuelidate/lib/validators";
import { ScProgressCircular } from "~/components/ui/progress";
export default {
	components: {
		ScInput,
		ScTextarea,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
	}),
	computed: {
		fairFormats () {
			return CONST.getCode("fair_format").filter((dt) => dt !== CONST.fair_format.INDIVIDUAL);
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		},
	},
	async asyncData ( {app, params} ) {
		let application_dt = {
			fair_application: {
				format: null,
				estimate_participant_number: null,
				comment: null
			}
		};
		let { data, error } = await app.$axios.get(`/api/fairApplication/${params.fair_application_id}`);
		if (error) {
			return { application_dt: application_dt };
		} else {
			return { application_dt: Object.assign(application_dt, data) };
		}
	},
	methods: {
		checkedTest (value) {
			return this.application_dt.fair.fair_type.some((dt) => dt === value);
		},
		async saveApplication () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}
			this.btnLoading = true;
			let res = await this.$axios.put(`/api/fairApplication`, this.application_dt.fair_application);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
				this.btnLoading = false;
			} else {
				UIkit.notification("変更しました");
				this.$router.go(-1);
			}
		},
	},
	validations: {
		application_dt: {
			fair_application: {
				format: {
					required,
				},
				estimate_participant_number: {
					required,
					integer,
					maxLength: maxLength(7)

				},
				comment: {
					maxLength: maxLength(3000)
				},

			},
		},
	}
}
</script>

<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>基本情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-2@m uk-first-column">
										<label class="uk-form-label" for="organization_name">
											<span class="contact_label required">必須</span>学校名
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="organization_name"
												v-model="$v.profile_dt.organization_name.$model"
												:error-state="$v.profile_dt.organization_name.$error"
												:validator="$v.profile_dt.organization_name"
												placeholder="学校名"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.organization_name.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.organization_name.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<label class="uk-form-label" for="organization_name_kana">
											<span class="contact_label required">必須</span>学校名フリガナ
										</label>
										<div class="uk-form-controls">
											<div>
												<ScInput
													id="organization_name_kana"
													v-model="$v.profile_dt.organization_name_kana.$model"
													:error-state="$v.profile_dt.organization_name_kana.$error"
													:validator="$v.profile_dt.organization_name_kana"
													placeholder="ガッコウメイ"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.profile_dt.organization_name_kana.required">
														必須項目です
													</li>
													<li v-if="!$v.profile_dt.organization_name_kana.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="prefecture">
											<span class="contact_label required">必須</span>住所
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="prefecture"
													v-model="$v.profile_dt.prefecture.$model"
													:error-state="$v.profile_dt.prefecture.$error"
													:validator="$v.profile_dt.prefecture"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '都道府県', allowClear: true }"
												>
													<option
														v-for="prefecture in prefecture_list"
														:key="prefecture"
														:value="prefecture"
													>
														{{ prefecture }}
													</option>
												</Select2>
												<ul class="sc-vue-errors">
													<li v-if="!$v.profile_dt.prefecture.required">
														必須項目です
													</li>
												</ul>
											</client-only>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="city"
												v-model="$v.profile_dt.city.$model"
												:error-state="$v.profile_dt.city.$error"
												:validator="$v.profile_dt.city"
												placeholder="市区町村"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.city.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.city.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
									<div class="uk-width-1-2@m uk-margin-medium-top">
										<div class="uk-first-column ">
											<ScInput
												id="address"
												v-model="$v.profile_dt.address.$model"
												:error-state="$v.profile_dt.address.$error"
												:validator="$v.profile_dt.address"
												placeholder="町名番地"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.address.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.address.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="homepage">
											<span class="contact_label">任意</span>HP
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="homepage"
												v-model="$v.profile_dt.homepage.$model"
												:error-state="$v.profile_dt.homepage.$error"
												:validator="$v.profile_dt.homepage"
												placeholder="https://example.com"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.homepage.url">
													形式が正しくありません
												</li>
												<li v-if="!$v.profile_dt.homepage.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="mail_address">
											<span class="contact_label required">必須</span>メールアドレス
										</label>
										<div class="uk-form-controls">
											<ScInput
												id="mail_address"
												v-model="$v.profile_dt.mail_address.$model"
												:error-state="$v.profile_dt.mail_address.$error"
												:validator="$v.profile_dt.mail_address"
												placeholder="info@example.jp"
												mode="outline"
											></ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.profile_dt.mail_address.required">
													必須項目です
												</li>
												<li v-if="!$v.profile_dt.mail_address.email">
													形式が正しくありません
												</li>
												<li v-if="!$v.profile_dt.mail_address.maxLength">
													入力可能桁数を超過しています
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<h4 class="uk-margin-large-top">
								<span>詳細情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="school_type">
											<span class="contact_label">任意</span>学校種別
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="school_type"
													v-model="$v.profile_dt.school_type.$model"
													:error-state="$v.profile_dt.school_type.$error"
													:validator="$v.profile_dt.school_type"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in schoolType"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="student_number">
											<span class="contact_label">任意</span>生徒数
										</label>
										<div class="uk-form-controls">
											<div>
												<ScInput
													id="student_number"
													v-model="$v.profile_dt.student_number.$model"
													:error-state="$v.profile_dt.student_number.$error"
													:validator="$v.profile_dt.student_number"
													placeholder="1,000"
													mode="outline"
												></ScInput>
												<ul class="sc-vue-errors">
													<li v-if="!$v.profile_dt.student_number.integer">
														数値を入力してください
													</li>
													<li v-if="!$v.profile_dt.student_number.maxLength">
														入力可能桁数を超過しています
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="scholarship_request">
											<span class="contact_label">任意</span>奨学金情報希望
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="scholarship_request"
													v-model="$v.profile_dt.scholarship_request.$model"
													:error-state="$v.profile_dt.scholarship_request.$error"
													:validator="$v.profile_dt.scholarship_request"

													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in scholarshipRequest"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="internship_request">
											<span class="contact_label">任意</span>インターン情報希望
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="internship_request"
													v-model="$v.profile_dt.internship_request.$model"
													:error-state="$v.profile_dt.internship_request.$error"
													:validator="$v.profile_dt.internship_request"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in internshipRequest"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="practice_request">
											<span class="contact_label">任意</span>実習情報希望
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="practice_request"
													v-model="$v.profile_dt.practice_request.$model"
													:error-state="$v.profile_dt.practice_request.$error"
													:validator="$v.profile_dt.practice_request"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true }"
												>
													<option
														v-for="data in practiceRequest"
														:key="data.value"
														:value="data.value"
													>
														{{ data.text }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
							</div>
							<div class="uk-margin-large-top uk-text-center">
								<button
									v-waves.button.light
									class="sc-button"
									:class="[ inputDiff === true ? 'sc-button-disabled' : 'sc-button-secondary' ]"
									:disabled="btnLoading || inputDiff"
									@click.prevent="saveProfile()"
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
import { ScProgressCircular } from "~/components/ui/progress";
import { CONST } from "~/const.js";
import { validationMixin } from "vuelidate";
import { required, email, minLength, maxLength, url, integer } from "vuelidate/lib/validators";
import _ from 'lodash';
export default {
	components: {
		ScInput,
		ScProgressCircular,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		profile_dt: {
			organization_name: '',
			organization_name_kana: '',
			prefecture: '',
			city: '',
			address: '',
			mail_address: '',
		}
	}),
	computed: {
		schoolType () {
			return CONST.getCode("school_type");
		},
		scholarshipRequest () {
			return CONST.getCode("scholarship_request");
		},
		internshipRequest () {
			return CONST.getCode("internship_request");
		},
		practiceRequest () {
			return CONST.getCode("practice_request");
		},
		prefecture_list () {
			return CONST.prefecture_list;
		},
		inputDiff () {
			return (
				this.pristine_profile_dt.organization_name === this.profile_dt.organization_name &&
				this.pristine_profile_dt.organization_name_kana === this.profile_dt.organization_name_kana &&
				this.pristine_profile_dt.prefecture === this.profile_dt.prefecture &&
				this.pristine_profile_dt.city === this.profile_dt.city &&
				this.pristine_profile_dt.address === this.profile_dt.address &&
				this.pristine_profile_dt.mail_address === this.profile_dt.mail_address &&
				this.pristine_profile_dt.school_type === this.profile_dt.school_type &&
				this.pristine_profile_dt.student_number === this.profile_dt.student_number &&
				this.pristine_profile_dt.homepage === this.profile_dt.homepage &&
				this.pristine_profile_dt.scholarship_request === this.profile_dt.scholarship_request &&
				this.pristine_profile_dt.internship_request === this.profile_dt.internship_request &&
				this.pristine_profile_dt.practice_request === this.profile_dt.practice_request ||
				this.profile_dt.organization_name === '' ||
				this.profile_dt.organization_name_kana === '' ||
				this.profile_dt.prefecture === '' ||
				this.profile_dt.city === '' ||
				this.profile_dt.address === '' ||
				this.profile_dt.mail_address === ''
			)
		},
	},
	async asyncData ( {app, params, store} ) {
		let profile_dt = {
			organization_id: null,
			organization_name: null,
			organization_name_kana: null,
			prefecture: null,
			city: null,
			address: null,
			mail_address: null,
			school_id: null,
			school_type: null,
			student_number: null,
			homepage: null,
			scholarship_request: null,
			internship_request: null,
			practice_request: null,
		}
		let { data, error } = await app.$axios.get(`/api/profile`);
		if (error) {
			return { profile_dt: profile_dt };
		} else {
			return {
				profile_dt: Object.assign(profile_dt, data),
				pristine_profile_dt: _.cloneDeep(data)
			};
		}
	},
	methods: {
		async saveProfile () {
			this.$v.$touch();
			if (this.$v.$invalid) {
				return;
			}

			let res;
			this.btnLoading = true;
			res = await this.$axios.put(`/api/profile`, this.profile_dt);
			if (res.error) {
				UIkit.notification("失敗しました", { status: "danger" });
			} else {
				await this.getProfile ();
				UIkit.notification("変更しました");
				this.$router.push('school_activity');
			}
			this.btnLoading = false;
		},
		async getProfile () {
			let { data, error } = await this.$axios.get(
				`/api/profile`
			);
			if (error) {
			} else {
				Object.assign(this.profile_dt, data);
				this.pristine_profile_dt = _.cloneDeep(data);
			}
		}
	},
	validations: {
		profile_dt: {
			organization_name: {
				required,
				maxLength: maxLength(128)
			},
			organization_name_kana: {
				required,
				maxLength: maxLength(128)
			},
			prefecture: {
				required
			},
			city: {
				required,
				maxLength: maxLength(32)
			},
			address: {
				required,
				maxLength: maxLength(128)
			},
			mail_address: {
				required,
				maxLength: maxLength(128),
				email
			},
			school_type: {
			},
			student_number: {
				maxLength: maxLength(7),
				integer
			},
			homepage: {
				maxLength: maxLength(128),
				url
			},
			scholarship_request: {
			},
			internship_request: {
			},
			practice_request: {
			},
		}
	}
}
</script>

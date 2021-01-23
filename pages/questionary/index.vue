<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<form class="uk-form-stacked">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>アンケート情報</span>
							</h4>
							<div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="fair_type">
											<span class="contact_label">任意</span>希望説明会種別
										</label>
										<div class="uk-form-controls">
											<ul class="uk-list uk-margin-remove">
												<li v-for="(data, index) in fairTypes"
													:key="index"
												>
													<label>
														<input
															v-model="$v.questionary.append_information.$model"
															:error-state="$v.questionary.append_information.$error"
															:validator="$v.questionary.append_information"
															class="uk-checkbox"
															:value="data.value"
															type="checkbox"
														>{{ data.text }}
													</label>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m" uk-first-column>
										<label class="uk-form-label" for="desire_at">
											<span class="contact_label">任意</span>希望実施期間
										</label>
										<div class="uk-form-controls">
											<div class="uk-grid">
												<div class="uk-width-2-5@s uk-margin-small-top uk-first-column">
													<ScInput
														id="desire_start_at"
														v-model="$v.questionary.desire_start_at.$model"
														v-flatpickr="dpTimePicker"
														:error-state="$v.questionary.desire_start_at.$error"
														:validator="$v.questionary.desire_start_at"
														mode="outline"
													>
														<label>希望開始日</label>
													</ScInput>
												</div>
												<div class="flexmiddle uk-margin-small-top ">
													~
												</div>
												<div class="uk-width-2-5@s uk-margin-small-top ">
													<ScInput
														id="desire_end_at"
														v-model="$v.questionary.desire_end_at.$model"
														v-flatpickr="dpTimePicker"
														:error-state="$v.questionary.desire_end_at.$error"
														:validator="$v.questionary.desire_end_at"
														mode="outline"
													>
														<label>希望終了日</label>
													</ScInput>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="hospital_id">
											<span class="contact_label">任意</span>希望病院
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="hospital_id"
													v-model="$v.questionary.hospital_id.$model"
													:error-state="$v.questionary.hospital_id.$error"
													:validator="$v.questionary.hospital_id"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true, 'closeOnSelect': false }"
													multiple
												>
													<option
														v-for="data in hospital_dtlist"
														:key="data.organization_id"
														:value="data.organization_id"
													>
														{{ data.organization_name }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="address"><span class="contact_label">任意</span>希望地域</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="prefecture"
													v-model="$v.questionary.prefecture.$model"
													class="uk-select2"
													:error-state="$v.questionary.prefecture.$error"
													:validator="$v.questionary.prefecture"
													:settings="{ 'width': '100%', 'placeholder': '都道府県', allowClear: true, 'closeOnSelect': false }"
													multiple
												>
													<option
														v-for="prefecture in prefectureList"
														:key="prefecture"
														:value="prefecture"
													>
														{{ prefecture }}
													</option>
												</Select2>
											</client-only>
										</div>
									</div>
								</div>
								<div class="uk-grid" data-uk-grid>
									<div class="uk-width-1-1@m uk-first-column">
										<label class="uk-form-label" for="school_type">
											<span class="contact_label">任意</span>希望病院種別
										</label>
										<div class="uk-form-controls">
											<client-only>
												<Select2
													id="hospital_type"
													v-model="$v.questionary.hospital_type.$model"
													:error-state="$v.questionary.hospital_type.$error"
													:validator="$v.questionary.hospital_type"
													class="uk-select2"
													:settings="{ 'width': '100%', 'placeholder': '選択してください', minimumResultsForSearch: -1, allowClear: true, 'closeOnSelect': false }"
													multiple
												>
													<option
														v-for="data in hospitalType"
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
										<label class="uk-form-label" for="comment">
											<span class="contact_label">任意</span>コメント
										</label>
										<div class="uk-form-controls">
											<div>
												<ScTextarea
													id="comment"
													v-model="$v.questionary.comment.$model"
													:error-state="$v.questionary.comment.$error"
													:validator="$v.questionary.comment"
													mode="outline"
												>
												</ScTextarea>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div class="uk-margin-large-top uk-text-center">
								<button id="form-submit"
									class="sc-button"
									:class="[ isNothingInput === false ? 'sc-button-secondary' : 'sc-button-disabled' ]"
									:disabled="isNothingInput"
									@click.prevent="openConfirmModal()"
								>
									登録
								</button>
							</div>
						</form>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
		<client-only>
			<ConfirmModal @afterSave="afterSave()">
			</ConfirmModal>
		</client-only>
	</div>
</template>

<script>
import ScInput from '~/components/ui/Input'
import ScTextarea from '~/components/ui/Textarea'
import { CONST } from "~/const.js"
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import { Japanese } from "flatpickr/dist/l10n/ja.js"
import { validationMixin } from "vuelidate";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import ConfirmModal from '~/components/pages/questionary/ConfirmModal.vue'

if(process.client) {
	require('~/plugins/flatpickr');
}
export default {
	components: {
		ScInput,
		ScTextarea,
		Select2: process.client ? () => import('~/components/ui/Select2') : null,
		ConfirmModal,
	},
	mixins: [validationMixin],
	data: () => ({
		btnLoading: false,
		questionary: {
			append_information: [],
			desire_start_at: '',
			desire_end_at: '',
			hospital_id: [],
			prefecture: [],
			hospital_type: [],
			comment: '',
		},
		Japanese,
	}),
	computed: {
		dpTimePicker () {
			const self = this;
	    	return {
				locale: self.Japanese,
				enableTime: false,
				time_24hr: false,
				plugins: [new confirmDatePlugin({
					confirmIcon: "<i class='mdi mdi-check'></i>",
					confirmText: ""
				})],
				dateFormat: "Y-m-d",
			}
		},
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		hospitalType () {
			return CONST.getCode("hospital_type");
		},
		prefectureList () {
			return CONST.prefecture_list;
		},
		hospitalId () {
			return CONST.getCode("hospital_id");
		},
		isNothingInput () {
			if(this.questionary.append_information.length === 0
				&& this.questionary.desire_start_at === ''
				&& this.questionary.desire_end_at === ''
				&& this.questionary.hospital_id.length === 0
				&& this.questionary.prefecture.length === 0
				&& this.questionary.hospital_type.length === 0
				&& this.questionary.comment === '') {
				return true;
			}
			return false;
		},
	},
	async asyncData ( {app, params, error} ) {
		let { data } = await app.$axios.get(`/api/hospital`);
		return { hospital_dtlist: data }
	},
	methods: {
		openConfirmModal () {
			this.$modal.show('modal-confirm', this.questionary);
		},
		afterSave () {
			this.questionary.append_information = [];
			this.questionary.desire_start_at = '';
			this.questionary.desire_end_at = '';
			this.questionary.hospital_id = [];
			this.questionary.prefecture = [];
			this.questionary.hospital_type = [];
			this.questionary.comment = '';
		},
	},
	validations: {
		questionary: {
			append_information: {
			},
			desire_start_at: {
			},
			desire_end_at: {
			},
			hospital_id: {
			},
			prefecture: {
			},
			hospital_type: {
			},
			comment: {
			},
		}
	}
}
</script>

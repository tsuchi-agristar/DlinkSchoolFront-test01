<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar">
			<div class="sc-top-bar-content uk-flex uk-flex-middle uk-width-1-1">
				<ul class="uk-breadcrumb uk-breadcrumb-alt uk-margin-remove uk-flex uk-flex-middle">
					<li>
						<nuxt-link to="/fair/">
							説明会一覧
						</nuxt-link>
					</li>
					<li>
						<span>
							詳細画面
						</span>
					</li>
				</ul>
			</div>
		</div>
		<div id="sc-page-content" class="uk-flex-center uk-grid uk-grid-stack">
			<div class="uk-width-2-3@l uk-first-column">
				<ScCard>
					<ScCardBody>
						<div class="uk-form-horizontal">
							<h4 class="bold uk-heading-divider c_blue01">
								<span>予定情報</span>
							</h4>
							<div>
								<div class="uk-overflow-auto">
									<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider">
										<tbody>
											<tr>
												<th class="uk-width-medium">
													病院名
												</th>
												<td>{{ fair_dt.organization_name }}</td>
											</tr>
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
												<td>{{ fair_dt.plan_start_at }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													受付終了日
												</th>
												<td>{{ fair_dt.plan_end_at }}</td>
											</tr>
											<tr>
												<th class="uk-width-medium">
													申込状態
												</th>
												<td v-if="fair_dt.applied_application">
													<span>{{ fair_dt.applied_application.application_status | view('application_status') }}</span>
												</td>
												<td v-else>
													<span>未申込</span>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<FairAppendDetail
								:fair_dt="fair_dt"
							></FairAppendDetail>
							<div v-if="fair_recruting(fair_dt.fair_status)" class="uk-margin-large-top uk-text-center">
								<a v-if="isShowApplicationButton(fair_dt.applied_application)"
									id="form-submit"
									class="sc-button sc-button-secondary waves-effect waves-button waves-light"
									@click="openApplicationModal(fair_dt)"
								>
									申込
								</a>
								<a v-else
									id="form-submit"
									class="sc-button sc-button-secondary waves-effect waves-button waves-light"
									@click="openApplicationCancelModal(fair_dt)"
								>
									キャンセル
								</a>
							</div>
							<client-only>
								<FairApplicationModal
									@update="getApplication()"
								></FairApplicationModal>
								<FairApplicationCancelModal
									@update="getApplication()"
								></FairApplicationCancelModal>
							</client-only>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>
<script>
import { CONST } from '~/const.js';
import FairAppendDetail from "~/components/pages/FairAppendDetail.vue";
import FairApplicationModal from "~/components/pages/fair/FairApplicationModal.vue";
import FairApplicationCancelModal from "~/components/pages/fair/FairApplicationCancelModal.vue";
export default {
	components: {
		FairAppendDetail,
		FairApplicationModal,
		FairApplicationCancelModal
	},
	data: () => ({
	}),

	computed: {
		fairTypes () {
			return CONST.getCode("fair_type");
		},
	},
	async asyncData ( {app, params, error, store} ) {
		let { data } = await app.$axios.get(`/api/fair/${params.fair_id}`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return { fair_dt: data }
	},
	methods: {
		isShowApplicationButton (applied_application) {
			return !applied_application
				|| applied_application.application_status == CONST.application_status.CANCEL.value
				|| applied_application.application_status == CONST.application_status.REJECT.value
		},
		fair_recruting (val) {
			return val === CONST.fair_status.RECRUITING.value;
		},
		openApplicationModal (value) {
			this.$modal.show('modal-application', value);
		},
		openApplicationCancelModal (value) {
			this.$modal.show('modal-application-cancel', value);
		},
		async getApplication () {
			let { data, error } = await this.$axios.get(`/api/fair/${this.$route.params.fair_id}`);
			if (error) {
			} else {
				console.log(data)
				this.fair_dt = data;
			}
		},
		checkedTest (value) {
			return this.fair_dt.fair_type.some((dt) => dt === value);
		},
		isScholarship (data) {
			return data.append_information_type === CONST.append_information_type.SCHOLARSHIP.value;
		},
		isIntership (data) {
			return data.append_information_type === CONST.append_information_type.INTERSHIP.value;
		},
		isPractice (data) {
			return data.append_information_type === CONST.append_information_type.PRACTICE.value;
		},
		isInfo (data) {
			return data.append_information_type === CONST.append_information_type.INFO.value;
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

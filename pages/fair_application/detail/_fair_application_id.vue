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
						<h4 class="bold uk-heading-divider c_blue01">
							<span>説明会申込情報</span>
						</h4>
						<div>
							<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider uk-margin-remove">
								<tbody>
									<tr>
										<th class="uk-width-medium">
											説明会形式
										</th>
										<td>{{ fair_application_dt.fair_application.format | view('fair_format') }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											申込状態
										</th>
										<td>{{ fair_application_dt.fair_application.application_status | view('application_status') }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											参加予定人数
										</th>
										<td>{{ fair_application_dt.fair_application.estimate_participant_number }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											コメント
										</th>
										<td>{{ fair_application_dt.fair_application.comment }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<h4 class="bold bold uk-heading-divider c_blue01 uk-margin-large-top">
							<span>説明会情報</span>
						</h4>
						<div>
							<table class="table-word-break-all uk-table-detail uk-table uk-table-responsive uk-table-divider uk-margin-remove">
								<tbody>
									<tr>
										<th class="uk-width-medium">
											病院名
										</th>
										<td>{{ fair_application_dt.fair.organization.organization_name }}</td>
									</tr>
									<!-- <tr>
										<th class="uk-width-medium">
											病院種別
										</th>
										<td>{{ fair_application_dt.fair.hospital_type | view('hospital_type') }}</td>
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
										<td>{{ fair_application_dt.fair.plan_start_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											受付終了日
										</th>
										<td>{{ fair_application_dt.fair.plan_end_at | formatTzToAsiaTokyo("YYYY/MM/DD") }}</td>
									</tr>
									<tr>
										<th class="uk-width-medium">
											説明会状態
										</th>
										<td>{{ fair_application_dt.fair.fair_status | view('fair_status') }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div v-if="isViewEditButton" class="uk-margin-large-top uk-text-center">
							<nuxt-link :to="`/fair_application/edit/${$route.params.fair_application_id}`">
								<input id="form-submit"
									class="sc-button sc-button-secondary waves-effect waves-button waves-light"
									type="submit"
									value="編集"
								>
							</nuxt-link>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>

<script>
import { CONST } from '~/const.js';

export default {
	components: {
	},
	data: () => ({
	}),
	computed: {
		fairTypes () {
			return CONST.getCode("fair_type");
		},
		isViewEditButton () {
			return this.fair_application_dt.fair.fair_status === CONST.fair_status.RECRUITING.value;
		}
	},
	async asyncData ( {app, params} ) {
		let { data } = await app.$axios.get(`/api/fairApplication/${params.fair_application_id}`);
		return {
			fair_application_dt: data
		}
	},
	methods: {
		checkedTest (value) {
			return this.fair_application_dt.fair.fair_type.some((dt) => dt === value);
		},
	}
}
</script>

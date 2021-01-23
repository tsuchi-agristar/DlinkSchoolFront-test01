<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								説明会一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<div class="uk-text-center">
						{{ "登録件数：" + fair_dtlists.length + "件" }}<br><br>
					</div>
					<VueGoodTable
						:columns="columns"
						:rows="fair_dtlists"
						:pagination-options="{
							mode: 'pages',
							enabled: true,
							rowsPerPageLabel: '表示件数',
							nextLabel: '次へ',
							prevLabel: '前へ',
							pageLabel: '',
							ofLabel: 'ページ目を表示中 / ',
							perPageDropdown: [10,25,50,100],
							dropdownAllowAll: false,
						}"
						style-class="uk-table uk-table-divider scutum-vgt uk-table-middle uk-table-striped"
						:search-options="{
							enabled: false
						}"
						:sort-options="{
							enabled: true,
						}"
					>
						<div slot="emptystate" class="uk-text-center">
							該当データはありません
						</div>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'hospital_type' || props.column.field === 'fair_status'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'fair_type'">
								<span
									v-for="(item, index) in props.formattedRow[props.column.field]"
									:key="index"
								>
									<span v-if="item === scholarship" class="uk-label label_type scholarship">奨学金</span>
									<span v-else-if="item === intership" class="uk-label label_type intership">インターン</span>
									<span v-else-if="item === practice" class="uk-label label_type practice">実習</span>
									<span v-else-if="item === info" class="uk-label label_type hospital_fair_type">病院説明</span>
								</span>
							</span>
							<span v-else-if="props.column.field === 'plan_start_at' || props.column.field === 'plan_end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo("YYYY/MM/DD") }}
							</span>
							<span v-else-if="props.column.field === 'application_count'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
							</span>
							<span v-else-if="props.column.field === 'applied_application.application_status'">
								{{ !props.formattedRow[props.column.field] ? "未申込" : props.formattedRow[props.column.field] | view('application_status') }}
							</span>
							<span v-else-if="props.column.field === 'action'">
								<div data-uk-margin>
									<div class="uk-inline">
										<button class="md-bg-white sc-button sc-button-icon sc-button-outline sc-button-mini" type="button">
											<span data-uk-icon="cog" class="w14"></span>
										</button>
										<div data-uk-dropdown pos="top-left">
											<ul class="uk-nav uk-dropdown-nav">
												<li v-if="fair_recruting(props.row.fair_status) && isShowApplicationButton(props.row.applied_application)">
													<a @click="openApplicationModal(props.row)"><span>申込</span></a>
												</li>
												<li v-else-if="fair_recruting(props.row.fair_status)">
													<a @click="openApplicationCancelModal(props.row)"><span>キャンセル</span></a>
												</li>
												<li>
													<nuxt-link :to="`/fair/detail/${props.row.fair_id}`"><span>詳細</span></nuxt-link>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</span>
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
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
</template>
<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { CONST } from "~/const.js";
import FairApplicationModal from "~/components/pages/fair/FairApplicationModal.vue";
import FairApplicationCancelModal from "~/components/pages/fair/FairApplicationCancelModal.vue";
export default {
	components: {
		VueGoodTable,
		FairApplicationModal,
		FairApplicationCancelModal
	},
	data: () => ({
		fair_dt: {
			oranization_name: null
		},
	}),
	computed: {
		scholarship () {
			return CONST.fair_type.SCHOLARSHIP.value;
		},
		intership () {
			return CONST.fair_type.INTERSHIP.value;
		},
		practice () {
			return CONST.fair_type.PRACTICE.value;
		},
		info () {
			return CONST.fair_type.INFO.value;
		},
		columns () {
			return [
				{
					label: '操作',
					field: 'action',
					sortable: false,
					tdClass: 'uk-text-nowrap',
				},
				{
					label: '申込状態',
					field: 'applied_application.application_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("application_status")
					}
				},
				{
					label: '説明会状態',
					field: 'fair_status',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_status")
					}
				},
				{
					label: '病院名',
					field: 'organization_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '病院名',
					}
				},
				{
					label: '住所',
					field: 'address',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '住所'
					}
				},
				{
					label: '病院種別',
					field: 'hospital_type',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("hospital_type")
					}
				},
				{
					label: '説明会内容',
					field: 'fair_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode("fair_type"),
						filterFn: this.fairTypeFilterFn
					}
				},
				{
					label: '受付開始日',
					field: 'plan_start_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00'
					}
				},
				{
					label: '受付終了日',
					field: 'plan_end_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00'
					}
				},
				{
					label: '申込件数',
					field: 'application_count',
					thClass: 'bghover01 pointer',
					type: 'number',
					filterOptions: {
						enabled: false,
						placeholder: '100,0000'
					}
				}
			]
		}
	},
	async asyncData ( {app} ) {
		let { data } = await app.$axios.get(`/api/fair`)
			.catch((e) =>  {
				return { 'data': {} };
			})
		return {
			fair_dtlists: data,
		}
	},
	methods: {
		fair_recruting (val) {
			return val === CONST.fair_status.RECRUITING.value;
		},
		isShowApplicationButton (applied_application) {
			return !applied_application
				|| applied_application.application_status == CONST.application_status.CANCEL.value
				|| applied_application.application_status == CONST.application_status.REJECT.value
		},
		openApplicationModal (value) {
			this.$modal.show('modal-application', value);
		},
		openApplicationCancelModal (value) {
			this.$modal.show('modal-application-cancel', value);
		},
		fairTypeFilterFn (data, filterString) {
			return data.some( (val) => {
				return val === filterString;
			})
		},
		appliedApplicationFilterFn (data, filterString) {
			return !data ? filterString === '0' : data.application_status === filterString;
		},
		async getApplication () {
			let { data, error } = await this.$axios.get(
				`/api/fair`
			);
			if (error) {
			} else {
				this.fair_dtlists = data;
			}
		},
		setData (data) {
			this.fair_dt = data;
		},
	},
}
</script>

<style scoped lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>

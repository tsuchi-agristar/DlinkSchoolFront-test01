<template>
	<div id="sc-page-wrapper" class="table_nowrap min_w80">
		<div id="sc-page-content">
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
						<div class="uk-flex-1">
							<ScCardTitle>
								チャンネル一覧
							</ScCardTitle>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="channel_dtlists"
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
							<span v-if="props.column.field === 'action'">
								<div data-uk-margin>
									<div class="uk-inline">
										<button class="md-bg-white sc-button sc-button-icon sc-button-outline sc-button-mini" type="button">
											<span data-uk-icon="cog" class="w14"></span>
										</button>
										<div data-uk-dropdown pos="top-left">
											<ul class="uk-nav uk-dropdown-nav">
												<li>
													<nuxt-link :to="`/channel/detail/${props.row.event_id}`"><span>詳細</span></nuxt-link>
												</li>
											</ul>
										</div>
									</div>
								</div>
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
							<span v-else-if="props.column.field === 'event_type' || props.column.field === 'channel_mode'">
								{{ props.formattedRow[props.column.field] | view(props.column.field) }}
							</span>
							<span v-else-if="props.column.field === 'start_at' || props.column.field === 'end_at'">
								{{ props.formattedRow[props.column.field] | formatTzToAsiaTokyo(("YYYY/MM/DD HH:mm")) }}
							</span>
							<span v-else-if="props.column.field === 'member_count'">
								{{ props.formattedRow[props.column.field] | formatNumber }}
							</span>
							<!-- <span v-else-if="props.column.field === 'entring'">
								<div class="uk-first-column">
									<a
										class="font12 sc-button min_w80 md-color-white sc-button-small sc-button-secondary waves-effect waves-button"
										@click="openEnterModal(props.row)"
									>
										入室
									</a>
								</div>
							</span> -->
							<template v-else>
								{{ props.formattedRow[props.column.field] }}
							</template>
						</template>
					</VueGoodTable>
				</ScCardBody>
			</ScCard>
		</div>
		<client-only>
			<EnterModal>
			</EnterModal>
		</client-only>
	</div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { CONST } from '~/const.js';
import EnterModal from "~/components/pages/channel/EnterModal.vue";
export default {
	components: {
		VueGoodTable,
		EnterModal
	},
	data: () => ({
		event_dt: {},
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
					label: '説明会形式',
					field: 'event_type',
					sortable: false,
					filterOptions: {
						enabled: true,
						placeholder: '選択',
						filterDropdownItems: CONST.getCode('event_type')
					}
				},
				{
					label: '主催者',
					field: 'owner_name',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: true,
						placeholder: '主催者',
					}
				},
				{
					label: '説明会種別',
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
					label: '開始日時',
					field: 'start_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00',
					}
				},
				{
					label: '終了日時',
					field: 'end_at',
					thClass: 'bghover01 pointer',
					filterOptions: {
						enabled: false,
						placeholder: '2020/01/01　00：00',
					}
				},
			]
		}
	},
	async asyncData ( {app} ) {
		let channel_dtlists = null;
		let { data } = await app.$axios.get(`/api/channel`)
			.catch((e) =>  {
				return channel_dtlists;
			})
		return { channel_dtlists: data }
	},
	mounted () {
		this.$store.commit('setIsThroughChannel');
	},
	methods: {
		openEnterModal (value) {
			this.$modal.show('modal-enter-channel', value);
		},
		fairTypeFilterFn (data, filterString) {
			return data.some( (val) => {
				return val === filterString;
			})
		}
	}
}
</script>
<style lang="scss">
	@import '~scss/plugins/vue-good-table.scss';
</style>

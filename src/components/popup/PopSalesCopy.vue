<template>
    <card class="mb-0">
        <div slot="header">
            <h4 class="card-title d-inline-block">복사저장 설정</h4>
        </div>
        <div class="box mb-3">
            <DatePicker id="COPY_DAY"
                        label="매출일자 선택 :"
                        :model="model"
                        wrap-classes="d-inline-block"/>
        </div>
        <div class="box mb-3">
            <b-input-group>
                <b-form-input v-model="postData.keyword"
                              ref="keyword"
                              placeholder="검색어를 입력해주세요"
                              @keyup.enter.native="fnGetData">
                </b-form-input>
                <b-input-group-button>
                    <b-btn variant="outline-success" @click="fnGetData">
                        <font-awesome-icon icon="search"/>
                    </b-btn>
                </b-input-group-button>
            </b-input-group>
        </div>
        <div id="loader-container">
            <ResultTable :hotOptions="hotOptions" @addLoad="doSearch" @rowClick="fnProdClick"/>
        </div>
        <div class="mt-3 text-right" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </card>
</template>

<script>
    import {customer} from '../../api/index'
    import Common from '../mixin/common'
    import _find from 'lodash/find'
    import _get from 'lodash/get'

    import DatePicker from '../inputs/DatePicker.vue'
    import ResultTable from './ResultTable.vue'

    export default {
        name: 'PopSalesCopy',
        mixins: [Common],
        props: {
            model: Object
        },
        components: {
            DatePicker,
            ResultTable
        },
        data () {
            return {
                isInit: false,
                isLoading: false,
                hotOptions: {
                    init: false,
                    data: [],
                    model: {
                        REG_NO: undefined,
                        VIEW_CODE: undefined,
                        CUSTOMER_CODE: undefined,
                        CUSTOMER_NAME: undefined,
                        C_AGENT_NO: undefined,
                        CEO_NAME: undefined,
                        MEMBER_CODE: undefined,
                        TEL: undefined,
                        CUSTOMER_BC: {
                            NOW_BC: undefined
                        },
                        CREDIT_BC: undefined,
                        BILL_PERCENT: undefined,
                        BILL_TRANSFER: undefined,
                        BANK_INFO: undefined
                    },
                    colWidths: [
                        70, 130, 80, 70, 70, 80, 80
                    ],
                    colHeaders: [
                        '코드', '거래처명', '사업자번호', '대표자', '담당사원', '전화번호', '잔고'
                    ],
                    columns: [
                        {data: 'VIEW_CODE', type: 'text', readOnly: true},
                        {data: 'CUSTOMER_NAME', type: 'text', readOnly: true},
                        {data: 'C_AGENT_NO', type: 'text', readOnly: true},
                        {data: 'CEO_NAME', type: 'text', readOnly: true},
                        {data: 'MEMBER_NAME', type: 'text', readOnly: true},
                        {data: 'TEL', type: 'text', readOnly: true},
                        {
                            data: 'CUSTOMER_BC.NOW_BC',
                            type: 'numeric',
                            numericFormat: {pattern: '0,0[00]'},
                            readOnly: true
                        }
                    ]
                },
                fetchState: null,
                fetchText: {
                    noResults: '조회결과가 없습니다.',
                    noMore: '모든 거래처를 조회했습니다.',
                    error: '조회에 실패하였습니다.'
                },
                postData: {
                    trade_type: 'SALES',
                    member_code: this.$store.state.USER_CODE,
                    with_balance: true,
                    customer_type1: null,
                    keyword: '',
                    offset: 0,
                    max: 25
                }
            }
        },
        computed: {
            getPostData () {
                return this.postData
            },
        },
        methods: {
            fnProdClick (row) {
                this.$emit('get-data', row)
            },
            fnGetData () {
                // 조회상태 초기화
                this.fetchState = null

                // 데이터 초기화
                this.hotOptions.init = false
                this.hotOptions.data = []

                // 페이지 정보 초기화
                this.postData.page = 1
                this.postData.offset = 0
                this.doSearch()
            },
            doSearch () {
                if (this.fetchState) return
                if (this.isLoading) return

                this.isLoading = true
                const loader = this.$common.getLoader(this)

                const postData = this.getPostData
                customer.fetch(postData).then((data) => {
                    let resCnt = data.list.length
                    if (resCnt <= 0) {
                        this.fetchState = 'noResults'
                        this.$toasted.show(this.fetchText.noResults)
                    } else {
                        const getAgentMemberList = this.$store.state.AGENT_MEMBER_LIST
                        data.list.forEach((e, i) => {
                            e.MEMBER_NAME = _get(_find(getAgentMemberList, {value: e.MEMBER_CODE}), 'name')
                        })

                        this.hotOptions.data = this.hotOptions.data.concat(data.list)
                        this.postData.offset = postData.offset + postData.max
                        if (resCnt < postData.max) {
                            this.fetchState = 'noMore'
                            this.$toasted.show(this.fetchText.noMore)
                        } else {
                            this.fetchState = null
                        }
                    }

                    this.isLoading = false
                    loader.hide()

                    if (!this.isInit) {
                        this.isInit = true
                        // this.$refs.keyword.$el.focus()
                    }
                }).catch((err) => {
                    this.isLoading = false
                    loader.hide()

                    this.$snotify.error('거래처 목록 조회 실패', this.$common.parseErrorMsg(err))
                })
            }
        },
        mounted () {
            // input focus
            setTimeout(() => {
                this.$refs.keyword.$el.focus()
            }, 300)
        }
    }
</script>

<style scoped>
    #loader-container {
        max-height: 400px;
    }
</style>

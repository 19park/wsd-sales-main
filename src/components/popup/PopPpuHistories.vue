<template>
    <card class="mb-0">
        <div slot="header">
            <h4 class="card-title d-inline-block">단가이력 조회</h4>
        </div>
        <div id="loader-container">
            <ResultTable :hotOptions="hotOptions" :isLoad="false" @rowClick="fnProdClick"/>
        </div>
        <div class="mt-3 text-right" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </card>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import {sales} from '../../api/index'
    import Common from '../mixin/common'
    import _assign from 'lodash/assign'

    import ResultTable from './ResultTable.vue'

    export default {
        name: 'PopPpuHistories',
        mixins: [Common],
        props: {
            state: Object
        },
        components: {
            ResultTable
        },
        data () {
            return {
                isInit: false,
                hotOptions: {
                    init: false,
                    data: [],
                    model: {
                        BOX_AMOUNT: null,
                        ITEM_AMOUNT: null,
                        SALES_AMOUNT: null,
                        SALES_DAY: null,
                        SALES_PPU: null,
                        SALES_PRICE: null,
                    },
                    colWidths: [
                        80, 80, 70, 70, 70, 90
                    ],
                    colHeaders: [],
                    columns: [
                        { data: 'SALES_DAY', type: 'text', readOnly: true },
                        { data: 'SALES_PPU', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true },
                        { data: 'BOX_AMOUNT', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true },
                        { data: 'ITEM_AMOUNT', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true },
                        { data: 'SALES_AMOUNT', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true },
                        { data: 'SALES_PRICE', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true }
                    ],
                    hiddenCols: []
                },
                fetchState: null,
                fetchText: {
                    noResults: '조회결과가 없습니다.',
                    noMore: '모든 이력을 조회했습니다.',
                    error: '조회에 실패하였습니다.'
                },
                postData: {
                    customer_code: this.state.model.CUSTOMER_CODE,
                    product_code: this.state.lastSelectedProduct.PRODUCT_CODE
                }
            }
        },
        computed: {
            ...mapState([
                'AGENT_SETTINGS'
            ]),
            ...mapGetters([
               'getAmountTypeTxt'
            ]),
            getPostData () {
                return this.postData
            }
        },
        mounted () {
            const getState = this.AGENT_SETTINGS
            const getAmountDiv = getState.AMOUNT_DIV

            let arrHiddenCols = []
            switch (getAmountDiv) {
                case '0': // 박스
                    arrHiddenCols.push(3, 4)
                    break
                case '1': // 낱개
                    arrHiddenCols.push(2)
                    break
                case '2': // 모두
                    break
            }
            _assign(this.hotOptions.hiddenCols, arrHiddenCols)
            _assign(this.hotOptions.colHeaders, ['일자', '단가', ...this.getAmountTypeTxt, '금액'])

            this.doSearch()
        },
        methods: {
            fnProdClick (row) {
                // console.log(row)
            },
            fnGetData () {
                // 조회상태 초기화
                this.fetchState = null

                // 데이터 초기화
                this.hotOptions.init = false
                this.hotOptions.data = []
                this.doSearch()
            },
            doSearch () {
                if (this.fetchState) return

                const loader = this.$common.getLoader(this)
                const postData = this.getPostData
                sales.fetchPpuHistories(postData).then((data) => {
                    let resCnt = data.list.length
                    if (resCnt <= 0) {
                        this.fetchState = 'noResults'
                        this.$toasted.show(this.fetchText.noResults)
                    } else {
                        this.hotOptions.data = this.hotOptions.data.concat(data.list)

                        this.fetchState = 'noMore'
                        this.$toasted.show(this.fetchText.noMore)
                    }

                    loader.hide()
                    if (!this.isInit) {
                        this.isInit = true
                    }
                }).catch((err) => {
                    loader.hide()

                    this.$snotify.error('단가 이력 조회 실패', this.$common.parseErrorMsg(err))
                })
            }
        }
    }
</script>

<style scoped>
    #loader-container {
        max-height: 400px;
    }
</style>

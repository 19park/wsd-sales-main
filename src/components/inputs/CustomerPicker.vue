<template>
    <div class="box" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'거래처' }} : </label>
        <input type="text" class="form-control d-inline-block input-100" v-model="getName"
               @keyup.enter="fnChkSearch" @click="fnChkSearch" readonly="true">
        <button type="button" class="btn btn-success ml5" @click="fnChkSearch">검색</button>

        <b-modal :id="defPopName"
                 :lazy="true"
                 size="lg"
                 body-class="p-0"
                 hide-footer
                 hide-header>
            <PopCustomers @get-data="cbAddCustomers">
                <div slot="footer" class="text-right">
                    <button class="btn btn-outline-dark"
                            @click="$root.$emit('bv::hide::modal',`${defPopName}`)">닫기
                    </button>
                </div>
            </PopCustomers>
        </b-modal>

    </div>
</template>

<script>
    // 거래처 검색 팝업
    import PopCustomers from '../popup/PopCustomers.vue'
    import alert from '../mixin/alert'

    export default {
        name: "CustomerPicker",
        mixins: [alert],
        props: {
            label: String,
            model: Object,
            isHotChk: Boolean,
            labelClasses: String,
            wrapClasses: String
        },
        components: {
            PopCustomers
        },
        computed: {
            getName () {
                return this.model.CUSTOMER_NAME
            }
        },
        data () {
            return {
                defPopName: 'pop-customers-' + this._uid
            }
        },
        methods: {
            fnChkSearch () {
                if (this.isHotChk) {
                    if (this.$salesEntry().hot && this.$salesEntry().hot.countRows() >= 3) {
                        this.showCommonAlert('작성중인 정보가 있어서<br/>거래처를 변경할 수 없습니다.')
                        return
                    }
                }

                this.$root.$emit('bv::show::modal',`${this.defPopName}`)
            },
            /**
             * 거래처 팝업에서 선택된 정보를 hansOnTable 에 row 추가
             * @param data (클릭한 거래처 객체)
             */
            cbAddCustomers (data) {
                if (!data.MEMBER_CODE) {
                    this.$snotify.warning('설정 후 다시 시도해주세요.', '담당자 정보없음')
                    return
                }
                if (!data.BANK_INFO) {
                    data.BANK_INFO = null
                }

                Object.assign(this.model, data)

                // 거래처물품 팝업 숨김
                this.$root.$emit('bv::hide::modal',`${this.defPopName}`)
            }

        }
    }
</script>

<style scoped>

</style>

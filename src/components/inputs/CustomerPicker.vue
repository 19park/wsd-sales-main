<template>
    <div class="box" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'거래처' }} : </label>
        <input type="text" name="CUSTOMER_NAME" class="form-control d-inline-block input-100" v-model="getName"
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
                    <button class="btn btn-primary"
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

    export default {
        name: "CustomerPicker",
        props: {
            label: String,
            model: Object,
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
                this.$root.$emit('bv::show::modal',`${this.defPopName}`)
            },
            /**
             * 거래처 팝업에서 선택된 정보를 hansOnTable 에 row 추가
             */
            cbAddCustomers (data) {
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

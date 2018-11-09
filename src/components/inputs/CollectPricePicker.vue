<template>
    <div class="box">
        <div class="d-inline-block">
            <span>수금액 :</span>
            <input type="text" name="COLLECT_PRICE"
                   class="form-control d-inline-block input-100 text-right" v-model="getCollectPrice">
        </div>
        <div class="d-inline-block ml-3">
            <span>할인액 :</span>
            <input type="text" name="DC_PRICE"
                   class="form-control d-inline-block input-100 text-right" v-model="getDcPrice">
        </div>
        <div class="d-inline-block ml-3">
            <input type="hidden" name="B_TOTAL_PRICE" value="0"/>
            <span>합계 :</span>
            <input type="text" name="TOTAL_PRICE"
                   class="form-control d-inline-block w-auto text-right"
                   readonly="true" v-model="getTotalPrice">
        </div>
    </div>
</template>

<script>
    import numeral from 'numeral'

    export default {
        name: "CollectPricePicker",
        props: {
            model: Object
        },
        computed: {
            getCollectPrice: {
                get () {
                    return numeral(this.model.value).format()
                },
                set (newValue) {
                    const nGetNowVal = (newValue) ? numeral(newValue).value() : 0
                    this.model.value = nGetNowVal
                    this.model.total = numeral(this.model.dc).value() + nGetNowVal
                }
            },
            getDcPrice: {
                get () {
                    return numeral(this.model.dc).format()
                },
                set (newValue) {
                    const nGetNowVal = (newValue) ? numeral(newValue).value() : 0
                    this.model.dc = nGetNowVal
                    this.model.total = numeral(this.model.value).value() + nGetNowVal
                }
            },
            getTotalPrice () {
                return numeral(this.model.total).format()
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>

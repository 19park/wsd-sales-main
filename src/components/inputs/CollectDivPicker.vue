<template>
    <div class="d-flex align-items-center">
        <div class="d-inline-block w-auto">
            <select name="COLLECT_DIV" class="form-control w-auto"
                    v-model="model.div">
                <option value="1">현금</option>
                <!--
                    중상이 아닐경우에만 노출
                    If sGetMemMmdiv = "1" Then
                //-->
                <option value="2">무통장입금</option>
                <option value="3">카드</option>
                <!-- //-->
                <option value="4">기타</option>
            </select>
        </div>

        <div v-show="getIsShowBank">
            <AgentBanksPicker :model="model.bank"
                              ref="select-bank"
                              wrap-classes="d-inline-block ml-2"/>
        </div>
    </div>
</template>

<script>
    import AgentBanksPicker from "./AgentBanksPicker.vue"

    export default {
        name: "CollectDivPicker",
        props: {
            model: Object
        },
        components: {
            AgentBanksPicker
        },
        computed: {
            getIsShowBank () {
                return (this.model.div === '2') ? true : false
            }
        }
    }
</script>

<style scoped>

</style>

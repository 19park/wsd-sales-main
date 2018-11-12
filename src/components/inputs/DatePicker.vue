<template>
    <div class="box" :class="wrapClasses">
        <label :for="id?id:''">{{ label?label:'매출일자' }}: </label>
        <datepicker :id="id?id:''"
                    :value="value"
                    format="yyyy-MM-dd"
                    wrapper-class="d-inline-block"
                    input-class="form-control input-90">
        </datepicker>
    </div>
</template>

<script>
    import Common from '../mixin/common'
    import Datepicker from 'vuejs-datepicker'

    export default {
        name: "AgentBanksPicker",
        mixins: [Common],
        props: {
            label: String,
            value: String,
            labelClasses: String,
            wrapClasses: String
        },
        components: {
            Datepicker
        },
        data () {
            return {
                options: [
                    { value: null, text: '로딩 중..' }
                ]
            }
        }
    }
</script>

<style scoped>

</style>

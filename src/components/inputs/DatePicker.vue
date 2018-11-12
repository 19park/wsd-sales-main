<template>
    <div class="box" :class="wrapClasses">
        <label :for="id?id:''">{{ label?label:'' }}</label>
        <Datepicker :id="id?id:''"
                    v-model="model[id]"
                    :language="ko"
                    :disabledDates="getDisableDates"
                    format="yyyy-MM-dd"
                    wrapper-class="d-inline-block"
                    input-class="form-control input-90">
        </Datepicker>
    </div>
</template>

<script>
    import Datepicker from 'vuejs-datepicker'
    import Moment from 'moment-timezone'
    import {ko} from 'vuejs-datepicker/dist/locale'

    export default {
        name: "DatePicker",
        props: {
            id: String,
            label: String,
            model: [String, Object],
            disableType: String,
            labelClasses: String,
            wrapClasses: String
        },
        components: {
            Datepicker
        },
        data () {
            return {
                ko: ko,
                currentDate: Moment(new Date()).format('YYYY-MM-DD'),
                disableDates: {}
            }
        },
        computed: {
            getDisableDates () {
                return this.disableDates
            }
        },
        watch: {
            'disableType': {
                handler (val, oldVal) {
                    const GET_DATE = this.currentDate
                    let objDisable = {}

                    switch (val) {
                        case 'noBoth':
                            objDisable = {
                                customPredictor (date) {
                                    if (Moment(date).format('YYYY-MM-DD') !== GET_DATE) return true
                                }
                            }
                            break
                        case 'noBefore':
                            objDisable = {
                                customPredictor (date) {
                                    if (Moment(date).format('YYYY-MM-DD') < GET_DATE) return true
                                }
                            }
                            break
                        case 'noAfter':
                            objDisable = {
                                customPredictor (date) {
                                    if (Moment(date).format('YYYY-MM-DD') > GET_DATE) return true
                                }
                            }
                            break
                    }
                    this.disableDates = objDisable
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>

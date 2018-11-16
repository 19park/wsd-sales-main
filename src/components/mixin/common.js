import Vue from 'vue'
import _get from 'lodash/get'
import Moment from 'moment-timezone'

import axios from 'axios'

/**
 * 공통사용함수 정의
 */
const Common = {
    methods: {
        /**
         * 오늘날짜 date 타입으로 그대로 return
         */
        getCurrentDate () {
            let date = new Date()
            //date.setHours(0, 0, 0, 0)
            return date
        },

        getFullCurrentDate () {
            return this.getFullFormatTime(this.getCurrentDate())
        },

        /**  _format형식으로 리턴
         * @_format : 원하는 포맷 형식
         * */
        getFormatDate (_format, _date) {
            return Moment(_date).format(_format)
        },

        /**  1일의 날짜형 리턴
         * @_date : 해당 날자형 데이터
         * */
        getFirstDate (_date = null) {
            let now
            if (_date == null) {
                now = new Date()
            } else {
                now = _date
            }
            return new Date(now.getFullYear(), now.getMonth(), 1)
        },

        /** 당월 말일의 날짜형 리턴
         * * @_date : 해당 날자형 데이터
         * */
        getLastDate (_date = null) {
            let now
            if (_date == null) {
                now = new Date()
            } else {
                now = _date
            }
            return new Date(now.getFullYear(), now.getMonth() + 1, 0)
        },

        /**
         * date 를 받아 yyyy-mm-dd format 으로 리턴
         */
        getFormatTime (date) {
            // noinspection JSUnresolvedVariable, JSUnresolvedFunction
            let zone = Moment.tz.guess()
            // noinspection JSUnresolvedFunction, SpellCheckingInspection
            return Moment.tz(date, zone).format('YYYY-MM-DD')
        },

        /**
         * date 를 받아 yyyy-mm-dd hh:mm format 으로 리턴
         */
        getFormatDateTime (date) {
            // noinspection JSUnresolvedVariable, JSUnresolvedFunction
            let zone = Moment.tz.guess()
            // noinspection JSUnresolvedFunction, SpellCheckingInspection
            return Moment.tz(date, zone).format('YYYY-MM-DD HH:mm')
        },

        /**
         * date 를 받아 yyyy-mm-ddTHH:mm:ssZ format 으로 리턴
         */
        getFullFormatTime (date) {
            // noinspection JSUnresolvedVariable, JSUnresolvedFunction
            let zone = Moment.tz.guess()
            // noinspection JSUnresolvedFunction
            return Moment.tz(date, zone).toISOString()
        },

        /****************************************** 숫자관련 ********************************************/
        /**
         * 숫자값 받아서 number 타입인지 체크 return
         * @param s 숫자여부 판별할 값
         * @returns {Boolean}  true: 숫자, false:
         */
        isNumber (s) {
            s += '' // 문자열로 변환
            s = s.replace(/^\s*|\s*$/g, '') // 좌우 공백 제거
            // noinspection RedundantIfStatementJS
            if (s === '' || isNaN(s)) return false
            return true
        },

        /**
         * n을 받아 콤마를 붙여 리턴
         */
        numberWithCommas (n) {
            if (!n) return 0
            let parts = n.toString().split('.')
            return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : '')
        },

        /**
         * obj1 의 구조에 맞는 정보만 obj2 에서 복사하여 새로운 newObj 를 리턴
         * @param obj1 구조 오브젝트
         * @param obj2 정보 오브젝트
         * @returns obj1 구조를 따르며, obj2 의 정보를 가지는 newObj
         */
        copy (obj1, obj2) {
            // noinspection JSUnresolvedFunction
            let newObj = Vue.util.extend({}, obj1)
            Object.keys(newObj).forEach(key => {
                // console.debug('key = ', key)
                if (_get(newObj, key, {}) instanceof Object) {
                    newObj[key] = this.copy(newObj[key], _get(obj2, key, null))
                } else {
                    newObj[key] = _get(obj2, key, null)
                }
            })
            return newObj
        },

        /**
         * jsReport api post > return pdf
         * self > vue instance
         * getData > post json data
         * getName > window popup name
         */
        fnGetPdfPrint (self, url, data, fn) {
            let wPop
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            } else {
                wPop = window.open('about:blank', 'report', 'width=1000,height=1000,menubar=no,toolbar=no,location=yes,status=yes,scrollbars=auto,resizable=yes')
                wPop.resizeTo(1000, 1000)
                wPop.moveTo(50, 50)
            }

            const loader = self.$common.getLoader(self)

            axios.post(url, data, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then((res) => {
                let blob = new Blob([res.data], {type: 'application/pdf'})

                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob)
                } else {
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')

                    link.href = url
                    link.target = 'report'
                    self.$el.appendChild(link)
                    link.click()

                    /*
                    let wPop = window.open(url, getname, 'width=1000,height=1000,menubar=no,toolbar=no,location=yes,status=yes,scrollbars=auto,resizable=yes')

                    if(wPop == null) {
                      this.throwNotify(`<span>팝업이 차단 되어있습니다.<br/>브라우저 설정을 확인해주세요.</span>`)
                    }else{
                      wPop.resizeTo(1000, 1000)
                      wPop.moveTo(100, 100)
                    }
                    */
                }

                // 함수가 넘어오면 마지막에 처리
                if (typeof fn === 'function') fn()
                loader.hide()
            }).catch((err) => {
                console.log('pdf-error : ' + err)
                this.$snotify.error('명세서 인쇄 실패', this.$common.parseErrorMsg(err))
                loader.hide()
            })
        }
    }
}

export default Common

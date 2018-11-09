import Vue from 'vue'
import _get from 'lodash/get'
import Moment from 'moment-timezone'

/**
 * 공통사용함수 정의
 */
const Common = {
    data () {
        return {
            windowHeight: 0
        }
    },
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


        /****************************************************************************************/
        /**
         * err 을 받아서 에러객체값에 따라서 alert 창 노출
         */
        parseErrorMsg (err) {
            let msg = ''
            if (!err.response) {
                msg = err
                console.log(1, err)
            } else {
                console.log(2, err.response)
                if (err.response.data) {
                    if (err.response.data.detail) {
                        let tmpErrTxt = ''
                        // noinspection JSUnresolvedVariable
                        err.response.data.detail.errors.forEach(function (v, k) {
                            if (k > 0) {
                                tmpErrTxt += '\n'
                            }
                            tmpErrTxt += v.message
                        })
                        msg = err.response.data.message + '\n' + tmpErrTxt
                    } else if (err.response.data.error) {
                        msg = err.response.data.error.message
                    } else {
                        msg = err.response.data.message
                    }
                } else {
                    msg = err.response.statusText
                }
            }
            return msg
        },

        getErrorMsg (err) {
            const msg = this.parseErrorMsg(err)
            alert(msg)
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

        // trigger element remove
        removeElement (p) {
            const elem = (typeof p === 'String') ?
                            document.getElementById(p) : p
            return elem.parentNode.removeChild(elem)
        },

        // resize callback
        debounce (func) {
            let timer
            return function (event) {
                if (timer) clearTimeout(timer)
                timer = setTimeout(func, 300, event)
            }
        },

        // 스크롤 이동 처리 함수
        scrollTo (element, from, to, duration, currentTime) {
            if (from <= 0) { from = 0 }
            if (to <= 0) { to = 0 }
            if (currentTime>=duration) return
            let delta = to-from
            let progress = currentTime / duration * Math.PI / 2
            let position = delta * (Math.sin(progress))
            setTimeout(() => {
                element.scrollTop = from + position
                this.scrollTo(element, from, to, duration, currentTime + 10)
            }, 10)
        }
    }
}

export default Common

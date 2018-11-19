import Vue from 'vue'
import _get from 'lodash/get'
import Moment from 'moment-timezone'

import {sales} from '../../api'

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
         * date 를 받아 yyyy-mm-ddTHH:mm:ssZ format 으로 리턴
         */
        getFullFormatTime (date) {
            // noinspection JSUnresolvedVariable, JSUnresolvedFunction
            let zone = Moment.tz.guess()
            // noinspection JSUnresolvedFunction
            return Moment.tz(date, zone).toISOString()
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
            const postData = {
                url: url,
                data: data,
            }

            sales.fetchReport(postData).then((data) => {
                let blob = new Blob([data], {type: 'application/pdf'})

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

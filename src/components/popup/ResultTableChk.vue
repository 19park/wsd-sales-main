<template>
    <div class="box">
        <div :id="'hot-table-'+_uid"></div>
    </div>
</template>

<script>
    import Handsontable from 'handsontable-pro'

    export default {
        name: "ResultTableChk",
        props: {
            hotId: String,
            hotOptions: Object
        },
        data () {
            return {
                hot: null,
                isAllChk: false,
                checkedArr: []
            }
        },
        computed: {
            getSelectRow () {
                return this.hot.getSelected()[0][0]
            }
        },
        watch: {
            'hotOptions.data': {
                handler (val, oldVal) {
                    this.hot.loadData(val)
                    if (!this.hotOptions.init && val.length) {
                        this.hotOptions.init = true
                        this.hot.selectCell(0, 0)
                    }
                },
                deep: true
            }
        },
        mounted () {
            let HotTable = document.getElementById('hot-table-' + this._uid)
            this.hot = new Handsontable(HotTable, {
                data: this.hotOptions.data,
                dataSchema: this.hotOptions.model,
                selectionMode: 'single',
                autoWrapRow: true,
                autoWrapCol: true,
                currentRowClassName: 'currentRow',
                height: 400,
                stretchH: 'all',
                startRows: 1,
                rowHeaders: true,
                colHeaders: this.hotOptions.colHeaders,
                colWidths: this.hotOptions.colWidths,
                columns: this.hotOptions.columns,
                manualColumnResize: true,
                manualRowMove: true,
                enterBeginsEditing: false,
                beforeKeyDown: (e) => {
                    if (e.keyCode === 13) {
                        // 엔터키
                        e.stopImmediatePropagation()
                        this.doSelect(this.getSelectRow)
                    } else if (e.keyCode === 38) {
                        // 위 방향키
                        if (this.getSelectRow === 0) e.stopImmediatePropagation()
                    } else if (e.keyCode === 40) {
                        // 아래 방향키
                        if (this.getSelectRow + 1 === this.hot.countRows()) e.stopImmediatePropagation()
                    }
                },
                afterOnCellMouseDown: (e, coords, TD) => {
                    // 마우스 클릭
                    e.stopImmediatePropagation()

                    if (coords.col === 0) {
                        if (!this.hot.getDataAtRowProp(coords.row, 'CHECKED')) {
                            // 체크 했을 경우
                            this.checkedArr.push(coords.row)
                        } else {
                            // 체크 해제 할 경우
                            const getIdx = this.checkedArr.indexOf(coords.row)
                            this.checkedArr.splice(getIdx, 1)
                        }
                        this.hot.deselectCell()
                        return false
                    }
                    this.doSelect(coords.row)
                },
                afterScrollVertically: () => {
                    const target = HotTable.querySelector(".wtHolder")
                    if (target.offsetHeight + target.scrollTop >= target.scrollHeight) {
                        // 스크롤 마지막 체크 후 추가로딩
                        this.$emit('addLoad')
                    }
                },
                afterRowMove: () => {
                    return false
                }
            })
        },
        methods: {
            doSelect (row) {
                if (!this.hot.countRows()) return false
                const getData = this.hot.getSourceDataAtRow(row)
                this.$emit('rowClick', getData)
            },
            doChkComp () {
                // let getChkData = []
                // this.checkedArr.forEach((e)=>{
                //     getChkData.push(this.hot.getSourceDataAtRow(e))
                // })
                // // 중복 제거?
                // getChkData = _uniq(getChkData)
                const getData = this.hot.getSourceData()
                const getChkData = getData.filter((e) => e.CHECKED === true)

                this.$emit('chkClick', getChkData)
            },

            doChkAll () {
                const getData = this.hot.getSourceData()
                if (!this.isAllChk) {
                    this.isAllChk = true
                    getData.forEach((e) => e.CHECKED = true)
                } else {
                    this.isAllChk = false
                    getData.forEach((e) => e.CHECKED = false)
                }
            }
        }
    }
</script>

<style scoped>

</style>

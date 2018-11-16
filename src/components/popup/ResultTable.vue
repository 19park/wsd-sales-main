<template>
    <div class="box">
        <div :id="'hot-table-'+_uid"></div>
    </div>
</template>

<script>
    import Handsontable from 'handsontable-pro'

    export default {
        name: "ResultTable",
        props: {
            hotId: String,
            hotOptions: Object,
            isLoad: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                hot: null
            }
        },
        computed: {
            getSelectRow () {
                return this.hot.getSelected()[0][0]
            }
        },
        watch: {
            'hotOptions': {
                handler (val) {
                    this.hot.loadData(val.data)
                    if (!this.hotOptions.init && val.data.length) {
                        this.hotOptions.init = true
                        this.hot.selectCell(0, 0)
                    }

                    this.hot.updateSettings({
                        hiddenColumns: {
                            columns: val.hiddenCols,
                            indicators: false
                        }
                    })
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
                        if(this.getSelectRow === 0) e.stopImmediatePropagation()
                    } else if (e.keyCode === 40) {
                        // 아래 방향키
                        if(this.getSelectRow+1 === this.hot.countRows()) e.stopImmediatePropagation()
                    }
                },
                afterOnCellMouseDown: (e, coords) => {
                    // 마우스 클릭
                    e.stopImmediatePropagation()
                    this.doSelect(coords.row)
                },
                afterScrollVertically: () => {
                    if (!this.isLoad) { return false }
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
            }
        }
    }
</script>

<style scoped>

</style>

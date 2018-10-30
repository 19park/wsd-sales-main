<template>
  <div class="box">
    <div id="result-table"></div>
  </div>
</template>

<script>
  import Handsontable from 'handsontable-pro'

  export default {
    name: "ResultTable",
    props: ['hotOption'],
    data () {
      return {
        hot: null
      }
    },
    mounted () {
      let HotTable = document.getElementById('result-table')
      this.hot = new Handsontable(HotTable, {
        data: this.hotOption.model,
        dataSchema: this.hotOption.schema,
        selectionMode: 'single',
        autoWrapRow: true,
        // fixedColumnsLeft: 3,
        // stretchH: 'all',
        startRows: 1,
        rowHeaders: true,
        colHeaders: this.hotOption.colHeaders,
        colWidths: this.hotOption.colWidths,
        columns: this.hotOption.columns,
        manualColumnResize: true,
        enterBeginsEditing: false,
        afterSelectionEnd: (row, col) => {

        }
      })

      // TODO 라이센스 문구 제거
      this.removeElement('hot-display-license-info')
    }
  }
</script>

<style scoped>

</style>

<template>
    <div id="wrapper">

        <b-card no-body id="page-wrapper">
            <div class="box">
                <div id="entry-panel">
                    <SalesEntry/>
                </div>
            </div>

            <div id="list-panel" ref="list-panel">
                <b-container flude class="mw-100">
                    <b-row>
                        <b-col cols="8">
                            <SalesList/>
                        </b-col>
                        <b-col cols="4">
                            <SalesLedger ref="sales-ledger"/>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </b-card>

        <vue-snotify></vue-snotify>
    </div>
</template>

<script>
    // 매출 관련 컴포넌트
    import SalesEntry from './SalesEntry.vue'
    import SalesList from './SalesList.vue'
    import SalesLedger from './SalesLedger.vue'

    export default {
        name: "SalesMain",
        components: {
            SalesEntry,
            SalesList,
            SalesLedger
        }
    }
</script>
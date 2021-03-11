/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9084507042253521, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9583333333333334, 500, 1500, "IdP Redirect endpoint"], "isController": false}, {"data": [1.0, 500, 1500, "SP grant the access"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Autentificate on IdP (SF)"], "isController": false}, {"data": [1.0, 500, 1500, "IdP generate SAML Response -1"], "isController": false}, {"data": [1.0, 500, 1500, "Relay SAML Response back to SP-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "IdP generate SAML Response -2"], "isController": false}, {"data": [1.0, 500, 1500, "SP logout request-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "SF login (IdP)-0"], "isController": false}, {"data": [1.0, 500, 1500, "Relay SAML Response back to SP-0"], "isController": false}, {"data": [1.0, 500, 1500, "SF login (IdP)-1"], "isController": false}, {"data": [1.0, 500, 1500, "SF login (IdP)-2"], "isController": false}, {"data": [1.0, 500, 1500, "SP logged out"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "Relay SAML Response back to SP"], "isController": false}, {"data": [1.0, 500, 1500, "SP logout group"], "isController": true}, {"data": [0.7, 500, 1500, "IdP (SF) Login group"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "IdP Redirect endpoint-1"], "isController": false}, {"data": [0.375, 500, 1500, "SSO to SP group"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "IdP generate SAML Response "], "isController": false}, {"data": [1.0, 500, 1500, "IdP Redirect endpoint-0"], "isController": false}, {"data": [1.0, 500, 1500, "SP logout request-0"], "isController": false}, {"data": [1.0, 500, 1500, "IdP generate SAML Response -0"], "isController": false}, {"data": [1.0, 500, 1500, "SP logout request"], "isController": false}, {"data": [0.5, 500, 1500, "SF login (IdP)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 240, 0, 0.0, 228.89999999999998, 51, 1356, 135.0, 529.7, 847.0999999999998, 1123.0900000000006, 4.04122044857547, 17.861779999747423, 10.682693947009497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["IdP Redirect endpoint", 12, 0, 0.0, 257.1666666666667, 135, 940, 177.0, 769.3000000000006, 940.0, 940.0, 0.21668472372697725, 2.9641616727609246, 0.5415002031419285], "isController": false}, {"data": ["SP grant the access", 12, 0, 0.0, 69.5, 66, 84, 68.0, 80.4, 84.0, 84.0, 0.2145769258279093, 0.1506648531936199, 0.15317942654316571], "isController": false}, {"data": ["Autentificate on IdP (SF)", 12, 0, 0.0, 215.66666666666669, 82, 789, 106.5, 687.6000000000004, 789.0, 789.0, 0.2142971944925621, 2.796117983999143, 0.22434237548440095], "isController": false}, {"data": ["IdP generate SAML Response -1", 12, 0, 0.0, 88.24999999999999, 51, 171, 67.5, 167.10000000000002, 171.0, 171.0, 0.22012290195359077, 0.13177279189213978, 0.31126754104374943], "isController": false}, {"data": ["Relay SAML Response back to SP-1", 12, 0, 0.0, 94.33333333333333, 64, 381, 68.5, 288.3000000000003, 381.0, 381.0, 0.21454623471358078, 0.16635713902596008, 0.14372921583351211], "isController": false}, {"data": ["IdP generate SAML Response -2", 12, 0, 0.0, 192.08333333333334, 80, 725, 106.5, 632.9000000000003, 725.0, 725.0, 0.2199695708760288, 2.8701303090572474, 0.22125845508038056], "isController": false}, {"data": ["SP logout request-1", 12, 0, 0.0, 77.08333333333333, 64, 194, 66.5, 156.5000000000001, 194.0, 194.0, 0.21410601816332722, 0.08593513033703856, 0.09199867967955466], "isController": false}, {"data": ["SF login (IdP)-0", 12, 0, 0.0, 350.0, 291, 601, 324.0, 548.8000000000002, 601.0, 601.0, 0.2169118976175843, 0.4796492579805502, 0.9136142718990636], "isController": false}, {"data": ["Relay SAML Response back to SP-0", 12, 0, 0.0, 106.33333333333334, 79, 222, 95.0, 190.2000000000001, 222.0, 222.0, 0.2143852502947797, 0.08290679601243435, 2.5948152267124023], "isController": false}, {"data": ["SF login (IdP)-1", 12, 0, 0.0, 285.58333333333337, 238, 358, 277.0, 351.40000000000003, 358.0, 358.0, 0.2183803457688808, 0.5363540718835305, 0.19220242834394904], "isController": false}, {"data": ["SF login (IdP)-2", 12, 0, 0.0, 271.25, 214, 369, 262.5, 366.0, 369.0, 369.0, 0.21884631517516825, 0.5832339786260099, 0.23188305855962651], "isController": false}, {"data": ["SP logged out", 12, 0, 0.0, 66.66666666666666, 64, 72, 66.0, 71.4, 72.0, 72.0, 0.21408691928923143, 0.08592746467565832, 0.09199047313209163], "isController": false}, {"data": ["Relay SAML Response back to SP", 12, 0, 0.0, 201.91666666666666, 144, 604, 165.5, 478.90000000000043, 604.0, 604.0, 0.21411747912354578, 0.24882792984083935, 2.735016237242167], "isController": false}, {"data": ["SP logout group", 12, 0, 0.0, 224.08333333333334, 194, 334, 205.0, 331.0, 334.0, 334.0, 0.21357253457205402, 0.21628390463986333, 0.329327179774681], "isController": true}, {"data": ["IdP (SF) Login group", 20, 0, 0.0, 551.15, 0, 1356, 826.0, 1027.2, 1339.8999999999996, 1356.0, 0.2105972538118103, 0.9265045199435599, 0.7773074713324488], "isController": true}, {"data": ["IdP Redirect endpoint-1", 12, 0, 0.0, 176.0, 83, 830, 98.5, 654.5000000000007, 830.0, 830.0, 0.21695503606877475, 2.8307971063622066, 0.22712480338449856], "isController": false}, {"data": ["SSO to SP group", 12, 0, 0.0, 1331.3333333333335, 905, 2497, 1067.5, 2432.2000000000003, 2497.0, 2497.0, 0.2107481559536354, 9.047335325561995, 4.180387249736565], "isController": true}, {"data": ["IdP generate SAML Response ", 12, 0, 0.0, 587.0833333333334, 425, 1185, 528.5, 1087.5000000000005, 1185.0, 1185.0, 0.21821752650433707, 3.1287790274772234, 0.6116057627611791], "isController": false}, {"data": ["IdP Redirect endpoint-0", 12, 0, 0.0, 80.0, 51, 125, 66.5, 122.60000000000001, 125.0, 125.0, 0.2199897338124221, 0.1389795168933783, 0.31945774822174966], "isController": false}, {"data": ["SP logout request-0", 12, 0, 0.0, 79.33333333333333, 64, 192, 68.0, 159.30000000000013, 192.0, 192.0, 0.21459227467811157, 0.045055995171673816, 0.146484375], "isController": false}, {"data": ["IdP generate SAML Response -0", 12, 0, 0.0, 303.74999999999994, 273, 374, 293.0, 371.3, 374.0, 374.0, 0.2188782489740082, 0.15133378932968536, 0.08378932968536251], "isController": false}, {"data": ["SP logout request", 12, 0, 0.0, 157.41666666666666, 130, 262, 136.5, 261.1, 262.0, 262.0, 0.21384656508954825, 0.130730419673884, 0.23786253675487837], "isController": false}, {"data": ["SF login (IdP)", 12, 0, 0.0, 918.5833333333334, 812, 1356, 856.5, 1259.4000000000003, 1356.0, 1356.0, 0.2149767108563239, 1.5762859414188464, 1.3224531697868147], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 240, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

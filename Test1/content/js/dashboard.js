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

    var data = {"OkPercent": 61.53846153846154, "KoPercent": 38.46153846153846};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "SP logout"], "isController": true}, {"data": [1.0, 500, 1500, "IdP Redirect endpoint"], "isController": false}, {"data": [0.0, 500, 1500, "SP grant the access"], "isController": false}, {"data": [0.55, 500, 1500, "IdP (SF) Login"], "isController": true}, {"data": [1.0, 500, 1500, "Autentificate on IdP (SF)"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "SF login (IdP)-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "SF login (IdP)-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "SF login (IdP)-2"], "isController": false}, {"data": [0.0, 500, 1500, "SP logged out"], "isController": false}, {"data": [0.0, 500, 1500, "Relay SAML Response back to SP"], "isController": false}, {"data": [1.0, 500, 1500, "IdP Redirect endpoint-1"], "isController": false}, {"data": [0.0, 500, 1500, "IdP generate SAML Response "], "isController": false}, {"data": [1.0, 500, 1500, "IdP Redirect endpoint-0"], "isController": false}, {"data": [0.0, 500, 1500, "SP logout request"], "isController": false}, {"data": [0.25, 500, 1500, "SF login (IdP)"], "isController": false}, {"data": [0.0, 500, 1500, "SSO to SP"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 156, 60, 38.46153846153846, 332.1923076923076, 2, 2761, 258.5, 843.2000000000011, 1434.0500000000013, 2404.750000000004, 2.653512502126212, 12.511760609797586, 3.954222656914441], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SP logout", 12, 12, 100.0, 293.83333333333337, 277, 315, 294.0, 312.6, 315.0, 315.0, 0.2170374389582203, 0.5996083152468801, 0.08202489148128052], "isController": true}, {"data": ["IdP Redirect endpoint", 12, 0, 0.0, 194.16666666666666, 143, 268, 176.5, 266.5, 268.0, 268.0, 0.21744251363545763, 2.967325864786997, 0.5255568566872634], "isController": false}, {"data": ["SP grant the access", 12, 12, 100.0, 323.75, 278, 427, 303.0, 418.90000000000003, 427.0, 427.0, 0.21702173834412414, 0.15153373331645387, 0.0924037870293341], "isController": false}, {"data": ["IdP (SF) Login", 20, 0, 0.0, 871.4499999999998, 0, 2761, 813.5, 1947.5, 2720.4499999999994, 2761.0, 0.21054404581438435, 0.9305676728040255, 0.7772241675614788], "isController": true}, {"data": ["Autentificate on IdP (SF)", 12, 0, 0.0, 104.83333333333334, 90, 149, 103.0, 136.40000000000003, 149.0, 149.0, 0.21774632553075668, 2.841121733805117, 0.2279531845400109], "isController": false}, {"data": ["SF login (IdP)-0", 12, 0, 0.0, 634.5000000000001, 296, 2136, 356.5, 1915.2000000000007, 2136.0, 2136.0, 0.2132271935747539, 0.4787547420839405, 0.8980946151249156], "isController": false}, {"data": ["SF login (IdP)-1", 12, 0, 0.0, 380.16666666666674, 224, 1345, 290.5, 1053.100000000001, 1345.0, 1345.0, 0.21606049693914295, 0.5306563962909615, 0.1903540803925099], "isController": false}, {"data": ["SF login (IdP)-2", 12, 0, 0.0, 422.5, 208, 1213, 268.0, 1144.6000000000004, 1213.0, 1213.0, 0.21654005088691197, 0.5770876942093581, 0.2294394093870112], "isController": false}, {"data": ["SP logged out", 12, 12, 100.0, 290.6666666666667, 274, 309, 291.5, 307.2, 309.0, 309.0, 0.21708848164697794, 0.1515803363062395, 0.08204418202869186], "isController": false}, {"data": ["Relay SAML Response back to SP", 12, 12, 100.0, 3.4166666666666665, 2, 8, 3.0, 7.100000000000003, 8.0, 8.0, 0.21817388458601505, 0.4504097578269881, 0.0], "isController": false}, {"data": ["IdP Redirect endpoint-1", 12, 0, 0.0, 104.5, 87, 155, 101.0, 143.90000000000003, 155.0, 155.0, 0.21773052219036906, 2.840915534165548, 0.21900628696882826], "isController": false}, {"data": ["IdP generate SAML Response ", 12, 12, 100.0, 316.58333333333337, 272, 393, 295.0, 388.8, 393.0, 393.0, 0.21693150387765064, 0.15147072780519552, 0.08304409132816314], "isController": false}, {"data": ["IdP Redirect endpoint-0", 12, 0, 0.0, 87.83333333333334, 53, 163, 67.5, 160.3, 163.0, 163.0, 0.21784910318785852, 0.13041162134195047, 0.30741401768208554], "isController": false}, {"data": ["SP logout request", 12, 12, 100.0, 3.1666666666666674, 2, 6, 3.0, 5.400000000000002, 6.0, 6.0, 0.21815405312051192, 0.4503688166960569, 0.0], "isController": false}, {"data": ["SF login (IdP)", 12, 0, 0.0, 1452.4166666666665, 788, 2761, 1377.5, 2517.7000000000007, 2761.0, 2761.0, 0.21125644772283156, 1.5561939400207736, 1.2997566699822194], "isController": false}, {"data": ["SSO to SP", 12, 12, 100.0, 942.75, 828, 1168, 956.0, 1133.8000000000002, 1168.0, 1168.0, 0.2143392991104919, 6.4634601730789845, 0.9157562828207052], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 36, 60.0, 23.076923076923077], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: serviceprovider2021.herokuapp.com:443 failed to respond", 24, 40.0, 15.384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 156, 60, "503/Service Unavailable", 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: serviceprovider2021.herokuapp.com:443 failed to respond", 24, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SP grant the access", 12, 12, "503/Service Unavailable", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SP logged out", 12, 12, "503/Service Unavailable", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Relay SAML Response back to SP", 12, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: serviceprovider2021.herokuapp.com:443 failed to respond", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["IdP generate SAML Response ", 12, 12, "503/Service Unavailable", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SP logout request", 12, 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: serviceprovider2021.herokuapp.com:443 failed to respond", 12, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

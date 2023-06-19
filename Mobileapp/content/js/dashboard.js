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

    var data = {"OkPercent": 90.9090909090909, "KoPercent": 9.090909090909092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7338636363636364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9725, 500, 1500, "GET List Category"], "isController": false}, {"data": [0.9875, 500, 1500, "GET Detail Category By Id"], "isController": false}, {"data": [0.0, 500, 1500, "POST  Create Order"], "isController": false}, {"data": [0.8525, 500, 1500, "GET Seller Product Id"], "isController": false}, {"data": [0.685, 500, 1500, "Register"], "isController": false}, {"data": [0.6875, 500, 1500, "GET List Buyer"], "isController": false}, {"data": [0.8125, 500, 1500, "Login"], "isController": false}, {"data": [0.58, 500, 1500, "POST Create Seller product"], "isController": false}, {"data": [0.7125, 500, 1500, "GET List Seller Product"], "isController": false}, {"data": [0.82, 500, 1500, "DELETE Seller Product By Id"], "isController": false}, {"data": [0.9625, 500, 1500, "GET Detail Buyer By Id"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 200, 9.090909090909092, 492.434545454545, 244, 2020, 437.0, 745.8000000000002, 971.0, 1546.7799999999952, 37.49339604955945, 44.80134624725191, 79.01646673739285], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET List Category", 200, 0, 0.0, 303.67000000000013, 246, 1453, 259.5, 404.9, 514.4999999999999, 1089.9400000000046, 3.700619853825516, 10.758540336756406, 1.3190686002405403], "isController": false}, {"data": ["GET Detail Category By Id", 200, 0, 0.0, 301.3899999999998, 244, 796, 264.5, 413.9, 472.84999999999997, 574.9100000000001, 3.691262780997379, 1.3806187940644494, 1.3229428131113654], "isController": false}, {"data": ["POST  Create Order", 200, 200, 100.0, 470.65999999999974, 270, 1604, 423.5, 681.0, 825.9999999999998, 1253.0500000000036, 3.7008252840383404, 1.2613164298138484, 2.9851637383886604], "isController": false}, {"data": ["GET Seller Product Id", 200, 0, 0.0, 478.88999999999976, 272, 1669, 420.0, 709.5, 788.95, 1666.820000000001, 3.7021954018733108, 2.7187997482507127, 1.337707322942505], "isController": false}, {"data": ["Register", 200, 0, 0.0, 633.275, 334, 1686, 548.5, 1130.9, 1289.85, 1643.6800000000003, 3.73761913660998, 2.1845361848252662, 5.653075943748832], "isController": false}, {"data": ["GET List Buyer", 200, 0, 0.0, 545.2700000000002, 309, 1119, 526.5, 693.9, 766.95, 970.5300000000004, 3.6854810474137136, 18.700937033556304, 1.5368168039508356], "isController": false}, {"data": ["Login", 200, 0, 0.0, 564.665, 324, 1817, 457.0, 1174.5000000000005, 1331.9999999999995, 1732.970000000001, 3.7232161140793414, 1.8652440102760766, 2.995152838021483], "isController": false}, {"data": ["POST Create Seller product", 200, 0, 0.0, 739.4300000000003, 285, 2020, 677.0, 1127.6, 1457.9999999999998, 1819.89, 3.6886077350104203, 2.52150919385478, 64.42492011858874], "isController": false}, {"data": ["GET List Seller Product", 200, 0, 0.0, 554.0550000000001, 278, 1688, 533.5, 724.8, 887.9999999999995, 1433.2600000000016, 3.7166431279268566, 2.7366688656805174, 1.324780021184866], "isController": false}, {"data": ["DELETE Seller Product By Id", 200, 0, 0.0, 496.83000000000015, 276, 1814, 451.0, 695.0, 826.95, 1805.9600000000028, 3.711539175295995, 1.1671050922317485, 1.420823590542998], "isController": false}, {"data": ["GET Detail Buyer By Id", 200, 0, 0.0, 328.6449999999998, 251, 1101, 282.0, 482.40000000000003, 531.8499999999999, 799.6400000000003, 3.7019898195279963, 3.30793035631652, 1.3340178158260065], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 200, 100.0, 9.090909090909092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST  Create Order", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

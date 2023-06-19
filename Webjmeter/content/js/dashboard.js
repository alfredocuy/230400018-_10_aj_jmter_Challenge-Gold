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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5575, 500, 1500, "GET Categories By Id"], "isController": false}, {"data": [0.455, 500, 1500, "GET List Produk"], "isController": false}, {"data": [0.5527777777777778, 500, 1500, "POST User-1"], "isController": false}, {"data": [0.7138888888888889, 500, 1500, "POST User-0"], "isController": false}, {"data": [0.51, 500, 1500, "DELETE Product"], "isController": false}, {"data": [0.505, 500, 1500, "POST Offer-1"], "isController": false}, {"data": [0.615, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.3525, 500, 1500, "POST User"], "isController": false}, {"data": [0.1075, 500, 1500, "POST Update Profiles"], "isController": false}, {"data": [0.32, 500, 1500, "PUT Update Product"], "isController": false}, {"data": [0.6375, 500, 1500, "GET List Offer"], "isController": false}, {"data": [0.38, 500, 1500, "PUT Update offer"], "isController": false}, {"data": [0.56, 500, 1500, "POST User Sign in"], "isController": false}, {"data": [0.5675, 500, 1500, "POST Offer-0"], "isController": false}, {"data": [0.625, 500, 1500, "GET Profiles"], "isController": false}, {"data": [0.4975, 500, 1500, "GET Product"], "isController": false}, {"data": [0.5375, 500, 1500, "PUT Update offer-1"], "isController": false}, {"data": [0.2675, 500, 1500, "POST Create Product"], "isController": false}, {"data": [0.3275, 500, 1500, "POST Offer"], "isController": false}, {"data": [0.69, 500, 1500, "PUT Update offer-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3960, 0, 0.0, 1211.5348484848469, 16, 5995, 939.5, 2509.9, 3204.0, 4986.339999999999, 19.887305270135897, 132.23637216599622, 53.04813031552264], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Categories By Id", 200, 0, 0.0, 994.365, 92, 3485, 904.0, 2018.3, 2281.9, 3096.140000000001, 1.0819817577875637, 0.7766177655994719, 0.79248824021077], "isController": false}, {"data": ["GET List Produk", 200, 0, 0.0, 1159.9750000000006, 267, 3489, 1018.0, 2198.2000000000003, 2514.85, 2971.9300000000003, 1.0755926515510046, 1.4213263637170332, 0.798785101293938], "isController": false}, {"data": ["POST User-1", 180, 0, 0.0, 902.9222222222223, 247, 3006, 594.0, 2480.700000000001, 2717.7499999999995, 2862.6299999999997, 1.06061409556133, 19.76987090890209, 0.9124779775267658], "isController": false}, {"data": ["POST User-0", 180, 0, 0.0, 738.8333333333331, 38, 3272, 468.0, 1858.1000000000004, 2230.9999999999995, 3228.2599999999998, 1.0745691276289633, 1.5478179530652085, 0.9196800619668197], "isController": false}, {"data": ["DELETE Product", 200, 0, 0.0, 1023.37, 31, 3003, 768.5, 2246.6, 2534.5499999999997, 2983.94, 1.0860121633362294, 1.1702735562825803, 0.8202255341822329], "isController": false}, {"data": ["POST Offer-1", 200, 0, 0.0, 1035.82, 228, 3515, 668.5, 2741.9, 3017.1, 3501.87, 1.0962087619966345, 20.195853324869688, 0.7855127961819048], "isController": false}, {"data": ["GET Categories", 200, 0, 0.0, 911.2600000000002, 117, 3470, 626.5, 2181.2000000000003, 2467.1499999999983, 3009.940000000001, 1.0833884055772836, 1.1320562441090756, 0.7914025343163278], "isController": false}, {"data": ["POST User", 200, 0, 0.0, 1689.1549999999997, 343, 5748, 1104.0, 4486.6, 4748.95, 5492.460000000003, 1.0625581086465667, 19.555017474100147, 1.6715989839288086], "isController": false}, {"data": ["POST Update Profiles", 200, 0, 0.0, 2284.5750000000007, 1056, 5513, 2056.5, 3820.4000000000005, 4235.099999999999, 5017.87, 1.0636883393165801, 1.6853695070469352, 18.80498666234543], "isController": false}, {"data": ["PUT Update Product", 200, 0, 0.0, 1598.98, 467, 4262, 1308.0, 3017.7000000000003, 3520.2999999999997, 4025.6000000000004, 1.0835116612942548, 2.0878761817049054, 1.9010021636373486], "isController": false}, {"data": ["GET List Offer", 200, 0, 0.0, 844.5400000000002, 58, 2980, 531.0, 2191.6000000000004, 2450.9, 2804.8100000000004, 1.096815943316552, 1.4620963545951104, 0.9235532997707655], "isController": false}, {"data": ["PUT Update offer", 200, 0, 0.0, 1703.0699999999997, 310, 5751, 1057.0, 4505.3, 5204.75, 5517.4900000000025, 1.0989433659536356, 21.685377536842076, 1.7197605127669746], "isController": false}, {"data": ["POST User Sign in", 200, 0, 0.0, 1114.0499999999995, 77, 3988, 624.5, 3051.600000000002, 3203.5, 3808.250000000002, 1.06088976824863, 2.1929803659141425, 0.8365074381633877], "isController": false}, {"data": ["POST Offer-0", 200, 0, 0.0, 873.2399999999999, 16, 3276, 643.5, 1999.7, 2434.349999999998, 3099.9100000000008, 1.092054755625447, 1.416013225465625, 0.9304327847123255], "isController": false}, {"data": ["GET Profiles", 200, 0, 0.0, 897.7449999999998, 175, 3233, 548.5, 2008.5, 2457.7, 2937.3800000000015, 1.0737736163084737, 1.7013806631491635, 0.7830577985493319], "isController": false}, {"data": ["GET Product", 200, 0, 0.0, 1059.975, 84, 3270, 966.5, 1995.4, 2255.95, 2986.7700000000004, 1.0840695972681447, 1.4331844713805626, 0.8174456440728495], "isController": false}, {"data": ["PUT Update offer-1", 200, 0, 0.0, 948.8649999999998, 281, 3708, 597.5, 2516.1000000000004, 2897.1499999999987, 3493.980000000001, 1.1018858776796487, 20.3021127886941, 0.802149245621381], "isController": false}, {"data": ["POST Create Product", 200, 0, 0.0, 1708.5099999999995, 607, 4222, 1451.0, 3020.4, 3265.2999999999997, 3731.920000000002, 1.0620164506348202, 2.4363113712756412, 19.033782411414553], "isController": false}, {"data": ["POST Offer", 200, 0, 0.0, 1909.3399999999988, 244, 5995, 1284.5, 4757.7, 5269.7, 5851.770000000003, 1.0906969007847565, 21.50855886048078, 1.7108390390414956], "isController": false}, {"data": ["PUT Update offer-0", 200, 0, 0.0, 753.9749999999998, 17, 3462, 486.0, 1834.4000000000003, 2225.95, 2973.3500000000013, 1.100715465052284, 1.4397981735002752, 0.921236499036874], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3960, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

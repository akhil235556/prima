import React from "react";

export function CustomToolTip(tooltipModel: any) {
    // Tooltip Element
    var tooltipEl = document.getElementById('chartjs-tooltip');

    // Create element on first render
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        document.body.appendChild(tooltipEl);
    }

    // Hide if no tooltip
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
    }

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem: any) {
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        var titleLines = tooltipModel.title || [];
        var bodyLines = tooltipModel.body.map(getBody);

        var innerHtml = '<thead>';

        titleLines.forEach(function (title: any) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function (body: any, i: number) {
            var colors = tooltipModel.labelColors[i];
            var style = 'background:' + colors.backgroundColor;
            style += '; border-color:' + colors.borderColor;
            style += '; border-width: 2px';
            var span = '<span style="' + style + '"></span>';
            innerHtml += '<tr><td>' + span + body + '</td></tr>';
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        if (tableRoot)
            tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip

    // var position = document?.getElementById('_chart.canvas')?.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = "1";
    tooltipEl.style.position = 'absolute';
    // tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    // tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}


// tooltips: {
//     borderColor: blue,
//         borderWidth: 3,
//             backgroundColor: 'white',
//                 titleFontColor: 'black',
//                     intersect: false,
//                         caretSize: 0,
//                             callbacks: {
//         label: function (tooltipItem: any, data: any) {
//             var label = data.datasets[tooltipItem.datasetIndex].label || '';

//             if (label) {
//                 label += ': ';
//             }
//             label += (state.chartData && state.chartData.units && state.chartData.units.volume) ?
//                 tooltipItem.yLabel + " " + (state.chartData && state.chartData.units && state.chartData.units.volume) + ')' : tooltipItem.yLabel;
//             return label;
//         },
//         labelColor: function (tooltipItem: any, chart: any) {
//             return {
//                 borderColor: 'rgba(255, 255, 255, .4)',
//                 backgroundColor: 'rgba(255, 255, 255, .4)'
//             };
//         },
//         labelTextColor: function (tooltipItem: any, chart: any) {
//             return '#006CC9';
//         }
//     }
// },
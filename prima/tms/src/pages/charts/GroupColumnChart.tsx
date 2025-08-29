import Numeral from "numeral";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import './GroupColumnChart.css';

interface DataProps {
    data: any,
    title: string,
    height: any,
    width: any,
    options?: any,
}
export default function GroupColumnChart(props: DataProps) {
    const { title, data, height, width, options } = props;
    return (
        <section className="graph-wrap">
            <div>
                <label>{title}</label>
            </div>
            <div className="container-fluid chart-wrap">
                <Bar
                    data={data}
                    width={width}
                    height={height}
                    options={{
                        ...options,
                        maintainAspectRatio: false,
                        legend: {
                            position: "bottom",
                            labels: {
                                usePointStyle: true
                            }
                        },
                        tooltips: {
                            ...options.tooltips,
                            callbacks: {
                                label: function (tooltipItems: any, data: any) {
                                    return data.labels[tooltipItems.index] + ': ' + Numeral(tooltipItems.value).format('0,0.00');
                                }
                            }
                        },
                    }}
                />
            </div>
        </section>
    );

    // function onClickLegend() {

    // }
}
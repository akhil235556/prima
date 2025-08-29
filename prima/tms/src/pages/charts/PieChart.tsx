import React from 'react';
import './PieChart.css'
import { Pie } from 'react-chartjs-2';


interface DataProps {
    title?: string,
    data: any,
    options?: any,
    height?: any
    // labels: any
}
export default function PieChart(props: DataProps) {
    const { data, options, height, title } = props;
    return (
        <section className="graph-wrap">
            <label>{title}</label>
            <div className="container-fluid">
                <Pie
                    data={data}
                    options={{
                        ...options,
                        legend: {
                            ...options.legend,
                            position: "bottom",
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItems: any, data: any) {
                                    return data.labels[tooltipItems.index] + ': ' + data.datasets[0].data[tooltipItems.index] + ' %';
                                }
                            }
                        },
                    }}
                    height={height}
                />
            </div>
        </section>
    );
}
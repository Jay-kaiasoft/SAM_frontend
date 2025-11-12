import React, {useEffect} from 'react';
import {Chart, ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle} from 'chart.js';
Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, Decimation, Filler, Legend, Title, Tooltip, SubTitle);

class DoughnutWithPercentage extends DoughnutController {
    draw() {
        super.draw(arguments);
        let chart = this.chart;
        let width = chart.width,
            height = chart.height,
            ctx = chart.ctx;
        let fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.fillStyle = "#6D7278";
        ctx.textBaseline = "middle";
        let text = chart.config.data.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = (height+70) / 2;
        ctx.fillText(text, textX, textY);
    }
}
DoughnutWithPercentage.id = 'doughnutWithPercentage';
DoughnutWithPercentage.defaults = DoughnutController.defaults;
Chart.register(DoughnutWithPercentage);

const ChartJs = ({counter, type, data, options, isAnimated=true, isBreakLine=false}) => {
    useEffect(()=> {
        const ctx = document.getElementById(`myChart${counter}`).getContext('2d');
        let newOptions;
        if(!isAnimated){
            newOptions = {...options,animation:false};
        } else {
            newOptions = options;
        }
        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: newOptions,
            plugins: isBreakLine ? [breakXAxisLinePlugin] : []
        });
        return () => {
            chart.destroy();
        }
    },[counter, type, data, options, isAnimated]);
    return (
        <canvas id={`myChart${counter}`}></canvas>
    );
}
const breakXAxisLinePlugin = {
    id: 'breakXAxisLine',
    afterDraw(chart) {
        const { ctx } = chart;
        const xScale = chart.scales.x;
        const yScale = chart.scales.y;
        ctx.save();
        ctx.strokeStyle = '#dadada';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        const ticks = xScale.getTicks();
        for (let i = 0; i < ticks.length; i++) {
            const x = xScale.getPixelForTick(i);
            const nextX = i + 1 < ticks.length ? xScale.getPixelForTick(i + 1) : x + 20;
            const segmentWidth = (nextX - x) * 0.6;
            const segmentStart = x - segmentWidth / 2;
            const segmentEnd = x + segmentWidth / 2;
            ctx.beginPath();
            ctx.moveTo(segmentStart, yScale.bottom);
            ctx.lineTo(segmentEnd, yScale.bottom);
            ctx.stroke();
        }
        ctx.restore();
    }
};

export default ChartJs;
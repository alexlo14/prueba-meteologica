<script>
    import { onMount, afterUpdate } from 'svelte';
    import Chart from 'chart.js/auto';

    export let visibleData = [];
    let canvas;
    let chart;

    onMount(() => {
        chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
            {
                label: 'Temperatura (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                tension: 0.3
            },
            {
                label: 'Potencia (W)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y1' // eje secundario
            }
            ]
        },
        options: {
            responsive: true,
            scales: {
            x: { title: { display: true, text: 'Hora' } },
            y: { title: { display: true, text: 'Temperatura (°C)' } },
            y1: {
                position: 'right',
                title: { display: true, text: 'Potencia (W)' },
                grid: { drawOnChartArea: false }
            }
            }
        }
        });
    });

    afterUpdate(() => {
        if (!chart || !visibleData.length) return;
        const latest = visibleData[visibleData.length - 1];
        chart.data.labels.push(latest.time);
        chart.data.datasets[0].data.push(latest.temperature);
        chart.data.datasets[1].data.push(latest.power);
        chart.update();
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        width: 100%;
        max-height: 400px;
    }
</style>

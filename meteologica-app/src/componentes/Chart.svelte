<script>
    import { onMount, afterUpdate } from 'svelte';
    import Chart from 'chart.js/auto';

    // Recibe los datos visibles desde App.svelte
    export let visibleData = [];

    // Referencia al elemento <canvas> donde se pintará la gráfica
    let canvas;

    // Variable para almacenar la instancia de la gráfica Chart.js
    let chart;

    // Se ejecuta una vez, cuando el componente se monta por primera vez
    onMount(() => {
        // Creamos una nueva gráfica de tipo 'line' (línea)
        chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: [], // Eje X (tiempo)
            datasets: [
            {
                label: 'Temperatura (°C)',
                data: [], // Valores Y de temperatura
                borderWidth: 2
            },
            {
                label: 'Energía (kWh)',
                data: [], // Valores Y de energía
                borderWidth: 2
            }
            ]
        },
        options: {
            responsive: true,
            scales: {
            x: {
                title: { display: true, text: 'Hora' }
            },
            y: {
                title: { display: true, text: 'Valor' }
            }
            }
        }
        });
    });

    // Se ejecuta cada vez que cambia 'visibleData'
    afterUpdate(() => {
        if (!chart || !visibleData.length) return;

        // Tomamos el último valor visible
        const latest = visibleData[visibleData.length - 1];

        // Añadimos los nuevos datos a la gráfica
        chart.data.labels.push(latest.time);
        chart.data.datasets[0].data.push(latest.temperature);
        chart.data.datasets[1].data.push(latest.energy);

        // Actualizamos la gráfica en pantalla
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

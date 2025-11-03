<script>
    // Importamos funciones de Svelte y Chart.js
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';

    // Recibimos como prop el array de datos visibles
    export let visibleData = [];
    export let selectedVariable = 'ambas';
    let canvas;
    let chart;
    let resizeObserver

    // Se ejecuta una sola vez cuando el componente se monta
    onMount(() => {
        // Inicializamos el gráfico de líneas
        chart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)', // color de la línea
                    borderWidth: 2, 
                    tension: 0.3 // curvatura de la línea
                },
                {
                    label: 'Potencia (KW)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: 'y1' // eje secundario
                }
                ]
            },
            options: {
                responsive: true, // para que se adapte al tamaño de pantalla
                maintainAspectRatio: false,
                scales: {
                x: { title: { display: true, text: 'Hora (hh:mm:ss)' } },
                y: { title: { display: true, text: 'Temperatura (°C)' } },
                y1: {
                    position: 'right',
                    title: { display: true, text: 'Potencia (KW)' },
                    grid: { drawOnChartArea: false }
                }
                }
            }
        });

        resizeObserver = new ResizeObserver(() => chart?.resize());
        resizeObserver.observe(canvas);
    });

    // Se ejecuta cada vez que visibleData cambia
    afterUpdate(() => {
        // Si aún no hay gráfico o no hay datos, no hacemos nada
        if (!chart || !visibleData.length) return;

        // Tomamos el último dato visible
        const latest = visibleData[visibleData.length - 1];

        // Añadimos el valor de time, temperatura y power a sus datasets
        chart.data.labels.push(latest.time);
        chart.data.datasets[0].data.push(latest.temperature);
        chart.data.datasets[1].data.push(latest.power);

        // Mostrar u ocultar datasets según la selección
        chart.getDatasetMeta(0).hidden = selectedVariable === 'potencia';
        chart.getDatasetMeta(1).hidden = selectedVariable === 'temperatura';

        // Actualizamos el gráfico
        chart.update();
    });

    onDestroy(() => {
        resizeObserver?.disconnect();
        chart?.destroy();
    });
</script>

<canvas bind:this={canvas}></canvas>
<script>
    import { onMount, afterUpdate, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-date-fns';

    // Recibimos los datos visibles desde el componente padre (App.svelte)
    export let visibleData = [];
    export let selectedVariable = 'ambas';

    // Referencia al elemento <canvas> donde se renderiza el gráfico
    let canvas;
    let chart;
    let resizeObserver;

    // onMount()
    onMount(() => {
        // Creamos un nuevo gráfico de tipo 'line'
        chart = new Chart(canvas, {
        type: 'line',
        data: {
            // Creamos los datasets vacíos que se llenarán dinámicamente
            datasets: [
            {
                label: 'Temperatura (°C)',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y'
            },
            {
                label: 'Potencia (W)',
                data: [],
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                tension: 0.3,
                yAxisID: 'y1'
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
            x: {
                type: 'time', // Activa el eje de tipo tiempo
                time: {
                    unit: 'minute', // Intervalos de minutos
                    displayFormats: { minute: 'HH:mm' },
                    tooltipFormat: 'HH:mm:ss' // Formato al pasar el ratón
                },
                title: { 
                    display: true, 
                    text: 'Hora' 
                }, 
                ticks: {
                    autoSkip: true,              
                    maxTicksLimit: 10 
                }
            },
            y: { 
                title: { 
                    display: true, 
                    text: 'Temperatura (°C)' 
                } 
            },
            y1: {
                position: 'right',
                title: { 
                    display: true, 
                    text: 'Potencia (W)' 
                },
                grid: { 
                    drawOnChartArea: false 
                }
            }
            },
            plugins: {
                legend: { 
                    position: 'bottom' 
                }   
            }
        }
        });

        // Observador que detecta cuando cambia el tamaño del contenedor
        // S ajusta el tamaño del gráfico automáticamente
        resizeObserver = new ResizeObserver(() => chart?.resize());
        resizeObserver.observe(canvas);
    });

    // afterUpdate()
    // Se ejecuta cada vez que cambian las variables reactivas (como visibleData)
    afterUpdate(() => {
        // Si no hay gráfico o no hay datos, no hacemos nada
        if (!chart || !visibleData.length) return;

        // Obtenemos el último registro recibido
        const latest = visibleData[visibleData.length - 1];

        // Convertimos la hora "HH:mm:ss" del YAML a un objeto Date válido
        const timeObj = new Date(`1970-01-01T${latest.time}`);

        // Añadimos un nuevo punto de temperatura al dataset 0
        chart.data.datasets[0].data.push({
            x: timeObj,
            y: latest.temperature
        });

        // Añadimos un nuevo punto de potencia al dataset 1
        chart.data.datasets[1].data.push({
            x: timeObj,
            y: latest.power
        });

        // Mostramos/ocultamos datasets según la variable seleccionada
        chart.getDatasetMeta(0).hidden = selectedVariable === 'potencia';
        chart.getDatasetMeta(1).hidden = selectedVariable === 'temperatura';

        // Calculamos el rango de tiempo visible (últimos 3 minutos)
        const now = timeObj.getTime();
        const threeMinutesAgo = now - 3 * 60 * 1000;  // Restamos 3 minutos en ms

        // Eliminamos los puntos más antiguos fuera del rango de 3 minutos
        chart.data.datasets.forEach(ds => {
        ds.data = ds.data.filter(point => point.x.getTime() >= threeMinutesAgo);
        });

        // Ajustamos el rango visible del eje X al nuevo intervalo de 3 minutos
        chart.options.scales.x.min = threeMinutesAgo;
        chart.options.scales.x.max = now;

        // Actualizamos el gráfico
        chart.update('none');
    });

    // onDestroy()
    onDestroy(() => {
        // Desconectamos el observador de tamaño
        resizeObserver?.disconnect();

        // Destruimos el gráfico para liberar memoria
        chart?.destroy();
    });
</script>

<!-- Div del gráfico -->
<div class="chart-container">
    <canvas bind:this={canvas}></canvas>
</div>


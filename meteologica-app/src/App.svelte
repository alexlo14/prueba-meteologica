<script>
  import { onMount } from 'svelte';
  import { loadForecast } from './utils/parseYAML.js';
  import Chart from './componentes/Chart.svelte';
  import InfoCard from './componentes/InfoCard.svelte';

  // Variables reactivas del componente principal
  let data = [];        // Almacena todos los datos del archivo YAML
  let visibleData = []; // Almacena solo los datos que se van mostrando progresivamente
  let index = 0;        // Índice que controla el avance del "stream" de datos

  // onMount se ejecuta cuando el componente se carga por primera vez
  onMount(async () => {
    // Cargamos los datos del archivo YAML
    data = await loadForecast();
    console.log('Datos cargados:', data);
    
    // Creamos un intervalo que cada 5 segundos añade un nuevo valor
    const interval = setInterval(() => {
      if (index < data.length) {
        visibleData = [...visibleData, data[index]]; // Añade un nuevo punto al array visible
        index++;
      } else {
        clearInterval(interval); // Detiene el proceso cuando se han mostrado todos los datos
      }
    }, 5000);
  });
</script>

<main>
  <h1>🌤️ Predicción Meteorológica</h1>

  <!-- Mostramos la última lectura -->
  <InfoCard lastValue={visibleData[visibleData.length - 1]} />

  <!-- Mostramos la gráfica -->
  <Chart {visibleData} />
</main>

<style>
  main {
    max-width: 800px;
    margin: 2rem auto;
    font-family: system-ui, sans-serif;
    padding: 1rem;
  }

  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
</style>

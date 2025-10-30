<script>
  import { onMount } from 'svelte'; // Hook para ejecutar código al iniciar el componente
  import { loadForecast } from './utils/parseYAML.js'; // Función que carga y procesa el data.yml
  import Chart from './componentes/Chart.svelte';
  import InfoCard from './componentes/InfoCard.svelte';

  let data = []; // Almacenará todos los datos del YAML (temperatura y potencia)
  let visibleData = []; // Contendrá los datos que ya se han mostrado progresivamente
  let index = 0;

  // Variable reactiva: se actualiza automáticamente cuando visibleData cambia
  // Guarda el último valor visible (última lectura mostrada)
  $: lastValue = visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;

  onMount(async () => {
    // Llamamos a la función que carga y procesa el YAML
    data = await loadForecast();

    // Mostramos inmediatamente el primer valor para no esperar 5 segundos
    if (data.length > 0) {
      visibleData = [data[0]];
      index = 1;
    }

    // Creamos un intervalo que se ejecuta cada 5 segundos
    const interval = setInterval(() => {
      if (index < data.length) {
        // Añadimos el siguiente dato al array visible (reactividad)
        visibleData = [...visibleData, data[index]];
        index++;
      } else {
        // Cuando llegamos al final, paramos el intervalo
        clearInterval(interval);
      }
    }, 5000);
  });

  // Cada vez que cambia lastValue, lo mostramos por consola (útil para depurar)
  // $: if (lastValue) console.log("Último valor:", lastValue);
</script>

<main>
  <h1>🌤️ Datos meteorológicos 🌤️</h1>
  <h3>*Proporcionados por el archivo "data.yml".</h3>

  <!-- Pasamos el último valor a InfoCard -->
  <InfoCard {lastValue} />

  <!-- Pasamos los datos visibles a Chart -->
  <Chart {visibleData} />
</main>
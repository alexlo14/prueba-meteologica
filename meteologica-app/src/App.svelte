<script>
  import { onMount } from 'svelte';
  import { loadForecast } from './utils/parseYAML.js';
  import Chart from './componentes/Chart.svelte';
  import InfoCard from './componentes/InfoCard.svelte';

  let data = [];
  let visibleData = [];
  let index = 0;
  $: lastValue = visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;

  onMount(async () => {
    data = await loadForecast();
    console.log("Datos cargados:", data.length, data[0]);

    if (data.length > 0) {
      visibleData = [data[0]];
      index = 1;
    }

    const interval = setInterval(() => {
      if (index < data.length) {
        visibleData = [...visibleData, data[index]];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  });
</script>

<main>
  <h1>🌡️ Temperatura y ⚡ Potencia</h1>
  <InfoCard {lastValue} />
  <Chart {visibleData} />
</main>

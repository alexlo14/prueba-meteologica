<script>
  import { onMount, onDestroy } from 'svelte';
  import { loadForecast } from './utils/parseYAML.js';
  import Chart from './componentes/Chart.svelte';
  import InfoCard from './componentes/InfoCard.svelte';

  let data = [];          // Todos los registros del YAML
  let visibleData = [];   // Datos que se van mostrando en la gráfica
  let lastValue = null;   // Último registro mostrado
  let intervalId;         // ID del intervalo para limpiar al desmontar
  let clockInterval;      // Intervalo para el reloj
  let currentTime = '';   // Hora actual en formato "HH:mm:ss"

  // Función auxiliar: convierte "HH:mm:ss" → formato estándar con ceros a la izquierda
  const pad = (n) => String(n).padStart(2, '0');

  // Devuelve la hora actual en formato "HH:mm:ss" (24h)
  const getNowHHMMSS = () => {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  onMount(async () => {
    // Iniciar reloj en tiempo real
    currentTime = getNowHHMMSS();
    clockInterval = setInterval(() => {
      currentTime = getNowHHMMSS();
    }, 1000);

    // 1️⃣ Cargar todos los datos del YAML
    data = await loadForecast();

    if (!data || data.length === 0) return;

    // 2️⃣ Crear un conjunto con todas las horas del YAML para búsqueda rápida
    const yamlTimes = new Set(data.map(d => d.time));

    // 3️⃣ Ejecutar una comprobación cada segundo
    intervalId = setInterval(() => {
      const now = getNowHHMMSS(); // Hora actual real
      //console.log('Hora actual:', now);

      // 4️⃣ Si hay coincidencia exacta con algún time del YAML...
      if (yamlTimes.has(now)) {
        // Buscar el registro correspondiente
        const record = data.find(d => d.time === now);

        // Si es nuevo (no repetido), lo añadimos
        if (!lastValue || record.time !== lastValue.time) {
          visibleData = [...visibleData, record];
          lastValue = record;
          console.log('Coincidencia encontrada →', record);
        }
      }
    }, 1000); // cada segundo
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

<!-- HEADER -->
<header class="header">
  <div class="header-content">
    <img src="/logo_meteologica.png" alt="Meteológica" class="logo" />
    <h1 class="title">Meteológica — Prueba técnica</h1>
    <div class="clock">🕐 {currentTime}</div>
  </div>
</header>

<!-- MAIN -->
<main>
  <!-- <h1>⛅ Datos meteorológicos en tiempo real ⛅</h1> -->
  <InfoCard {lastValue} />
  <Chart {visibleData} />
</main>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer-content">
    <p>Desarrollado por <strong>Alejandro Lobo</strong> © 2025</p>
  </div>
</footer>

<style>
  :global(#app) {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
  }
</style>

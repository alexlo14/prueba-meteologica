<script>
    // Recibimos como prop el último valor leído
    export let lastValue;

    // Variable que controla la animación
    let animate = false;

    // Observador reactivo: cada vez que cambia lastValue, activamos el efecto
    $: if (lastValue) {
        animate = true;                // activa la clase "updated"
        const timeout = setTimeout(() => (animate = false), 600); // la quita tras 0.6 s
    }
</script>

{#if lastValue}
    <!-- Si ya tenemos un valor, lo mostramos -->
    <div class="info-card {animate ? 'updated' : ''}">
        <h2>Última actualización</h2>
        <p>🕒 Hora: {lastValue.time}</p>
        <p>🌡️ Temperatura: {lastValue.temperature.toFixed(2)} °C</p>
        <p>⚡ Potencia: {lastValue.power.toFixed(0) ?? '—'} KW</p>
    </div>
{:else}
    <!-- Si aún no hay datos, mostramos un mensaje de carga -->
    <p>Cargando datos meteorológicos...</p>
{/if}
<script>
  export let lastValue;
</script>

{#if lastValue}
    <div class="info-card">
        <h2>Última actualización: {lastValue.time}</h2>
        <p>🌡️ Temperatura: {lastValue.temperature.toFixed(2)} °C</p>
        <p>⚡ Potencia: {lastValue.power ?? '—'} W</p>
    </div>
{:else}
    <p>Cargando datos meteorológicos...</p>
{/if}

<style>
    .info-card {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 0.8rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
</style>

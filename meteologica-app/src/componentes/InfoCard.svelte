<script>
    // Recibimos como prop el último valor leído
    export let lastValue;
</script>

{#if lastValue}
    <!-- Si ya tenemos un valor, lo mostramos -->
    <div class="info-card">
        <h2>Últimos valores recibidos</h2>
        <p>🕒 Hora: {lastValue.time}</p>
        <p>🌡️ Temperatura: {lastValue.temperature.toFixed(2)} °C</p>
        <p>⚡ Potencia: {lastValue.power ?? '—'} KW</p>
    </div>
{:else}
    <!-- Si aún no hay datos, mostramos un mensaje de carga -->
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

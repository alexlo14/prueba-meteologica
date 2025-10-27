<script>
    // Este componente muestra la información más reciente de las predicciones (último valor recibido).
    export let lastValue; // Recibe una variable 'lastValue' desde el componente padre (App.svelte).
</script>

{#if lastValue}
    <div class="info-card">
        <!-- Mostramos la hora y los valores de temperatura y energía -->
        <h2>Última actualización: {lastValue.time}</h2>
        <p>🌡️ Temperatura media: {lastValue.temperature} °C</p>
        <p>⚡ Energía producida: {lastValue.energy} kWh</p>
    </div>
{:else}
    <!-- En caso de que aún no haya datos -->
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

    h2 {
        margin-bottom: 0.5rem;
    }
</style>

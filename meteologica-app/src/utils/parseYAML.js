// src/utils/parseYAML.js
import yaml from 'js-yaml';

/**
 * Carga y parsea el archivo YAML (temperatura y potencia)
 */
export async function loadForecast() {
    const res = await fetch('/data.yml'); // ubicado en /public
    const text = await res.text();
    const raw = yaml.load(text);

    // Extraemos los arrays de temperatura y potencia
    // @ts-ignore
    const tempValues = raw?.temperature?.values || [];
    // @ts-ignore
    const powerValues = raw?.power?.values || [];

    // Combinamos ambos arrays según el campo "time"
    const combined = tempValues.map(t => {
        const powerMatch = powerValues.find(p => p.time === t.time);
        return {
            time: t.time,
            temperature: (Number(t.value) / 10) - 273.15, // deciKelvin → Celsius
            power: powerMatch ? Number(powerMatch.value) : null
        };
    });

    return combined;
}

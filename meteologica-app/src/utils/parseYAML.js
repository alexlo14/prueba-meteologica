// Importamos la librería js-yaml para convertir texto YAML a objetos JavaScript
import yaml from 'js-yaml';

/**
 * Función que carga y procesa el archivo YAML con los datos.
 * Devuelve un array de objetos con { time, temperature, power }.
 */
export async function loadForecast() {
    // Hacemos una petición al archivo data.yml,
    const res = await fetch('/data.yml'); // ubicado en /public
    // Convertimos el contenido obtenido a texto plano
    const text = await res.text();
      // Parseamos el texto YAML y lo transformamos en un objeto JavaScript
    const raw = yaml.load(text);

    // Extraemos los arrays de temperatura y potencia
    // @ts-ignore
    const tempValues = raw?.temperature?.values || [];
    // @ts-ignore
    const powerValues = raw?.power?.values || [];

    // Combinamos ambos arrays según el campo "time"
    const combined = tempValues.map(t => {
        // Buscamos el valor de potencia que tenga la misma hora que la temperatura actual
        const powerMatch = powerValues.find(p => p.time === t.time);
        // Devolvemos un objeto con las tres propiedades necesarias
        return {
            time: t.time,
            temperature: (Number(t.value) / 10) - 273.15, // deciKelvin a Celsius
            power: powerMatch ? Number(powerMatch.value) * 1000 : null //megavatios (MW) a kilovatios (KW)
        };
    });

    // Retornamos el array completo
    return combined;
}

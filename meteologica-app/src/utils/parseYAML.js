// Importamos la librería js-yaml, que nos permite leer y convertir archivos YAML a objetos JavaScript.
import yaml from 'js-yaml';

import dataUrl from '../data/data.yml?url';

/**
 * Carga y parsea el archivo YAML.
 * Este archivo está ubicado en la carpeta "public" del proyecto.
 */
export async function loadForecast() {
    // Usamos fetch() para obtener el contenido del archivo forecast.yml.
    // En Vite, todo lo que esté en /public se sirve en la raíz del servidor.
    const res = await fetch(dataUrl);

    // Convertimos la respuesta a texto plano.
    const text = await res.text();

    // Convertimos el texto YAML en un objeto JavaScript usando js-yaml.
    return yaml.load(text);
}

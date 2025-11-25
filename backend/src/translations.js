import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Importujesz wychodząc katalog wyżej do shared
const pl = require("../storage/notificationsLocales/pl.json");
const en = require("../storage/notificationsLocales/en.json");

const translations = { pl, en };

export function getTranslation(lang, key, args = {}) {
    const dict = translations[lang] || translations['en'];
    let text = dict[key];

    // Jeśli klucza nie ma w wybranym języku, spróbuj pobrać z fallback (angielskiego)
    if (!text && lang !== 'en')
        text = translations['en'][key];

    if (!text) {
        console.warn(`Missing translation key: ${key} for lang: ${lang}`);
        return key;
    }

    if (!args)
        return text;

    if (typeof args === 'object' && !Array.isArray(args)) {
        Object.keys(args).forEach(k => {
            const value = args[k] !== undefined ? args[k] : '';
            text = text.replaceAll(`{{${k}}}`, value);
        });
    }

    // Wariant B: Tablica (np. ["Jan"]) - styl printf (%s)
    else if (Array.isArray(args)) {
        args.forEach(arg => {
            // Tutaj zwykły replace jest OK, bo chcemy zamieniać %s po kolei (pierwszy %s, potem drugi %s itd.)
            text = text.replace('%s', arg !== undefined ? arg : '');
        });
    }

    return text;
}
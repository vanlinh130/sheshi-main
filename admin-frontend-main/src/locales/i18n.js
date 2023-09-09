import LocalStorage from '@/utils/storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTransition from './transitions/en.json';
import enError from './errors/en.json';
import enValidation from './validations/en.json';

import viTransition from './transitions/vi.json';
import viError from './errors/vi.json';
import viValidation from './validations/vi.json';

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            vi: {
                translations: viTransition,
                errors: viError,
                validations: viValidation,
            },
            en: {
                translations: enTransition,
                errors: enError,
                validations: enValidation,
            },
        },
        lng: LocalStorage.has('lang') && LocalStorage.get('lang') === 'en' ? 'en' : 'vi',
        fallbackLng: ['vi', 'en'],
        debug: false,
        ns: ['translations', 'errors', 'validations'],
        defaultNS: 'translations',
        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
        },
        react: {
            wait: true,
        },
    });

export default i18n;

import React from 'react'
import { createRoot } from 'react-dom/client'
import MainApp from './app/main'

import '@/locales/i18n'
import '@popperjs/core/dist/umd/popper.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/resources/styles/index.scss'
import '@/resources/fonts/RV-Harmonia-Regular.ttf';
import '@/resources/fonts/RV-Harmonia-Light.ttf';
import '@/resources/fonts/RV-Harmonia-Bold.ttf';

const container = document.getElementById('application')
const root = createRoot(container)

root.render(<MainApp />)

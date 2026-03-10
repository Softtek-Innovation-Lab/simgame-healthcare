export const BUDGET = 10000;

export const metricsInfo = {
    nps: {
        name: 'NPS (Satisfacción Paciente)',
        short: 'NPS',
        description: 'Experiencia del paciente, reducción de reclamos y mejora en percepción del servicio'
    },
    evitarBurnout: {
        name: 'Evitar Burnout',
        short: 'Burnout',
        description: 'Satisfacción del equipo médico, reducción de carga de trabajo y mejora del clima laboral'
    },
    eficiencia: {
        name: 'Eficiencia Operativa',
        short: 'Efic.',
        description: 'Optimización de recursos, ahorro de costos y mejor aprovechamiento de capacidad instalada'
    },
    accuracy: {
        name: 'Accuracy (Precisión Médica)',
        short: 'Accur.',
        description: 'Calidad del diagnóstico, reducción de errores médicos y mejores outcomes clínicos'
    },
    goToMkt: {
        name: 'Go-to-Market (Velocidad)',
        short: 'GTM',
        description: 'Rapidez de implementación, transformación digital ágil y resultados tempranos'
    }
};

export const metricNames = {
    nps: 'NPS',
    evitarBurnout: 'Burnout',
    eficiencia: 'Efic.',
    accuracy: 'Accur.',
    goToMkt: 'GTM'
};

export const metricNamesLong = {
    nps: 'NPS (Satisfacción Paciente)',
    evitarBurnout: 'Evitar Burnout (Satisfacción Staff)',
    eficiencia: 'Eficiencia (Ahorro & Recursos)',
    accuracy: 'Accuracy (Precisión Médica)',
    goToMkt: 'Go-to-Market (Velocidad)'
};

export const categoryColors = {
    'Tecnología AI': { border: '#06b6d4', dot: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', icon: '🤖' },
    'Procesos': { border: '#f59e0b', dot: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🔄' },
    'Experiencia Paciente': { border: '#10b981', dot: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '👥' }
};

export const decisionsData = [
    // TECNOLOGÍA AI (5 decisions)
    {
        id: 1, decision: "AI de triage predictivo", categoria: "Tecnología AI", costo: 3500,
        nps: 4, evitarBurnout: 4, eficiencia: 5, accuracy: 5, goToMkt: 2
    },
    {
        id: 2, decision: "Copiloto de documentación clínica", categoria: "Tecnología AI", costo: 3000,
        nps: 3, evitarBurnout: 5, eficiencia: 4, accuracy: 4, goToMkt: 2
    },
    {
        id: 3, decision: "Predicción de altas y gestión de camas", categoria: "Tecnología AI", costo: 2500,
        nps: 3, evitarBurnout: 3, eficiencia: 5, accuracy: 3, goToMkt: 3
    },
    {
        id: 4, decision: "Alertas inteligentes de riesgo clínico", categoria: "Tecnología AI", costo: 2000,
        nps: 2, evitarBurnout: 3, eficiencia: 3, accuracy: 5, goToMkt: 3
    },
    {
        id: 5, decision: "Análisis predictivo de demanda y recursos", categoria: "Tecnología AI", costo: 1500,
        nps: 2, evitarBurnout: 2, eficiencia: 4, accuracy: 2, goToMkt: 3
    },

    // PROCESOS (5 decisions)
    {
        id: 6, decision: "Protocolos clínicos estandarizados con IA", categoria: "Procesos", costo: 2500,
        nps: 2, evitarBurnout: 2, eficiencia: 4, accuracy: 5, goToMkt: 2
    },
    {
        id: 7, decision: "Rediseño de roles y responsabilidades", categoria: "Procesos", costo: 2000,
        nps: 3, evitarBurnout: 4, eficiencia: 4, accuracy: 3, goToMkt: 3
    },
    {
        id: 8, decision: "Separación de flujos de atención", categoria: "Procesos", costo: 1800,
        nps: 3, evitarBurnout: 3, eficiencia: 4, accuracy: 3, goToMkt: 3
    },
    {
        id: 9, decision: "Sala de control operativa en tiempo real", categoria: "Procesos", costo: 1800,
        nps: 2, evitarBurnout: 3, eficiencia: 5, accuracy: 3, goToMkt: 4
    },
    {
        id: 10, decision: "Fast-track por nivel de complejidad", categoria: "Procesos", costo: 1500,
        nps: 4, evitarBurnout: 3, eficiencia: 5, accuracy: 3, goToMkt: 4
    },

    // EXPERIENCIA PACIENTE (5 decisions)
    {
        id: 11, decision: "Chatbot asistente multicanal", categoria: "Experiencia Paciente", costo: 1500,
        nps: 4, evitarBurnout: 2, eficiencia: 3, accuracy: 2, goToMkt: 4
    },
    {
        id: 12, decision: "App de seguimiento post-alta", categoria: "Experiencia Paciente", costo: 1200,
        nps: 4, evitarBurnout: 1, eficiencia: 3, accuracy: 3, goToMkt: 4
    },
    {
        id: 13, decision: "Portal de resultados y estudios online", categoria: "Experiencia Paciente", costo: 1100,
        nps: 5, evitarBurnout: 1, eficiencia: 2, accuracy: 2, goToMkt: 5
    },
    {
        id: 14, decision: "Sistema de turnos y notificaciones digitales", categoria: "Experiencia Paciente", costo: 1000,
        nps: 4, evitarBurnout: 1, eficiencia: 2, accuracy: 1, goToMkt: 5
    },
    {
        id: 15, decision: "Pantallas informativas en sala de espera", categoria: "Experiencia Paciente", costo: 800,
        nps: 5, evitarBurnout: 1, eficiencia: 2, accuracy: 1, goToMkt: 5
    }
];

export const decisionDescriptions = {
    1: {
        desc: 'Sistema de inteligencia artificial que evalúa automáticamente la urgencia y complejidad de cada paciente al ingresar a la guardia.',
        impl: 'Reduce tiempos de espera para casos críticos, mejora precisión diagnóstica, disminuye carga cognitiva del personal. Requiere integración profunda con sistemas existentes (6-8 meses).'
    },
    2: {
        desc: 'Asistente de IA que transcribe automáticamente consultas médicas y genera documentación clínica en tiempo real.',
        impl: 'Reduce hasta 2 horas de tiempo administrativo por turno, mejora calidad de vida del equipo. Requiere infraestructura de audio y validación médica.'
    },
    3: {
        desc: 'Sistema predictivo que anticipa altas hospitalarias y optimiza asignación de camas disponibles.',
        impl: 'Optimiza flujo entre guardia e internación, reduce esperas en camillas de pasillo. Requiere integración con múltiples sistemas.'
    },
    4: {
        desc: 'Monitoreo en tiempo real de signos vitales y laboratorios, detectando patrones de deterioro clínico.',
        impl: 'Previene eventos adversos mediante detección precoz, reduce mortalidad evitable. Puede generar fatiga de alertas si no está calibrado.'
    },
    5: {
        desc: 'Business intelligence que analiza patrones históricos y contextuales para predecir picos de demanda.',
        impl: 'Optimización proactiva de recursos, reducción de costos, anticipación a saturación. Requiere datos históricos de calidad.'
    },
    6: {
        desc: 'Guías clínicas digitales asistidas por IA que sugieren diagnóstico y tratamiento óptimo según evidencia actualizada.',
        impl: 'Reduce variabilidad en práctica clínica, mejora outcomes por adherencia a mejores prácticas. Requiere consenso médico.'
    },
    7: {
        desc: 'Reorganización del equipo redistribuyendo tareas según competencias específicas (enfermeros de práctica avanzada, médicos generalistas, especialistas).',
        impl: 'Cada profesional trabaja en el tope de su licencia, reduce burnout. Requiere gestión del cambio y ajustes culturales significativos.'
    },
    8: {
        desc: 'Circuitos diferenciados según complejidad: consultorio rápido, observación breve, área crítica, zona de procedimientos.',
        impl: 'Reduce tiempos de espera para casos simples, mejor experiencia del paciente. Requiere remodelación física o reingeniería de espacios.'
    },
    9: {
        desc: 'Centro de comando con dashboards en tiempo real: ocupación, tiempos de espera, alertas, disponibilidad de recursos.',
        impl: 'Visibilidad total del estado operativo, intervención proactiva ante problemas. Requiere infraestructura tecnológica robusta.'
    },
    10: {
        desc: 'Circuito express para pacientes de baja complejidad con atención en menos de 60 minutos.',
        impl: 'Mejora dramática en satisfacción, descongestiona circuito principal. Fácil implementación con ajustes organizacionales menores.'
    },
    11: {
        desc: 'Asistente virtual 24/7 en web, WhatsApp y app que responde consultas, explica tiempos de espera, orienta sobre síntomas.',
        impl: 'Reduce consultas administrativas, mejora expectativas. Implementación rápida con plataformas comerciales existentes.'
    },
    12: {
        desc: 'App móvil post-alta con plan de cuidados, recordatorios de medicación, canal de consultas y síntomas de alarma.',
        impl: 'Reduce reconsultas evitables, mejora adherencia al tratamiento. Mayor seguridad percibida post-alta.'
    },
    13: {
        desc: 'Plataforma web donde pacientes acceden a resultados de laboratorio, imágenes e informes sin volver presencialmente.',
        impl: 'Elimina filas para retiro de estudios, mayor transparencia. Implementación rápida con sistemas de laboratorio modernos.'
    },
    14: {
        desc: 'Turnos virtuales con actualizaciones por SMS/WhatsApp sobre posición en fila y notificaciones de turno próximo.',
        impl: 'Reduce ansiedad por falta de información, descongestiona sala de espera. Tecnología simple y económica de implementar.'
    },
    15: {
        desc: 'Pantallas digitales mostrando tiempos de espera, cantidad de pacientes, contenido educativo y campañas de prevención.',
        impl: 'Gestiona expectativas proactivamente, reduce consultas ansiosas. Inversión mínima con impacto inmediato en percepción.'
    }
};

export function formatNumber(num) {
    return num.toLocaleString('es-AR');
}

export function calculateAverages(selectedIds) {
    const selected = selectedIds.map(id => decisionsData.find(d => d.id === id));
    const metrics = ['nps', 'evitarBurnout', 'eficiencia', 'accuracy', 'goToMkt'];

    const result = {};
    metrics.forEach(metric => {
        const sum = selected.reduce((acc, d) => acc + d[metric], 0);
        result[metric] = parseFloat((sum / selected.length).toFixed(2));
    });

    return result;
}

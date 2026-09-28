import { createReportView } from './memoriaView.js';
import { renderPedagogicalReport } from '../report/pedagogical.js';

export const pedagogicoView = createReportView(
  'Relatório Pedagógico da Simulação — Simulador Hídrico Cidadão', renderPedagogicalReport
);

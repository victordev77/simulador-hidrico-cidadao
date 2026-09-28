import { state } from '../state.js';
import { captureReport } from '../report/snapshot.js';
import { renderReport, escapeHtml } from '../report/render.js';

export function createReportView(title, renderDocument) {
 return {
  title,

  render() {
    try {
      this.record = captureReport(state);
      this.error = null;
    } catch (error) {
      this.record = null;
      this.error = error.message;
    }
    if (!this.record) return `<div class="section"><h1>Não foi possível gerar o relatório</h1><p role="alert">${escapeHtml(this.error)}</p><p>Corrija os parâmetros indicados na simulação. Não foi emitido um documento com os últimos valores válidos em lugar das entradas atuais.</p><a class="btn btn-primary" href="/simular">Corrigir parâmetros</a></div>`;
    return `<div class="section scientific-report-page">
      <div class="no-print sr-actions"><a href="/simular" class="btn-link">← Voltar à simulação</a><button class="btn btn-secondary" id="btnRegenerateReport">Gerar novo relatório</button><button class="btn btn-primary" id="btnPrintReport" disabled>Imprimir / Salvar em PDF</button></div>
      <div class="no-print sr-print-help"><p>O botão abre o diálogo de impressão do navegador. Para salvar, escolha “Salvar como PDF”, papel A4 e escala 100%. Desative os cabeçalhos e rodapés automáticos para evitar endereço e data duplicados.</p><p>A numeração editorial é compatível com navegadores que suportam margens CSS paginadas, como Chrome/Edge 131 ou posteriores. Em outros navegadores, confira a prévia: cabeçalho e paginação podem não aparecer.</p><p id="reportReady" role="status">Preparando o documento…</p></div>
      ${renderDocument(this.record)}
    </div>`;
  },

  async mount(container) {
    this.container = container;
    this.mountToken = {};
    const token = this.mountToken;
    if (!this.record) return;
    document.body.classList.add('scientific-report-open');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/report/report.css';
    this.stylesheet = link;
    const stylesheetReady = new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = () => reject(new Error('Não foi possível carregar os estilos do relatório. Reabra a página quando o recurso estiver disponível.'));
    });
    document.head.append(link);
    const button = container.querySelector('#btnPrintReport');
    const status = container.querySelector('#reportReady');
    container.querySelector('#btnRegenerateReport').addEventListener('click', () => {
      this.unmount();
      container.innerHTML = this.render();
      this.mount(container);
    });
    try {
      await stylesheetReady;
      await document.fonts.ready;
      await Promise.all([...container.querySelectorAll('img')].map(img => img.decode()));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (this.mountToken !== token) return;
      status.textContent = 'Documento pronto. Os dados desta emissão permanecem estáveis durante a impressão.';
      button.disabled = false;
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          await document.fonts.ready;
          if (this.mountToken === token) window.print();
        } finally {
          // Native cancellation does not mutate the snapshot or simulation.
          if (this.mountToken === token) button.disabled = false;
        }
      });
    } catch (error) {
      if (this.mountToken === token) status.textContent = error.message;
    }
  },

  unmount() {
    this.mountToken = null;
    this.stylesheet?.remove();
    document.body.classList.remove('scientific-report-open');
  }
};
}

export const memoriaView = createReportView(
  'Relatório Científico de Simulação — Simulador Hídrico Cidadão', renderReport
);

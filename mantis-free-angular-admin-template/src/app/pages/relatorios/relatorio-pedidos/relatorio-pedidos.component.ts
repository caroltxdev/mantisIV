import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PedidoData {
  id: string;
  numeroOrcamento: string;
  cliente: string;
  dataOrcamento: string;
  status: string;
  valor: number;
  desconto: number;
  imposto: number;
  valorFinal: number;
  condicaoPagamento: string;
  formaPagamento: string;
}

@Component({
  selector: 'app-relatorio-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-pedidos.component.html',
  styleUrl: './relatorio-pedidos.component.scss'
})
export class RelatorioPedidosComponent implements OnInit {
  // Dados
  pedidos: PedidoData[] = [];
  pedidosFiltrados: PedidoData[] = [];
  pedidosPaginados: PedidoData[] = [];

  // Filtros
  filtroStatus = '';
  filtroCliente = '';
  filtroFormaPagamento = '';
  dataInicio = '';
  dataFim = '';

  // Ordenação
  campoOrdenacao = '';
  ordemAscendente = true;

  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;

  // Estatísticas
  totalPedidos = 0;
  totalFaturado = 0;
  totalDesconto = 0;
  totalImposto = 0;
  pedidosPorStatus: { status: string; quantidade: number; valor: number }[] = [];
  pedidosPorFormaPagamento: { formaPagamento: string; quantidade: number }[] = [];
  statusDisponibles = ['rascunho', 'enviado', 'pendente', 'aprovado', 'recusado'];
  formasPagamento = ['dinheiro', 'transferencia', 'cartao', 'pix', 'boleto'];

  constructor() {}

  ngOnInit() {
    this.carregarPedidos();
    this.aplicarFiltros();
  }

  // ===== CARREGAR DADOS =====

  carregarPedidos() {
    // Simular dados de pedidos (você pode integrar com backend depois)
    const pedidosSalvos = localStorage.getItem('pedidos');
    if (pedidosSalvos) {
      this.pedidos = JSON.parse(pedidosSalvos);
    } else {
      // Dados de exemplo
      this.pedidos = [
        {
          id: '1',
          numeroOrcamento: '001/2025',
          cliente: 'João Silva',
          dataOrcamento: '2025-01-15',
          status: 'aprovado',
          valor: 500,
          desconto: 50,
          imposto: 45,
          valorFinal: 495,
          condicaoPagamento: '30dias',
          formaPagamento: 'transferencia'
        }
      ];
    }
  }

  // ===== FILTROS =====

  aplicarFiltros() {
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      let passa = true;

      // Filtrar por status
      if (this.filtroStatus && pedido.status !== this.filtroStatus) {
        passa = false;
      }

      // Filtrar por cliente
      if (this.filtroCliente.trim() !== '') {
        if (!pedido.cliente.toLowerCase().includes(this.filtroCliente.toLowerCase())) {
          passa = false;
        }
      }

      // Filtrar por forma de pagamento
      if (this.filtroFormaPagamento && pedido.formaPagamento !== this.filtroFormaPagamento) {
        passa = false;
      }

      // Filtrar por data
      if (this.dataInicio && new Date(pedido.dataOrcamento) < new Date(this.dataInicio)) {
        passa = false;
      }

      if (this.dataFim && new Date(pedido.dataOrcamento) > new Date(this.dataFim)) {
        passa = false;
      }

      return passa;
    });

    this.calcularEstatisticas();
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  limparFiltros() {
    this.filtroStatus = '';
    this.filtroCliente = '';
    this.filtroFormaPagamento = '';
    this.dataInicio = '';
    this.dataFim = '';
    this.aplicarFiltros();
  }

  // ===== ESTATÍSTICAS =====

  calcularEstatisticas() {
    this.totalPedidos = this.pedidosFiltrados.length;
    this.totalFaturado = this.pedidosFiltrados.reduce((total, p) => total + p.valorFinal, 0);
    this.totalDesconto = this.pedidosFiltrados.reduce((total, p) => total + p.desconto, 0);
    this.totalImposto = this.pedidosFiltrados.reduce((total, p) => total + p.imposto, 0);

    // Agrupar por status
    const statusMap = new Map<string, { quantidade: number; valor: number }>();
    this.pedidosFiltrados.forEach((pedido) => {
      const status = pedido.status;
      const atual = statusMap.get(status) || { quantidade: 0, valor: 0 };
      statusMap.set(status, {
        quantidade: atual.quantidade + 1,
        valor: atual.valor + pedido.valorFinal
      });
    });

    this.pedidosPorStatus = Array.from(statusMap, ([status, dados]) => ({
      status,
      ...dados
    })).sort((a, b) => b.quantidade - a.quantidade);

    // Agrupar por forma de pagamento
    const formasMap = new Map<string, number>();
    this.pedidosFiltrados.forEach((pedido) => {
      formasMap.set(pedido.formaPagamento, (formasMap.get(pedido.formaPagamento) || 0) + 1);
    });

    this.pedidosPorFormaPagamento = Array.from(formasMap, ([formaPagamento, quantidade]) => ({
      formaPagamento,
      quantidade
    })).sort((a, b) => b.quantidade - a.quantidade);
  }

  // ===== ORDENAÇÃO =====

  ordenarPorCampo(campo: string) {
    if (this.campoOrdenacao === campo) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.campoOrdenacao = campo;
      this.ordemAscendente = true;
    }

    this.pedidosFiltrados.sort((a, b) => {
      const valA = (a as any)[campo];
      const valB = (b as any)[campo];

      if (typeof valA === 'string' && typeof valB === 'string') {
        const comparacao = valA.localeCompare(valB);
        return this.ordemAscendente ? comparacao : -comparacao;
      }

      if (valA < valB) {
        return this.ordemAscendente ? -1 : 1;
      }
      if (valA > valB) {
        return this.ordemAscendente ? 1 : -1;
      }
      return 0;
    });

    this.atualizarPaginacao();
  }

  obterIconeOrdenacao(campo: string): string {
    if (this.campoOrdenacao !== campo) {
      return '⇅';
    }
    return this.ordemAscendente ? '▲' : '▼';
  }

  obterCorStatus(status: string): string {
    const cores: any = {
      rascunho: '#e0e0e0',
      enviado: '#2196f3',
      pendente: '#ff9800',
      aprovado: '#52c76b',
      recusado: '#e53935'
    };
    return cores[status] || '#666';
  }

  // ===== PAGINAÇÃO =====

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.pedidosPaginados = this.pedidosFiltrados.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.itensPorPagina);
  }

  proximaPagina() {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  // ===== EXPORTAR =====

  exportarCSV() {
    const headers = ['Nº Orçamento', 'Cliente', 'Data', 'Status', 'Forma Pagamento', 'Subtotal', 'Desconto', 'Imposto', 'Total'];
    let csv = headers.join(',') + '\n';

    this.pedidosFiltrados.forEach((pedido) => {
      const linha = [
        `"${pedido.numeroOrcamento}"`,
        `"${pedido.cliente}"`,
        pedido.dataOrcamento,
        `"${pedido.status}"`,
        `"${pedido.formaPagamento}"`,
        pedido.valor.toFixed(2),
        pedido.desconto.toFixed(2),
        pedido.imposto.toFixed(2),
        pedido.valorFinal.toFixed(2)
      ];
      csv += linha.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-pedidos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

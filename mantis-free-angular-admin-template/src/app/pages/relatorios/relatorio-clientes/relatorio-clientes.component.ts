// relatorio-clientes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ClienteData {
  id: string;
  nome: string;
  cnpjCpf: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  ativo: boolean;
}

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-clientes.component.html',
  styleUrl: './relatorio-clientes.component.scss'
})
export class RelatorioClientesComponent implements OnInit {
  // Dados
  clientes: ClienteData[] = [];
  clientesFiltrados: ClienteData[] = [];
  clientesPaginados: ClienteData[] = [];

  // Filtros
  filtroAtivo: boolean | null = null;
  filtroEstado = '';
  filtroCidade = '';

  // Ordenação
  campoOrdenacao = '';
  ordemAscendente = true;

  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;

  // Estatísticas
  totalClientes = 0;
  clientesAtivos = 0;
  clientesInativos = 0;
  percentualAtivo = 0;
  percentualInativo = 0;
  estadosDiferentes = 0;
  estadosAgrupados: { estado: string; quantidade: number }[] = [];
  maxClientes = 0;

  constructor() {}

  ngOnInit() {
    this.carregarClientes();
    this.aplicarFiltros();
  }

  // ===== CARREGAR DADOS =====

  carregarClientes() {
    const clientesSalvos = localStorage.getItem('clientes');
    if (clientesSalvos) {
      this.clientes = JSON.parse(clientesSalvos);
    }
  }

  // ===== FILTROS =====

  aplicarFiltros() {
    this.clientesFiltrados = this.clientes.filter((cliente) => {
      let passa = true;

      // Filtrar por status
      if (this.filtroAtivo !== null && cliente.ativo !== this.filtroAtivo) {
        passa = false;
      }

      // Filtrar por estado
      if (this.filtroEstado.trim() !== '') {
        if (!cliente.estado?.toLowerCase().includes(this.filtroEstado.toLowerCase())) {
          passa = false;
        }
      }

      // Filtrar por cidade
      if (this.filtroCidade.trim() !== '') {
        if (!cliente.cidade?.toLowerCase().includes(this.filtroCidade.toLowerCase())) {
          passa = false;
        }
      }

      return passa;
    });

    this.calcularEstatisticas();
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  limparFiltros() {
    this.filtroAtivo = null;
    this.filtroEstado = '';
    this.filtroCidade = '';
    this.aplicarFiltros();
  }

  // ===== ESTATÍSTICAS =====

  calcularEstatisticas() {
    this.totalClientes = this.clientesFiltrados.length;
    this.clientesAtivos = this.clientesFiltrados.filter((c) => c.ativo).length;
    this.clientesInativos = this.clientesFiltrados.filter((c) => !c.ativo).length;

    // Percentuais
    if (this.totalClientes > 0) {
      this.percentualAtivo = Math.round((this.clientesAtivos / this.totalClientes) * 100);
      this.percentualInativo = Math.round((this.clientesInativos / this.totalClientes) * 100);
    } else {
      this.percentualAtivo = 0;
      this.percentualInativo = 0;
    }

    // Agrupar por estado
    const estadosMap = new Map<string, number>();
    this.clientesFiltrados.forEach((cliente) => {
      const estado = cliente.estado || 'Sem Estado';
      estadosMap.set(estado, (estadosMap.get(estado) || 0) + 1);
    });

    this.estadosAgrupados = Array.from(estadosMap, ([estado, quantidade]) => ({
      estado,
      quantidade
    })).sort((a, b) => b.quantidade - a.quantidade);

    this.estadosDiferentes = this.estadosAgrupados.length;
    this.maxClientes = Math.max(...this.estadosAgrupados.map((e) => e.quantidade), 1);
  }

  // ===== ORDENAÇÃO =====

  ordenarPorCampo(campo: string) {
    if (this.campoOrdenacao === campo) {
      this.ordemAscendente = !this.ordemAscendente;
    } else {
      this.campoOrdenacao = campo;
      this.ordemAscendente = true;
    }

    this.clientesFiltrados.sort((a, b) => {
      const valA = (a as any)[campo];
      const valB = (b as any)[campo];

      // Verificar se são strings
      if (typeof valA === 'string' && typeof valB === 'string') {
        const comparacao = valA.localeCompare(valB);
        return this.ordemAscendente ? comparacao : -comparacao;
      }

      // Se são números ou booleanos
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

  // ===== PAGINAÇÃO =====

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.clientesPaginados = this.clientesFiltrados.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.clientesFiltrados.length / this.itensPorPagina);
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

  // ===== GRÁFICOS =====

  gerarGradientePie(): string {
    const percentAtivo = this.percentualAtivo;
    const graus = (percentAtivo / 100) * 360;
    return `conic-gradient(
      #52c76b 0deg ${graus}deg,
      #e0e0e0 ${graus}deg 360deg
    )`;
  }

  // ===== EXPORTAR =====

  exportarCSV() {
    const headers = ['Nome', 'CNPJ/CPF', 'Email', 'Telefone', 'Endereço', 'Cidade', 'Estado', 'CEP', 'Status'];
    let csv = headers.join(',') + '\n';

    this.clientesFiltrados.forEach((cliente) => {
      const linha = [
        `"${cliente.nome}"`,
        `"${cliente.cnpjCpf}"`,
        `"${cliente.email || '-'}"`,
        `"${cliente.telefone || '-'}"`,
        `"${cliente.endereco || '-'}"`,
        `"${cliente.cidade || '-'}"`,
        `"${cliente.estado || '-'}"`,
        `"${cliente.cep || '-'}"`,
        `"${cliente.ativo ? 'Ativo' : 'Inativo'}"`
      ];
      csv += linha.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-clientes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

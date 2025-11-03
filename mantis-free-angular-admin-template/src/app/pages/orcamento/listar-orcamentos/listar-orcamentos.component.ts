import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Orcamento {
  id: string;
  numeroOrcamento: string;
  nomeCliente: string;
  dataOrcamento: Date;
  dataValidade: Date;
  total: number;
  status: string;
  itens: number;
  expirado: boolean;
}

@Component({
  selector: 'app-listar-orcamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listar-orcamentos.component.html',
  styleUrls: ['./listar-orcamentos.component.scss']
})
export class ListarOrcamentosComponent implements OnInit {
  orcamentos: Orcamento[] = [];
  orcamentosFiltrados: Orcamento[] = [];
  visualizacao: 'cards' | 'tabela' = 'cards';
  paginaAtual = 1;
  itensPorPagina = 12;
  totalPaginas = 1;

  filtro = {
    busca: '',
    status: '',
    ordenar: 'data-desc'
  };

  constructor() {}

  ngOnInit(): void {
    this.carregarOrcamentos();
  }

  carregarOrcamentos(): void {
    // Simular dados de orçamentos
    this.orcamentos = [
      {
        id: '1',
        numeroOrcamento: 'ORÇ-001',
        nomeCliente: 'João Silva',
        dataOrcamento: new Date(2025, 10, 2),
        dataValidade: new Date(2025, 10, 10),
        total: 1500.00,
        status: 'pendente',
        itens: 3,
        expirado: false
      },
      {
        id: '2',
        numeroOrcamento: 'ORÇ-002',
        nomeCliente: 'Maria Santos',
        dataOrcamento: new Date(2025, 10, 1),
        dataValidade: new Date(2025, 9, 15),
        total: 2300.50,
        status: 'aprovado',
        itens: 5,
        expirado: true
      },
      {
        id: '3',
        numeroOrcamento: 'ORÇ-003',
        nomeCliente: 'Pedro Oliveira',
        dataOrcamento: new Date(2025, 11, 1),
        dataValidade: new Date(2025, 11, 20),
        total: 890.00,
        status: 'rascunho',
        itens: 2,
        expirado: false
      },
      {
        id: '4',
        numeroOrcamento: 'ORÇ-004',
        nomeCliente: 'Ana Costa',
        dataOrcamento: new Date(2025, 9, 28),
        dataValidade: new Date(2025, 10, 5),
        total: 3200.75,
        status: 'recusado',
        itens: 4,
        expirado: true
      },
      {
        id: '5',
        numeroOrcamento: 'ORÇ-005',
        nomeCliente: 'Carlos Mendes',
        dataOrcamento: new Date(2025, 10, 3),
        dataValidade: new Date(2025, 10, 25),
        total: 1100.00,
        status: 'enviado',
        itens: 2,
        expirado: false
      }
    ];

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultado = [...this.orcamentos];

    // Filtrar por busca
    if (this.filtro.busca) {
      resultado = resultado.filter(o =>
        o.numeroOrcamento.toLowerCase().includes(this.filtro.busca.toLowerCase()) ||
        o.nomeCliente.toLowerCase().includes(this.filtro.busca.toLowerCase())
      );
    }

    // Filtrar por status
    if (this.filtro.status) {
      resultado = resultado.filter(o => o.status === this.filtro.status);
    }

    // Ordenar
    switch (this.filtro.ordenar) {
      case 'data-asc':
        resultado.sort((a, b) => a.dataOrcamento.getTime() - b.dataOrcamento.getTime());
        break;
      case 'data-desc':
        resultado.sort((a, b) => b.dataOrcamento.getTime() - a.dataOrcamento.getTime());
        break;
      case 'valor-desc':
        resultado.sort((a, b) => b.total - a.total);
        break;
      case 'valor-asc':
        resultado.sort((a, b) => a.total - b.total);
        break;
      case 'cliente':
        resultado.sort((a, b) => a.nomeCliente.localeCompare(b.nomeCliente));
        break;
    }

    this.orcamentosFiltrados = resultado;
    this.totalPaginas = Math.ceil(this.orcamentosFiltrados.length / this.itensPorPagina);
    this.paginaAtual = 1;
  }

  limparFiltros(): void {
    this.filtro = {
      busca: '',
      status: '',
      ordenar: 'data-desc'
    };
    this.aplicarFiltros();
  }

  confirmarDelecao(id: string, numeroOrcamento: string): void {
    if (confirm(`Tem certeza que deseja deletar o orçamento ${numeroOrcamento}?`)) {
      this.orcamentos = this.orcamentos.filter(o => o.id !== id);
      this.aplicarFiltros();
      alert('Orçamento deletado com sucesso!');
    }
  }
}

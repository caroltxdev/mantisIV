import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProdutoData {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  unidade: string;
  precoUnitario: number;
  estoque: number;
  estoqueMinimo: number;
  ativo: boolean;
}

@Component({
  selector: 'app-relatorio-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorio-produtos.component.html',
  styleUrl: './relatorio-produtos.component.scss'
})
export class RelatorioProdutosComponent implements OnInit {
  // Dados
  produtos: ProdutoData[] = [];
  produtosFiltrados: ProdutoData[] = [];
  produtosPaginados: ProdutoData[] = [];

  // Filtros
  filtroAtivo: boolean | null = null;
  filtroCategoria = '';
  filtroEstoque: 'todos' | 'baixo' | 'otimo' = 'todos';

  // Ordenação
  campoOrdenacao = '';
  ordemAscendente = true;

  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;

  // Estatísticas
  totalProdutos = 0;
  produtosAtivos = 0;
  produtosInativos = 0;
  valorTotalEstoque = 0;
  produtosBaixoEstoque = 0;
  categoriasAgrupadas: { categoria: string; quantidade: number }[] = [];

  constructor() {}

  ngOnInit() {
    this.carregarProdutos();
    this.aplicarFiltros();
  }

  // ===== CARREGAR DADOS =====

  carregarProdutos() {
    const produtosSalvos = localStorage.getItem('produtos');
    if (produtosSalvos) {
      this.produtos = JSON.parse(produtosSalvos);
    }
  }

  // ===== FILTROS =====

  aplicarFiltros() {
    this.produtosFiltrados = this.produtos.filter((produto) => {
      let passa = true;

      // Filtrar por status
      if (this.filtroAtivo !== null && produto.ativo !== this.filtroAtivo) {
        passa = false;
      }

      // Filtrar por categoria
      if (this.filtroCategoria.trim() !== '') {
        if (!produto.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())) {
          passa = false;
        }
      }

      // Filtrar por estoque
      if (this.filtroEstoque === 'baixo') {
        if (produto.estoque >= produto.estoqueMinimo) {
          passa = false;
        }
      } else if (this.filtroEstoque === 'otimo') {
        if (produto.estoque < produto.estoqueMinimo) {
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
    this.filtroCategoria = '';
    this.filtroEstoque = 'todos';
    this.aplicarFiltros();
  }

  // ===== ESTATÍSTICAS =====

  calcularEstatisticas() {
    this.totalProdutos = this.produtosFiltrados.length;
    this.produtosAtivos = this.produtosFiltrados.filter((p) => p.ativo).length;
    this.produtosInativos = this.produtosFiltrados.filter((p) => !p.ativo).length;
    this.produtosBaixoEstoque = this.produtosFiltrados.filter((p) => p.estoque < p.estoqueMinimo).length;

    // Valor total em estoque
    this.valorTotalEstoque = this.produtosFiltrados.reduce((total, p) => {
      return total + (p.estoque * p.precoUnitario);
    }, 0);

    // Agrupar por categoria
    const categoriasMap = new Map<string, number>();
    this.produtosFiltrados.forEach((produto) => {
      categoriasMap.set(produto.categoria, (categoriasMap.get(produto.categoria) || 0) + 1);
    });

    this.categoriasAgrupadas = Array.from(categoriasMap, ([categoria, quantidade]) => ({
      categoria,
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

    this.produtosFiltrados.sort((a, b) => {
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

  // ===== PAGINAÇÃO =====

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.produtosPaginados = this.produtosFiltrados.slice(inicio, fim);
  }

  get totalPaginas(): number {
    return Math.ceil(this.produtosFiltrados.length / this.itensPorPagina);
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
    const headers = ['Nome', 'Categoria', 'Unidade', 'Preço', 'Estoque', 'Mín.', 'Valor Total', 'Status'];
    let csv = headers.join(',') + '\n';

    this.produtosFiltrados.forEach((produto) => {
      const valorTotal = produto.estoque * produto.precoUnitario;
      const linha = [
        `"${produto.nome}"`,
        `"${produto.categoria}"`,
        `"${produto.unidade}"`,
        produto.precoUnitario.toFixed(2),
        produto.estoque,
        produto.estoqueMinimo,
        valorTotal.toFixed(2),
        `"${produto.ativo ? 'Ativo' : 'Inativo'}"`
      ];
      csv += linha.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-produtos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

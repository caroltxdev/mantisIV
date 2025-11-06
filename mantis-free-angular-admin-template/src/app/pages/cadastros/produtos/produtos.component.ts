import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="cadastro-container">
      <div class="page-header">
        <h1>🍎 Cadastro de Produtos</h1>
        <p class="subtitle">Gerencie os produtos da Sacola Cheia</p>
      </div>

      <div class="content-wrapper">
        <!-- Formulário -->
        <div class="form-section">
          <h2>{{ editandoId ? 'Editar Produto' : 'Novo Produto' }}</h2>
          
          <form [formGroup]="produtoForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nome">Nome do Produto *</label>
              <input
                type="text"
                id="nome"
                formControlName="nome"
                class="form-control"
                placeholder="Tomate Premium"
                required
              >
            </div>

            <div class="form-group">
              <label for="descricao">Descrição</label>
              <textarea
                id="descricao"
                formControlName="descricao"
                class="form-control"
                rows="3"
                placeholder="Descreva o produto..."
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="categoria">Categoria *</label>
                <select id="categoria" formControlName="categoria" class="form-control" required>
                  <option value="">Selecione</option>
                  <option value="frutas">Frutas</option>
                  <option value="verduras">Verduras</option>
                  <option value="legumes">Legumes</option>
                  <option value="organicos">Orgânicos</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div class="form-group">
                <label for="unidade">Unidade de Medida *</label>
                <select id="unidade" formControlName="unidade" class="form-control" required>
                  <option value="">Selecione</option>
                  <option value="kg">Kg</option>
                  <option value="un">Unidade</option>
                  <option value="l">Litro</option>
                  <option value="dz">Dúzia</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="precoUnitario">Preço Unitário *</label>
                <input
                  type="number"
                  id="precoUnitario"
                  formControlName="precoUnitario"
                  class="form-control"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  required
                >
              </div>

              <div class="form-group">
                <label for="estoque">Estoque *</label>
                <input
                  type="number"
                  id="estoque"
                  formControlName="estoque"
                  class="form-control"
                  placeholder="0"
                  min="0"
                  required
                >
              </div>

              <div class="form-group">
                <label for="estoqueMinimo">Estoque Mínimo</label>
                <input
                  type="number"
                  id="estoqueMinimo"
                  formControlName="estoqueMinimo"
                  class="form-control"
                  placeholder="0"
                  min="0"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="ativo">
                <input
                  type="checkbox"
                  id="ativo"
                  formControlName="ativo"
                >
                Produto Ativo
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!produtoForm.valid">
                {{ editandoId ? '✓ Atualizar' : '➕ Adicionar' }}
              </button>
              <button type="button" class="btn-secondary" (click)="onCancel()">
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Produtos -->
        <div class="list-section">
          <h2>Produtos Cadastrados</h2>
          
          <div class="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar produto..."
              [(ngModel)]="filtro"
              class="search-input"
            >
          </div>

          <div *ngIf="produtos.length === 0" class="empty-state">
            <p>Nenhum produto cadastrado. Adicione um novo!</p>
          </div>

          <table *ngIf="produtos.length > 0" class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Unidade</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Mín.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let prod of produtosFiltrados" [ngClass]="{ 'alerta-estoque': prod.estoque < prod.estoqueMinimo }">
                <td>{{ prod.nome }}</td>
                <td>{{ prod.categoria }}</td>
                <td>{{ prod.unidade }}</td>
                <td>{{ prod.precoUnitario | currency: 'BRL' }}</td>
                <td>{{ prod.estoque }}</td>
                <td>{{ prod.estoqueMinimo || '-' }}</td>
                <td>
                  <span class="badge" [ngClass]="prod.ativo ? 'active' : 'inactive'">
                    {{ prod.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="acoes">
                  <button class="btn-edit" (click)="onEdit(prod)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn-delete" (click)="onDelete(prod.id)" title="Deletar">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cadastro-container {
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0;
      color: #1a4d27;
      font-size: 2rem;
    }

    .subtitle {
      color: #666;
      margin: 0.5rem 0 0;
    }

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .form-section,
    .list-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-section h2,
    .list-section h2 {
      color: #1a4d27;
      margin-top: 0;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #52c76b;
      padding-bottom: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #52c76b;
      box-shadow: 0 0 0 3px rgba(82, 199, 107, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: #52c76b;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2d7a3e;
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #d0d0d0;
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .table thead {
      background: #f5f5f5;
    }

    .table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
    }

    .table td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .table tbody tr:hover {
      background: #f9f9f9;
    }

    .table tbody tr.alerta-estoque {
      background: #fff3e0;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge.active {
      background: #c8e6c9;
      color: #2d7a3e;
    }

    .badge.inactive {
      background: #ffcdd2;
      color: #c62828;
    }

    .acoes {
      text-align: center;
    }

    .btn-edit,
    .btn-delete {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      margin: 0 0.5rem;
      transition: transform 0.3s;
    }

    .btn-edit:hover {
      transform: scale(1.2);
    }

    .btn-delete:hover {
      transform: scale(1.2);
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    @media (max-width: 1024px) {
      .content-wrapper {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProdutosComponent implements OnInit {
  produtoForm!: FormGroup;
  produtos: any[] = [];
  filtro = '';
  editandoId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.carregarProdutos();
  }

  initForm() {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      categoria: ['', Validators.required],
      unidade: ['', Validators.required],
      precoUnitario: [0, Validators.required],
      estoque: [0, Validators.required],
      estoqueMinimo: [0],
      ativo: [true]
    });
  }

  carregarProdutos() {
    const produtosSalvos = localStorage.getItem('produtos');
    if (produtosSalvos) {
      this.produtos = JSON.parse(produtosSalvos);
    }
  }

  get produtosFiltrados() {
    return this.produtos.filter(prod =>
      prod.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
      prod.categoria.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  onSubmit() {
    if (this.produtoForm.valid) {
      const novoProduto = {
        id: this.editandoId || Date.now().toString(),
        ...this.produtoForm.value
      };

      if (this.editandoId) {
        const index = this.produtos.findIndex(p => p.id === this.editandoId);
        if (index !== -1) {
          this.produtos[index] = novoProduto;
        }
      } else {
        this.produtos.push(novoProduto);
      }

      localStorage.setItem('produtos', JSON.stringify(this.produtos));
      this.onCancel();
    }
  }

  onEdit(produto: any) {
    this.editandoId = produto.id;
    this.produtoForm.patchValue(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: string) {
    if (confirm('Deseja realmente deletar este produto?')) {
      this.produtos = this.produtos.filter(p => p.id !== id);
      localStorage.setItem('produtos', JSON.stringify(this.produtos));
    }
  }

  onCancel() {
    this.produtoForm.reset({ ativo: true });
    this.editandoId = null;
  }
}

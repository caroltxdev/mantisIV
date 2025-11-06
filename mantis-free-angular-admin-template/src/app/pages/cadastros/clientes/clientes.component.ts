import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="cadastro-container">
      <div class="page-header">
        <h1>👥 Cadastro de Clientes</h1>
        <p class="subtitle">Gerencie os clientes da Sacola Cheia</p>
      </div>

      <div class="content-wrapper">
        <!-- Formulário -->
        <div class="form-section">
          <h2>{{ editandoId ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
          
          <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="nome">Nome/Empresa *</label>
                <input
                  type="text"
                  id="nome"
                  formControlName="nome"
                  class="form-control"
                  placeholder="Nome do cliente"
                  required
                >
                <small class="error" *ngIf="clienteForm.get('nome')?.hasError('required') && clienteForm.get('nome')?.touched">
                  Nome é obrigatório
                </small>
              </div>

              <div class="form-group">
                <label for="cnpjCpf">CNPJ/CPF *</label>
                <input
                  type="text"
                  id="cnpjCpf"
                  formControlName="cnpjCpf"
                  class="form-control"
                  placeholder="00.000.000/0000-00"
                  required
                >
                <small class="error" *ngIf="clienteForm.get('cnpjCpf')?.hasError('required') && clienteForm.get('cnpjCpf')?.touched">
                  CNPJ/CPF é obrigatório
                </small>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  formControlName="email"
                  class="form-control"
                  placeholder="email@exemplo.com"
                >
                <small class="error" *ngIf="clienteForm.get('email')?.hasError('email') && clienteForm.get('email')?.touched">
                  Email inválido
                </small>
              </div>

              <div class="form-group">
                <label for="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  formControlName="telefone"
                  class="form-control"
                  placeholder="(11) 9999-9999"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="endereco">Endereço</label>
              <input
                type="text"
                id="endereco"
                formControlName="endereco"
                class="form-control"
                placeholder="Rua, número, complemento"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cidade">Cidade</label>
                <input
                  type="text"
                  id="cidade"
                  formControlName="cidade"
                  class="form-control"
                  placeholder="São Paulo"
                >
              </div>

              <div class="form-group">
                <label for="estado">Estado</label>
                <input
                  type="text"
                  id="estado"
                  formControlName="estado"
                  class="form-control"
                  placeholder="SP"
                  maxlength="2"
                >
              </div>

              <div class="form-group">
                <label for="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  formControlName="cep"
                  class="form-control"
                  placeholder="12345-678"
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
                Cliente Ativo
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!clienteForm.valid">
                {{ editandoId ? '✓ Atualizar' : '➕ Adicionar' }}
              </button>
              <button type="button" class="btn-secondary" (click)="onCancel()">
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Clientes -->
        <div class="list-section">
          <h2>Clientes Cadastrados</h2>
          
          <div class="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar cliente..."
              [(ngModel)]="filtro"
              class="search-input"
            >
          </div>

          <div *ngIf="clientes.length === 0" class="empty-state">
            <p>Nenhum cliente cadastrado. Adicione um novo!</p>
          </div>

          <table *ngIf="clientes.length > 0" class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CNPJ/CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cliente of clientesFiltrados">
                <td>{{ cliente.nome }}</td>
                <td>{{ cliente.cnpjCpf }}</td>
                <td>{{ cliente.email || '-' }}</td>
                <td>{{ cliente.telefone || '-' }}</td>
                <td>{{ cliente.cidade || '-' }}</td>
                <td>
                  <span class="badge" [ngClass]="cliente.ativo ? 'active' : 'inactive'">
                    {{ cliente.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="acoes">
                  <button class="btn-edit" (click)="onEdit(cliente)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn-delete" (click)="onDelete(cliente.id)" title="Deletar">
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
    }

    .form-control:focus {
      outline: none;
      border-color: #52c76b;
      box-shadow: 0 0 0 3px rgba(82, 199, 107, 0.1);
    }

    .error {
      color: #e53935;
      font-size: 0.85rem;
      margin-top: 0.25rem;
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
export class ClientesComponent implements OnInit {
  clienteForm!: FormGroup;
  clientes: any[] = [];
  filtro = '';
  editandoId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.carregarClientes();
  }

  initForm() {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cnpjCpf: ['', Validators.required],
      email: ['', [Validators.email]],
      telefone: [''],
      endereco: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      ativo: [true]
    });
  }

  carregarClientes() {
    // Simular carregamento de clientes do localStorage
    const clientesSalvos = localStorage.getItem('clientes');
    if (clientesSalvos) {
      this.clientes = JSON.parse(clientesSalvos);
    }
  }

  get clientesFiltrados() {
    return this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
      cliente.cnpjCpf.includes(this.filtro)
    );
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const novoCliente = {
        id: this.editandoId || Date.now().toString(),
        ...this.clienteForm.value
      };

      if (this.editandoId) {
        const index = this.clientes.findIndex(c => c.id === this.editandoId);
        if (index !== -1) {
          this.clientes[index] = novoCliente;
        }
      } else {
        this.clientes.push(novoCliente);
      }

      localStorage.setItem('clientes', JSON.stringify(this.clientes));
      this.onCancel();
    }
  }

  onEdit(cliente: any) {
    this.editandoId = cliente.id;
    this.clienteForm.patchValue(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: string) {
    if (confirm('Deseja realmente deletar este cliente?')) {
      this.clientes = this.clientes.filter(c => c.id !== id);
      localStorage.setItem('clientes', JSON.stringify(this.clientes));
    }
  }

  onCancel() {
    this.clienteForm.reset({ ativo: true });
    this.editandoId = null;
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="cadastro-container">
      <div class="page-header">
        <h1>👔 Cadastro de Funcionários</h1>
        <p class="subtitle">Gerencie os funcionários da Sacola Cheia</p>
      </div>

      <div class="content-wrapper">
        <!-- Formulário -->
        <div class="form-section">
          <h2>{{ editandoId ? 'Editar Funcionário' : 'Novo Funcionário' }}</h2>
          
          <form [formGroup]="funcionarioForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  formControlName="nome"
                  class="form-control"
                  placeholder="João Silva"
                  required
                >
              </div>

              <div class="form-group">
                <label for="cpf">CPF *</label>
                <input
                  type="text"
                  id="cpf"
                  formControlName="cpf"
                  class="form-control"
                  placeholder="000.000.000-00"
                  required
                >
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
                  placeholder="joao@example.com"
                >
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

            <div class="form-row">
              <div class="form-group">
                <label for="cargo">Cargo *</label>
                <select id="cargo" formControlName="cargo" class="form-control" required>
                  <option value="">Selecione um cargo</option>
                  <option value="gerente">Gerente</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="entregador">Entregador</option>
                  <option value="operacional">Operacional</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>

              <div class="form-group">
                <label for="departamento">Departamento</label>
                <select id="departamento" formControlName="departamento" class="form-control">
                  <option value="">Selecione</option>
                  <option value="vendas">Vendas</option>
                  <option value="logistica">Logística</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="rh">RH</option>
                  <option value="ti">TI</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dataAdmissao">Data de Admissão *</label>
                <input
                  type="date"
                  id="dataAdmissao"
                  formControlName="dataAdmissao"
                  class="form-control"
                  required
                >
              </div>

              <div class="form-group">
                <label for="salario">Salário</label>
                <input
                  type="number"
                  id="salario"
                  formControlName="salario"
                  class="form-control"
                  placeholder="0,00"
                  min="0"
                  step="0.01"
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
                Funcionário Ativo
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="!funcionarioForm.valid">
                {{ editandoId ? '✓ Atualizar' : '➕ Adicionar' }}
              </button>
              <button type="button" class="btn-secondary" (click)="onCancel()">
                ✕ Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Funcionários -->
        <div class="list-section">
          <h2>Funcionários Cadastrados</h2>
          
          <div class="search-bar">
            <input
              type="text"
              placeholder="🔍 Buscar funcionário..."
              [(ngModel)]="filtro"
              class="search-input"
            >
          </div>

          <div *ngIf="funcionarios.length === 0" class="empty-state">
            <p>Nenhum funcionário cadastrado. Adicione um novo!</p>
          </div>

          <table *ngIf="funcionarios.length > 0" class="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Admissão</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let func of funcionariosFiltrados">
                <td>{{ func.nome }}</td>
                <td>{{ func.cpf }}</td>
                <td>{{ func.cargo }}</td>
                <td>{{ func.departamento || '-' }}</td>
                <td>{{ func.dataAdmissao | date: 'dd/MM/yyyy' }}</td>
                <td>
                  <span class="badge" [ngClass]="func.ativo ? 'active' : 'inactive'">
                    {{ func.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="acoes">
                  <button class="btn-edit" (click)="onEdit(func)" title="Editar">
                    ✏️
                  </button>
                  <button class="btn-delete" (click)="onDelete(func.id)" title="Deletar">
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
export class FuncionariosComponent implements OnInit {
  funcionarioForm!: FormGroup;
  funcionarios: any[] = [];
  filtro = '';
  editandoId: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
    this.carregarFuncionarios();
  }

  initForm() {
    this.funcionarioForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', Validators.email],
      telefone: [''],
      cargo: ['', Validators.required],
      departamento: [''],
      dataAdmissao: ['', Validators.required],
      salario: [0],
      ativo: [true]
    });
  }

  carregarFuncionarios() {
    const funcionariosSalvos = localStorage.getItem('funcionarios');
    if (funcionariosSalvos) {
      this.funcionarios = JSON.parse(funcionariosSalvos);
    }
  }

  get funcionariosFiltrados() {
    return this.funcionarios.filter(func =>
      func.nome.toLowerCase().includes(this.filtro.toLowerCase()) ||
      func.cpf.includes(this.filtro)
    );
  }

  onSubmit() {
    if (this.funcionarioForm.valid) {
      const novoFuncionario = {
        id: this.editandoId || Date.now().toString(),
        ...this.funcionarioForm.value
      };

      if (this.editandoId) {
        const index = this.funcionarios.findIndex(f => f.id === this.editandoId);
        if (index !== -1) {
          this.funcionarios[index] = novoFuncionario;
        }
      } else {
        this.funcionarios.push(novoFuncionario);
      }

      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
      this.onCancel();
    }
  }

  onEdit(funcionario: any) {
    this.editandoId = funcionario.id;
    this.funcionarioForm.patchValue(funcionario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(id: string) {
    if (confirm('Deseja realmente deletar este funcionário?')) {
      this.funcionarios = this.funcionarios.filter(f => f.id !== id);
      localStorage.setItem('funcionarios', JSON.stringify(this.funcionarios));
    }
  }

  onCancel() {
    this.funcionarioForm.reset({ ativo: true });
    this.editandoId = null;
  }
}

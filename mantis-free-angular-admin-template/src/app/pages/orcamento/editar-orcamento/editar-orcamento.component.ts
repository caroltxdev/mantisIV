import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

interface Historico {
  data: Date;
  usuario: string;
  acao: string;
}

@Component({
  selector: 'app-editar-orcamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-orcamento.component.html',
  styleUrls: ['./editar-orcamento.component.scss']
})
export class EditarOrcamentoComponent implements OnInit {
  orcamentoForm!: FormGroup;
  numeroOrcamento: string = '';
  historico: Historico[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarOrcamento();
  }

  criarFormulario(): void {
    this.orcamentoForm = this.fb.group({
      // Cliente
      cliente: ['', Validators.required],
      nomeCliente: ['', Validators.required],
      cnpjCpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],

      // Orçamento
      numeroOrcamento: ['', Validators.required],
      status: ['rascunho'],
      dataOrcamento: ['', Validators.required],
      dataValidade: ['', Validators.required],
      dataCriacao: [''],
      observacoes: [''],

      // Itens
      itens: this.fb.array([]),

      // Totalizadores
      desconto: [0, [Validators.min(0), Validators.max(100)]],
      imposto: [0, [Validators.min(0), Validators.max(100)]],

      // Condições
      condicaoPagamento: ['', Validators.required],
      formaPagamento: ['', Validators.required]
    });
  }

  carregarOrcamento(): void {
    // Pega o ID da rota
    this.route.params.subscribe(params => {
      const id = params['id'];
      // Aqui você chamaria um serviço para buscar o orçamento
      // Por enquanto, vou simular com dados
      this.simularCarregamento(id);
    });
  }

  simularCarregamento(id: string): void {
    // Simular dados do orçamento
    const orcamentoDados = {
      cliente: '1',
      nomeCliente: 'João Silva',
      cnpjCpf: '12.345.678/0001-90',
      email: 'joao@empresa.com',
      telefone: '(11) 9999-9999',
      numeroOrcamento: `ORÇ-${id}`,
      status: 'pendente',
      dataOrcamento: '2025-11-03',
      dataValidade: '2025-12-03',
      dataCriacao: '2025-11-02',
      observacoes: 'Orçamento de teste',
      desconto: 5,
      imposto: 15,
      condicaoPagamento: '30dias',
      formaPagamento: 'transferencia'
    };

    this.numeroOrcamento = orcamentoDados.numeroOrcamento;
    this.orcamentoForm.patchValue(orcamentoDados);

    // Adicionar itens simulados
    const itens = [
      { produto: '1', quantidade: 10, valorUnitario: 25.50 },
      { produto: '3', quantidade: 5, valorUnitario: 15.00 }
    ];

    itens.forEach(item => {
      this.itens.push(this.fb.group({
        produto: [item.produto, Validators.required],
        quantidade: [item.quantidade, [Validators.required, Validators.min(0.1)]],
        valorUnitario: [item.valorUnitario, [Validators.required, Validators.min(0)]],
        subtotal: [item.quantidade * item.valorUnitario]
      }));
    });

    // Simular histórico
    this.historico = [
      {
        data: new Date(2025, 10, 2, 14, 30),
        usuario: 'Admin',
        acao: 'Orçamento criado'
      },
      {
        data: new Date(2025, 10, 3, 8, 15),
        usuario: 'Admin',
        acao: 'Status alterado para Pendente'
      }
    ];
  }

  get itens(): FormArray {
    return this.orcamentoForm.get('itens') as FormArray;
  }

  adicionarItem(): void {
    const item = this.fb.group({
      produto: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(0.1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0)]],
      subtotal: [0]
    });
    this.itens.push(item);
  }

  removerItem(index: number): void {
    this.itens.removeAt(index);
    this.calcularTotal();
  }

  calcularSubtotal(): number {
    let total = 0;
    this.itens.controls.forEach((control) => {
      const quantidade = control.get('quantidade')?.value || 0;
      const valor = control.get('valorUnitario')?.value || 0;
      total += quantidade * valor;
    });
    return total;
  }

  calcularSubtotalItem(index: number): number {
    const item = this.itens.at(index);
    const quantidade = item.get('quantidade')?.value || 0;
    const valor = item.get('valorUnitario')?.value || 0;
    return quantidade * valor;
  }

  calcularValorDesconto(): number {
    const subtotal = this.calcularSubtotal();
    const desconto = this.orcamentoForm.get('desconto')?.value || 0;
    return (subtotal * desconto) / 100;
  }

  calcularValorImposto(): number {
    const subtotal = this.calcularSubtotal();
    const desconto = this.calcularValorDesconto();
    const base = subtotal - desconto;
    const imposto = this.orcamentoForm.get('imposto')?.value || 0;
    return (base * imposto) / 100;
  }

  calcularTotalFinal(): number {
    const subtotal = this.calcularSubtotal();
    const desconto = this.calcularValorDesconto();
    const imposto = this.calcularValorImposto();
    return subtotal - desconto + imposto;
  }

  calcularTotal(): void {
    this.calcularSubtotal();
  }

  onClienteChange(event: any): void {
    if (event.target.value === '4') {
      this.orcamentoForm.patchValue({
        nomeCliente: '',
        cnpjCpf: '',
        email: '',
        telefone: ''
      });
    }
  }

  onSubmit(): void {
    if (this.orcamentoForm.valid && this.itens.length > 0) {
      console.log('Orçamento atualizado:', this.orcamentoForm.value);
      alert('Orçamento atualizado com sucesso!');
      // Aqui você pode chamar um serviço para salvar no backend
    } else {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item.');
    }
  }

  onSaveDraft(): void {
    this.orcamentoForm.patchValue({ status: 'rascunho' });
    console.log('Rascunho salvo:', this.orcamentoForm.value);
    alert('Orçamento salvo como rascunho!');
  }

  onDelete(): void {
    if (confirm(`Tem certeza que deseja deletar o orçamento ${this.numeroOrcamento}?`)) {
      console.log('Orçamento deletado');
      alert('Orçamento deletado com sucesso!');
      this.router.navigate(['/orcamentos']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/orcamentos']);
  }
}

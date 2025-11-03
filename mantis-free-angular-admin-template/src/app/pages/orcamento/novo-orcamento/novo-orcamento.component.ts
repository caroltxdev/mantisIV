import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-orcamento',
  standalone: true,  // ← IMPORTANTE! Deve estar aqui
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './novo-orcamento.component.html',
  styleUrls: ['./novo-orcamento.component.scss']
})
export class NovoOrcamentoComponent implements OnInit {
  orcamentoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.adicionarItem(); // Adiciona um item inicial
  }

  criarFormulario(): void {
    this.orcamentoForm = this.fb.group({
      cliente: ['', Validators.required],
      nomeCliente: ['', Validators.required],
      cnpjCpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      numeroOrcamento: ['AUTO-001'],
      dataOrcamento: [new Date().toISOString().split('T')[0], Validators.required],
      dataValidade: [this.adicionarDias(30).toISOString().split('T')[0], Validators.required],
      observacoes: [''],
      itens: this.fb.array([]),
      desconto: [0, [Validators.min(0), Validators.max(100)]],
      imposto: [0, [Validators.min(0), Validators.max(100)]],
      condicaoPagamento: ['', Validators.required],
      formaPagamento: ['', Validators.required]
    });
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
      console.log('Orçamento gerado:', this.orcamentoForm.value);
      alert('Orçamento gerado com sucesso!');
    } else {
      alert('Por favor, preencha todos os campos obrigatórios e adicione pelo menos um item.');
    }
  }

  onSaveDraft(): void {
    console.log('Rascunho salvo:', this.orcamentoForm.value);
    alert('Orçamento salvo como rascunho!');
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  private adicionarDias(dias: number): Date {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data;
  }
}

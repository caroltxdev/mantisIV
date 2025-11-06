import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-orcamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-orcamento.component.html',
  styleUrl: './editar-orcamento.component.scss'
})
export class EditarOrcamentoComponent implements OnInit {
  orcamentoForm!: FormGroup;
  numeroOrcamento = '001/2025';
  historico: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.orcamentoForm = this.fb.group({
      cliente: [''],
      nomeCliente: [''],
      cnpjCpf: [''],
      email: [''],
      telefone: [''],
      numeroOrcamento: [this.numeroOrcamento],
      status: ['rascunho'],
      dataOrcamento: [''],
      dataValidade: [''],
      dataCriacao: [''],
      observacoes: [''],
      itens: this.fb.array([]),
      desconto: [0],
      imposto: [0],
      condicaoPagamento: [''],
      formaPagamento: ['']
    });
  }

  get itens() {
    return this.orcamentoForm.get('itens') as FormArray;
  }

  adicionarItem() {
    const item = this.fb.group({
      produto: [''],
      quantidade: [0],
      valorUnitario: [0]
    });
    this.itens.push(item);
  }

  removerItem(index: number) {
    this.itens.removeAt(index);
  }

  calcularSubtotalItem(index: number): number {
    const item = this.itens.at(index).value;
    return item.quantidade * item.valorUnitario;
  }

  calcularSubtotal(): number {
    return this.itens.controls.reduce((acc, item) => {
      const valores = item.value;
      return acc + (valores.quantidade * valores.valorUnitario);
    }, 0);
  }

  calcularValorDesconto(): number {
    const subtotal = this.calcularSubtotal();
    const desconto = this.orcamentoForm.get('desconto')?.value || 0;
    return subtotal * (desconto / 100);
  }

  calcularValorImposto(): number {
    const subtotal = this.calcularSubtotal();
    const imposto = this.orcamentoForm.get('imposto')?.value || 0;
    return subtotal * (imposto / 100);
  }

  calcularTotalFinal(): number {
    return this.calcularSubtotal() - this.calcularValorDesconto() + this.calcularValorImposto();
  }

  calcularTotal() {
    this.calcularTotalFinal();
  }

  onClienteChange(event: any) {
    // Lógica ao mudar cliente
  }

  onCancel() {
    if (confirm('Deseja cancelar? Alterações não salvas serão perdidas.')) {
      this.router.navigate(['/home']);
    }
  }

  onDelete() {
    if (confirm('Deseja realmente deletar este orçamento?')) {
      // Adicionar lógica de exclusão aqui
      this.router.navigate(['/orcamentos']);
    }
  }

  onSaveDraft() {
    // Lógica para salvar rascunho
    console.log('Salvando rascunho...', this.orcamentoForm.value);
    this.router.navigate(['/orcamentos']);
  }

  onSubmit() {
    if (this.orcamentoForm.valid && this.itens.length > 0) {
      console.log('Orçamento atualizado:', this.orcamentoForm.value);
      this.router.navigate(['/orcamentos']);
    }
  }
}

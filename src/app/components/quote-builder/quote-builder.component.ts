import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-quote-builder',
  standalone: true,
  templateUrl: './quote-builder.component.html',
  styleUrl: './quote-builder.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    CheckboxModule,
  ],
})
export class QuoteBuilderComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lines: this.fb.array([]),
    });
  }

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  get total(): number {
    return this.lines.controls.reduce((sum, line) => {
      const price = parseFloat(line.get('pricePerUnit')?.value || 0);
      return sum + price;
    }, 0);
  }

  createLine(
    item: string = '',
    unitType: string = 'number',
    pricePerUnit: number = 0
  ): FormGroup {
    return this.fb.group({
      item: [item],
      unitType: [unitType],
      pricePerUnit: [pricePerUnit],
      selected: [false],
    });
  }

  addLine(item = '', unitType = 'number', pricePerUnit = 0): void {
    this.lines.push(this.createLine(item, unitType, pricePerUnit));
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  removeSelectedLines(): void {
    for (let i = this.lines.length - 1; i >= 0; i--) {
      if (this.lines.at(i).get('selected')?.value) {
        this.lines.removeAt(i);
      }
    }
  }

  addKitchenBlueprint(): void {
    this.addLine('Kitchen Blueprint', 'area', 0);
  }

  quoteItemOptions = [
    {
      label: 'Add Kitchen Blueprint',
      icon: 'pi pi-plus',
      command: () => this.addKitchenBlueprint(),
    },
    {
      label: 'Remove Selected Lines',
      icon: 'pi pi-trash',
      command: () => this.removeSelectedLines(),
    },
  ];
}
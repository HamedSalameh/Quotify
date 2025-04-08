import { Component, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { QuoteItemTypes } from './QuoteItemTypes';
import { QuoteItemFactory } from './QuoteItemFactory';
import { QuoteItem } from './QuoteItem';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quote-builder',
  standalone: true,
  templateUrl: './quote-builder.component.html',
  styleUrls: ['./quote-builder.component.scss'],
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
export class QuoteBuilderComponent implements OnDestroy {
  form: FormGroup;
  QuoteItemFactory: QuoteItemFactory;
  unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lines: this.fb.array([]),
    });
    this.QuoteItemFactory = new QuoteItemFactory();
  }

  // Get the lines as a FormArray
  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  // Sum the totalPrice field from each row
  get total(): number {
    return this.lines.controls.reduce((sum, line) => {
      const rowTotal = parseFloat(line.get('totalPrice')?.value || '0');
      return sum + rowTotal;
    }, 0);
  }

  // Creates a new row (line)
  createLine(
    item: string = '',
    unitType: string = 'number',
    units: number = 0,
    pricePerUnit: number = 0,
    totalPrice: number = 0
  ): FormGroup {
    const line = this.fb.group({
      item: [item],
      unitType: [unitType],
      units: [units, [Validators.required, Validators.min(0)]],
      pricePerUnit: [pricePerUnit, [Validators.required, Validators.min(0)]],
      totalPrice: [totalPrice],
      selected: [false],
    });

    line.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(values => {
        this.updateTotalPrice(line);
      });

    return line;
  }

  // Calculates the row-level total and updates the form control.
  private updateTotalPrice(line: FormGroup): void {
    const units = parseFloat(line.get('units')?.value) || 0;
    const pricePerUnit = parseFloat(line.get('pricePerUnit')?.value) || 0;
    const newTotal = units * pricePerUnit;
    // Only update if the computed total is different.
    if (newTotal !== (parseFloat(line.get('totalPrice')?.value) || 0)) {
      line.get('totalPrice')?.setValue(newTotal, { emitEvent: false });
    }
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

  addItem(itemType: QuoteItemTypes): void {
    const item = this.QuoteItemFactory.createLine(itemType);
    this.lines.push(this.createLine(item.item, item.unitType, item.units, item.pricePerUnit, item.totalPrice));
  }

  quoteItemOptions = [
    {
      label: 'Add Kitchen Carpentry',
      icon: 'ph ph-ruler',
      command: () => this.addItem(QuoteItemTypes.KitchenCarpentry),
    },
    {
      label: 'Add Construction and Demolition',
      icon: 'ph ph-hammer',
      command: () => this.addItem(QuoteItemTypes.ConstructionAndDemolition),
    },
    {
      label: 'Add Furniture Layout',
      icon: 'ph ph-blueprint',
      command: () => this.addItem(QuoteItemTypes.FurnitureLayout),
    },
    {
      label: 'Add Electrical Plan',
      icon: 'ph ph-lightning',
      command: () => this.addItem(QuoteItemTypes.ElectricalPlan),
    },
    {
      label: 'Add Plumbing Plan',
      icon: 'ph ph-pipe',
      command: () => this.addItem(QuoteItemTypes.PlumbingPlan),
    },
    {
      label: 'Add HVAC Plan',
      icon: 'ph ph-wind',
      command: () => this.addItem(QuoteItemTypes.HVACPlan),
    },
    {
      label: 'Add Ceiling and Lighting Plan',
      icon: 'ph ph-lightbulb',
      command: () => this.addItem(QuoteItemTypes.CeilingAndLightingPlan),
    },
    {
      label: 'Add Dressing Room Carpentry',
      icon: 'ph ph-t-shirt',
      command: () => this.addItem(QuoteItemTypes.DressingRoomCarpentry),
    },
    {
      label: 'Decorativd Walls',
      icon: 'ph ph-wall',
      command: () => this.addItem(QuoteItemTypes.DecorativeWalls),
    }
  ];

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}



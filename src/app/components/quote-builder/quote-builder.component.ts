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
import { QuoteItemTypes } from './QuoteItemTypes';

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
export class QuoteBuilderComponent {
  form: FormGroup;
  QuoteItemFactory: QuoteItemFactory;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      lines: this.fb.array([]),
    });
    this.QuoteItemFactory = new QuoteItemFactory(this.fb);
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
      units: [units],
      pricePerUnit: [pricePerUnit],
      totalPrice: [totalPrice],
      selected: [false],
    });
  
    // Subscribe to changes on units and pricePerUnit
    line.get('units')?.valueChanges.subscribe(() => this.updateTotalPrice(line));
    line.get('pricePerUnit')?.valueChanges.subscribe(() => this.updateTotalPrice(line));
  
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
  
  addLine(item = '', unitType = 'number', units = 0, pricePerUnit = 0, price = 0): void {
    this.lines.push(this.createLine(item, unitType, units, pricePerUnit, price));
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
    this.addLine('Kitchen Blueprint', 'area', 0, 0);
  }

  addConstructionAndDemolition(): void {
    this.addLine('Construction and Demolition', 'area', 0, 0);
  }

  createNewLineWithDefaults(itemName: string): void {
    this.addLine(itemName, 'area', 0, 0);
  }

  quoteItemOptions = [
    {
      label: 'Add Kitchen Blueprint',
      icon: 'pi pi-plus',
      command: () => this.addKitchenBlueprint(),
    },
    {
      label: 'Add Construction and Demolition',
      icon: 'pi pi-plus',
      command: () => this.addConstructionAndDemolition(),
    },
    {
      label: 'Add Furniture Layout',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.FurnitureLayout)
        ),
    },
    {
      label: 'Add Electrical Plan',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.ElectricalPlan)
        ),
    },
    {
      label: 'Add Plumbing Plan',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.PlumbingPlan)
        ),
    },
    {
      label: 'Add HVAC Plan',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.HVACPlan)
        ),
    },
    {
      label: 'Add Ceiling and Lighting Plan',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(
            QuoteItemTypes.CeilingAndLightingPlan
          )
        ),
    },
    {
      label: 'Add Kitchen Carpentry',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.KitchenCarpentry)
        ),
    },
    {
      label: 'Add Dressing Room Carpentry',
      icon: 'pi pi-plus',
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(QuoteItemTypes.DressingRoomCarpentry)
        ),
    },
  ];
}

export class QuoteItemFactory {
  constructor(private fb: FormBuilder) { }

  public createLine(itemType: QuoteItemTypes): FormGroup {
    switch (itemType) {
      case QuoteItemTypes.ConstructionAndDemolition:
        return this.createLineWithDefaults('Construction and Demolition');
      case QuoteItemTypes.FurnitureLayout:
        return this.createLineWithDefaults('Furniture Layout');
      case QuoteItemTypes.ElectricalPlan:
        return this.createLineWithDefaults('Electrical Plan');
      case QuoteItemTypes.PlumbingPlan:
        return this.createLineWithDefaults('Plumbing Plan');
      case QuoteItemTypes.HVACPlan:
        return this.createLineWithDefaults('HVAC Plan');
      case QuoteItemTypes.CeilingAndLightingPlan:
        return this.createLineWithDefaults('Ceiling and Lighting Plan');
      case QuoteItemTypes.KitchenCarpentry:
        return this.createLineWithDefaults('Kitchen Carpentry');
      case QuoteItemTypes.DressingRoomCarpentry:
        return this.createLineWithDefaults('Dressing Room Carpentry');
      default:
        throw new Error('Invalid item type');
    }
  }

  private createLineWithDefaults(label: string): FormGroup {
    return this.fb.group({
      item: [label],
      unitType: ['area'],
      units: [0],
      pricePerUnit: [0],
      totalPrice: [0],
      selected: [false],
    });
  }
}

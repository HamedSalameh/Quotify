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
    units: number = 0,
    pricePerUnit: number = 0
  ): FormGroup {
    return this.fb.group({
      item: [item],
      unitType: [unitType],
      units: [units],
      pricePerUnit: [pricePerUnit],
      selected: [false],
    });
  }

  addLine(item = '', unitType = 'number', units = 0, pricePerUnit = 0): void {
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
    this.addLine('Kitchen Blueprint', 'area', 0, 0);
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
      command: () =>
        this.lines.push(
          this.QuoteItemFactory.createLine(
            QuoteItemTypes.ConstructionAndDemolition
          )
        ),
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
        this.lines.push(this.QuoteItemFactory.createLine(QuoteItemTypes.HVACPlan)),
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

export enum QuoteItemTypes {
  ConstructionAndDemolition = 'constructionAndDemolition',
  FurnitureLayout = 'furnitureLayout',
  ElectricalPlan = 'electricalPlan',
  PlumbingPlan = 'plumbingPlan',
  HVACPlan = 'hvacPlan',
  CeilingAndLightingPlan = 'ceilingAndLightingPlan',
  KitchenCarpentry = 'kitchenCarpentry',
  DressingRoomCarpentry = 'dressingRoomCarpentry',
}

export class QuoteItemFactory {
  constructor(private fb: FormBuilder) {}

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
      selected: [false],
    });
  }
}

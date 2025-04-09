import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { catchError, last, of, Subject, takeUntil } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { QuoteItemOptionConfig } from '../../models/QuoteItemOptionConfig';
import { QuoteItemMenuOption } from '../../models/QuoteItemMenuOption';
import { QuoteItemFactory } from './QuoteItemFactory';
import { UnitTypes } from '../../models/UnitTypes';

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
    ToggleSwitchModule
  ],
})
export class QuoteBuilderComponent implements OnDestroy, OnInit {
  form: FormGroup;
  quoteItemOptions: QuoteItemMenuOption[] = [];
  quoteItemOptionsConfig: QuoteItemOptionConfig[] = [];
  unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.form = this.fb.group({
      lines: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.initializeQuoteItems();
    this.loadConfiguration();
  }

  initializeQuoteItems(): void {
    this.quoteItemOptions = [
      {
        key: QuoteItemTypes.KitchenCarpentry,
        label: 'Add Kitchen Carpentry',
        icon: 'ph ph-ruler',
        command: () => this.addItem(QuoteItemTypes.KitchenCarpentry),
      },
      {
        key: QuoteItemTypes.ConstructionAndDemolition,
        label: 'Add Construction and Demolition',
        icon: 'ph ph-hammer',
        command: () => this.addItem(QuoteItemTypes.ConstructionAndDemolition),
      },
      {
        key: QuoteItemTypes.FurnitureLayout,
        label: 'Add Furniture Layout',
        icon: 'ph ph-blueprint',
        command: () => this.addItem(QuoteItemTypes.FurnitureLayout),
      },
      {
        key: QuoteItemTypes.ElectricalPlan,
        label: 'Add Electrical Plan',
        icon: 'ph ph-lightning',
        command: () => this.addItem(QuoteItemTypes.ElectricalPlan),
      },
      {
        key: QuoteItemTypes.PlumbingPlan,
        label: 'Add Plumbing Plan',
        icon: 'ph ph-pipe',
        command: () => this.addItem(QuoteItemTypes.PlumbingPlan),
      },
      {
        key: QuoteItemTypes.HVACPlan,
        label: 'Add HVAC Plan',
        icon: 'ph ph-wind',
        command: () => this.addItem(QuoteItemTypes.HVACPlan),
      },
      {
        key: QuoteItemTypes.CeilingAndLightingPlan,
        label: 'Add Ceiling and Lighting Plan',
        icon: 'ph ph-lightbulb',
        command: () => this.addItem(QuoteItemTypes.CeilingAndLightingPlan),
      },
      {
        key: QuoteItemTypes.DressingRoomCarpentry,
        label: 'Add Dressing Room Carpentry',
        icon: 'ph ph-t-shirt',
        command: () => this.addItem(QuoteItemTypes.DressingRoomCarpentry),
      },
      {
        key: QuoteItemTypes.DecorativeWalls,
        label: 'Decorative Walls',
        icon: 'ph ph-wall',
        command: () => this.addItem(QuoteItemTypes.DecorativeWalls),
      }
    ]
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
    active: boolean = false,
    item: string = '',
    unitType: string = UnitTypes.Number,
    units: number = 0,
    pricePerUnit: number = 0,
    totalPrice: number = 0
  ): FormGroup {
    const line = this.fb.group({
      active: [active],
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

  addItem(itemType: QuoteItemTypes): void {
    const item = QuoteItemFactory.createLine(itemType);
    const pricePerUnit = this.quoteItemOptionsConfig.find(option => option.key === itemType)?.base_price || 0;
    item.pricePerUnit = pricePerUnit;
    this.lines.push(this.createLine(true, item.item, item.unitType, item.units, item.pricePerUnit, item.totalPrice));
  }

  // Load the configuration from Firestore and wire up command callbacks.
  loadConfiguration(): void {
    this.settingsService.getConfiguration()
      .pipe(
        takeUntil(this.unsubscribe$),
        // Optionally, catch and log errors and provide fallback empty array.
        catchError(error => {
          console.error("Error loading configuration", error);
          // Return an empty array as a fallback.
          return of([] as QuoteItemOptionConfig[]);
        })
      )
      .subscribe({
        next: (options: QuoteItemOptionConfig[]) => {
          // Directly assign the configuration array instead of pushing to it.
          this.quoteItemOptionsConfig = options;
        },
        error: (err) => {
          // This error callback is optional since we handled errors in catchError.
          console.error("Error in loadConfiguration subscription", err);
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}



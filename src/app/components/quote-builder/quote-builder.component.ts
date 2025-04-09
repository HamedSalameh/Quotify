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
    this.quoteItemOptions = [];
    this.loadConfiguration();
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
    const itemFromConfig = this.quoteItemOptionsConfig.find(option => option.key === itemType);
    item.pricePerUnit = itemFromConfig?.base_price || 0;
    item.item = itemFromConfig?.label || item.item;
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

          // Dynamically generate quoteItemOptions from config
          this.quoteItemOptions = this.quoteItemOptionsConfig.map(config => ({
            key: config.key,
            label: `${config.label}`,
            icon: config.icon,
            command: () => this.addItem(config.key as QuoteItemTypes),
          }));
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



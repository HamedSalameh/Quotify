import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { QuoteItemOptionConfig } from '../../models/QuoteItemOptionConfig';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { ButtonModule } from 'primeng/button';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, CardModule, ButtonModule, InputNumberModule, ToastModule, ConfirmDialogModule, ButtonGroupModule],
  standalone: true,
  providers: [MessageService, ConfirmationService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  form: FormGroup;
  quoteItems: QuoteItemOptionConfig[] = [];

  // Localized strings

  saveButtonLabel = $localize`:@@settings.saveButtonLabel: Save Configuration`;
  resetButtonLabel = $localize`:@@settings.resetButtonLabel: Reset Configuration`;
  newItemButtonLabel = $localize`:@@settings.newItemLabel: New Item`;
  deleteButtonLabel = $localize`:@@settings.deleteButtonLabel: Delete`;

  successMessage = $localize`:@@settings.successMessage: Configuration saved successfully!`;
  errorMessage = $localize`:@@settings.errorMessage: Error saving configuration!`;
  resetMessage = $localize`:@@settings.resetMessage: Configuration reset to default!`;

  invalidFormMessageTitle = $localize`:@@settings.invalidFormMessageTitle: Invalid Form`;
  invalidFormMessage = $localize`:@@settings.invalidFormMessage: Please correct the errors in the form.`;

  yesButtonLabel = $localize`:@@settings.yesButtonLabel: Yes`;
  noButtonLabel = $localize`:@@settings.noButtonLabel: No`;
  confirmResetMessage = $localize`:@@settings.confirmResetMessage: Are you sure you want to reset the configuration?`;
  confirmResetMessageTitle = $localize`:@@settings.resetConfirmationHeader: Confirmation`;

  constructor(private settingsService: SettingsService,
    private fb: FormBuilder, private messageService: MessageService,
    private confirmationService: ConfirmationService) {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadConfiguration();
    this.quoteItems.forEach(item => {
      this.items.push(this.createItemGroup(item));
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addNewItem(): void {
    const newItem: QuoteItemOptionConfig = {
      key: '',
      label: '',
      icon: '',
      base_price: 0
    };
  
    this.items.push(this.createItemGroup(newItem));
  } 

  deleteItem(index: number): void {
    this.items.removeAt(index);
  }

  loadConfiguration() {
    this.settingsService.getConfiguration().subscribe((config: QuoteItemOptionConfig[]) => {
      this.quoteItems = config;
      this.items.clear(); // Clear existing items
      this.quoteItems.forEach(item => {
        this.items.push(this.createItemGroup(item)); // Add new items
      });
    });
  }

  confirmReset() {
    this.confirmationService.confirm({
      message: this.confirmResetMessage,
      header: this.confirmResetMessageTitle,
      icon: 'ph ph-warning',
      closable: true,
      closeOnEscape: true,
      rejectButtonProps: {
        label: this.noButtonLabel,
        icon: 'ph ph-x',
        severity: 'secondary',
        outlined: true,
        class: 'p-button-text'
      },
      acceptButtonProps: {
        label: this.yesButtonLabel,
        icon: 'ph ph-check',
        severity: 'danger',
        class: 'p-button-text'
      },
      accept: () => {
        this.resetConfiguration();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: $localize`:@@settings.resetCancelled: Reset Cancelled` });
      }
    });
  }

  resetConfiguration() {
    this.quoteItems = [
      { key: 'constructionAndDemolition', label: "Construction and Demolition", icon: "ph ph-hammer", base_price: 20 },
      { key: 'kitchenCarpentry', label: "Kitchen Carpentry", icon: "ph ph-ruler", base_price: 150 },
      { key: 'ceilingAndLightingPlan', label: "Ceiling and Lighting Plan", icon: "ph ph-lightbulb", base_price: 25 },
      { key: 'hvacPlan', label: "HVAC Plan", icon: "ph ph-thermometer", base_price: 200 },
      { key: 'plumbingPlan', label: "Plumbing Plan", icon: "ph ph-water", base_price: 400 },
      { key: 'dressingRoomCarpentry', label: "Dressing Room Carpentry", icon: "ph ph-ruler", base_price: 50 },
      { key: 'electricalPlan', label: "Electrical Plan", icon: "ph ph-plug", base_price: 25 },
      { key: 'furnitureLayout', label: "Furniture Layout", icon: "ph ph-layout", base_price: 10 },
      { key: 'decorativeWalls', label: "Decorative Walls", icon: "ph ph-wall", base_price: 50 },
    ];
  
    this.settingsService.saveConfiguration(this.quoteItems)
      .then(() => console.log('Configuration saved successfully!'))
      .catch(error => console.error('Error saving configuration: ', error));
  
    this.messageService.add({ severity: 'success', summary: this.resetMessage });
  }

  private createItemGroup(item: QuoteItemOptionConfig): FormGroup {
    return this.fb.group({
      key: [item.key, [Validators.required]],
      label: [item.label, [Validators.required]],
      icon: [item.icon],
      base_price: [item.base_price, [Validators.required, Validators.min(0)]]
    });
  }

  saveConfiguration(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: this.invalidFormMessageTitle, detail: this.invalidFormMessage });
      return;
    }

    const updatedConfig: QuoteItemOptionConfig[] = this.form.value.items;

    this.settingsService.saveConfiguration(updatedConfig)
      .then(() => {
        console.log('Configuration saved successfully!');
        this.messageService.add({ severity: 'success', summary: this.successMessage });
      })
      .catch(error => {
        console.error('Error saving configuration: ', error);
        this.messageService.add({ severity: 'error', summary: this.errorMessage });
      });

  }
}



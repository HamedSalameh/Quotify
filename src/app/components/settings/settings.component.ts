import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { QuoteItemOptionConfig } from '../../models/QuoteItemOptionConfig';
import { QuoteItemTypes } from '../../models/QuoteItemTypes';
import { ButtonModule } from 'primeng/button';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, CardModule, ButtonModule, InputNumberModule, ToastModule],
  standalone: true,
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  form: FormGroup;
  quoteItems: QuoteItemOptionConfig[] = [];

  constructor(private settingsService: SettingsService, private fb: FormBuilder, private messageService: MessageService) {
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

  loadConfiguration() {
    this.settingsService.getConfiguration().subscribe((config: QuoteItemOptionConfig[]) => {
      this.quoteItems = config;
      this.items.clear(); // Clear existing items
      this.quoteItems.forEach(item => {
        this.items.push(this.createItemGroup(item)); // Add new items
      });
    });
  }

  ResetConfiguration() {
    this.quoteItems = [
      { key: QuoteItemTypes.ConstructionAndDemolition, label: "Construction and Demolition", icon: "ph ph-hammer" , base_price: 20 },
      { key: QuoteItemTypes.KitchenCarpentry, label: "Kitchen Carpentry", icon: "ph ph-ruler" , base_price: 150 },
      { key: QuoteItemTypes.CeilingAndLightingPlan, label: "Ceiling and Lighting Plan", icon: "ph ph-lightbulb" , base_price: 25 },
      { key: QuoteItemTypes.HVACPlan, label: "HVAC Plan", icon: "ph ph-thermometer" , base_price: 200 },
      { key: QuoteItemTypes.PlumbingPlan, label: "Plumbing Plan", icon: "ph ph-water" , base_price: 400 },
      { key: QuoteItemTypes.DressingRoomCarpentry, label: "Dressing Room Carpentry", icon: "ph ph-ruler" , base_price: 50 },
      { key: QuoteItemTypes.ElectricalPlan, label: "Electrical Plan", icon: "ph ph-plug" , base_price: 25 },
      { key: QuoteItemTypes.FurnitureLayout, label: "Furniture Layout", icon: "ph ph-layout" , base_price: 10 },
      { key: QuoteItemTypes.DecorativeWalls, label: "Decorative Walls", icon: "ph ph-wall" , base_price: 50 },
    ];

    this.settingsService.saveConfiguration(this.quoteItems)
      .then(() => console.log('Configuration saved successfully!'))
      .catch(error => console.error('Error saving configuration: ', error));

    this.messageService.add({ severity: 'success', summary: 'Configuration Reset', detail: 'Default configuration has been restored.' });
  }

  private createItemGroup(item: QuoteItemOptionConfig): FormGroup {
    return this.fb.group({
      key: [item.key],
      label: [item.label],
      icon: [item.icon],
      base_price: [item.base_price]
    });
  }

  saveConfiguration(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Invalid Form', detail: 'Please correct the errors in the form.' });
      return;
    }

    const updatedConfig: QuoteItemOptionConfig[] = this.form.value.items;

    this.settingsService.saveConfiguration(updatedConfig)
      .then(() => {
        console.log('Configuration saved successfully!');
        this.messageService.add({ severity: 'success', summary: 'Configuration Saved', detail: 'Your changes have been saved.' });
      })
      .catch(error => {
        console.error('Error saving configuration: ', error);
        this.messageService.add({ severity: 'error', summary: 'Error Saving Configuration', detail: 'There was an error saving your changes.' });
      });

  }
}



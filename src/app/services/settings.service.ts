import { Injectable } from '@angular/core';
import { Firestore, doc, docData, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { QuoteItemOptionConfig } from '../models/QuoteItemOptionConfig';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private configDocPath = 'settings/quoteItemOptions'; // e.g. a document in Firestore

  constructor(private firestore: Firestore) {}

  // Save the configuration
  async saveConfiguration(options: QuoteItemOptionConfig[]): Promise<void> {
    const configDocRef = doc(this.firestore, this.configDocPath);
    await setDoc(configDocRef, { options });
  }

  // Load the configuration as an observable
  getConfiguration(): Observable<QuoteItemOptionConfig[]> {
    const configDocRef = doc(this.firestore, this.configDocPath);
    return docData(configDocRef).pipe(
      map((config: any) => config ? config.options : [])
    );
  }
}

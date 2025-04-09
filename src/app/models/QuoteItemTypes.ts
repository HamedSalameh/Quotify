
// export enum QuoteItemTypes {
//   ConstructionAndDemolition = 'constructionAndDemolition',
//   FurnitureLayout = 'furnitureLayout',
//   ElectricalPlan = 'electricalPlan',
//   PlumbingPlan = 'plumbingPlan',
//   HVACPlan = 'hvacPlan',
//   CeilingAndLightingPlan = 'ceilingAndLightingPlan',
//   KitchenCarpentry = 'kitchenCarpentry',
//   DressingRoomCarpentry = 'dressingRoomCarpentry',
//   DecorativeWalls = "DecorativeWalls"
// }

export type QuoteItemTypes =
  | 'constructionAndDemolition'
  | 'furnitureLayout'
  | 'electricalPlan'
  | 'plumbingPlan'
  | 'hvacPlan'
  | 'ceilingAndLightingPlan'
  | 'kitchenCarpentry'
  | 'dressingRoomCarpentry'
  | 'decorativeWalls'
  | string; // <-- allows dynamic/custom types too




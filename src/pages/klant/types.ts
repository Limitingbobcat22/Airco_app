export type KlantNawData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  note: string
  consentContact: boolean
}

export type OfferteContext = {
  aircoId?: string
  aircoLabel: string
  coolingKw: number
  heatingKw: number
  netEuroSavedYearly: number | null
}

export const EMPTY_KLANT_NAW: KlantNawData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  note: '',
  consentContact: false,
}

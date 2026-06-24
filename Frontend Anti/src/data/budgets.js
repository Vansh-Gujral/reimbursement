// ── Fixed rates ───────────────────────────────────────────
export const PER_DIEM_RATE = 1500
export const CARPOOL_RATE_PER_DAY = 50
export const PETROL_RATE = 105
export const VEHICLE_MILEAGE = 11

// ── Domestic Areas ────────────────────────────────────────
export const DOMESTIC_STATES = {
  'Maharashtra': 'Area A', 'Delhi': 'Area A', 'Karnataka': 'Area A', 'Tamil Nadu': 'Area A',
  'Telangana': 'Area B', 'Gujarat': 'Area B', 'West Bengal': 'Area B',
  'Other': 'Area C'
}

export const DOMESTIC_BUDGETS_BY_AREA = {
  'Area A': {
    CL1: { perDiem:1500, hotelPerNight:10000, localConveyanceMax:3500, totalCap:200000 },
    CL2: { perDiem:1500, hotelPerNight:8000,  localConveyanceMax:3000, totalCap:150000 },
    CL3: { perDiem:1500, hotelPerNight:6000,  localConveyanceMax:2500, totalCap:100000 },
    CL4: { perDiem:1500, hotelPerNight:4000,  localConveyanceMax:2000, totalCap:60000  },
  },
  'Area B': {
    CL1: { perDiem:1500, hotelPerNight:8000, localConveyanceMax:3000, totalCap:150000 },
    CL2: { perDiem:1500, hotelPerNight:6000, localConveyanceMax:2500, totalCap:100000 },
    CL3: { perDiem:1500, hotelPerNight:4000, localConveyanceMax:2000, totalCap:60000  },
    CL4: { perDiem:1500, hotelPerNight:3000, localConveyanceMax:1500, totalCap:40000  },
  },
  'Area C': {
    CL1: { perDiem:1500, hotelPerNight:6000, localConveyanceMax:2500, totalCap:100000 },
    CL2: { perDiem:1500, hotelPerNight:4000, localConveyanceMax:2000, totalCap:60000  },
    CL3: { perDiem:1500, hotelPerNight:3000, localConveyanceMax:1500, totalCap:40000  },
    CL4: { perDiem:1500, hotelPerNight:2000, localConveyanceMax:1000, totalCap:30000  },
  }
}

// ── International Tiers & Rates ───────────────────────────
export const INTL_COUNTRIES = ['Vietnam', 'Korea', 'Philippines', 'Other']

export const EXCHANGE_RATES = {
  'Vietnam': { currency: 'VND', rate: 0.0034 },
  'Korea': { currency: 'KRW', rate: 0.062 },
  'Philippines': { currency: 'PHP', rate: 1.48 }
}

export function getExchangeRate(country) {
  if (EXCHANGE_RATES[country]) return EXCHANGE_RATES[country]
  // Mock backend fetch for 'Other' international countries
  const mockRates = {
    'Japan': { currency: 'JPY', rate: 0.55 },
    'USA': { currency: 'USD', rate: 83.50 },
    'UK': { currency: 'GBP', rate: 105.20 },
    'Singapore': { currency: 'SGD', rate: 61.80 }
  }
  return mockRates[country] || { currency: 'USD', rate: 83.50 } // Default fallback
}

export const INTL_BUDGETS = {
  'Korea': { CL1:{perDiem:6000,hotelPerNight:22000,localConveyanceMax:7000,totalCap:480000}, CL2:{perDiem:5000,hotelPerNight:18000,localConveyanceMax:5500,totalCap:320000}, CL3:{perDiem:4000,hotelPerNight:14000,localConveyanceMax:4500,totalCap:230000}, CL4:{perDiem:3500,hotelPerNight:11000,localConveyanceMax:3500,totalCap:160000} },
  'Vietnam': { CL1:{perDiem:4000,hotelPerNight:15000,localConveyanceMax:5000,totalCap:300000}, CL2:{perDiem:3500,hotelPerNight:12000,localConveyanceMax:4000,totalCap:200000}, CL3:{perDiem:3000,hotelPerNight:9000, localConveyanceMax:3000,totalCap:150000}, CL4:{perDiem:2500,hotelPerNight:7000, localConveyanceMax:2500,totalCap:100000} },
  'Philippines': { CL1:{perDiem:4000,hotelPerNight:15000,localConveyanceMax:5000,totalCap:300000}, CL2:{perDiem:3500,hotelPerNight:12000,localConveyanceMax:4000,totalCap:200000}, CL3:{perDiem:3000,hotelPerNight:9000, localConveyanceMax:3000,totalCap:150000}, CL4:{perDiem:2500,hotelPerNight:7000, localConveyanceMax:2500,totalCap:100000} },
  'Other': { CL1:{perDiem:4500,hotelPerNight:18000,localConveyanceMax:5500,totalCap:350000}, CL2:{perDiem:3800,hotelPerNight:14000,localConveyanceMax:4500,totalCap:240000}, CL3:{perDiem:3000,hotelPerNight:11000,localConveyanceMax:3500,totalCap:180000}, CL4:{perDiem:2500,hotelPerNight:8000, localConveyanceMax:2800,totalCap:120000} },
}

// ── Other caps ────────────────────────────────────────────
export const INTERNET_CAPS   = { CL1:2000, CL2:1500, CL3:1000, CL4:750  }
export const RELOCATION_CAPS = { CL1:200000, CL2:150000, CL3:100000, CL4:75000 }

// ── Budget helper ─────────────────────────────────────────
export function getBudget(cl, tripType, location) {
  if (tripType === 'domestic') {
    const area = DOMESTIC_STATES[location] || 'Area C'
    return DOMESTIC_BUDGETS_BY_AREA[area][cl] || DOMESTIC_BUDGETS_BY_AREA['Area C'].CL4
  }
  const rb = INTL_BUDGETS[location] || INTL_BUDGETS.Other
  return rb[cl] || rb.CL4
}

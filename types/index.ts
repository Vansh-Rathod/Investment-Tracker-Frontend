export interface Portfolio {
  portfolioId: number
  name: string
  userId: number
  portfolioType: number
  portfolioTypeName: string
  createdDate: string
  modifiedDate?: string
  totalInvested: number
  stockCount: number
  mutualFundCount: number
}

export interface CreatePortfolioRequest {
  name: string
  portfolioType: number // 1 = Mixed, 2 = Stocks, 3 = Mutual Funds
}

export interface UpdatePortfolioRequest {
  portfolioId: number
  name: string
  portfolioType: number
}

export interface SIP {
  sipId: number
  portfolioId: number
  portfolioName: string
  portfolioType: number
  portfolioTypeName: string
  assetTypeId: number
  assetTypeName: string
  assetId: number
  assetName: string
  amcName?: string
  categoryName?: string
  sipAmount: number
  frequency: number
  frequencyName: string
  sipDate: string
  startDate: string
  endDate?: string
  sipStatus: number
  sipStatusName: string
  createdDate: string
  modifiedDate?: string
}

export interface CreateSIPRequest {
  portfolioId: number
  assetTypeId: number
  assetId: number
  sipAmount: number
  frequency: number
  sipDate: string
  startDate: string
  endDate?: string
}

export interface UpdateSIPRequest {
  sipId: number
  sipAmount: number
  frequency: number
  sipDate: string
  endDate?: string
}

export interface Transaction {
  transactionId: number
  portfolioId: number
  portfolioName: string
  portfolioType: number
  portfolioTypeName: string
  assetTypeId: number
  assetTypeName: string
  assetId: number
  assetName: string
  amcName?: string
  categoryName?: string
  transactionType: number
  transactionTypeName: string
  units: number
  price: number
  amount: number
  transactionDate: string
  sourceType?: string
  sourceId?: number
  createdDate: string
  modifiedDate?: string
}

export interface TransactionFilter {
  portfolioId?: number
  assetId?: number
  assetTypeId?: number
  transactionType?: number
  fromDate?: string
  toDate?: string
}

export interface DashboardSummary {
  totalInvested: number
  currentValue: number
  totalReturns: number
  totalReturnsPercentage: number
  mutualFundsValue: number
  stocksValue: number
  mutualFundsCount: number
  stocksCount: number
}

export interface AllocationData {
  name: string
  value: number
  percentage: number
  fill?: string
}

export interface PerformanceData {
  period: string
  mutualFunds: number
  stocks: number
  total: number
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

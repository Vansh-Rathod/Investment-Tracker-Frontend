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
  userId: number
  assetTypeId: number
  assetTypeName: string
  assetId: number
  assetName: string
  amcName?: string
  categoryName?: string
  sipAmount: number
  frequency: number
  sipDate: string
  startDate: string
  endDate?: string
  nextSipDate?: string
  sipStatus: number
  createdDate: string
  modifiedDate?: string
}

export interface CreateSIPRequest {
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
  assetTypeId: number
  assetId: number
  sipAmount: number
  frequency: number
  sipDate: string
  startDate: string
  endDate?: string
  status: number
}

export interface SipExecution {
  sipExecutionId: number
  sipId: number
  assetTypeId: number
  assetTypeName: string
  assetId: number
  assetName: string
  amcName?: string
  categoryName?: string
  sipAmount: number
  scheduledDate?: string
  executedDate: string
  navAtExecution: number
  unitsAllocated: number
  orderReference?: string
  executionStatus: number
  executionStatusName: string
  failureReason?: string
  createdDate: string
  modifiedDate?: string
}

export interface Transaction {
  transactionId: number
  userId: number
  assetTypeId: number
  assetTypeName: string
  assetId: number
  assetName: string
  amcName?: string
  categoryName?: string
  transactionType: number
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
  assetId?: number
  assetTypeId?: number
  transactionType?: number
  fromDate?: string
  toDate?: string
}

export interface CreateTransactionRequest {
  assetTypeId: number
  assetId: number
  transactionType: number // 1=Buy, 2=Sell, 3=Dividend, 4=Split, 5=Bonus
  units: number
  price: number
  amount: number
  transactionDate: string
  sourceType?: string
  sourceId?: number
}

export interface DashboardSummary {
  investedAmount: number
  currentValue: number
  totalReturns: number
  absReturns: number
  stockInvestedAmount: number
  stockCurrentValue: number
  mfInvestedAmount: number
  mfCurrentValue: number
  xirr?: number
  dayChange?: number
  dayChangePercentage?: number
}

export interface AllocationData {
  id?: number
  name: string
  value: number
  percentage: number
  fill?: string
}

export interface PerformanceData {
  date: string
  investedAmount: number
  currentValue: number
}

/** Stock holding (user's holdings from API) */
export interface StockHolding {
  stockId: number
  stockName: string
  symbol: string
  exchangeName: string
  quantity: number
  averagePrice: number
  currentPrice: number
  investedAmount: number
  currentValue: number
  dayChange: number
  dayChangePercentage: number
  totalReturn: number
  totalReturnPercentage: number
}

/** Market stock (for dropdowns / search) */
export interface StockViewModel {
  stockId: number
  stockName: string
  symbol: string
  exchangeName?: string
  exchangeId?: number
  isin?: string
  isActive?: boolean
  isETF?: boolean
}

/** Mutual fund holding (user's holdings from API) */
export interface MutualFundHolding {
  fundId: number
  fundName: string
  amcCode: string
  categoryName: string
  unitsHeld: number
  averageNAV: number
  currentNAV: number
  investedAmount: number
  currentValue: number
  absoluteReturn: number
  absoluteReturnPercentage: number
  xirr: number
}

/** Market mutual fund (for dropdowns / search) */
export interface MutualFundViewModel {
  fundId: number
  fundName: string
  amcId?: number
  amcName?: string
  categoryId?: number
  categoryName?: string
  isin?: string
  isActive?: boolean
}

/** Legacy mock shape - map from StockHolding where needed */
export interface StockInvestment {
  id: string
  symbol: string
  companyName: string
  exchange: string
  quantity: number
  averagePrice: number
  currentPrice: number
  investedValue: number
  currentValue: number
  returns: number
  returnsPercentage: number
  purchaseDate: string
  sector: string
}

export interface MutualFundSIP {
  id: string
  orderId: string
  amcName: string
  schemeName: string
  folioNumber: string
  sipAmount: number
  sipDate: number
  startDate: string
  frequency: string
  nav: number
  currentNav: number
  units: number
  investedValue: number
  currentValue: number
  returns: number
  returnsPercentage: number
  status: string
}

export interface StockFormData {
  symbol: string
  companyName: string
  exchange: string
  quantity: number
  averagePrice: number
  purchaseDate: string
  sector: string
}

export interface MutualFundSIPFormData {
  schemeName: string
  amcName: string
  folioNumber: string
  sipAmount: number
  sipDate: number
  startDate: string
  frequency: string
}

export interface PortfolioSummary {
  totalInvested: number
  currentValue: number
  totalReturns: number
  totalReturnsPercentage: number
  mutualFundsValue: number
  stocksValue: number
  mutualFundsCount: number
  stocksCount: number
}

// API Response Wrapper
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

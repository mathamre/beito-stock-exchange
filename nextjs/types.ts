/**
 * Business
 */
export interface Business {
    id: number;
    name: string;

    // Because portfolioId is optional (Int?),
    // use `number | null | undefined`
    portfolioId?: number | null;

    // The one-to-one relation to Portfolio is optional
    // (since portfolioId can be null)
    portfolio?: Portfolio | null;
}

/**
 * Portfolio
 */
export interface Portfolio {
    id: number;

    // A Portfolio has multiple PortfolioStocks, so an array
    stocks: PortfolioStock[];

    // One-to-one back-reference to Business (optional)
    business?: Business | null;
}

/**
 * PortfolioStock
 */
export interface PortfolioStock {
    id: number;
    stockId: number;
    portfolioId: number;

    // The quantity owned in the portfolio
    quantity: number;

    // Relations
    stock: Stock;
    portfolio: Portfolio;
}

/**
 * Stock
 */
export interface Stock {
    id: number;
    name: string;
    current_price: number;
    volatility: number;

    // A Stock can be referenced by multiple PortfolioStocks
    portfolioStocks: PortfolioStock[];
}

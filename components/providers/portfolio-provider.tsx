"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Portfolio } from '@/types';
import { portfolioService } from '@/services/portfolioService';
import { useAuth } from '@/components/providers/auth-provider';

interface PortfolioContextType {
    portfolios: Portfolio[];
    selectedPortfolio: Portfolio | null;
    selectedPortfolioId: number | null;
    setSelectedPortfolioId: (id: number | null) => void;
    isLoading: boolean;
    refreshPortfolios: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const refreshPortfolios = async () => {
        try {
            setIsLoading(true);
            const response = await portfolioService.getPortfolios();
            if (response.success && response.data) {
                setPortfolios(response.data);

                // Select first portfolio if none selected and portfolios exist
                if (!selectedPortfolioId && response.data.length > 0) {
                    setSelectedPortfolioId(response.data[0].portfolioId);
                }
            }
        } catch (error) {
            console.error("Failed to fetch portfolios", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            refreshPortfolios();
        }
        if (!authLoading && !isAuthenticated) {
            setPortfolios([]);
            setSelectedPortfolioId(null);
            setIsLoading(false);
        }
    }, [authLoading, isAuthenticated]);

    const selectedPortfolio = portfolios.find(p => p.portfolioId === selectedPortfolioId) || null;

    return (
        <PortfolioContext.Provider value={{
            portfolios,
            selectedPortfolio,
            selectedPortfolioId,
            setSelectedPortfolioId,
            isLoading,
            refreshPortfolios
        }}>
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (context === undefined) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}

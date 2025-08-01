import { useState, useEffect } from "react";

interface CoinMarketCapResponse {
  status: {
    error_code: number;
    error_message: string | null;
  };
  data: {
    [key: string]: {
      id: number;
      name: string;
      symbol: string;
      category: string;
      description: string;
      slug: string;
      logo: string;
      subreddit: string;
      notice: string;
      tags: string[];
      urls: {
        website: string[];
        twitter: string[];
        message_board: string[];
        chat: string[];
        facebook: string[];
        explorer: string[];
        reddit: string[];
        technical_doc: string[];
        source_code: string[];
        announcement: string[];
      };
      platform: null;
      date_added: string;
      twitter_username: string;
      is_hidden: number;
      date_launched: string;
      contract_address: string[];
      self_reported_circulating_supply: null;
      self_reported_tags: null;
      self_reported_market_cap: null;
      infinite_supply: boolean;
    };
  };
}

export const useWSonicPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          "https://rest.coincap.io/v3/assets?ids=sonic&apiKey=81a8479c3fb8e0a48c34d3d35f08eb7e11b55ff9973d39bf3c6e522cf31261ca"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch wSonic price");
        }

        const data: CoinMarketCapResponse = await response.json();
        console.log(data);
        // Extract price from the response
        const sonicData = Object.values(data.data)[0];
        if (!sonicData) {
          throw new Error("No price data available");
        }
        console.log(sonicData?.priceUsd);
        setPrice(sonicData?.priceUsd ? sonicData.priceUsd : 0); // Replace with actual price extraction once API endpoint is confirmed
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching wSonic price:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();

    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { price, isLoading, error };
};

import { useEffect, useState } from "react";

interface LendingStats {
  tvl: number;
  totalBorrowed: number;
  utilization: number;
  avgDuration: number;
}

export const useLendingStats = () => {
  const [stats, setStats] = useState<LendingStats>({
    tvl: 0,
    totalBorrowed: 0,
    utilization: 0,
    avgDuration: 0,
  });

  useEffect(() => {
    // TODO: Implement real data fetching
    // This is mock data for demonstration
    setStats({
      tvl: 1000000,
      totalBorrowed: 750000,
      utilization: 75,
      avgDuration: 14,
    });
  }, []);

  return { stats };
};

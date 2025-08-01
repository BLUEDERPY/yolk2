# Eggs Finance

A DeFi protocol on the Sonic blockchain that utilizes $S and $EGGS to create a stable and potentially increasing value mechanism.

## Features

- **Trade**: Swap $S for $EGGS to start earning yield
- **Lending**: Borrow $S using $EGGS as collateral with 99% LTV
- **Leverage**: Open leveraged positions for amplified returns
- **Staking**: Provide liquidity and earn rewards

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Library**: Material-UI (MUI) with custom Aurora theme
- **Web3**: Wagmi + Viem + RainbowKit
- **Blockchain**: Sonic Network
- **Charts**: Lightweight Charts
- **Styling**: Custom design system with Aurora theme

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eggs-finance
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard/      # Protocol metrics and analytics
│   ├── Header/         # Navigation and wallet connection
│   ├── Lending/        # Borrowing and lending interface
│   ├── Leverage/       # Leverage trading components
│   ├── Swap/           # Token swapping interface
│   ├── TokenCard/      # Token display and trading cards
│   └── ...
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── providers/          # Context providers and data management
├── themes/             # Custom MUI themes (Aurora design system)
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Key Components

### Trading Interface
- **SwapWidget**: Main trading interface for $S ↔ $EGGS
- **TokenCard**: Advanced trading cards with charts and multiple actions
- **PriceChart**: Real-time price charts with WebSocket integration

### Lending System
- **LendingInterface**: Borrow $S using $EGGS as collateral
- **LendingTabs**: Manage existing positions (borrow more, extend, close)
- **LoanMetrics**: Real-time position health and metrics

### Leverage Trading
- **LeverageCalculator**: Open leveraged positions
- **PotentialReturns**: ROI calculations and scenario modeling

## Smart Contract Integration

The app integrates with the Eggs Finance smart contract on Sonic:
- **Contract Address**: `0xf26Ff70573ddc8a90Bd7865AF8d7d70B8Ff019bC`
- **Network**: Sonic Mainnet (Chain ID: 146)

## Design System

The project uses a custom **Aurora Design System** featuring:
- Holographic gradients and glass morphism effects
- Smooth animations and micro-interactions
- Responsive design with mobile-first approach
- Dark/light theme support
- Consistent spacing and typography scales

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file with:
```
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Links

- [Documentation](https://eggs-finance.gitbook.io/docs/documentation)
- [Website](https://eggs.finance)
- [Twitter](https://twitter.com/eggsonsonic)
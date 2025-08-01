import { GridPosition } from '../types/grid';

export const createGridPositions = (columns: number, rows: number): GridPosition[] => {
  const positions: GridPosition[] = [];
  const cellWidth = 100 / columns;
  const cellHeight = 100 / rows;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Add some controlled randomness within each cell
      const randomX = Math.random() * (cellWidth * 0.6);
      const randomY = Math.random() * (cellHeight * 0.6);
      
      positions.push({
        x: col * cellWidth + cellWidth * 0.2 + randomX,
        y: row * cellHeight + cellHeight * 0.2 + randomY,
      });
    }
  }
  
  return positions.sort(() => Math.random() - 0.5);
};
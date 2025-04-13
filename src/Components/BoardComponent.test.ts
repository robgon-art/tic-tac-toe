import { describe, it, expect, beforeEach } from 'vitest';
import { BoardComponent, CellValue } from './BoardComponent';

describe('BoardComponent', () => {
    let boardComponent: BoardComponent;

    beforeEach(() => {
        boardComponent = new BoardComponent();
    });

    it('should initialize with an empty grid', () => {
        const expected = [
            [CellValue.Empty, CellValue.Empty, CellValue.Empty],
            [CellValue.Empty, CellValue.Empty, CellValue.Empty],
            [CellValue.Empty, CellValue.Empty, CellValue.Empty]
        ];
        expect(boardComponent.grid).toEqual(expected);
    });

    it('should reset the grid to empty state', () => {
        // Set a value first
        boardComponent.setCell(0, 0, CellValue.X);
        expect(boardComponent.getCell(0, 0)).toBe(CellValue.X);

        // Reset the board
        boardComponent.reset();

        // Check if board is empty
        expect(boardComponent.getCell(0, 0)).toBe(CellValue.Empty);
        expect(boardComponent.grid.every(row =>
            row.every(cell => cell === CellValue.Empty))).toBe(true);
    });

    it('should get cell value correctly', () => {
        // Initially all cells are empty
        expect(boardComponent.getCell(0, 0)).toBe(CellValue.Empty);
        expect(boardComponent.getCell(1, 1)).toBe(CellValue.Empty);
        expect(boardComponent.getCell(2, 2)).toBe(CellValue.Empty);
    });

    it('should set cell value correctly if empty', () => {
        // Set X at 0,0
        const result = boardComponent.setCell(0, 0, CellValue.X);
        expect(result).toBe(true);
        expect(boardComponent.getCell(0, 0)).toBe(CellValue.X);

        // Set O at 1,1
        const result2 = boardComponent.setCell(1, 1, CellValue.O);
        expect(result2).toBe(true);
        expect(boardComponent.getCell(1, 1)).toBe(CellValue.O);
    });

    it('should not set cell value if already occupied', () => {
        // Set X at 0,0
        boardComponent.setCell(0, 0, CellValue.X);

        // Try to set O at the same position
        const result = boardComponent.setCell(0, 0, CellValue.O);
        expect(result).toBe(false);
        expect(boardComponent.getCell(0, 0)).toBe(CellValue.X);
    });

    it('should detect when board is full', () => {
        // Initially board is not full
        expect(boardComponent.isFull()).toBe(false);

        // Fill the board
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                boardComponent.setCell(row, col, CellValue.X);
            }
        }

        // Board should be full now
        expect(boardComponent.isFull()).toBe(true);
    });

    it('should not be full if any cell is empty', () => {
        // Fill all cells except one
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (row !== 2 || col !== 2) {
                    boardComponent.setCell(row, col, CellValue.X);
                }
            }
        }

        // Board should not be full yet
        expect(boardComponent.isFull()).toBe(false);
    });

    it('should create a clone with the same state', () => {
        // Set some values
        boardComponent.setCell(0, 0, CellValue.X);
        boardComponent.setCell(1, 1, CellValue.O);

        // Clone the board
        const clonedBoard = boardComponent.clone();

        // Check if clone has the same values
        expect(clonedBoard.getCell(0, 0)).toBe(CellValue.X);
        expect(clonedBoard.getCell(1, 1)).toBe(CellValue.O);
        expect(clonedBoard.getCell(2, 2)).toBe(CellValue.Empty);

        // Verify that it's a deep copy (modifying one doesn't affect the other)
        boardComponent.setCell(2, 2, CellValue.X);
        expect(boardComponent.getCell(2, 2)).toBe(CellValue.X);
        expect(clonedBoard.getCell(2, 2)).toBe(CellValue.Empty);
    });

    it('should implement the Component interface', () => {
        expect(boardComponent.name).toBe('BoardComponent');
        expect(boardComponent.state).toBeDefined();
        expect(boardComponent.state.grid).toBeDefined();
    });
}); 
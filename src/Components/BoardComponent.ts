import { Component } from 'javascript-entity-component-system';

// Cell values for the board
export enum CellValue {
    Empty = '',
    X = 'X',
    O = 'O'
}

// Type for the board grid
export type BoardGrid = CellValue[][];

/**
 * BoardComponent represents the game board state
 * It is a pure data container following ECS principles
 */
export class BoardComponent implements Component {
    public name: string = 'BoardComponent';
    public state: { [key: string]: any } = {};

    // The 3x3 grid of the board - store in state
    constructor() {
        this.reset();
    }

    /**
     * Resets the board to empty state
     */
    public reset(): void {
        this.state.grid = [
            [CellValue.Empty, CellValue.Empty, CellValue.Empty],
            [CellValue.Empty, CellValue.Empty, CellValue.Empty],
            [CellValue.Empty, CellValue.Empty, CellValue.Empty]
        ];
    }

    /**
     * Gets the value at a specific position
     * @param row The row index (0-2)
     * @param col The column index (0-2)
     * @returns The cell value
     */
    public getCell(row: number, col: number): CellValue {
        return this.state.grid[row][col];
    }

    /**
     * Sets a value at a specific position
     * @param row The row index (0-2)
     * @param col The column index (0-2)
     * @param value The value to set
     * @returns True if the position was set, false if already occupied
     */
    public setCell(row: number, col: number, value: CellValue): boolean {
        // Only allow setting if the cell is empty
        if (this.state.grid[row][col] === CellValue.Empty) {
            this.state.grid[row][col] = value;
            return true;
        }
        return false;
    }

    /**
     * Checks if the board is full
     * @returns True if all cells are filled, false otherwise
     */
    public isFull(): boolean {
        return this.state.grid.every((row: CellValue[]) =>
            row.every((cell: CellValue) => cell !== CellValue.Empty)
        );
    }

    /**
     * Creates a deep copy of the current board state
     * @returns A new BoardComponent with the same state
     */
    public clone(): BoardComponent {
        const clonedComponent = new BoardComponent();
        clonedComponent.state.grid = this.state.grid.map((row: CellValue[]) => [...row]);
        return clonedComponent;
    }

    /**
     * Get the board grid
     * @returns The current grid
     */
    public get grid(): BoardGrid {
        return this.state.grid;
    }
} 
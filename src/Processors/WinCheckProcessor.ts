import { Entity, Processor, Component } from 'javascript-entity-component-system';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent, Position, WinLine } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';

/**
 * Checks if there is a win in any row
 * @param board - The board component
 * @returns Win line positions if found, null otherwise
 */
function checkRows(board: BoardComponent): WinLine | null {
    const grid = board.grid;

    // Check each row
    for (let row = 0; row < 3; row++) {
        const symbol = grid[row][0];

        // Skip empty cells
        if (symbol === CellValue.Empty) {
            continue;
        }

        // Check if all symbols in the row match
        if (symbol === grid[row][1] && symbol === grid[row][2]) {
            // Return win line positions
            return [
                { row, col: 0 },
                { row, col: 1 },
                { row, col: 2 },
            ];
        }
    }

    return null;
}

/**
 * Checks if there is a win in any column
 * @param board - The board component
 * @returns Win line positions if found, null otherwise
 */
function checkColumns(board: BoardComponent): WinLine | null {
    const grid = board.grid;

    // Check each column
    for (let col = 0; col < 3; col++) {
        const symbol = grid[0][col];

        // Skip empty cells
        if (symbol === CellValue.Empty) {
            continue;
        }

        // Check if all symbols in the column match
        if (symbol === grid[1][col] && symbol === grid[2][col]) {
            // Return win line positions
            return [
                { row: 0, col },
                { row: 1, col },
                { row: 2, col },
            ];
        }
    }

    return null;
}

/**
 * Checks if there is a win in any diagonal
 * @param board - The board component
 * @returns Win line positions if found, null otherwise
 */
function checkDiagonals(board: BoardComponent): WinLine | null {
    const grid = board.grid;

    // Check main diagonal (top-left to bottom-right)
    const mainDiagSymbol = grid[0][0];
    if (
        mainDiagSymbol !== CellValue.Empty &&
        mainDiagSymbol === grid[1][1] &&
        mainDiagSymbol === grid[2][2]
    ) {
        return [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 },
        ];
    }

    // Check anti-diagonal (top-right to bottom-left)
    const antiDiagSymbol = grid[0][2];
    if (
        antiDiagSymbol !== CellValue.Empty &&
        antiDiagSymbol === grid[1][1] &&
        antiDiagSymbol === grid[2][0]
    ) {
        return [
            { row: 0, col: 2 },
            { row: 1, col: 1 },
            { row: 2, col: 0 },
        ];
    }

    return null;
}

/**
 * Gets the winning symbol at the specified position
 * @param board - The board component
 * @param position - The position to check
 * @returns The winning symbol (X or O)
 */
function getWinningSymbol(board: BoardComponent, position: Position): CellValue {
    return board.getCell(position.row, position.col);
}

/**
 * Checks if there is a win on the board
 * @param board - The board component
 * @returns Object with winning symbol and win line if win found, null otherwise
 */
function checkWin(board: BoardComponent): { symbol: CellValue, winLine: WinLine } | null {
    // Check rows, columns, and diagonals
    const rowWin = checkRows(board);
    if (rowWin) {
        return {
            symbol: getWinningSymbol(board, rowWin[0]),
            winLine: rowWin
        };
    }

    const colWin = checkColumns(board);
    if (colWin) {
        return {
            symbol: getWinningSymbol(board, colWin[0]),
            winLine: colWin
        };
    }

    const diagWin = checkDiagonals(board);
    if (diagWin) {
        return {
            symbol: getWinningSymbol(board, diagWin[0]),
            winLine: diagWin
        };
    }

    return null;
}

/**
 * Checks if the game is a draw (board full with no winner)
 * @param board - The board component
 * @returns True if the game is a draw, false otherwise
 */
function checkDraw(board: BoardComponent): boolean {
    return board.isFull();
}

/**
 * WinCheckProcessor checks for win conditions after each move
 * and detects draw situations.
 */
export const WinCheckProcessor: Processor = {
    name: 'win_check_processor',
    required: ['BoardComponent', 'GameStateComponent', 'TurnComponent'],

    /**
     * Checks for win conditions or draw after each move
     * @param entity - The game entity
     * @param components - Array of components [BoardComponent, GameStateComponent, TurnComponent]
     */
    update(_entity: Entity, components: Component[]) {
        // Extract components from array - order matches the 'required' array
        const [board, gameState, _turn] = components as [
            BoardComponent,
            GameStateComponent,
            TurnComponent
        ];

        // Only check win conditions if the game is in progress
        if (!gameState.isInProgress()) {
            return;
        }

        // Check for a win
        const win = checkWin(board);
        if (win) {
            gameState.setWin(win.symbol, win.winLine);
            return;
        }

        // Check for a draw
        if (checkDraw(board)) {
            gameState.setDraw();
            return;
        }

        // Game continues
    }
};

// Export helper functions for testing
export {
    checkRows,
    checkColumns,
    checkDiagonals,
    getWinningSymbol,
    checkWin,
    checkDraw
}; 
import { Entity, Processor, Component } from 'javascript-entity-component-system';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';

/**
 * BoardPosition represents a position on the board
 */
export interface BoardPosition {
    row: number;
    col: number;
}

/**
 * Gets all empty cells on the board
 * @param board - The board component
 * @returns Array of empty positions
 */
function getEmptyCells(board: BoardComponent): BoardPosition[] {
    const emptyCells: BoardPosition[] = [];
    const grid = board.grid;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (grid[row][col] === CellValue.Empty) {
                emptyCells.push({ row, col });
            }
        }
    }

    return emptyCells;
}

/**
 * Finds winning moves for a specific symbol
 * @param board - The board component
 * @param symbol - The symbol to check for wins (X or O)
 * @returns Position that would create a win, or null if none exists
 */
function findWinningMove(board: BoardComponent, symbol: CellValue): BoardPosition | null {
    const emptyCells = getEmptyCells(board);

    // Try each empty cell to see if it would create a win
    for (const cell of emptyCells) {
        // Create a hypothetical board with the move
        const testBoard = board.clone();
        testBoard.setCell(cell.row, cell.col, symbol);

        // Check rows
        for (let row = 0; row < 3; row++) {
            if (
                testBoard.getCell(row, 0) === symbol &&
                testBoard.getCell(row, 1) === symbol &&
                testBoard.getCell(row, 2) === symbol &&
                // Make sure at least one of these cells is our hypothetical move
                (row === cell.row)
            ) {
                return cell;
            }
        }

        // Check columns
        for (let col = 0; col < 3; col++) {
            if (
                testBoard.getCell(0, col) === symbol &&
                testBoard.getCell(1, col) === symbol &&
                testBoard.getCell(2, col) === symbol &&
                // Make sure at least one of these cells is our hypothetical move
                (col === cell.col)
            ) {
                return cell;
            }
        }

        // Check main diagonal
        if (
            testBoard.getCell(0, 0) === symbol &&
            testBoard.getCell(1, 1) === symbol &&
            testBoard.getCell(2, 2) === symbol &&
            // Make sure at least one of these cells is our hypothetical move
            (cell.row === cell.col)
        ) {
            return cell;
        }

        // Check anti-diagonal
        if (
            testBoard.getCell(0, 2) === symbol &&
            testBoard.getCell(1, 1) === symbol &&
            testBoard.getCell(2, 0) === symbol &&
            // Make sure at least one of these cells is our hypothetical move
            (cell.row + cell.col === 2)
        ) {
            return cell;
        }
    }

    return null;
}

/**
 * Counts potential winning lines through a specific cell for a symbol
 * @param board - The board component
 * @param position - The position to check
 * @param symbol - The symbol to check (X or O)
 * @returns Number of potential winning lines
 */
function countWinningLines(
    board: BoardComponent,
    position: BoardPosition,
    symbol: CellValue
): number {
    // Clone the board and make the hypothetical move
    const testBoard = board.clone();

    // Skip if the cell is already occupied
    if (testBoard.getCell(position.row, position.col) !== CellValue.Empty) {
        return 0;
    }

    testBoard.setCell(position.row, position.col, symbol);

    let winningLines = 0;
    const oppositeSymbol = getOppositeSymbol(symbol);

    // Check row - consider it a potential winning line if no opponent symbols are in it
    const row = position.row;
    if (
        testBoard.getCell(row, 0) !== oppositeSymbol &&
        testBoard.getCell(row, 1) !== oppositeSymbol &&
        testBoard.getCell(row, 2) !== oppositeSymbol
    ) {
        winningLines++;
    }

    // Check column - consider it a potential winning line if no opponent symbols are in it
    const col = position.col;
    if (
        testBoard.getCell(0, col) !== oppositeSymbol &&
        testBoard.getCell(1, col) !== oppositeSymbol &&
        testBoard.getCell(2, col) !== oppositeSymbol
    ) {
        winningLines++;
    }

    // Check main diagonal if on it
    if (row === col) {
        if (
            testBoard.getCell(0, 0) !== oppositeSymbol &&
            testBoard.getCell(1, 1) !== oppositeSymbol &&
            testBoard.getCell(2, 2) !== oppositeSymbol
        ) {
            winningLines++;
        }
    }

    // Check anti-diagonal if on it
    if (row + col === 2) {
        if (
            testBoard.getCell(0, 2) !== oppositeSymbol &&
            testBoard.getCell(1, 1) !== oppositeSymbol &&
            testBoard.getCell(2, 0) !== oppositeSymbol
        ) {
            winningLines++;
        }
    }

    return winningLines;
}

/**
 * Gets the opposite symbol (X -> O, O -> X)
 * @param symbol - The symbol to get the opposite of
 * @returns The opposite symbol
 */
function getOppositeSymbol(symbol: CellValue): CellValue {
    return symbol === CellValue.X ? CellValue.O : CellValue.X;
}

/**
 * Finds potential fork positions for a specific symbol
 * @param board - The board component
 * @param symbol - The symbol to check for forks (X or O)
 * @returns Position that would create a fork, or null if none exists
 */
function findForkMove(board: BoardComponent, symbol: CellValue): BoardPosition | null {
    const emptyCells = getEmptyCells(board);

    // We need to check if we have at least one of our symbol on the board already
    let hasSymbolOnBoard = false;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board.getCell(row, col) === symbol) {
                hasSymbolOnBoard = true;
                break;
            }
        }
        if (hasSymbolOnBoard) break;
    }

    // If we don't have any of our symbols on the board, we can't create a fork yet
    if (!hasSymbolOnBoard) {
        return null;
    }

    // For a genuine fork, we need at least two of our symbols on the board already
    let symbolCount = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board.getCell(row, col) === symbol) {
                symbolCount++;
            }
        }
    }
    
    // A real fork typically requires at least two of our symbols on the board
    if (symbolCount < 2) {
        return null;
    }

    // Look for positions with multiple potential winning lines (fork)
    for (const cell of emptyCells) {
        if (countWinningLines(board, cell, symbol) >= 2) {
            return cell;
        }
    }

    return null;
}

/**
 * Finds the center position if it's empty
 * @param board - The board component
 * @returns Center position if empty, null otherwise
 */
function findCenterMove(board: BoardComponent): BoardPosition | null {
    if (board.getCell(1, 1) === CellValue.Empty) {
        return { row: 1, col: 1 };
    }
    return null;
}

/**
 * Finds the opposite corner of an opponent's mark
 * @param board - The board component
 * @param opponentSymbol - The opponent's symbol (X or O)
 * @returns Opposite corner position if available, null otherwise
 */
function findOppositeCornerMove(board: BoardComponent, opponentSymbol: CellValue): BoardPosition | null {
    // Check all corners for opponent's marks
    if (board.getCell(0, 0) === opponentSymbol && board.getCell(2, 2) === CellValue.Empty) {
        return { row: 2, col: 2 };
    }
    if (board.getCell(0, 2) === opponentSymbol && board.getCell(2, 0) === CellValue.Empty) {
        return { row: 2, col: 0 };
    }
    if (board.getCell(2, 0) === opponentSymbol && board.getCell(0, 2) === CellValue.Empty) {
        return { row: 0, col: 2 };
    }
    if (board.getCell(2, 2) === opponentSymbol && board.getCell(0, 0) === CellValue.Empty) {
        return { row: 0, col: 0 };
    }

    return null;
}

/**
 * Finds an empty corner
 * @param board - The board component
 * @returns Empty corner position, or null if none exists
 */
function findEmptyCornerMove(board: BoardComponent): BoardPosition | null {
    const corners = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 2 }
    ];

    for (const corner of corners) {
        if (board.getCell(corner.row, corner.col) === CellValue.Empty) {
            return corner;
        }
    }

    return null;
}

/**
 * Finds an empty side (non-corner, non-center) position
 * @param board - The board component
 * @returns Empty side position, or null if none exists
 */
function findEmptySideMove(board: BoardComponent): BoardPosition | null {
    const sides = [
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 2 },
        { row: 2, col: 1 }
    ];

    for (const side of sides) {
        if (board.getCell(side.row, side.col) === CellValue.Empty) {
            return side;
        }
    }

    return null;
}

/**
 * Determines the best move for the AI by applying rules in priority order
 * @param board - The board component
 * @param aiSymbol - The AI's symbol (X or O)
 * @param playerSymbol - The player's symbol (X or O)
 * @returns The best move position, or null if no move is possible
 */
function findBestMove(
    board: BoardComponent,
    aiSymbol: CellValue,
    playerSymbol: CellValue
): BoardPosition | null {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) {
        return null;
    }

    let move: BoardPosition | null = null;

    // Rule 1: Win if possible
    move = findWinningMove(board, aiSymbol);
    if (move) {
        return move;
    }

    // Rule 2: Block opponent's win
    move = findWinningMove(board, playerSymbol);
    if (move) {
        return move;
    }

    // Rule 3: Create a fork
    move = findForkMove(board, aiSymbol);
    if (move) {
        return move;
    }

    // Rule 4: Block opponent's fork
    move = findForkMove(board, playerSymbol);
    if (move) {
        return move;
    }

    // Rule 5: Take the center
    move = findCenterMove(board);
    if (move) {
        return move;
    }

    // Rule 6: Play opposite corner
    move = findOppositeCornerMove(board, playerSymbol);
    if (move) {
        return move;
    }

    // Rule 7: Take an empty corner
    move = findEmptyCornerMove(board);
    if (move) {
        return move;
    }

    // Rule 8: Take an empty side
    move = findEmptySideMove(board);
    if (move) {
        return move;
    }

    // This should never happen if there are empty cells
    return emptyCells[0];
}

/**
 * Makes a move on the board for the AI
 * @param board - The board component
 * @param turn - The turn component
 * @param aiSymbol - The AI's symbol (X or O)
 * @param playerSymbol - The player's symbol (X or O)
 * @returns True if a move was made, false otherwise
 */
function makeAIMove(
    board: BoardComponent,
    turn: TurnComponent,
    aiSymbol: CellValue,
    playerSymbol: CellValue
): boolean {
    const bestMove = findBestMove(board, aiSymbol, playerSymbol);

    if (bestMove) {
        // Always make the move if we found a valid one
        board.setCell(bestMove.row, bestMove.col, aiSymbol);
        turn.nextTurn();
        return true;
    }

    return false;
}

/**
 * Checks if it's the computer's turn to move
 * @param turn - The turn component
 * @param computer - The computer component
 * @returns True if it's the computer's turn, false otherwise
 */
function isComputerTurn(turn: TurnComponent, computer: PlayerComponent): boolean {
    return (
        computer.playerType === PlayerType.Computer &&
        computer.symbol === turn.currentTurn
    );
}

/**
 * AIProcessor determines computer moves using the rule-based strategy
 */
export const AIProcessor: Processor = {
    name: 'ai_processor',
    required: ['BoardComponent', 'GameStateComponent', 'TurnComponent', 'PlayerComponent'],

    /**
     * Makes a move for the computer if it's the computer's turn
     * @param entity - The entity (unused)
     * @param components - Array of components [BoardComponent, GameStateComponent, TurnComponent, PlayerComponent]
     */
    update(_entity: Entity, components: Component[]) {
        // Extract components
        const [board, gameState, turn, computer] = components as [
            BoardComponent,
            GameStateComponent,
            TurnComponent,
            PlayerComponent
        ];

        // Only make a move if the game is in progress and it's the computer's turn
        if (
            gameState.isInProgress() &&
            isComputerTurn(turn, computer)
        ) {
            // Determine the player's symbol (opposite of computer's)
            const playerSymbol = computer.symbol === CellValue.X ? CellValue.O : CellValue.X;

            // Make the AI move
            makeAIMove(board, turn, computer.symbol, playerSymbol);
        }
    }
};

// Export helper functions for testing
export {
    getEmptyCells,
    findWinningMove,
    countWinningLines,
    findForkMove,
    findCenterMove,
    findOppositeCornerMove,
    findEmptyCornerMove,
    findEmptySideMove,
    findBestMove,
    makeAIMove,
    isComputerTurn
}; 
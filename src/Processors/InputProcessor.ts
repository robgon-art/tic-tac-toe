import { Entity, Processor, Component } from 'javascript-entity-component-system';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';

/**
 * Represents a board position clicked by the user
 */
export interface BoardPosition {
    row: number;
    col: number;
}

// Store for clicks that need to be processed
// This is kept outside the processor to avoid extending the Processor interface
export const InputStore = {
    // Queue of clicked positions to process
    clickQueue: [] as BoardPosition[],

    /**
     * Adds a click to the queue to be processed on the next update
     * @param position - The board position that was clicked
     */
    addClick(position: BoardPosition): void {
        this.clickQueue.push(position);
    },

    /**
     * Gets the next click from the queue and removes it
     * @returns The next click position or undefined if queue is empty
     */
    getNextClick(): BoardPosition | undefined {
        return this.clickQueue.shift();
    },

    /**
     * Checks if there are pending clicks
     * @returns True if there are pending clicks, false otherwise
     */
    hasPendingClicks(): boolean {
        return this.clickQueue.length > 0;
    },

    /**
     * Clears all pending clicks
     */
    clearClicks(): void {
        this.clickQueue = [];
    }
};

/**
 * Validates if a position is within the board boundaries
 * @param position - The position to validate
 * @returns True if the position is valid, false otherwise
 */
function isValidPosition(position: BoardPosition): boolean {
    return (
        position.row >= 0 &&
        position.row < 3 &&
        position.col >= 0 &&
        position.col < 3
    );
}

/**
 * Checks if a move is valid (cell is empty and within bounds)
 * @param board - The board component
 * @param position - The position to check
 * @returns True if the move is valid, false otherwise
 */
function isValidMove(board: BoardComponent, position: BoardPosition): boolean {
    if (!isValidPosition(position)) {
        return false;
    }

    // Check if the cell is empty
    return board.getCell(position.row, position.col) === CellValue.Empty;
}

/**
 * Checks if it's the human player's turn to move
 * @param turn - The turn component
 * @param player - The player component
 * @returns True if it's the human player's turn, false otherwise
 */
function isHumanTurn(turn: TurnComponent, player: PlayerComponent): boolean {
    return (
        player.playerType === PlayerType.Human &&
        player.symbol === turn.currentTurn
    );
}

/**
 * Processes a human player's move
 * @param board - The board component
 * @param turn - The turn component
 * @param position - The position where the player wants to move
 * @param playerSymbol - The player's symbol (X or O)
 * @returns True if the move was made successfully, false otherwise
 */
function processMove(
    board: BoardComponent,
    turn: TurnComponent,
    position: BoardPosition,
    playerSymbol: CellValue
): boolean {
    if (!isValidMove(board, position)) {
        return false;
    }

    // Make the move
    const success = board.setCell(position.row, position.col, playerSymbol);

    if (success) {
        // Advance to the next player's turn
        turn.nextTurn();
    }

    return success;
}

/**
 * Processes a pending click
 * @param board - The board component
 * @param gameState - The game state component
 * @param turn - The turn component
 * @param player - The player component
 * @param position - The position that was clicked
 * @returns True if the move was made successfully, false otherwise
 */
function processPendingClick(
    board: BoardComponent,
    gameState: GameStateComponent,
    turn: TurnComponent,
    player: PlayerComponent,
    position: BoardPosition
): boolean {
    // Only process click if the game is in progress
    if (!gameState.isInProgress()) {
        return false;
    }

    // Only process click if it's the human player's turn
    if (!isHumanTurn(turn, player)) {
        return false;
    }

    // Process the move
    return processMove(board, turn, position, player.symbol);
}

/**
 * InputProcessor handles user clicks on the board, validates input, and updates board state
 */
export const InputProcessor: Processor = {
    name: 'input_processor',
    required: ['BoardComponent', 'GameStateComponent', 'TurnComponent', 'PlayerComponent'],

    /**
     * Processes user input to update the game state
     * @param entity - The game entity
     * @param components - Array of components [BoardComponent, GameStateComponent, TurnComponent, PlayerComponent]
     */
    update(_entity: Entity, components: Component[]) {
        // Extract components from array - order matches the 'required' array
        const [board, gameState, turn, player] = components as [
            BoardComponent,
            GameStateComponent,
            TurnComponent,
            PlayerComponent
        ];

        // Process pending input from the click queue
        if (InputStore.hasPendingClicks()) {
            const position = InputStore.getNextClick();
            if (position) {
                processPendingClick(board, gameState, turn, player, position);
            }
        }
    }
};

// Export helper functions for testing
export {
    isValidPosition,
    isValidMove,
    isHumanTurn,
    processMove,
    processPendingClick
}; 
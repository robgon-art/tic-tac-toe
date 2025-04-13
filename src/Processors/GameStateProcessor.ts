import { Entity, Processor, Component } from 'javascript-entity-component-system';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { ScoreComponent } from '../Components/ScoreComponent';

/**
 * Starts a new game
 * @param gameState - The game state component
 */
function startGame(gameState: GameStateComponent): void {
    gameState.startGame();
}

/**
 * Handles updating scores when game is won
 * @param gameState - The game state component
 * @param score - The score component
 */
function handleWin(gameState: GameStateComponent, score: ScoreComponent): void {
    // Skip if already processed (avoid duplicate score increments)
    if (gameState.winner === CellValue.Empty) {
        return;
    }

    // Check if X or O won and update the appropriate score
    if (gameState.winner === CellValue.X) {
        // X is always the player in this implementation
        score.incrementPlayerScore();
    } else if (gameState.winner === CellValue.O) {
        // O is always the computer in this implementation
        score.incrementComputerScore();
    }
}

/**
 * Handles updating scores when game is a draw
 * @param score - The score component
 */
function handleDraw(score: ScoreComponent): void {
    score.incrementTies();
}

/**
 * Resets the game for a new round, preserving scores but alternating first player
 * @param gameState - The game state component
 * @param board - The board component
 * @param turn - The turn component
 */
function resetGame(gameState: GameStateComponent, board: BoardComponent, turn: TurnComponent): void {
    // Reset the game state
    gameState.reset();

    // Reset the board
    board.reset();

    // Prepare for next game by alternating who goes first
    turn.prepareNextGame();

    // Start the game
    gameState.startGame();
}

/**
 * Starts a completely new game, resetting all scores and state
 * @param gameState - The game state component
 * @param board - The board component
 * @param turn - The turn component
 * @param score - The score component
 */
function startNewGame(
    gameState: GameStateComponent,
    board: BoardComponent,
    turn: TurnComponent,
    score: ScoreComponent
): void {
    // Reset game state
    gameState.reset();

    // Reset the board
    board.reset();

    // Reset the turn (X always goes first in a brand new game)
    turn.reset(CellValue.X);

    // Reset scores
    score.reset();

    // Start the game
    gameState.startGame();
}

/**
 * GameStateProcessor manages the game state transitions and game lifecycle.
 * It handles:
 * - Starting new games
 * - Resetting the game state
 * - Handling game over conditions (win/draw)
 * - Updating scores when games end
 * - Alternating first player for new games
 */
export const GameStateProcessor: Processor = {
    name: 'game_state_processor',
    required: ['GameStateComponent', 'BoardComponent', 'TurnComponent', 'ScoreComponent'],

    /**
     * Processes game state transitions based on the current state
     * @param entity - The game entity
     * @param components - Array of components [GameStateComponent, BoardComponent, TurnComponent, ScoreComponent]
     */
    update(_entity: Entity, components: Component[]) {
        // Extract components from array - order matches the 'required' array
        const [gameState, _board, _turn, score] = components as [
            GameStateComponent,
            BoardComponent,
            TurnComponent,
            ScoreComponent
        ];

        // Main state machine for game state transitions
        switch (gameState.status) {
            case GameStatus.NotStarted:
                // When game is not started, start it
                startGame(gameState);
                break;

            case GameStatus.Win:
                // When game is won, update scores
                handleWin(gameState, score);
                break;

            case GameStatus.Draw:
                // When game is a draw, update scores
                handleDraw(score);
                break;

            case GameStatus.InProgress:
                // Game is in progress, nothing to do here
                // Win/draw detection is handled by WinCheckProcessor
                break;

            default:
                // Unrecognized state, reset to not started
                gameState.reset();
                break;
        }
    }
};

// Export helper functions for testing
export { startGame, handleWin, handleDraw, resetGame, startNewGame }; 
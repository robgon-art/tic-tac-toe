import { Entity, Processor, Component } from 'javascript-entity-component-system';
import { TurnComponent } from '../Components/TurnComponent';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';

/**
 * Advances to the next player's turn if the game is in progress
 * @param turn - The turn component
 * @param gameState - The game state component
 * @returns Whether the turn was advanced
 */
function advanceTurn(turn: TurnComponent, gameState: GameStateComponent): boolean {
    // Only advance turn if the game is in progress
    if (!gameState.isInProgress()) {
        return false;
    }

    // Move to next player
    turn.nextTurn();
    return true;
}

/**
 * Checks if it's the human player's turn
 * @param turn - The turn component
 * @param player - The player component
 * @returns True if it's the human player's turn
 */
function isHumanTurn(turn: TurnComponent, player: PlayerComponent): boolean {
    return player.symbol === turn.currentTurn && player.playerType === PlayerType.Human;
}

/**
 * Checks if it's the computer player's turn
 * @param turn - The turn component
 * @param computer - The computer component
 * @returns True if it's the computer player's turn
 */
function isComputerTurn(turn: TurnComponent, computer: PlayerComponent): boolean {
    return computer.symbol === turn.currentTurn && computer.playerType === PlayerType.Computer;
}

/**
 * Determines whose turn it is based on the game state
 * @param turn - The turn component
 * @param gameState - The game state component
 * @param player - The player component
 * @param computer - The computer component
 * @returns "human", "computer", or "none" if game is over
 */
function getCurrentPlayer(
    turn: TurnComponent,
    gameState: GameStateComponent,
    player: PlayerComponent,
    computer: PlayerComponent
): "human" | "computer" | "none" {
    if (!gameState.isInProgress()) {
        return "none";
    }

    if (isHumanTurn(turn, player)) {
        return "human";
    }

    if (isComputerTurn(turn, computer)) {
        return "computer";
    }

    // This should never happen if the game is set up correctly
    return "none";
}

/**
 * TurnProcessor manages turn switching between players
 * and tracks whose turn it is to go first in new games.
 */
export const TurnProcessor: Processor = {
    name: 'turn_processor',
    required: ['TurnComponent', 'GameStateComponent', 'PlayerComponent'],

    /**
     * Updates the turn state based on the game state
     * @param entity - The game entity
     * @param components - Array of components [TurnComponent, GameStateComponent, PlayerComponent]
     */
    update(_entity: Entity, components: Component[]) {
        // Extract components from array - order matches the 'required' array
        const [turn, gameState, _player] = components as [
            TurnComponent,
            GameStateComponent,
            PlayerComponent
        ];

        // Handle the current turn based on game state
        if (gameState.isInProgress()) {
            // Game in progress - turns handled by other processors
            // (InputProcessor for player moves, AIProcessor for computer moves)
            return;
        } else if (gameState.isGameOver()) {
            // Game is over - nothing to do with turns
            return;
        } else if (gameState.status === GameStatus.NotStarted) {
            // Game not started yet - turns handled by GameStateProcessor
            return;
        }

        // For any other state, reset turns to default
        turn.reset();
    }
};

// Export helper functions for testing
export { advanceTurn, isHumanTurn, isComputerTurn, getCurrentPlayer }; 
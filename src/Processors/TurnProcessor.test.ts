import { describe, it, expect, beforeEach } from 'vitest';
import { TurnProcessor, advanceTurn, isHumanTurn, isComputerTurn, getCurrentPlayer } from './TurnProcessor';
import { TurnComponent } from '../Components/TurnComponent';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

describe('TurnProcessor', () => {
    // Test components that we'll use in various tests
    let turn: TurnComponent;
    let gameState: GameStateComponent;
    let player: PlayerComponent;
    let computer: PlayerComponent;

    // Set up fresh components before each test
    beforeEach(() => {
        turn = new TurnComponent(CellValue.X); // X starts
        gameState = new GameStateComponent(GameStatus.NotStarted);
        player = new PlayerComponent(PlayerType.Human, CellValue.X); // Human plays as X
        computer = new PlayerComponent(PlayerType.Computer, CellValue.O); // Computer plays as O
    });

    describe('Structure', () => {
        it('should have the correct processor name', () => {
            expect(TurnProcessor.name).toBe('turn_processor');
        });

        it('should require the correct components', () => {
            expect(TurnProcessor.required).toEqual([
                'TurnComponent',
                'GameStateComponent',
                'PlayerComponent'
            ]);
        });

        it('should have an update method', () => {
            expect(typeof TurnProcessor.update).toBe('function');
        });
    });

    describe('advanceTurn function', () => {
        it('should advance turn if game is in progress', () => {
            // Arrange
            gameState.startGame();
            const initialTurn = turn.currentTurn;
            const initialTurnNumber = turn.turnNumber;

            // Act
            const result = advanceTurn(turn, gameState);

            // Assert
            expect(result).toBe(true);
            expect(turn.currentTurn).not.toBe(initialTurn);
            expect(turn.turnNumber).toBe(initialTurnNumber + 1);
        });

        it('should not advance turn if game is not in progress', () => {
            // Arrange - game not started
            const initialTurn = turn.currentTurn;
            const initialTurnNumber = turn.turnNumber;

            // Act
            const result = advanceTurn(turn, gameState);

            // Assert
            expect(result).toBe(false);
            expect(turn.currentTurn).toBe(initialTurn);
            expect(turn.turnNumber).toBe(initialTurnNumber);
        });

        it('should not advance turn if game is over', () => {
            // Arrange - game has ended
            gameState.setWin(CellValue.X, []);
            const initialTurn = turn.currentTurn;
            const initialTurnNumber = turn.turnNumber;

            // Act
            const result = advanceTurn(turn, gameState);

            // Assert
            expect(result).toBe(false);
            expect(turn.currentTurn).toBe(initialTurn);
            expect(turn.turnNumber).toBe(initialTurnNumber);
        });
    });

    describe('isHumanTurn function', () => {
        it('should return true when it is human player\'s turn', () => {
            // Arrange - X (human) goes first
            turn.reset(CellValue.X);
            player.symbol = CellValue.X;

            // Act & Assert
            expect(isHumanTurn(turn, player)).toBe(true);
        });

        it('should return false when it is not human player\'s turn', () => {
            // Arrange - O (computer) goes first
            turn.reset(CellValue.O);
            player.symbol = CellValue.X;

            // Act & Assert
            expect(isHumanTurn(turn, player)).toBe(false);
        });
    });

    describe('isComputerTurn function', () => {
        it('should return true when it is computer player\'s turn', () => {
            // Arrange - O (computer) goes first
            turn.reset(CellValue.O);
            computer.symbol = CellValue.O;

            // Act & Assert
            expect(isComputerTurn(turn, computer)).toBe(true);
        });

        it('should return false when it is not computer player\'s turn', () => {
            // Arrange - X (human) goes first
            turn.reset(CellValue.X);
            computer.symbol = CellValue.O;

            // Act & Assert
            expect(isComputerTurn(turn, computer)).toBe(false);
        });
    });

    describe('getCurrentPlayer function', () => {
        beforeEach(() => {
            // Standard setup: X is human, O is computer
            player.symbol = CellValue.X;
            player.playerType = PlayerType.Human;
            computer.symbol = CellValue.O;
            computer.playerType = PlayerType.Computer;
            gameState.startGame(); // Set game to in progress
        });

        it('should return "human" when it is human player\'s turn', () => {
            // Arrange - X (human) to move
            turn.reset(CellValue.X);

            // Act & Assert
            expect(getCurrentPlayer(turn, gameState, player, computer)).toBe("human");
        });

        it('should return "computer" when it is computer player\'s turn', () => {
            // Arrange - O (computer) to move
            turn.reset(CellValue.O);

            // Act & Assert
            expect(getCurrentPlayer(turn, gameState, player, computer)).toBe("computer");
        });

        it('should return "none" when game is not in progress', () => {
            // Arrange - game is over
            gameState.setWin(CellValue.X, []);

            // Act & Assert
            expect(getCurrentPlayer(turn, gameState, player, computer)).toBe("none");
        });
    });

    describe('update method', () => {
        it('should not modify turn when game is in progress', () => {
            // Arrange
            gameState.startGame();
            const initialTurn = turn.clone();
            const components = [turn, gameState, player];

            // Act
            TurnProcessor.update({} as any, components, TurnProcessor);

            // Assert - turn state should remain unchanged
            expect(turn.currentTurn).toBe(initialTurn.currentTurn);
            expect(turn.turnNumber).toBe(initialTurn.turnNumber);
        });

        it('should not modify turn when game is over', () => {
            // Arrange
            gameState.setWin(CellValue.X, []);
            const initialTurn = turn.clone();
            const components = [turn, gameState, player];

            // Act
            TurnProcessor.update({} as any, components, TurnProcessor);

            // Assert - turn state should remain unchanged
            expect(turn.currentTurn).toBe(initialTurn.currentTurn);
            expect(turn.turnNumber).toBe(initialTurn.turnNumber);
        });

        it('should not modify turn when game is not started', () => {
            // Arrange
            gameState.status = GameStatus.NotStarted;
            const initialTurn = turn.clone();
            const components = [turn, gameState, player];

            // Act
            TurnProcessor.update({} as any, components, TurnProcessor);

            // Assert - turn state should remain unchanged
            expect(turn.currentTurn).toBe(initialTurn.currentTurn);
            expect(turn.turnNumber).toBe(initialTurn.turnNumber);
        });

        it('should reset turn for invalid game states', () => {
            // Arrange - create an invalid state
            (gameState as any).state.status = 'invalid_state';
            turn.nextTurn(); // Set to something other than default
            const components = [turn, gameState, player];

            // Act
            TurnProcessor.update({} as any, components, TurnProcessor);

            // Assert - turn should be reset
            expect(turn.currentTurn).toBe(CellValue.X); // Default starting player
            expect(turn.turnNumber).toBe(1);
        });
    });
}); 
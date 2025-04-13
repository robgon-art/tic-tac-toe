import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    InputProcessor,
    InputStore,
    isValidPosition,
    isValidMove,
    isHumanTurn,
    processMove,
    processPendingClick
} from './InputProcessor';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';

describe('InputProcessor', () => {
    // Test components
    let board: BoardComponent;
    let gameState: GameStateComponent;
    let turn: TurnComponent;
    let player: PlayerComponent;

    // Set up fresh components before each test
    beforeEach(() => {
        board = new BoardComponent();
        gameState = new GameStateComponent(GameStatus.InProgress);
        turn = new TurnComponent(CellValue.X);
        player = new PlayerComponent(PlayerType.Human, CellValue.X);

        // Clear any clicks from previous tests
        InputStore.clearClicks();
    });

    // Clean up after each test
    afterEach(() => {
        InputStore.clearClicks();
    });

    describe('Structure', () => {
        it('should have the correct processor name', () => {
            expect(InputProcessor.name).toBe('input_processor');
        });

        it('should require the correct components', () => {
            expect(InputProcessor.required).toEqual([
                'BoardComponent',
                'GameStateComponent',
                'TurnComponent',
                'PlayerComponent'
            ]);
        });

        it('should have an update method', () => {
            expect(typeof InputProcessor.update).toBe('function');
        });
    });

    describe('isValidPosition function', () => {
        it('should return true for valid positions', () => {
            // Test all valid positions
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    expect(isValidPosition({ row, col })).toBe(true);
                }
            }
        });

        it('should return false for positions outside the board', () => {
            // Test positions outside the boundaries
            expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
            expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
            expect(isValidPosition({ row: 3, col: 0 })).toBe(false);
            expect(isValidPosition({ row: 0, col: 3 })).toBe(false);
        });
    });

    describe('isValidMove function', () => {
        it('should return true for valid moves to empty cells', () => {
            // Empty board, all positions are valid
            expect(isValidMove(board, { row: 0, col: 0 })).toBe(true);
            expect(isValidMove(board, { row: 1, col: 1 })).toBe(true);
            expect(isValidMove(board, { row: 2, col: 2 })).toBe(true);
        });

        it('should return false for moves to occupied cells', () => {
            // Arrange - Occupy a cell
            board.setCell(1, 1, CellValue.X);

            // Act & Assert
            expect(isValidMove(board, { row: 1, col: 1 })).toBe(false);
        });

        it('should return false for positions outside the board', () => {
            expect(isValidMove(board, { row: -1, col: 0 })).toBe(false);
            expect(isValidMove(board, { row: 3, col: 3 })).toBe(false);
        });
    });

    describe('isHumanTurn function', () => {
        it('should return true when it is the human player\'s turn', () => {
            // Arrange - Human player with symbol X, and it's X's turn
            player.playerType = PlayerType.Human;
            player.symbol = CellValue.X;
            turn.reset(CellValue.X);

            // Act & Assert
            expect(isHumanTurn(turn, player)).toBe(true);
        });

        it('should return false when it is not the human player\'s turn', () => {
            // Arrange - Human player with symbol X, but it's O's turn
            player.playerType = PlayerType.Human;
            player.symbol = CellValue.X;
            turn.reset(CellValue.O);

            // Act & Assert
            expect(isHumanTurn(turn, player)).toBe(false);
        });

        it('should return false for computer player even if symbol matches turn', () => {
            // Arrange - Computer player with symbol X, and it's X's turn
            player.playerType = PlayerType.Computer;
            player.symbol = CellValue.X;
            turn.reset(CellValue.X);

            // Act & Assert
            expect(isHumanTurn(turn, player)).toBe(false);
        });
    });

    describe('processMove function', () => {
        it('should make a valid move and advance turn', () => {
            // Arrange
            const position = { row: 0, col: 0 };
            const initialTurn = turn.currentTurn;
            const initialTurnNumber = turn.turnNumber;

            // Act
            const result = processMove(board, turn, position, CellValue.X);

            // Assert
            expect(result).toBe(true);
            expect(board.getCell(0, 0)).toBe(CellValue.X);
            expect(turn.currentTurn).not.toBe(initialTurn);
            expect(turn.turnNumber).toBe(initialTurnNumber + 1);
        });

        it('should return false for invalid moves', () => {
            // Arrange - Occupy a cell
            board.setCell(1, 1, CellValue.X);
            const initialTurn = turn.currentTurn;
            const initialTurnNumber = turn.turnNumber;

            // Act
            const result = processMove(board, turn, { row: 1, col: 1 }, CellValue.O);

            // Assert
            expect(result).toBe(false);
            expect(board.getCell(1, 1)).toBe(CellValue.X); // Should not change
            expect(turn.currentTurn).toBe(initialTurn); // Turn should not advance
            expect(turn.turnNumber).toBe(initialTurnNumber);
        });

        it('should return false for positions outside the board', () => {
            // Arrange
            const initialTurn = turn.currentTurn;

            // Act
            const result = processMove(board, turn, { row: 3, col: 3 }, CellValue.X);

            // Assert
            expect(result).toBe(false);
            expect(turn.currentTurn).toBe(initialTurn); // Turn should not advance
        });
    });

    describe('processPendingClick function', () => {
        it('should process valid moves when game is in progress and it\'s human turn', () => {
            // Arrange
            gameState.startGame();
            turn.reset(CellValue.X);
            player.symbol = CellValue.X;
            player.playerType = PlayerType.Human;

            // Act
            const result = processPendingClick(board, gameState, turn, player, { row: 0, col: 0 });

            // Assert
            expect(result).toBe(true);
            expect(board.getCell(0, 0)).toBe(CellValue.X);
        });

        it('should not process moves when game is not in progress', () => {
            // Arrange
            gameState.status = GameStatus.NotStarted;

            // Act
            const result = processPendingClick(board, gameState, turn, player, { row: 0, col: 0 });

            // Assert
            expect(result).toBe(false);
            expect(board.getCell(0, 0)).toBe(CellValue.Empty);
        });

        it('should not process moves when it\'s not human turn', () => {
            // Arrange
            gameState.startGame();
            turn.reset(CellValue.O);
            player.symbol = CellValue.X;

            // Act
            const result = processPendingClick(board, gameState, turn, player, { row: 0, col: 0 });

            // Assert
            expect(result).toBe(false);
            expect(board.getCell(0, 0)).toBe(CellValue.Empty);
        });
    });

    describe('InputStore', () => {
        it('should be able to add and retrieve clicks', () => {
            // Arrange
            const position = { row: 1, col: 2 };

            // Act
            InputStore.addClick(position);

            // Assert
            expect(InputStore.hasPendingClicks()).toBe(true);
            expect(InputStore.getNextClick()).toEqual(position);
            expect(InputStore.hasPendingClicks()).toBe(false);
        });

        it('should clear clicks when requested', () => {
            // Arrange
            InputStore.addClick({ row: 0, col: 0 });
            InputStore.addClick({ row: 1, col: 1 });

            // Act
            InputStore.clearClicks();

            // Assert
            expect(InputStore.hasPendingClicks()).toBe(false);
        });

        it('should process clicks in FIFO order', () => {
            // Arrange
            const firstClick = { row: 0, col: 0 };
            const secondClick = { row: 1, col: 1 };

            // Act
            InputStore.addClick(firstClick);
            InputStore.addClick(secondClick);

            // Assert
            expect(InputStore.getNextClick()).toEqual(firstClick);
            expect(InputStore.getNextClick()).toEqual(secondClick);
        });
    });

    describe('update method', () => {
        it('should process pending clicks during update', () => {
            // Arrange
            gameState.startGame();
            turn.reset(CellValue.X);
            player.symbol = CellValue.X;
            player.playerType = PlayerType.Human;

            // Add a click to the store
            InputStore.addClick({ row: 0, col: 0 });

            const components = [board, gameState, turn, player];

            // Act
            InputProcessor.update({} as any, components, InputProcessor);

            // Assert
            expect(board.getCell(0, 0)).toBe(CellValue.X);
            expect(InputStore.hasPendingClicks()).toBe(false);
        });

        it('should not modify board if there are no pending clicks', () => {
            // Arrange
            const components = [board, gameState, turn, player];
            const initialBoard = new BoardComponent(); // Fresh empty board for comparison

            // Act
            InputProcessor.update({} as any, components, InputProcessor);

            // Assert - board should remain unchanged
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    expect(board.getCell(row, col)).toBe(initialBoard.getCell(row, col));
                }
            }
        });

        it('should not process clicks if game is not in progress', () => {
            // Arrange
            gameState.status = GameStatus.NotStarted;
            InputStore.addClick({ row: 0, col: 0 });
            const components = [board, gameState, turn, player];

            // Act
            InputProcessor.update({} as any, components, InputProcessor);

            // Assert
            expect(board.getCell(0, 0)).toBe(CellValue.Empty);
            expect(InputStore.hasPendingClicks()).toBe(false); // Click should be consumed even if not applied
        });
    });
}); 
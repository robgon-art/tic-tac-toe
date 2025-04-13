import { describe, it, expect, beforeEach } from 'vitest';
import {
    WinCheckProcessor,
    checkRows,
    checkColumns,
    checkDiagonals,
    getWinningSymbol,
    checkWin,
    checkDraw
} from './WinCheckProcessor';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';

describe('WinCheckProcessor', () => {
    // Test components
    let board: BoardComponent;
    let gameState: GameStateComponent;
    let turn: TurnComponent;

    // Set up fresh components before each test
    beforeEach(() => {
        board = new BoardComponent();
        gameState = new GameStateComponent();
        turn = new TurnComponent();

        // Set game to in progress for most tests
        gameState.startGame();
    });

    describe('Structure', () => {
        it('should have the correct processor name', () => {
            expect(WinCheckProcessor.name).toBe('win_check_processor');
        });

        it('should require the correct components', () => {
            expect(WinCheckProcessor.required).toEqual([
                'BoardComponent',
                'GameStateComponent',
                'TurnComponent'
            ]);
        });

        it('should have an update method', () => {
            expect(typeof WinCheckProcessor.update).toBe('function');
        });
    });

    describe('checkRows function', () => {
        it('should detect a win in the first row', () => {
            // Arrange - X wins first row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);
            board.setCell(0, 2, CellValue.X);

            // Act
            const result = checkRows(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 0 });
            expect(result?.[1]).toEqual({ row: 0, col: 1 });
            expect(result?.[2]).toEqual({ row: 0, col: 2 });
        });

        it('should detect a win in the second row', () => {
            // Arrange - O wins second row
            board.setCell(1, 0, CellValue.O);
            board.setCell(1, 1, CellValue.O);
            board.setCell(1, 2, CellValue.O);

            // Act
            const result = checkRows(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 1, col: 0 });
            expect(result?.[1]).toEqual({ row: 1, col: 1 });
            expect(result?.[2]).toEqual({ row: 1, col: 2 });
        });

        it('should detect a win in the third row', () => {
            // Arrange - X wins third row
            board.setCell(2, 0, CellValue.X);
            board.setCell(2, 1, CellValue.X);
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkRows(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 2, col: 0 });
            expect(result?.[1]).toEqual({ row: 2, col: 1 });
            expect(result?.[2]).toEqual({ row: 2, col: 2 });
        });

        it('should return null if no row win', () => {
            // Arrange - No complete row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.O);
            board.setCell(0, 2, CellValue.X);

            // Act
            const result = checkRows(board);

            // Assert
            expect(result).toBeNull();
        });

        it('should return null if row has empty cells', () => {
            // Arrange - Incomplete row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);
            // Third cell empty

            // Act
            const result = checkRows(board);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('checkColumns function', () => {
        it('should detect a win in the first column', () => {
            // Arrange - X wins first column
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 0, CellValue.X);
            board.setCell(2, 0, CellValue.X);

            // Act
            const result = checkColumns(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 0 });
            expect(result?.[1]).toEqual({ row: 1, col: 0 });
            expect(result?.[2]).toEqual({ row: 2, col: 0 });
        });

        it('should detect a win in the second column', () => {
            // Arrange - O wins second column
            board.setCell(0, 1, CellValue.O);
            board.setCell(1, 1, CellValue.O);
            board.setCell(2, 1, CellValue.O);

            // Act
            const result = checkColumns(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 1 });
            expect(result?.[1]).toEqual({ row: 1, col: 1 });
            expect(result?.[2]).toEqual({ row: 2, col: 1 });
        });

        it('should detect a win in the third column', () => {
            // Arrange - X wins third column
            board.setCell(0, 2, CellValue.X);
            board.setCell(1, 2, CellValue.X);
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkColumns(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 2 });
            expect(result?.[1]).toEqual({ row: 1, col: 2 });
            expect(result?.[2]).toEqual({ row: 2, col: 2 });
        });

        it('should return null if no column win', () => {
            // Arrange - No complete column
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 0, CellValue.O);
            board.setCell(2, 0, CellValue.X);

            // Act
            const result = checkColumns(board);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('checkDiagonals function', () => {
        it('should detect a win in the main diagonal (top-left to bottom-right)', () => {
            // Arrange - X wins main diagonal
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.X);
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkDiagonals(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 0 });
            expect(result?.[1]).toEqual({ row: 1, col: 1 });
            expect(result?.[2]).toEqual({ row: 2, col: 2 });
        });

        it('should detect a win in the anti-diagonal (top-right to bottom-left)', () => {
            // Arrange - O wins anti-diagonal
            board.setCell(0, 2, CellValue.O);
            board.setCell(1, 1, CellValue.O);
            board.setCell(2, 0, CellValue.O);

            // Act
            const result = checkDiagonals(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.length).toBe(3);
            expect(result?.[0]).toEqual({ row: 0, col: 2 });
            expect(result?.[1]).toEqual({ row: 1, col: 1 });
            expect(result?.[2]).toEqual({ row: 2, col: 0 });
        });

        it('should return null if no diagonal win', () => {
            // Arrange - No complete diagonal
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkDiagonals(board);

            // Assert
            expect(result).toBeNull();
        });

        it('should return null if diagonal has empty cells', () => {
            // Arrange - Incomplete diagonal
            board.setCell(0, 0, CellValue.X);
            // Middle empty
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkDiagonals(board);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('getWinningSymbol function', () => {
        it('should return the correct symbol at a position', () => {
            // Arrange
            board.setCell(1, 1, CellValue.X);

            // Act
            const result = getWinningSymbol(board, { row: 1, col: 1 });

            // Assert
            expect(result).toBe(CellValue.X);
        });

        it('should return empty for an empty cell', () => {
            // Act
            const result = getWinningSymbol(board, { row: 0, col: 0 });

            // Assert
            expect(result).toBe(CellValue.Empty);
        });
    });

    describe('checkWin function', () => {
        it('should detect row wins', () => {
            // Arrange - X wins first row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);
            board.setCell(0, 2, CellValue.X);

            // Act
            const result = checkWin(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.symbol).toBe(CellValue.X);
            expect(result?.winLine.length).toBe(3);
        });

        it('should detect column wins', () => {
            // Arrange - O wins first column
            board.setCell(0, 0, CellValue.O);
            board.setCell(1, 0, CellValue.O);
            board.setCell(2, 0, CellValue.O);

            // Act
            const result = checkWin(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.symbol).toBe(CellValue.O);
            expect(result?.winLine.length).toBe(3);
        });

        it('should detect diagonal wins', () => {
            // Arrange - X wins main diagonal
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.X);
            board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkWin(board);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.symbol).toBe(CellValue.X);
            expect(result?.winLine.length).toBe(3);
        });

        it('should return null if no win', () => {
            // Arrange - No win condition
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.O);
            board.setCell(0, 2, CellValue.X);
            board.setCell(1, 0, CellValue.O);

            // Act
            const result = checkWin(board);

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('checkDraw function', () => {
        it('should return true when board is full with no winner', () => {
            // Arrange - Full board with no winner
            board.setCell(0, 0, CellValue.X); board.setCell(0, 1, CellValue.O); board.setCell(0, 2, CellValue.X);
            board.setCell(1, 0, CellValue.X); board.setCell(1, 1, CellValue.O); board.setCell(1, 2, CellValue.O);
            board.setCell(2, 0, CellValue.O); board.setCell(2, 1, CellValue.X); board.setCell(2, 2, CellValue.X);

            // Act
            const result = checkDraw(board);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when board is not full', () => {
            // Arrange - Partially filled board
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);

            // Act
            const result = checkDraw(board);

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('update method', () => {
        it('should not modify game state if game is not in progress', () => {
            // Arrange
            gameState.status = GameStatus.NotStarted;
            // Create a winning board
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);
            board.setCell(0, 2, CellValue.X);
            const components = [board, gameState, turn];

            // Act
            WinCheckProcessor.update({} as any, components, WinCheckProcessor);

            // Assert - state should remain unchanged
            expect(gameState.status).toBe(GameStatus.NotStarted);
        });

        it('should update game state to win when a win is detected', () => {
            // Arrange
            // X wins first row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);
            board.setCell(0, 2, CellValue.X);
            const components = [board, gameState, turn];

            // Act
            WinCheckProcessor.update({} as any, components, WinCheckProcessor);

            // Assert
            expect(gameState.status).toBe(GameStatus.Win);
            expect(gameState.winner).toBe(CellValue.X);
            expect(gameState.winLine.length).toBe(3);
        });

        it('should update game state to draw when board is full with no winner', () => {
            // Arrange - Full board with no winner
            board.setCell(0, 0, CellValue.X); board.setCell(0, 1, CellValue.O); board.setCell(0, 2, CellValue.X);
            board.setCell(1, 0, CellValue.X); board.setCell(1, 1, CellValue.O); board.setCell(1, 2, CellValue.O);
            board.setCell(2, 0, CellValue.O); board.setCell(2, 1, CellValue.X); board.setCell(2, 2, CellValue.X);
            const components = [board, gameState, turn];

            // Act
            WinCheckProcessor.update({} as any, components, WinCheckProcessor);

            // Assert
            expect(gameState.status).toBe(GameStatus.Draw);
            expect(gameState.winner).toBe(CellValue.Empty);
            expect(gameState.winLine.length).toBe(0);
        });

        it('should not modify game state when game is in progress with no win or draw', () => {
            // Arrange - Game in progress, no win or draw
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);
            const components = [board, gameState, turn];
            const initialState = gameState.clone();

            // Act
            WinCheckProcessor.update({} as any, components, WinCheckProcessor);

            // Assert - state should remain unchanged
            expect(gameState.status).toBe(initialState.status);
            expect(gameState.winner).toBe(initialState.winner);
            expect(gameState.winLine).toEqual(initialState.winLine);
        });
    });
}); 
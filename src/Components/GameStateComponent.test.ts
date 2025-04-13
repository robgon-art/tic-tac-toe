import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateComponent, GameStatus, WinLine } from './GameStateComponent';
import { CellValue } from './BoardComponent';

describe('GameStateComponent', () => {
    let gameState: GameStateComponent;

    beforeEach(() => {
        gameState = new GameStateComponent();
    });

    it('should initialize with NotStarted status by default', () => {
        expect(gameState.status).toBe(GameStatus.NotStarted);
        expect(gameState.winner).toBe(CellValue.Empty);
        expect(gameState.winLine).toEqual([]);
    });

    it('should initialize with provided status', () => {
        const inProgressState = new GameStateComponent(GameStatus.InProgress);
        expect(inProgressState.status).toBe(GameStatus.InProgress);
        expect(inProgressState.winner).toBe(CellValue.Empty);
        expect(inProgressState.winLine).toEqual([]);
    });

    it('should reset to specified status', () => {
        // Set to win state first
        const winLine: WinLine = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 }
        ];
        gameState.setWin(CellValue.X, winLine);

        // Reset to in progress
        gameState.reset(GameStatus.InProgress);

        expect(gameState.status).toBe(GameStatus.InProgress);
        expect(gameState.winner).toBe(CellValue.Empty);
        expect(gameState.winLine).toEqual([]);
    });

    it('should get and set status correctly', () => {
        expect(gameState.status).toBe(GameStatus.NotStarted);

        gameState.status = GameStatus.InProgress;
        expect(gameState.status).toBe(GameStatus.InProgress);

        gameState.status = GameStatus.Win;
        expect(gameState.status).toBe(GameStatus.Win);

        gameState.status = GameStatus.Draw;
        expect(gameState.status).toBe(GameStatus.Draw);
    });

    it('should get and set winner correctly', () => {
        expect(gameState.winner).toBe(CellValue.Empty);

        gameState.winner = CellValue.X;
        expect(gameState.winner).toBe(CellValue.X);

        gameState.winner = CellValue.O;
        expect(gameState.winner).toBe(CellValue.O);
    });

    it('should get and set win line correctly', () => {
        expect(gameState.winLine).toEqual([]);

        const winLine: WinLine = [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 }
        ];

        gameState.winLine = winLine;
        expect(gameState.winLine).toEqual(winLine);
    });

    it('should detect if game is over', () => {
        // Initially not over
        expect(gameState.isGameOver()).toBe(false);

        // Set to win
        gameState.status = GameStatus.Win;
        expect(gameState.isGameOver()).toBe(true);

        // Set to draw
        gameState.status = GameStatus.Draw;
        expect(gameState.isGameOver()).toBe(true);

        // Set to not started
        gameState.status = GameStatus.NotStarted;
        expect(gameState.isGameOver()).toBe(false);

        // Set to in progress
        gameState.status = GameStatus.InProgress;
        expect(gameState.isGameOver()).toBe(false);
    });

    it('should detect if game is in progress', () => {
        // Initially not in progress
        expect(gameState.isInProgress()).toBe(false);

        // Set to in progress
        gameState.status = GameStatus.InProgress;
        expect(gameState.isInProgress()).toBe(true);

        // Set to other states
        gameState.status = GameStatus.Win;
        expect(gameState.isInProgress()).toBe(false);

        gameState.status = GameStatus.Draw;
        expect(gameState.isInProgress()).toBe(false);
    });

    it('should set game to win state', () => {
        const winLine: WinLine = [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 }
        ];

        gameState.setWin(CellValue.X, winLine);

        expect(gameState.status).toBe(GameStatus.Win);
        expect(gameState.winner).toBe(CellValue.X);
        expect(gameState.winLine).toEqual(winLine);
    });

    it('should set game to draw state', () => {
        gameState.setDraw();

        expect(gameState.status).toBe(GameStatus.Draw);
        expect(gameState.winner).toBe(CellValue.Empty);
        expect(gameState.winLine).toEqual([]);
    });

    it('should start game', () => {
        // Set to win state first
        const winLine: WinLine = [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 2 }
        ];
        gameState.setWin(CellValue.X, winLine);

        // Start new game
        gameState.startGame();

        expect(gameState.status).toBe(GameStatus.InProgress);
        expect(gameState.winner).toBe(CellValue.Empty);
        expect(gameState.winLine).toEqual([]);
    });

    it('should create a clone with same state', () => {
        // Set to win state
        const winLine: WinLine = [
            { row: 0, col: 0 },
            { row: 1, col: 1 },
            { row: 2, col: 2 }
        ];
        gameState.setWin(CellValue.X, winLine);

        // Clone the component
        const clonedState = gameState.clone();

        // Verify state matches
        expect(clonedState.status).toBe(GameStatus.Win);
        expect(clonedState.winner).toBe(CellValue.X);
        expect(clonedState.winLine).toEqual(winLine);

        // Verify it's a deep copy by modifying original
        gameState.setDraw();
        expect(gameState.status).toBe(GameStatus.Draw);
        expect(clonedState.status).toBe(GameStatus.Win);

        // Verify win line is a deep copy
        const originalWinLine = clonedState.winLine;
        originalWinLine[0].row = 99;
        expect(winLine[0].row).toBe(0); // Original unchanged
    });

    it('should implement the Component interface', () => {
        expect(gameState.name).toBe('GameStateComponent');
        expect(gameState.state).toBeDefined();
        expect(gameState.state.status).toBe(GameStatus.NotStarted);
        expect(gameState.state.winner).toBe(CellValue.Empty);
        expect(gameState.state.winLine).toEqual([]);
    });
}); 
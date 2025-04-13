import { describe, it, expect, beforeEach } from 'vitest';
import {
    AIProcessor,
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
} from './AIProcessor';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';

describe('AIProcessor', () => {
    // Test components
    let board: BoardComponent;
    let gameState: GameStateComponent;
    let turn: TurnComponent;
    let computer: PlayerComponent;

    // Set up fresh components before each test
    beforeEach(() => {
        board = new BoardComponent();
        gameState = new GameStateComponent(GameStatus.InProgress);
        turn = new TurnComponent(CellValue.O); // O (computer) goes first
        computer = new PlayerComponent(PlayerType.Computer, CellValue.O);
    });

    describe('Structure', () => {
        it('should have the correct processor name', () => {
            expect(AIProcessor.name).toBe('ai_processor');
        });

        it('should require the correct components', () => {
            expect(AIProcessor.required).toEqual([
                'BoardComponent',
                'GameStateComponent',
                'TurnComponent',
                'PlayerComponent'
            ]);
        });

        it('should have an update method', () => {
            expect(typeof AIProcessor.update).toBe('function');
        });
    });

    describe('getEmptyCells function', () => {
        it('should return all cells for an empty board', () => {
            // Empty board should have 9 empty cells
            const emptyCells = getEmptyCells(board);
            expect(emptyCells.length).toBe(9);
        });

        it('should return only empty cells for a partially filled board', () => {
            // Arrange - fill some cells
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);
            board.setCell(2, 2, CellValue.X);

            // Act
            const emptyCells = getEmptyCells(board);

            // Assert
            expect(emptyCells.length).toBe(6);

            // Check that filled cells are not included
            expect(emptyCells.some(cell => cell.row === 0 && cell.col === 0)).toBe(false);
            expect(emptyCells.some(cell => cell.row === 1 && cell.col === 1)).toBe(false);
            expect(emptyCells.some(cell => cell.row === 2 && cell.col === 2)).toBe(false);
        });

        it('should return an empty array for a full board', () => {
            // Arrange - fill the entire board
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    board.setCell(row, col, row % 2 === col % 2 ? CellValue.X : CellValue.O);
                }
            }

            // Act
            const emptyCells = getEmptyCells(board);

            // Assert
            expect(emptyCells.length).toBe(0);
        });
    });

    describe('findWinningMove function', () => {
        it('should find a row winning move', () => {
            // Arrange - set up a potential win in the first row
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);

            // Act
            const winningMove = findWinningMove(board, CellValue.X);

            // Assert
            expect(winningMove).toEqual({ row: 0, col: 2 });
        });

        it('should find a column winning move', () => {
            // Arrange - set up a potential win in the first column
            board.setCell(0, 0, CellValue.O);
            board.setCell(1, 0, CellValue.O);

            // Act
            const winningMove = findWinningMove(board, CellValue.O);

            // Assert
            expect(winningMove).toEqual({ row: 2, col: 0 });
        });

        it('should find a diagonal winning move', () => {
            // Arrange - set up a potential win in the main diagonal
            board.setCell(0, 0, CellValue.X);
            board.setCell(2, 2, CellValue.X);

            // Act
            const winningMove = findWinningMove(board, CellValue.X);

            // Assert
            expect(winningMove).toEqual({ row: 1, col: 1 });
        });

        it('should find an anti-diagonal winning move', () => {
            // Arrange - set up a potential win in the anti-diagonal
            board.setCell(0, 2, CellValue.O);
            board.setCell(1, 1, CellValue.O);

            // Act
            const winningMove = findWinningMove(board, CellValue.O);

            // Assert
            expect(winningMove).toEqual({ row: 2, col: 0 });
        });

        it('should return null if no winning move exists', () => {
            // Arrange - no potential wins
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);

            // Act
            const winningMove = findWinningMove(board, CellValue.X);

            // Assert
            expect(winningMove).toBeNull();
        });
    });

    describe('countWinningLines function', () => {
        it('should count potential winning lines through a position', () => {
            // Empty board, center position has 4 potential winning lines
            const lines = countWinningLines(board, { row: 1, col: 1 }, CellValue.X);
            expect(lines).toBe(4); // 1 row, 1 column, 2 diagonals
        });

        it('should count correctly when some lines are blocked', () => {
            // Arrange - block one potential winning line
            board.setCell(0, 0, CellValue.O); // Block main diagonal

            // Act
            const lines = countWinningLines(board, { row: 1, col: 1 }, CellValue.X);

            // Assert
            expect(lines).toBe(3); // 1 row, 1 column, 1 diagonal (one is blocked)
        });

        it('should return 0 for occupied positions', () => {
            // Arrange - occupy the position
            board.setCell(1, 1, CellValue.O);

            // Act
            const lines = countWinningLines(board, { row: 1, col: 1 }, CellValue.X);

            // Assert
            expect(lines).toBe(0);
        });
    });

    describe('findForkMove function', () => {
        it('should find a fork position', () => {
            // Arrange - set up a potential fork
            board.setCell(0, 0, CellValue.X);
            board.setCell(2, 2, CellValue.X);
            board.setCell(1, 1, CellValue.O); // Block the diagonal

            // This creates a fork opportunity at (0, 2) forming threats in the top row and right column

            // Act
            const forkMove = findForkMove(board, CellValue.X);

            // Assert
            // Either (0, 2) or (2, 0) would work for this setup
            expect(forkMove).toBeTruthy();
            expect(
                (forkMove?.row === 0 && forkMove?.col === 2) ||
                (forkMove?.row === 2 && forkMove?.col === 0)
            ).toBe(true);
        });

        it('should return null if no fork exists', () => {
            // Arrange - no fork possible yet
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O);

            // Act
            const forkMove = findForkMove(board, CellValue.X);

            // Assert
            expect(forkMove).toBeNull();
        });
    });

    describe('findCenterMove function', () => {
        it('should return the center if empty', () => {
            // Empty board, center is available
            const centerMove = findCenterMove(board);
            expect(centerMove).toEqual({ row: 1, col: 1 });
        });

        it('should return null if center is occupied', () => {
            // Arrange - occupy the center
            board.setCell(1, 1, CellValue.X);

            // Act
            const centerMove = findCenterMove(board);

            // Assert
            expect(centerMove).toBeNull();
        });
    });

    describe('findOppositeCornerMove function', () => {
        it('should find the opposite corner of an opponent\'s mark', () => {
            // Arrange - opponent in top-left corner
            board.setCell(0, 0, CellValue.X);

            // Act
            const oppositeCornerMove = findOppositeCornerMove(board, CellValue.X);

            // Assert - should suggest bottom-right corner
            expect(oppositeCornerMove).toEqual({ row: 2, col: 2 });
        });

        it('should return null if no opposite corner is available', () => {
            // Arrange - opponent in top-left, but bottom-right is already occupied
            board.setCell(0, 0, CellValue.X);
            board.setCell(2, 2, CellValue.O);

            // Act
            const oppositeCornerMove = findOppositeCornerMove(board, CellValue.X);

            // Assert
            expect(oppositeCornerMove).toBeNull();
        });

        it('should handle all corner pairs', () => {
            // Test all corner pairs

            // Reset board
            board = new BoardComponent();

            // Top-right to bottom-left
            board.setCell(0, 2, CellValue.X);
            expect(findOppositeCornerMove(board, CellValue.X)).toEqual({ row: 2, col: 0 });

            // Reset board
            board = new BoardComponent();

            // Bottom-left to top-right
            board.setCell(2, 0, CellValue.X);
            expect(findOppositeCornerMove(board, CellValue.X)).toEqual({ row: 0, col: 2 });

            // Reset board
            board = new BoardComponent();

            // Bottom-right to top-left
            board.setCell(2, 2, CellValue.X);
            expect(findOppositeCornerMove(board, CellValue.X)).toEqual({ row: 0, col: 0 });
        });
    });

    describe('findEmptyCornerMove function', () => {
        it('should find an empty corner', () => {
            // Empty board, all corners are available
            const cornerMove = findEmptyCornerMove(board);
            expect(cornerMove).toBeTruthy();

            const isCorner = (
                (cornerMove?.row === 0 && cornerMove?.col === 0) ||
                (cornerMove?.row === 0 && cornerMove?.col === 2) ||
                (cornerMove?.row === 2 && cornerMove?.col === 0) ||
                (cornerMove?.row === 2 && cornerMove?.col === 2)
            );

            expect(isCorner).toBe(true);
        });

        it('should return null if no corners are available', () => {
            // Arrange - occupy all corners
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 2, CellValue.O);
            board.setCell(2, 0, CellValue.X);
            board.setCell(2, 2, CellValue.O);

            // Act
            const cornerMove = findEmptyCornerMove(board);

            // Assert
            expect(cornerMove).toBeNull();
        });
    });

    describe('findEmptySideMove function', () => {
        it('should find an empty side', () => {
            // Empty board, all sides are available
            const sideMove = findEmptySideMove(board);
            expect(sideMove).toBeTruthy();

            const isSide = (
                (sideMove?.row === 0 && sideMove?.col === 1) ||
                (sideMove?.row === 1 && sideMove?.col === 0) ||
                (sideMove?.row === 1 && sideMove?.col === 2) ||
                (sideMove?.row === 2 && sideMove?.col === 1)
            );

            expect(isSide).toBe(true);
        });

        it('should return null if no sides are available', () => {
            // Arrange - occupy all sides
            board.setCell(0, 1, CellValue.X);
            board.setCell(1, 0, CellValue.O);
            board.setCell(1, 2, CellValue.X);
            board.setCell(2, 1, CellValue.O);

            // Act
            const sideMove = findEmptySideMove(board);

            // Assert
            expect(sideMove).toBeNull();
        });
    });

    describe('findBestMove function', () => {
        it('should prioritize winning moves (Rule 1)', () => {
            // Arrange - set up a winning move
            board.setCell(0, 0, CellValue.O);
            board.setCell(0, 1, CellValue.O);

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should take the winning move
            expect(bestMove).toEqual({ row: 0, col: 2 });
        });

        it('should prioritize blocking opponent\'s win (Rule 2)', () => {
            // Arrange - set up a situation where opponent can win
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 1, CellValue.X);

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should block opponent's win
            expect(bestMove).toEqual({ row: 0, col: 2 });
        });

        it('should prioritize creating a fork (Rule 3)', () => {
            // Arrange - set up a potential fork situation
            board.setCell(0, 0, CellValue.O);
            board.setCell(2, 2, CellValue.O);
            board.setCell(1, 1, CellValue.X); // Block the diagonal

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should create a fork
            expect(
                (bestMove?.row === 0 && bestMove?.col === 2) ||
                (bestMove?.row === 2 && bestMove?.col === 0)
            ).toBe(true);
        });

        it('should prioritize blocking opponent\'s fork (Rule 4)', () => {
            // Arrange - set up a situation where opponent can create a fork
            board.setCell(0, 0, CellValue.X);
            board.setCell(2, 2, CellValue.X);
            board.setCell(1, 1, CellValue.O); // AI already took center

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should block opponent's fork
            expect(
                (bestMove?.row === 0 && bestMove?.col === 2) ||
                (bestMove?.row === 2 && bestMove?.col === 0)
            ).toBe(true);
        });

        it('should take center if available (Rule 5)', () => {
            // Arrange - empty board

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should take center
            expect(bestMove).toEqual({ row: 1, col: 1 });
        });

        it('should take opposite corner if opponent is in a corner (Rule 6)', () => {
            // Arrange - opponent in a corner, center already taken
            board.setCell(0, 0, CellValue.X);
            board.setCell(1, 1, CellValue.O); // AI took center

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should take opposite corner
            expect(bestMove).toEqual({ row: 2, col: 2 });
        });

        it('should take an empty corner (Rule 7)', () => {
            // Arrange - center and one corner taken
            board.setCell(1, 1, CellValue.X); // Opponent took center
            board.setCell(0, 0, CellValue.O); // AI took one corner

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should take another corner
            expect(
                (bestMove?.row === 0 && bestMove?.col === 2) ||
                (bestMove?.row === 2 && bestMove?.col === 0) ||
                (bestMove?.row === 2 && bestMove?.col === 2)
            ).toBe(true);
        });

        it('should take an empty side as last resort (Rule 8)', () => {
            // Arrange - all corners and center taken
            board.setCell(0, 0, CellValue.X);
            board.setCell(0, 2, CellValue.O);
            board.setCell(2, 0, CellValue.X);
            board.setCell(2, 2, CellValue.O);
            board.setCell(1, 1, CellValue.X);

            // Act
            const bestMove = findBestMove(board, CellValue.O, CellValue.X);

            // Assert - should take a side
            expect(
                (bestMove?.row === 0 && bestMove?.col === 1) ||
                (bestMove?.row === 1 && bestMove?.col === 0) ||
                (bestMove?.row === 1 && bestMove?.col === 2) ||
                (bestMove?.row === 2 && bestMove?.col === 1)
            ).toBe(true);
        });
    });

    describe('makeAIMove function', () => {
        it('should make the best move for the AI', () => {
            // Arrange
            const initialTurn = turn.currentTurn;

            // Act
            const result = makeAIMove(board, turn, CellValue.O, CellValue.X);

            // Assert
            expect(result).toBe(true);
            expect(turn.currentTurn).not.toBe(initialTurn); // Turn should advance

            // Should have made a move (center in empty board case)
            expect(board.getCell(1, 1)).toBe(CellValue.O);
        });

        it('should return false if no move can be made', () => {
            // Arrange - full board
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    board.setCell(row, col, row % 2 === col % 2 ? CellValue.X : CellValue.O);
                }
            }

            const initialTurn = turn.currentTurn;

            // Act
            const result = makeAIMove(board, turn, CellValue.O, CellValue.X);

            // Assert
            expect(result).toBe(false);
            expect(turn.currentTurn).toBe(initialTurn); // Turn should not change
        });
    });

    describe('isComputerTurn function', () => {
        it('should return true when it is the computer\'s turn', () => {
            // Arrange
            turn.reset(CellValue.O);
            computer.symbol = CellValue.O;

            // Act & Assert
            expect(isComputerTurn(turn, computer)).toBe(true);
        });

        it('should return false when it is not the computer\'s turn', () => {
            // Arrange
            turn.reset(CellValue.X);
            computer.symbol = CellValue.O;

            // Act & Assert
            expect(isComputerTurn(turn, computer)).toBe(false);
        });

        it('should return false for human player', () => {
            // Arrange
            turn.reset(CellValue.X);
            computer.playerType = PlayerType.Human;
            computer.symbol = CellValue.X;

            // Act & Assert
            expect(isComputerTurn(turn, computer)).toBe(false);
        });
    });

    describe('update method', () => {
        it('should make a move when it is the computer\'s turn and game is in progress', () => {
            // Arrange
            gameState.startGame();
            turn.reset(CellValue.O); // Computer's turn
            computer.symbol = CellValue.O;

            const components = [board, gameState, turn, computer];

            // Initial state
            const initialBoardEmpty = board.grid.every(row =>
                row.every(cell => cell === CellValue.Empty)
            );
            expect(initialBoardEmpty).toBe(true);

            // Act
            AIProcessor.update({} as any, components, AIProcessor);

            // Assert
            // Board should have a move now (center in empty board case)
            expect(board.getCell(1, 1)).toBe(CellValue.O);

            // Turn should have advanced
            expect(turn.currentTurn).toBe(CellValue.X);
        });

        it('should not make a move when it is not the computer\'s turn', () => {
            // Arrange
            gameState.startGame();
            turn.reset(CellValue.X); // Player's turn
            computer.symbol = CellValue.O;

            const components = [board, gameState, turn, computer];

            // Act
            AIProcessor.update({} as any, components, AIProcessor);

            // Assert
            // Board should still be empty
            const stillEmpty = board.grid.every(row =>
                row.every(cell => cell === CellValue.Empty)
            );
            expect(stillEmpty).toBe(true);

            // Turn should not have changed
            expect(turn.currentTurn).toBe(CellValue.X);
        });

        it('should not make a move when game is not in progress', () => {
            // Arrange
            gameState.status = GameStatus.Win; // Game over
            turn.reset(CellValue.O); // Computer's turn
            computer.symbol = CellValue.O;

            const components = [board, gameState, turn, computer];

            // Act
            AIProcessor.update({} as any, components, AIProcessor);

            // Assert
            // Board should still be empty
            const stillEmpty = board.grid.every(row =>
                row.every(cell => cell === CellValue.Empty)
            );
            expect(stillEmpty).toBe(true);

            // Turn should not have changed
            expect(turn.currentTurn).toBe(CellValue.O);
        });
    });
}); 
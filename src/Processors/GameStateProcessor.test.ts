import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateProcessor, startGame, handleWin, handleDraw, resetGame, startNewGame } from './GameStateProcessor';
import { GameStateComponent, GameStatus } from '../Components/GameStateComponent';
import { BoardComponent, CellValue } from '../Components/BoardComponent';
import { TurnComponent } from '../Components/TurnComponent';
import { ScoreComponent } from '../Components/ScoreComponent';

describe('GameStateProcessor', () => {
  // Test components that we'll use in various tests
  let gameState: GameStateComponent;
  let board: BoardComponent;
  let turn: TurnComponent;
  let score: ScoreComponent;

  // Set up fresh components before each test
  beforeEach(() => {
    gameState = new GameStateComponent();
    board = new BoardComponent();
    turn = new TurnComponent();
    score = new ScoreComponent();
  });

  describe('Structure', () => {
    it('should have the correct processor name', () => {
      expect(GameStateProcessor.name).toBe('game_state_processor');
    });

    it('should require the correct components', () => {
      expect(GameStateProcessor.required).toEqual([
        'GameStateComponent',
        'BoardComponent',
        'TurnComponent',
        'ScoreComponent'
      ]);
    });

    it('should have an update method', () => {
      expect(typeof GameStateProcessor.update).toBe('function');
    });
  });

  describe('startGame function', () => {
    it('should change game state to InProgress', () => {
      // Arrange
      gameState.status = GameStatus.NotStarted;

      // Act
      startGame(gameState);

      // Assert
      expect(gameState.status).toBe(GameStatus.InProgress);
    });

    it('should reset winner and win line', () => {
      // Arrange - set up a previous win state
      gameState.setWin(CellValue.X, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);

      // Act
      startGame(gameState);

      // Assert
      expect(gameState.winner).toBe(CellValue.Empty);
      expect(gameState.winLine).toEqual([]);
    });
  });

  describe('handleWin function', () => {
    it('should increment player score when X wins', () => {
      // Arrange
      gameState.setWin(CellValue.X, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);
      const initialScore = score.playerScore;

      // Act
      handleWin(gameState, score);

      // Assert
      expect(score.playerScore).toBe(initialScore + 1);
      expect(score.computerScore).toBe(0); // Shouldn't change
      expect(score.ties).toBe(0); // Shouldn't change
    });

    it('should increment computer score when O wins', () => {
      // Arrange
      gameState.setWin(CellValue.O, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);
      const initialScore = score.computerScore;

      // Act
      handleWin(gameState, score);

      // Assert
      expect(score.computerScore).toBe(initialScore + 1);
      expect(score.playerScore).toBe(0); // Shouldn't change
      expect(score.ties).toBe(0); // Shouldn't change
    });

    it('should do nothing if winner is empty', () => {
      // Arrange
      gameState.status = GameStatus.Win;
      gameState.winner = CellValue.Empty;

      // Act
      handleWin(gameState, score);

      // Assert
      expect(score.playerScore).toBe(0);
      expect(score.computerScore).toBe(0);
      expect(score.ties).toBe(0);
    });
  });

  describe('handleDraw function', () => {
    it('should increment ties counter', () => {
      // Arrange
      const initialTies = score.ties;

      // Act
      handleDraw(score);

      // Assert
      expect(score.ties).toBe(initialTies + 1);
      expect(score.playerScore).toBe(0); // Shouldn't change
      expect(score.computerScore).toBe(0); // Shouldn't change
    });
  });

  describe('resetGame function', () => {
    it('should reset the game state and board', () => {
      // Arrange - set up a game that's finished
      gameState.setWin(CellValue.X, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);
      board.setCell(0, 0, CellValue.X);
      board.setCell(0, 1, CellValue.X);
      board.setCell(0, 2, CellValue.X);

      // Act
      resetGame(gameState, board, turn);

      // Assert
      expect(gameState.status).toBe(GameStatus.InProgress);
      expect(gameState.winner).toBe(CellValue.Empty);
      expect(gameState.winLine).toEqual([]);

      // Board should be reset
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(board.getCell(row, col)).toBe(CellValue.Empty);
        }
      }
    });

    it('should alternate first player symbol', () => {
      // Arrange
      turn.reset(CellValue.X); // X goes first
      const initialFirstPlayer = turn.firstPlayerSymbol;

      // Act
      resetGame(gameState, board, turn);

      // Assert
      expect(turn.firstPlayerSymbol).not.toBe(initialFirstPlayer);
      expect(turn.currentTurn).toBe(turn.firstPlayerSymbol);
    });
  });

  describe('startNewGame function', () => {
    it('should reset the game state, board, and scores', () => {
      // Arrange - set up a game with scores
      gameState.setWin(CellValue.X, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);
      board.setCell(0, 0, CellValue.X);
      board.setCell(0, 1, CellValue.X);
      board.setCell(0, 2, CellValue.X);
      score.incrementPlayerScore();
      score.incrementComputerScore();
      score.incrementTies();

      // Act
      startNewGame(gameState, board, turn, score);

      // Assert
      expect(gameState.status).toBe(GameStatus.InProgress);
      expect(gameState.winner).toBe(CellValue.Empty);
      expect(gameState.winLine).toEqual([]);

      // Board should be reset
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(board.getCell(row, col)).toBe(CellValue.Empty);
        }
      }

      // Scores should be reset
      expect(score.playerScore).toBe(0);
      expect(score.computerScore).toBe(0);
      expect(score.ties).toBe(0);

      // X should go first in a brand new game
      expect(turn.firstPlayerSymbol).toBe(CellValue.X);
      expect(turn.currentTurn).toBe(CellValue.X);
    });
  });

  describe('update method', () => {
    it('should handle NotStarted state by starting the game', () => {
      // Arrange
      gameState.status = GameStatus.NotStarted;
      const components = [gameState, board, turn, score];

      // Act
      GameStateProcessor.update({} as any, components, GameStateProcessor);

      // Assert
      expect(gameState.status).toBe(GameStatus.InProgress);
    });

    it('should handle Win state by updating scores', () => {
      // Arrange
      gameState.setWin(CellValue.X, [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }]);
      const components = [gameState, board, turn, score];

      // Act
      GameStateProcessor.update({} as any, components, GameStateProcessor);

      // Assert
      expect(score.playerScore).toBe(1);
      expect(score.computerScore).toBe(0);
    });

    it('should handle Draw state by updating ties', () => {
      // Arrange
      gameState.setDraw();
      const components = [gameState, board, turn, score];

      // Act
      GameStateProcessor.update({} as any, components, GameStateProcessor);

      // Assert
      expect(score.ties).toBe(1);
    });

    it('should not modify state when game is InProgress', () => {
      // Arrange
      gameState.startGame();
      const initialState = gameState.clone();
      const components = [gameState, board, turn, score];

      // Act
      GameStateProcessor.update({} as any, components, GameStateProcessor);

      // Assert - state should remain unchanged
      expect(gameState.status).toBe(initialState.status);
      expect(gameState.winner).toBe(initialState.winner);
      expect(gameState.winLine).toEqual(initialState.winLine);
    });

    it('should reset the game state if status is invalid', () => {
      // Arrange - create an invalid state
      (gameState as any).state.status = 'invalid_state';
      const components = [gameState, board, turn, score];

      // Act
      GameStateProcessor.update({} as any, components, GameStateProcessor);

      // Assert
      expect(gameState.status).toBe(GameStatus.NotStarted);
    });
  });
}); 
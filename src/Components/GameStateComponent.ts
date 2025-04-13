import { Component } from 'javascript-entity-component-system';
import { CellValue } from './BoardComponent';

// Game status states
export enum GameStatus {
  NotStarted = 'not_started',
  InProgress = 'in_progress',
  Win = 'win',
  Draw = 'draw'
}

// Position type for win line coordinates
export type Position = {
  row: number;
  col: number;
};

// Win line (three positions that make a winning line)
export type WinLine = Position[];

/**
 * GameStateComponent tracks the game state including status, winner, and win line
 * It is a pure data container following ECS principles
 */
export class GameStateComponent implements Component {
  public name: string = 'GameStateComponent';
  public state: { [key: string]: any } = {
    status: GameStatus.NotStarted,
    winner: CellValue.Empty,
    winLine: [] as WinLine
  };

  /**
   * Creates a new GameStateComponent
   * @param initialStatus The initial game status
   */
  constructor(initialStatus: GameStatus = GameStatus.NotStarted) {
    this.reset(initialStatus);
  }

  /**
   * Resets the game state
   * @param status The status to reset to
   */
  public reset(status: GameStatus = GameStatus.NotStarted): void {
    this.state.status = status;
    this.state.winner = CellValue.Empty;
    this.state.winLine = [];
  }

  /**
   * Gets the current game status
   * @returns The game status
   */
  public get status(): GameStatus {
    return this.state.status;
  }

  /**
   * Sets the game status
   * @param status The new game status
   */
  public set status(status: GameStatus) {
    this.state.status = status;
  }

  /**
   * Gets the winner symbol (X, O, or Empty if no winner)
   * @returns The winner symbol
   */
  public get winner(): CellValue {
    return this.state.winner;
  }

  /**
   * Sets the winner
   * @param winner The winner symbol
   */
  public set winner(winner: CellValue) {
    this.state.winner = winner;
  }

  /**
   * Gets the win line (array of positions forming winning line)
   * @returns The win line positions
   */
  public get winLine(): WinLine {
    return this.state.winLine;
  }

  /**
   * Sets the win line
   * @param winLine The winning line positions
   */
  public set winLine(winLine: WinLine) {
    this.state.winLine = winLine;
  }

  /**
   * Checks if the game is over (win or draw)
   * @returns True if game is over, false otherwise
   */
  public isGameOver(): boolean {
    return this.state.status === GameStatus.Win || 
           this.state.status === GameStatus.Draw;
  }

  /**
   * Checks if the game is in progress
   * @returns True if game is in progress, false otherwise
   */
  public isInProgress(): boolean {
    return this.state.status === GameStatus.InProgress;
  }

  /**
   * Sets the game state to a win
   * @param winner The winning player symbol
   * @param winLine The winning line positions
   */
  public setWin(winner: CellValue, winLine: WinLine): void {
    this.state.status = GameStatus.Win;
    this.state.winner = winner;
    this.state.winLine = winLine;
  }

  /**
   * Sets the game state to a draw
   */
  public setDraw(): void {
    this.state.status = GameStatus.Draw;
    this.state.winner = CellValue.Empty;
    this.state.winLine = [];
  }

  /**
   * Sets the game to in progress
   */
  public startGame(): void {
    this.state.status = GameStatus.InProgress;
    this.state.winner = CellValue.Empty;
    this.state.winLine = [];
  }

  /**
   * Creates a deep copy of the current game state
   * @returns A new GameStateComponent with the same state
   */
  public clone(): GameStateComponent {
    const clonedComponent = new GameStateComponent(this.status);
    clonedComponent.winner = this.winner;
    
    // Deep copy the win line array
    clonedComponent.state.winLine = this.state.winLine.map((pos: Position) => ({
      row: pos.row,
      col: pos.col
    }));
    
    return clonedComponent;
  }
} 
# Tic Tac Toe Game Development Plan

This document outlines the development plan for a Tic Tac Toe game using the Entity Component System (ECS) architecture with [javascript-entity-component-system](https://github.com/Stuhl/javascript-entity-component-system), built with Lit, Vite, and TypeScript.

## Game Overview

Tic Tac Toe is a single-player game played against the computer on a 3×3 grid:
- The user is always X, and the computer is always O
- Players take turns placing their marks in empty squares
- The first to align three marks vertically, horizontally, or diagonally wins
- If all squares are filled without a winner, the game is a draw
- The player goes first in the initial game
- The computer starts the second game
- In subsequent games, players alternate who goes first

## Architecture: Entity Component System

### Components

Components are pure data containers:

1. **BoardComponent**
   - Board state (3x3 grid)
   - Tracks what marks are in which positions

2. **PlayerComponent**
   - Player type (human/computer)
   - Symbol (X/O)

3. **TurnComponent**
   - Current turn (X/O)
   - Turn number

4. **GameStateComponent**
   - Game status (in progress, win, draw)
   - Winner (if any)
   - Win line coordinates (for rendering)

5. **ScoreComponent**
   - Player score
   - Computer score
   - Ties

6. **RenderComponent**
   - Canvas dimensions
   - Line styles
   - Colors
   - Animation states

### Processors

Processors contain the game logic:

1. **GameStateProcessor**
   - Handles transitions between game states
   - Manages game reset and new game creation

2. **TurnProcessor**
   - Manages turn switching between players
   - Tracks whose turn it is to go first in new games

3. **WinCheckProcessor**
   - Checks for win conditions after each move
   - Detects draw situations

4. **InputProcessor**
   - Handles user clicks on the board
   - Validates input and updates board state

5. **AIProcessor**
   - Determines computer's moves
   - Implements simple AI strategy

6. **RenderProcessor**
   - Draws the board, grid lines, and X/O marks
   - Renders win lines and game state information

### Entities

Entities combine components:

1. **Game**
   - GameStateComponent
   - TurnComponent
   - ScoreComponent
   - RenderComponent

2. **Board**
   - BoardComponent
   - RenderComponent

3. **Player**
   - PlayerComponent (human)

4. **Computer**
   - PlayerComponent (computer)

## Folder Structure

```
/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
│
├── src/
│   ├── main.ts                   # Entry point
│   ├── app.ts                    # Main application
│   ├── game-controller.ts        # Sets up ECS and game loop
│   │
│   ├── Components/
│   │   ├── BoardComponent.ts
│   │   ├── PlayerComponent.ts
│   │   ├── TurnComponent.ts
│   │   ├── GameStateComponent.ts
│   │   ├── ScoreComponent.ts
│   │   └── RenderComponent.ts
│   │
│   ├── Processors/
│   │   ├── GameStateProcessor.ts
│   │   ├── TurnProcessor.ts
│   │   ├── WinCheckProcessor.ts
│   │   ├── InputProcessor.ts
│   │   ├── AIProcessor.ts
│   │   └── RenderProcessor.ts
│   │
│   ├── Entities/
│   │   ├── Game.ts
│   │   ├── Board.ts
│   │   ├── Player.ts
│   │   └── Computer.ts
│   │
│   ├── utils/
│   │   ├── canvas.ts             # Canvas utility functions
│   │   └── game-logic.ts         # Pure game logic functions
│   │
│   └── ui/
│       └── GameCanvas.ts         # Lit component for the canvas
│
```

## Implementation Approach

1. Set up the project with Vite, Lit, and TypeScript
2. Install the javascript-entity-component-system package
3. Implement the components first (data structures) with tests
4. Implement the processors (game logic) with tests
5. Create entity factories with tests
6. Implement the game controller with the main loop with tests
7. Create the UI with HTML canvas with tests
8. Implement tests for components and processors with tests
9. Refine the AI algorithm with tests

## AI Strategy

The AI will use a rule-based strategy, applying rules in priority order:

1. **Win if Possible**: If there is a move that completes three in a row, take it immediately to win.
2. **Block Opponent's Win**: If the opponent has two in a row and an empty square would complete three, block that move.
3. **Create a Fork**: If possible, make a move that creates two simultaneous threats to win on the next turn (a fork).
4. **Block Opponent's Fork**: If the opponent can create a fork, block it. If multiple blocking options exist, choose one that also creates your own opportunity.
5. **Take the Center**: If the center square is open, take it. This is especially strong when the computer goes second.
6. **Play Opposite Corner**: If the opponent is in a corner, play the opposite corner if available.
7. **Take an Empty Corner**: If one or more corners are free, take one.
8. **Take an Empty Side**: If corners and center are occupied, take a side square.

This approach implements a "perfect play" strategy that should never lose and will always win when possible.

## Testing Strategy

- Use Vitest for testing
- Co-locate test files with source files
- Minimize use of mocks
- Test components without mocks
- Use functional programming for testable pure functions
- Test processors with simulated entities and components

## Functional Programming Approach

- Use pure functions where possible
- Minimize side effects
- Use immutable data patterns
- Separate logic from side effects
- Model state transitions explicitly 
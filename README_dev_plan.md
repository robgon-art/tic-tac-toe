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

1. **RenderProcessor**
   - Draws the board, grid lines, and X/O marks
   - Renders win lines and game state information

2. **InputProcessor**
   - Handles user clicks on the board
   - Validates input and updates board state

3. **TurnProcessor**
   - Manages turn switching between players
   - Tracks whose turn it is to go first in new games

4. **WinCheckProcessor**
   - Checks for win conditions after each move
   - Detects draw situations

5. **AIProcessor**
   - Determines computer's moves
   - Implements simple AI strategy

6. **GameStateProcessor**
   - Handles transitions between game states
   - Manages game reset and new game creation

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
│   │   ├── RenderComponent.ts
│   │   └── index.ts              # Exports all components
│   │
│   ├── Processors/
│   │   ├── RenderProcessor.ts
│   │   ├── InputProcessor.ts
│   │   ├── TurnProcessor.ts
│   │   ├── WinCheckProcessor.ts
│   │   ├── AIProcessor.ts
│   │   ├── GameStateProcessor.ts
│   │   └── index.ts              # Exports all processors
│   │
│   ├── Entities/
│   │   ├── Game.ts
│   │   ├── Board.ts
│   │   ├── Player.ts
│   │   ├── Computer.ts
│   │   └── index.ts              # Exports all entity factories
│   │
│   ├── utils/
│   │   ├── canvas.ts             # Canvas utility functions
│   │   └── game-logic.ts         # Pure game logic functions
│   │
│   └── ui/
│       └── GameCanvas.ts         # Lit component for the canvas
│
└── tests/
    ├── Components/               # Tests for components
    ├── Processors/               # Tests for processors
    └── utils/                    # Tests for utility functions
```

## Implementation Approach

1. Set up the project with Vite, Lit, and TypeScript
2. Install the javascript-entity-component-system package
3. Implement the components first (data structures)
4. Implement the processors (game logic)
5. Create entity factories
6. Implement the game controller with the main loop
7. Create the UI with HTML canvas
8. Implement tests for components and processors
9. Refine the AI algorithm

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
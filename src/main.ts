import { createApp, resizeCanvas } from './app.js';

/**
 * Creates and configures the game canvas element
 * @returns The configured canvas element
 */
function createGameCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 300;
    canvas.height = 300;
    return canvas;
}

/**
 * Creates the game UI elements
 * @returns Object containing UI elements
 */
function createGameUI() {
    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.className = 'game-container';

    // Create canvas
    const canvas = createGameCanvas();
    gameContainer.appendChild(canvas);

    // Create scoreboard
    const scoreboard = document.createElement('div');
    scoreboard.id = 'scoreboard';
    scoreboard.className = 'scoreboard';
    scoreboard.innerHTML = `
    <div class="score-item">
      <span class="label">Player (X):</span> 
      <span id="player-score">0</span>
    </div>
    <div class="score-item">
      <span class="label">Ties:</span> 
      <span id="ties-score">0</span>
    </div>
    <div class="score-item">
      <span class="label">Computer (O):</span> 
      <span id="computer-score">0</span>
    </div>
  `;
    gameContainer.appendChild(scoreboard);

    // Create game status
    const status = document.createElement('div');
    status.id = 'game-status';
    status.className = 'game-status';
    status.textContent = 'Game Ready';
    gameContainer.appendChild(status);

    // Create game controls
    const controls = document.createElement('div');
    controls.id = 'game-controls';
    controls.className = 'game-controls';

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.textContent = 'Reset Game';
    controls.appendChild(resetButton);

    gameContainer.appendChild(controls);

    return {
        container: gameContainer,
        canvas,
        scoreboard,
        status,
        controls,
        resetButton
    };
}

/**
 * Initializes the application
 */
function initializeApp() {
    // Create UI elements
    const ui = createGameUI();

    // Add to document
    const root = document.getElementById('app');
    if (root) {
        root.appendChild(ui.container);
    } else {
        document.body.appendChild(ui.container);
    }

    // Initialize game
    const app = createApp(ui.canvas);

    // Connect reset button
    ui.resetButton.addEventListener('click', () => {
        app.resetGame();
        updateStatus('Game Reset');
    });

    // Handle canvas clicks
    ui.canvas.addEventListener('click', (event) => {
        const rect = ui.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        app.handleClick(x, y);
    });

    // Update score display
    app.onScoreChange = (playerScore: number, ties: number, computerScore: number) => {
        document.getElementById('player-score')!.textContent = playerScore.toString();
        document.getElementById('ties-score')!.textContent = ties.toString();
        document.getElementById('computer-score')!.textContent = computerScore.toString();
    };

    // Update game status 
    app.onGameStateChange = (state: string) => {
        updateStatus(state);
    };

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas(ui.canvas);
    });

    // Initial resize
    resizeCanvas(ui.canvas);

    // Start game
    app.startGame();
}

/**
 * Updates the game status display
 * @param status Status message to display
 */
function updateStatus(status: string) {
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
        statusElement.textContent = status;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp); 
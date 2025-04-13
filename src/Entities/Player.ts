import { Entity, EntityComponentSystem } from 'javascript-entity-component-system';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

/**
 * Interface for options when creating a Player entity
 */
export interface PlayerOptions {
    /** Player type (human or computer) */
    playerType?: PlayerType;
}

/**
 * Creates a Player entity
 * 
 * This is a pure factory function that creates a Player entity with
 * the required components. It doesn't register the entity with the ECS.
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the player (optional)
 * @returns A new Player entity
 */
export function createPlayerEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Player',
    options: PlayerOptions = {}
): Entity {
    // Create the entity first
    const entity = ecs.createEntity(entityName, [], []);

    // Create the player component with custom values
    const playerType = options.playerType || PlayerType.Human;

    // Symbol is determined by player type
    const symbol = playerType === PlayerType.Human ? CellValue.X : CellValue.O;

    // Create a fresh component each time
    const playerComponent = new PlayerComponent(playerType, symbol);

    // Important: Add component to the ECS system
    ecs.addComponent(playerComponent);

    // Associate component with the entity
    ecs.addComponentToEntity(entity, 'PlayerComponent');

    return entity;
}

/**
 * Factory function that creates and registers a Player entity in the ECS
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the player (optional)
 * @returns The created Player entity
 */
export function createAndRegisterPlayerEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Player',
    options: PlayerOptions = {}
): Entity {
    const playerEntity = createPlayerEntity(ecs, entityName, options);
    ecs.addEntity(playerEntity);
    return playerEntity;
}

/**
 * Creates a human player entity
 * 
 * @param ecs The Entity Component System instance
 * @returns A new human Player entity
 */
export function createHumanPlayer(
    ecs: EntityComponentSystem
): Entity {
    return createAndRegisterPlayerEntity(ecs, 'HumanPlayer', {
        playerType: PlayerType.Human
    });
}

/**
 * Creates a computer player entity
 * 
 * @param ecs The Entity Component System instance
 * @returns A new computer Player entity
 */
export function createComputerPlayer(
    ecs: EntityComponentSystem
): Entity {
    // Use the general function with computer-specific settings
    return createAndRegisterPlayerEntity(ecs, 'ComputerPlayer', {
        playerType: PlayerType.Computer
    });
}

/**
 * Get the player component from a player entity
 * 
 * @param ecs The Entity Component System instance
 * @param playerEntity The player entity
 * @returns The PlayerComponent or undefined if not found
 */
export function getPlayerComponent(
    ecs: EntityComponentSystem,
    playerEntity: Entity
): PlayerComponent | undefined {
    const components = ecs.getEntityComponents(playerEntity, ['PlayerComponent']);
    return components.find(c => c.name === 'PlayerComponent') as PlayerComponent | undefined;
}

/**
 * Check if an entity is a human player
 * 
 * @param ecs The Entity Component System instance
 * @param playerEntity The player entity
 * @returns True if the entity is a human player
 */
export function isHumanPlayer(
    ecs: EntityComponentSystem,
    playerEntity: Entity
): boolean {
    const playerComponent = getPlayerComponent(ecs, playerEntity);
    return playerComponent?.state.playerType === PlayerType.Human || false;
}

/**
 * Check if an entity is a computer player
 * 
 * @param ecs The Entity Component System instance
 * @param playerEntity The player entity
 * @returns True if the entity is a computer player
 */
export function isComputerPlayer(
    ecs: EntityComponentSystem,
    playerEntity: Entity
): boolean {
    const playerComponent = getPlayerComponent(ecs, playerEntity);
    return playerComponent?.state.playerType === PlayerType.Computer || false;
}

/**
 * Get the symbol of a player entity
 * 
 * @param ecs The Entity Component System instance
 * @param playerEntity The player entity
 * @returns The player's symbol or Empty if not found
 */
export function getPlayerSymbol(
    ecs: EntityComponentSystem,
    playerEntity: Entity
): CellValue {
    const playerComponent = getPlayerComponent(ecs, playerEntity);
    return playerComponent?.state.symbol || CellValue.Empty;
} 
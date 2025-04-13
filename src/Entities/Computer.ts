import { Entity, EntityComponentSystem } from 'javascript-entity-component-system';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

/**
 * Interface for options when creating a Computer entity
 */
export interface ComputerOptions {
    /** Custom difficulty level (future enhancement) */
    difficulty?: string;
}

/**
 * Creates a Computer entity
 * 
 * This is a pure factory function that creates a Computer entity with
 * the required components. It doesn't register the entity with the ECS.
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the computer (optional)
 * @returns A new Computer entity
 */
export function createComputerEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Computer',
    options: ComputerOptions = {}
): Entity {
    // Create the entity first
    const entity = ecs.createEntity(entityName, [], []);

    // Computer always uses PlayerType.Computer and O symbol
    const playerComponent = new PlayerComponent(PlayerType.Computer, CellValue.O);

    // Save options for future use if needed
    if (options.difficulty) {
        playerComponent.state.difficulty = options.difficulty;
    }

    // Important: Add component to the ECS system
    ecs.addComponent(playerComponent);

    // Associate component with the entity
    ecs.addComponentToEntity(entity, 'PlayerComponent');

    return entity;
}

/**
 * Factory function that creates and registers a Computer entity in the ECS
 * 
 * @param ecs The Entity Component System instance
 * @param entityName Custom name for the entity (optional)
 * @param options Custom options for the computer (optional)
 * @returns The created Computer entity
 */
export function createAndRegisterComputerEntity(
    ecs: EntityComponentSystem,
    entityName: string = 'Computer',
    options: ComputerOptions = {}
): Entity {
    const computerEntity = createComputerEntity(ecs, entityName, options);
    ecs.addEntity(computerEntity);
    return computerEntity;
}

/**
 * Get the player component from a computer entity
 * 
 * @param ecs The Entity Component System instance
 * @param computerEntity The computer entity
 * @returns The PlayerComponent or undefined if not found
 */
export function getComputerComponent(
    ecs: EntityComponentSystem,
    computerEntity: Entity
): PlayerComponent | undefined {
    const components = ecs.getEntityComponents(computerEntity, ['PlayerComponent']);
    return components.find(c => c.name === 'PlayerComponent') as PlayerComponent | undefined;
}

/**
 * Get the symbol of a computer entity
 * 
 * @param ecs The Entity Component System instance
 * @param computerEntity The computer entity
 * @returns The computer's symbol or Empty if not found
 */
export function getComputerSymbol(
    ecs: EntityComponentSystem,
    computerEntity: Entity
): CellValue {
    const playerComponent = getComputerComponent(ecs, computerEntity);
    return playerComponent?.state.symbol || CellValue.Empty;
}

/**
 * Check if a player component belongs to the computer
 * 
 * @param playerComponent The player component to check
 * @returns True if the component is a computer player
 */
export function isComputerPlayer(playerComponent: PlayerComponent): boolean {
    return playerComponent.state.playerType === PlayerType.Computer;
} 
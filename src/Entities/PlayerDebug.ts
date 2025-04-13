import { EntityComponentSystem } from 'javascript-entity-component-system';
import { PlayerComponent, PlayerType } from '../Components/PlayerComponent';
import { CellValue } from '../Components/BoardComponent';

/**
 * This file is for debugging the PlayerComponent with ECS
 */

// Create a standalone function to test component creation and association
export function testPlayerComponents(): void {
    // Create a new ECS instance
    const ecs = new EntityComponentSystem();

    // Create X player component
    console.log('Creating X player component');
    const xComponent = new PlayerComponent(PlayerType.Computer, CellValue.X);
    console.log('X component initial state:', xComponent.state);

    // Add to ECS
    ecs.addComponent(xComponent);

    // Create entity
    console.log('Creating entity with X component');
    const entity = ecs.createEntity('TestPlayer', ['PlayerComponent'], []);

    // Add entity to ECS
    ecs.addEntity(entity);

    // Get components
    console.log('Getting components from entity');
    const components = ecs.getEntityComponents(entity, ['PlayerComponent']);
    console.log('Retrieved components count:', components.length);

    if (components.length > 0) {
        console.log('Retrieved component state:', components[0].state);
    }
} 
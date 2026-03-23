## Project Title

## GBDA302 Week 9 Side Quest: Reflective Blob Platformer (Debug HUD and Bonus Level)

## Authors

Starter code provided by Dr. Karen Cochrane and David Han
Modified and extended by Jowan Manjooran Jomon

---

## Description

This project builds on the Week 6 blob platformer and extends it with a toggleable debug system and a second bonus level.

The player controls a small character navigating a side-scrolling world with collectibles, enemies, and hazards. The game now includes:

Debug HUD: Toggleable overlay for live game information, including player position, velocity, health, score, active enemies, collectibles, and event logs. Hitboxes for the player, enemies, and collectibles can be visualized to aid testing.
Level Management: The game now supports multiple levels. Completing the first level transitions to a second bonus level with unique layout, enemies, and collectibles.
Audio Integration: Background music and sound effects are present in both levels. Sounds are tied to player actions, collisions, and events.
Modular Architecture: Levels, physics, collectibles, enemies, and rendering remain modular. JSON configuration files control level layout, physics, and spawn points, allowing flexible environment changes without modifying core code.

These additions enhance gameplay testing and expand the platformer experience while keeping the structured design from previous assignments.

---

## Learning Goals

Learning Goals:

- - Implement a toggleable debug HUD to visualize game state and hitboxes
- - Add a second playable level with unique layout, enemies, and collectibles
- - Maintain modular level design and transition logic
- - Implement sprite sheet animations for characters and objects
- - Use tilesets for environment graphics
- - Add and connect sound effects and background music to gameplay events
- - Use event-driven programming to track game actions
- - Load and parse level data from JSON files
- - Structure a p5.js project with clear separation between world logic, rendering, and system modules
    Assets

---

## Assets

The following external assets were used:

Sprite Sheets

- - Player character sprite sheet(Blob) - https://craftpix.net/freebies/free-slime-sprite-sheets-pixel-art/
- - Enemy sprite sheet(Slime Mobs) - https://craftpix.net/freebies/free-slime-sprite-sheets-pixel-art/
- - Leaf collectible sprite sheet - https://craftpix.net/freebies/free-slime-mobs-pixel-art-top-down-sprite-pack/

Tileset - https://craftpix.net/freebies/free-green-zone-tileset-pixel-art/

- - Ground tiles
- - Platform tiles
- - Wall tiles

Sound Effects

- - Jump sound
- - Attack sound - https://mixkit.co/free-sound-effects/discover/attacck/
- - Item collection sound
- - Damage sound

Background music
Background music used for gameplay atmosphere already provided

All assets used are free or educational-use assets and are credited to their original creators.

## GenAI

Starter code was provided by Dr. Karen Cochrane and David Han.

- - Generative AI tools were used to support the development process by:
- - helping understand the structure of the provided starter code
- - assisting with debugging sprite loading and animation configuration
- - explaining how JSON configuration files interact with the game systems
- - helping integrate sound effects through the event-driven architecture
- - clarifying how different modules in the project communicate with each other

All final implementation decisions and integration were completed by the author.

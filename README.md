## Project Title

## GBDA302 Week 9 Side Quest: Reflective Blob Platformer Debug Screen

## Authors

Starter code provided by Dr. Karen Cochrane and David Han
Modified and extended by Jowan Manjooran Jomon

---

## Description

This project builds on the Week 6 blob platformer and extends it with a toggleable debug system.

The player controls a small character navigating a side-scrolling world with collectibles, enemies, and hazards. The game includes:

Debug HUD: A toggleable overlay that displays live game information such as player position, velocity, health, score, active enemies, collectibles, and recent event logs. Hitboxes for the player, enemies, and collectibles can also be visualized to support collision testing.

Audio Integration: Background music and sound effects are connected to gameplay events such as jumping, collecting items, and taking damage.

Modular Architecture: The game uses a modular structure where systems such as input, camera, sound, and gameplay logic are separated. JSON configuration files control level setup and behavior, allowing flexible changes without modifying core code.

## These additions improve testing, debugging, and overall clarity of the gameplay experience.

## Controls

Arrow Keys / WASD – Move
Space – Jump
D – Toggle Debug HUD

## Learning Goals

- - Implement a toggleable debug HUD to visualize game state and hitboxes
- - Maintain modular game structure and system separation
- - Implement sprite sheet animations for characters and objects
- - Use tilesets for environment graphics
- - Add and connect sound effects and background music to gameplay events
- - Use event-driven programming to track game actions
- - Load and parse level data from JSON files
- - Structure a p5.js project with clear separation between world logic, rendering, and system modules

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

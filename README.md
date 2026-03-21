## Project Title

## GBDA302 Week 6 Side Quest: Reflective Blob Platformer (Sprites, Tiles, and Sound)

## Authors

Starter code provided by Dr. Karen Cochrane and David Han
Modified and extended by Jowan Manjooran Jomon

---

## Description

This project builds on the earlier blob platformer framework and expands it with visual and audio improvements. The game now uses custom sprite sheets, a tileset for the environment, and multiple sound effects to create a more immersive experience.

The player controls a small character that explores a side-scrolling world larger than the screen. A smooth camera follows the player through the environment while collectibles are scattered across the level. The goal is to move through the world, avoid hazards, defeat enemies, and collect all hidden symbols.

The game world is defined using JSON configuration files, which control level layout, physics settings, collectible locations, and other gameplay parameters. This allows the game environment to be easily modified without changing the core code.

Custom sprite sheets are used for the player character, enemies, collectibles, and environmental tiles. Sound effects have been added for actions such as jumping, attacking, collecting items, and taking damage. A looping background track plays during gameplay to reinforce atmosphere.

Together, these additions make the platformer feel more dynamic while maintaining the structured architecture introduced in previous assignments.

---

## Learning Goals

Learning Goals:

- - Load and parse level data from JSON files
- - Define and render a tile-based platformer level
- - Implement sprite sheet animations for characters and objects
- - Replace default graphics with a custom tileset
- - Hide small interactive symbols for the camera and player to discover
- - Add sound effects and background music
- - Connect gameplay events to sound using an event-driven system
- - Structure a p5.js project using modular classes such as
- - Maintain separation between world logic, system modules, and rendering

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

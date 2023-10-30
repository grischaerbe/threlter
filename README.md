[![OG](https://user-images.githubusercontent.com/46897060/232580867-88e8d414-6b9b-45d1-93cc-5777538a4b11.png)](https://threltemania.xyz)

### [**threltemania.xyz**](https://threltemania.xyz)

Threltemania is a racing game that defies physics.

## Motivation

It is a bit of a tradition to celebrate new versions of [Threlte](https://next.threlte.xyz) with a small game that not only is superb promotional material, but also is used to test every aspect of all moving parts of the Threlte ecosystem.

Threlte 6 is a special release. Threlte is transitioning towards a clear separation of concerns: `@threlte/core` as a way to declaratively use [Three.js](https://threejs.org/) and other packages such as `@threlte/extras` with useful abstractions and `@threlte/rapier` to easily integrate the exceptional [Rapier physics engine](https://rapier.rs/).

The next version is called "Threlte v6" and what better way is there to celebrate that than with a V6? – I'll see myself out.

## Features

- 👑 [**Campaign**](https://threltemania.xyz/menu/campaign): _Official tracks_ to race against the clock and win medals.
- 👤 [**User Tracks**](https://threltemania.xyz/menu/explore): Race on tracks built by other players.
- 🛠️ **Track Editor**: Build and share your own tracks and compete against your friends.

## "Technical" Features

- Options allow for a customized game experience
- Keyboard navigation to navigate the whole game via keyboard
- Game UI implemented in Svelte
- Game mechanics implemented in [Threlte v6](https://next.threlte.xyz)

## Technical Outline

Threltemania holds many different interesting aspects, technically challenging topics and goodies. Here's a rough outline:

- Raycast Vehicle Controller: As opposed to a vehicle controller that is based on many "rigid bodies" that are connected via "joints", this arcade-style vehicle controller is implemented with an approach that lends concepts from this [implementation overview](https://digitalrune.github.io/DigitalRune-Documentation/html/143af493-329d-408f-975d-e63625646f2f.htm) and this [excellent talk](https://www.youtube.com/watch?v=LG1CtlFRmpU), however it's a mix of the over-simplification of the latter and the close-to-simulation approach of the former. The implementation details can be found [here](https://github.com/grischaerbe/threlter/blob/hackathon/src/components/Car/RaycastVehicleController/RaycastVehicleController.svelte). [Aktivate the debug mode](https://threltemania.xyz/menu/options) to see how the physics are modelled.
- Keyboard navigation: As it is with many games, the game Threltemania can be controlled with only the keyboard. This makes it feel more like a game and less like a regular website.
- URL Statemanagement: When a game is started, it typically starts from the very beginning. The web as a platform provides a very powerful statemanagement tool: The URL. SvelteKit's routing is used to determine the current app state. This means that reloading the page will get you where you left off.
- The perfect tool for the job: Svelte components make managing Three.js objects a breeze. Slot props – one of my favorite features – allow truely magical component compositions. The component lifecycle is used to never miss the disposal of an object.
- DOM UI and Three.js objects side by side: In game development, the management of UI is always a bit of a pain because UI normally cannot be co-located with actual gameplay elements. The web provides the ultimate UI-engine: the DOM. Using Svelte [_portals_](https://github.com/grischaerbe/threlter/blob/hackathon/src/components/Utilities/DomPortal.svelte), the UI can be placed next to actual Three.js objects and allows for ultra-transparent game and UI state references.

This outline does not contain the work that has gone into Threlte v6. If you want to learn more about the upcoming version of Threlte, [visit the Documentation](https://next.threlte.xyz) or [join our Discord community](https://discord.gg/EqUBCfCaGm).

## Demo Video

https://user-images.githubusercontent.com/46897060/232627678-a423de2d-bb05-43f6-82b4-b6be9c2d61e9.mp4

## Screenshots

- Main Menu

![hack threltemania xyz_menu_main](https://user-images.githubusercontent.com/46897060/232592157-89ef64dc-e511-444e-a3b9-5cad26401a7b.png)

- Track Selection

![localhost_5173_](https://user-images.githubusercontent.com/46897060/232592204-1b7f39f8-bc69-4b07-8ac7-1690c5401c3d.png)

- On-Track Intro

![localhost_5173_campaign_Track-o5of60o_time-attack](https://user-images.githubusercontent.com/46897060/232592247-61e70a5e-f652-44bd-9575-0fc165535eac.png)

- Track Editor

![localhost_5173_campaign_Track-o5of60o_time-attack (2)](https://user-images.githubusercontent.com/46897060/232592286-e40fd7bd-f9d3-4b9e-ada8-02e2eb71520f.png)

- Track Element Transformation

![localhost_5173_campaign_Track-o5of60o_time-attack (5)](https://user-images.githubusercontent.com/46897060/232592393-fd82909c-4e10-4f31-a5c9-47298fc2e31c.png)

- Track Editor Info

![localhost_5173_campaign_Track-o5of60o_time-attack (3)](https://user-images.githubusercontent.com/46897060/232592329-a9727709-303f-4892-8659-de3be17cc3e5.png)

- Track validation

![localhost_5173_campaign_Track-o5of60o_time-attack (4)](https://user-images.githubusercontent.com/46897060/232592434-a1a48238-6a44-4ce6-90c5-050801c475ff.png)

## Known Issues

- The physics are arguably the hardest part to get right. Rapier allows for deterministic physics, but the vehicle controller is not ready for that yet. This means that no two runs are the same (even if the inputs are) and the tracks should not be too fast paced.
- Responsiveness. This game is best played on a decently-sized screen.
- Safari sometimes (rarely) hangs on loading without any clear reason.

## Roadmap

- Deterministic physics
- Responsive UI
- UI transitions
- Back-porting the vehicle controller to a Svelte component available at `@threlte/rapier`
- Creation of more owned assets
- Multiplayer
- Some game-related mechanics: Auto-reset after falling off, …
- More campaign tracks
- A track-making challenge for the release of Threlte v6
- Maybe add a little bit of storytelling to it

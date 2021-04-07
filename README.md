# PlayingWithFirePhaser
 
Clone of the flash game ["Playing With Fire"](https://www.crazygames.com/game/playing-with-fire-2), made with [Phaser 3](https://phaser.io/).

The standalone version is launched as an electron application. It can also be played on [my homepage](https://tobias.eu.ngrok.io/playingwithfire/playingwithfire.html).

![Demo](demo.gif)

# Launching
`cd Standalone`

`npm install`

`npm run start`




# Networked multiplayer
The project also includes a networked version, however this is still very buggy and difficult to start. 
The host starts a single instance of the game, and players join by opening the game in their browser (port 3000). 

Communication uses [Socket.io](https://socket.io/). The client instances send keystrokes to the host using the "toserver namespace" namespace, while the host simulates the game sends updates to the game state using the "toclient" namespace. As noted, this feature is not finished, and the system only works if clients connect at the right time.


# Todo

1. Send full gamestate to new clients that connect.
2. Create seperate icons for powerups.
3. Prevent players from taking damage by running through boxes that are exploding.
4. Make simulation purely server side, to allow for multiple multiplayer instances.
5. Create lobbies.

## Assets:

RPG sprite set by [Antifarena on OpenGameArt](https://opengameart.org/content/antifareas-rpg-sprite-set-1-enlarged-w-transparent-background)


Core code, and some assets taken from the[https://phaser.io/tutorials/making-your-first-phaser-3-game](Phaser 3 tutorial)

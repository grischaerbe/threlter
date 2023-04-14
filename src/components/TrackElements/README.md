# Track Elements

Track Elements can be any object that can be placed in the track. They are
designed to be used with the integrated track editor and can emit events
when the player interacts with them:

- `on:checkpointreached`
	- This event needs to be emitted from Elements that are used as checkpoints. Their name must start with "Checkpoint".
- `on:finishreached`
	- There can be many finish elements in the track. A finish is only reached when the player has reached all checkpoints before it.

On top of that, an element MUST emit a `load` event when it is loaded.

# teJS
Web based 2D Game Engine

I wrote teJS as a fun project. But, it turns out to be something interesting.
So I have decided to build a GUI for it and make it available on web so anyone can
create and share small 2D games.

This README includes the documentation for the teJS library, not the web app.

## API

- Classes
   1. Scene

### Scene
`Scene` contains all the sprites, functionalities of your Game. You can create multiple levels with multiple scenes.
Although, that's not what's it meant to be.

#### Usage
First, create a HTML canvas element. Then, pass the element as the only one property. 

```html
<canvas id="gScene"></canvas>
```

```javascript
const c = document.getElementById('gScene')
const scene = new Scene(c)
```

Now, you can create your cool game and run it in your scene.

#### Methods
teJS simplifies the process of doing the basic things of game development. Besides, it 
optimizes the codebase to improve performance. So, you have control over low-level tasks 
yet things are done in a faster and easier way. 

These are all the available methods that you can use -

1. newRect
2. newTexture
3. newSprite
4. getObjectProperties
5. getAllGameObjects

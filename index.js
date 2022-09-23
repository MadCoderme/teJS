const collisionEvent = (props) =>
              new CustomEvent('collision', { detail: props })
    
class Scene {
     
     constructor(canvas) {
         this.gameObjects = []
         this.collisionObjects = []
         this.canvas = canvas
         this.ctx = canvas.getContext('2d')
         
         this.ctx.clearRect(0,0,300,300)
         
         const clickEvent = (props) => 
             new CustomEvent('gameObjectClicked', 
                 { detail: { index: props } })
         
         canvas.addEventListener('click', (event) => { 
             this.gameObjects.map((obj, i) => {
                 if(event.offsetX >= obj.x 
                 && event.offsetY >= obj.y 
                 && event.offsetX <= (obj.x + obj.w) 
                 && event.offsetY <= (obj.y + obj.h)
                 ) { 
                 document.dispatchEvent(clickEvent(i))
              }
             })
         });
         
         this.checkCollision()
         window.requestAnimationFrame(()=> this.draw())
     }
     
     draw() {
         this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
       
         for(let i=0;i < this.gameObjects.length; i++){
             
             this.drawObjects(i)
             
         }
         
         setTimeout(()=>
             window.requestAnimationFrame(()=>this.draw()), 13)         
     }
     
     drawObjects (i){
         //let s = +new Date
         const { x, y, w, h, animationStopped, texture,
             vx, vy, tPos, color, text, font,
              resolve} = this.gameObjects[i]
         
         if(animationStopped == false) {
             if(parseInt(x) == tPos.x 
                 && parseInt(y) == tPos.y) {
               resolve()
               
               this.gameObjects[i].tPos = {}
               this.gameObjects[i].animationStopped = true
             }
             
             let xDiff = Math.round(vx /10)
             let yDiff = Math.round(vy /10)
             
             if(Math.abs(this.gameObjects[i].x - tPos.x) < xDiff) {
                     this.gameObjects[i].x = tPos.x
                 
             }
             
             if(Math.abs(this.gameObjects[i].y - tPos.y) < yDiff) {
                     this.gameObjects[i].y = tPos.y
                 
             }
             
             if(this.gameObjects[i].x < tPos.x) {
                 this.gameObjects[i].x += xDiff
             } else if(this.gameObjects[i].x > tPos.x) {
                 this.gameObjects[i].x -= xDiff
             }
       
             if(this.gameObjects[i].y < tPos.y) {
                this.gameObjects[i].y += yDiff
             } else if(this.gameObjects[i].y > tPos.y) {
                this.gameObjects[i].y -= yDiff
             }
    
         }
         
         if(texture) {
         
             w&&h? this.ctx.drawImage(texture, x, y, w, h) 
             : this.ctx.drawImage(texture, x, y) 
         
         } else if(text) {
             this.ctx.font = font
             this.ctx.fillText(text, x, y)
             this.ctx.font = ""
         } else {
         
         color? this.ctx.fillStyle = color : null
        
        
         this.ctx.fillRect(this.gameObjects[i].x,
             this.gameObjects[i].y,w,h)
         this.ctx.fillStyle = "black"
         
         }
         
       //  let e = +new Date
       //  console.log(e-s)
         
     }
     
     newTexture(uri) { 
         let img = new Image() 
         img.src = uri 
         return img 
     }
     
     newSprite(texture, x, y, w, h) { 
          this.gameObjects.push({texture, x, y, w, h}) 
          return this.gameObjects.length - 1
     }
     
     newRect(w, h, x, y, color) {
         
         this.gameObjects.push({w, h, x, y, color})
        
         return this.gameObjects.length - 1
     }
     
     newText(text, font, x, y) {
         this.gameObjects.push({text, font, x, y})
         return this.gameObjects.length - 1
     }
     
     updateText (index, text) {
         this.gameObjects[index].text = text
     }
     
     getTextValue(index) {
         const obj = this.gameObjects[index] 
         return obj.text
     }
     
     getProperties(index) {
         return this.gameObjects[index]
     }
     
     setSize(index, w, h) {
         this.gameObjects[index].w = w
         this.gameObjects[index].h = h
     }
     
     
     setPosition(index, x, y) {
       const obj = this.gameObjects[index] 
       
       this.gameObjects[index].x = x
       this.gameObjects[index].y = y
       
     }
     
     destroyObject(index) {
         const obj = this.gameObjects[index] 
         this.ctx.clearRect(obj.x, obj.y, obj.w, obj.h)
         this.gameObjects.splice(index, 1)
     }
     
     addAcceleration(index, ax, ay) {
         
         let inter = setInterval(()=>{
             
             this.gameObjects[index].vx += ax
             this.gameObjects[index].vy += ay
             
         }, 200)
     }
     
     addForce(index, force) {
         this.gameObjects[index].velocity += force
         setTimeout(()=> {
               this.gameObjects[index].velocity -= force
         }, 500)
     }
     
     moveObject(index, endX, endY, vx, vy) {
     
     return new Promise((resolve) => {
         
         this.gameObjects[index].vx = vx
         this.gameObjects[index].vy = vy
         this.gameObjects[index].tPos = {x:endX, y:endY}
         
         
         this.gameObjects[index].resolve = resolve
         
         this.gameObjects[index].animationStopped = false
      
      })
     }
     
     stopAnimation(index) {
         this.gameObjects[index].animationStopped = true
     }
     
     
     startLinearAnimation(timestamp, obj, index, x, y) {
     
        if((timestamp - obj.lastTime) >= 16) {
      if(parseInt(obj.x) == x && parseInt(obj.y) == y) {
           obj.resolve()
           return 
       }
       
       if(obj.animationStopped) {
           obj.resolve()
           return
       }
       
       let prev = {x: obj.x, y: obj.y}
        
       if(this.gameObjects[index].x < x) {
         this.gameObjects[index].x += Math.round(obj.vx /10)
       } else if(this.gameObjects[index].x > x) {
         this.gameObjects[index].x -= Math.round(obj.vx/10)
       }
       
       if(this.gameObjects[index].y < y) {
         this.gameObjects[index].y += Math.round(obj.vy/10)
       } else if(this.gameObjects[index].y > y) {
         this.gameObjects[index].y -= Math.round(obj.vy /10)
       }
       

       
       this.ctx.clearRect(0,0, this.canvas.width, this.canvas.width)
       obj.color?  this.ctx.fillStyle = obj.color : null
       this.ctx.fillRect(obj.x, obj.y, obj.w, obj.h)              
       this.ctx.fillStyle = 'black'
      } 
      
      this.gameObjects[index].lastTime = +new Date
      
      window.requestAnimationFrame(() => this.startLinearAnimation(+new Date, this.gameObjects[index],
          index, x, y))  
             
     }
     
     
     enableCollision(obj1, obj2) {
         this.collisionObjects.push({obj1, obj2})
     }
     
     checkCollision () {
         setInterval(()=>{
         this.collisionObjects.map((el, i) => {
         
             let rect1 = this.gameObjects[el.obj1]
             let rect2 = this.gameObjects[el.obj2]
             
             
            // console.log(rect1, rect2)
             
             if(rect1.x <= rect2.x + rect2.w 
                 && rect1.x + rect1.w >= rect2.x
                 && rect1.y <= rect2.y + rect2.h 
                 && rect1.h + rect1.y >= rect2.y ) {
                     
                     if(!el.collided){
                      this.collisionObjects[i].collided = true
                      document.dispatchEvent(collisionEvent(el))
                     }
                 } else {
                     if(el.collided) {
                       this.collisionObjects[i].collided = false
                     }
                 }
         })
         }, 15)
     }
     
     getAllGameObjects() {
         return this.gameObjects
     }
    
}


window.addEventListener('DOMContentLoaded', (event) =>{


    
    let gravity = 0//.05//0//.03
    let friction = .99
    let pegged = 1
    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
     });

     let scrollsum = 0

     function MouseScroll (event) {
        var rolled = 0;
        if ('wheelDelta' in event) {
            rolled = event.wheelDelta;
        }
        else {  // Firefox
                // The measurement units of the detail and wheelDelta properties are different.
            rolled = -40 * event.detail;
        }
        
        // tutorial_canvas_context.scale(1+(rolled/1000),1+(rolled/1000))
        if(rolled > 0){
            // tutorial_canvas_context.translate(-70,-70)
        }else{
            // tutorial_canvas_context.translate(70,70)
        }
        // tutorial_canvas_context.translate((tutorial_canvas.width*(rolled/30000))/2,(tutorial_canvas.height*(rolled/30000))/2)
        // scrollsum+=(rolled/30000)
    }

    function Init () {
            // for mouse scrolling in Firefox
        var elem = document.getElementById ("infooverlay");
        // var elem = document.getElementById ("tutorial");
        if (elem.addEventListener) {    // all browsers except IE before version 9
                // Internet Explorer, Opera, Google Chrome and Safari
            elem.addEventListener ("mousewheel", MouseScroll, false);
                // Firefox
            elem.addEventListener ("DOMMouseScroll", MouseScroll, false);
        }
        else {
            if (elem.attachEvent) { // IE before version 9
                elem.attachEvent ("onmousewheel", MouseScroll);
            }
        }
    }

    Init()


   
    // function sclaescropp() {
    //     if (document.body.scrollTop > 1 || document.documentElement.scrollTop > 1) {
    //       tutorial_canvas_context.scale(.9,.9)
    //       tutorial_canvas_context.translate(70,70)
    //       document.body.scrollTop = 0
    //       document.documentElement.scrollTop = 0
    //     } else {
    //     }
    //     if (document.body.scrollTop < 0 || document.documentElement.scrollTop < 0) {
   
    //       tutorial_canvas_context.translate(70,70)
    //       document.body.scrollTop = 0
    //       document.documentElement.scrollTop = 0
    //     } else {
    //     }
    // }


    //  document.addEventListener('scroll', (event) => {

        
    //      tutorial_canvas_context.scale(.9,.9)
    //   });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');
    let infooverlay = document.getElementById("infooverlay");
    let infooverlay_context = infooverlay.getContext('2d');
    infooverlay.style.background = "transparent"
    infooverlay.style.marginTop = "-720px"
    tutorial_canvas.style.background = "#000000"



    let flex = tutorial_canvas.getBoundingClientRect();

    // Add the event listeners for mousedown, mousemove, and mouseup
    let tip = {}
    let xs
    let ys
    let tap = {}
    let xz
    let yz
   
   
    
    window.addEventListener('mousedown', e => {
       flex = tutorial_canvas.getBoundingClientRect();
   
   
       xs = e.clientX - flex.left;
       ys = e.clientY - flex.top;
         tip.x = xs
         tip.y = ys
   
         tip.body = tip


        dummypin.x=tip.x
        dummypin.y = tip.y
   
    //   window.addEventListener('mousemove', beamdrag);
    });
   
   

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }
    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){

            this.sxmom = 0
            this.symom = 0
            this.height = 0
            this.width = 0
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.xrepel = 0
            this.yrepel = 0
            this.lens = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }

        repelCheck(point){
            // console.log(point)
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (2*this.radius+point.radius)*(2*point.radius+this.radius)){
                return true
            }
            return false
        }
        unmove(){
             //friction
            //  if(this.x > tutorial_canvas.width){
            //     if(this.xmom > 0){
            //     this.xmom*=-1
            //     }
            // }
            // if(this.y > tutorial_canvas.height){
            //     if(this.ymom > 0){
            //     this.ymom*=-1
            //     }
            // }
            // if(this.x < 0){
            //     if(this.xmom < 0){
            //     this.xmom*=-1
            //     }
            // }
            // if(this.y < 0){
            //     if(this.ymom < 0){
            //         this.ymom*=-1
            //     }
            // }
            this.xmom/=.999
            this.ymom/=.999
            this.x -= this.xmom
            this.y -= this.ymom
        }
        drive(){



            this.x+=this.sxmom
            this.y+=this.symom 

            this.sxmom*=.98
            this.symom*=.98
        }
        move(){
            //friction
            // if(this.x > tutorial_canvas.width){
            //     if(this.xmom > 0){
            //     this.xmom*=-1
            //     }
            // }
            // if(this.y > tutorial_canvas.height){
            //     if(this.ymom > 0){
            //     this.ymom*=-1
            //     }
            // }
            // if(this.x < 0){
            //     if(this.xmom < 0){
            //     this.xmom*=-1
            //     }
            // }
            // if(this.y < 0){
            //     if(this.ymom < 0){
            //         this.ymom*=-1
            //     }
            // }
            this.xmom*=friction
            this.ymom*=friction
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }
    }
    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Spring{
        constructor(body = 0){
            if(body == 0){
                this.body = new Circle(350, 350, 5, "red",10,10)
                this.anchor = new Circle(this.body.x, this.body.y+5, 3, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
                this.length = 100
            }else{
                this.body = body
                this.length = .2
                this.anchor = new Circle(this.body.x-(this.length*40), this.body.y, 3, "red")
                this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            }

        }
        balance(){
            // this.length+=.005
            // if(this.length <=2){
            //     this.length = 2
            // }
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            let xmomentumaverage 
            let ymomentumaverage
            if(this.anchor != pin2 && this.anchor != pin3 && this.anchor != pin4 && this.anchor != pin5 ){

             xmomentumaverage = ((this.body.xmom*1.1)+this.anchor.xmom)/2.1
             ymomentumaverage = ((this.body.ymom*1.1)+this.anchor.ymom)/2.1
            }else{
                 xmomentumaverage = ((this.body.xmom)+this.anchor.xmom*1.1)/2.1
                 ymomentumaverage = ((this.body.ymom)+this.anchor.ymom*1.1)/2.1

            }

            // if(this.body != pin){

                if(this.anchor != pin2){
                    if(this.anchor != pin3){
                        if(this.anchor != pin4){
                            if(this.anchor != pin5){
                this.body.xmom = ((this.body.xmom)+xmomentumaverage)/2
                this.body.ymom = ((this.body.ymom)+ymomentumaverage)/2
                            }
                        }
                    }
                }
            // }

            if(this.body != pin){
                // if(this.anchor != pin2){
                //     if(this.anchor != pin3){
                //         if(this.anchor != pin4){
                    this.anchor.xmom = ((this.anchor.xmom)+xmomentumaverage)/2
                    this.anchor.ymom = ((this.anchor.ymom)+ymomentumaverage)/2
        //         }
        //     }
        // }
            }
                if(this.beam.hypotenuse() !=0){
            if(this.beam.hypotenuse() < this.length){
                // if(this.body != pin){
                this.body.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                this.body.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                // }

                // if(pegged == 1){
                //     if(this.anchor != pin2){
                //         this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/30
                //         this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/30
                //     }else{

                //         this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/30
                //         this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/30
                //     }
                // }else{
                    this.anchor.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                // }
            }else if(this.beam.hypotenuse() > this.length){

                // if(this.body != pin){
                this.body.xmom -= (this.body.x-this.anchor.x)/(this.length)/300
                this.body.ymom -= (this.body.y-this.anchor.y)/(this.length)/300
                // }

                // if(pegged == 1){
                //     if(this.anchor != pin2){
                //         this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/30
                //         this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/30
                //     }else{
                //         this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/30
                //         this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/30
                //     }
                // }else{
                    this.anchor.xmom += (this.body.x-this.anchor.x)/(this.length)/300
                    this.anchor.ymom += (this.body.y-this.anchor.y)/(this.length)/300
                // }
            }

        }
            // console.log(this)
        }
        draw(){
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", 5)
            this.beam.draw()
            this.body.draw()
            this.anchor.draw()
        }
        move(){
            // if(this.body !== pin){
                if(this.body != pin){

                    this.body.move()
                }
            // }
            // if(Math.random()<.01){
            //     this.anchor.xmom-=1
            // }
            // if(pegged == 1){
            //     if(this.anchor != pin2){
            //         this.anchor.ymom+=gravity
            if(this.anchor != pin2 && this.anchor != pin3 && this.anchor != pin4 && this.anchor != pin5 ){
                    this.anchor.move()
                        this.anchor.ymom+=gravity
            }
            //     }
            // }else{
            //     this.anchor.ymom+=gravity
            //     this.anchor.move()
            // }
        }

    }

    let springs = []


    let pin = new Circle(550,100, 10, "white")
    let pin2 = new Circle(100,100, 10, "red")
    let pin3 = new Circle(100,60, 10, "yellow")
    let pin4 = new Circle(100,200, 10, "blue")
    let pin5 = new Circle(400,200, 10, "#00FF00")
    let dummypin = new Circle(100,100, 10, "blue")
    let dummypin2 = new Circle(100,500, 10, "blue")
    let dummypin3= new Circle(100,500, 10, "blue")
    let dummypin4 = new Circle(100,100, 10, "blue")

    let spring = new Spring(pin)
    springs.push(spring)
    for(let k = 0; k<20;k++){
        spring = new Spring(spring.anchor)
        if(k < 19){
            springs.push(spring)
        }else{
            spring.anchor = pin2
            springs.push(spring)
        }
    }


    // spring = new Spring(springs[springs.length-11].body)
    // springs.push(spring)

    // springs[springs.length-11].body.color = "green"
    // springs[springs.length-11].body.radius =10
    spring = new Spring(springs[springs.length-10].body)
    springs.push(spring)
    for(let k = 0; k<10;k++){
        spring = new Spring(spring.anchor)
        if(k < 9){
            springs.push(spring)
        }else{
            spring.anchor = pin3
            springs.push(spring)
        }
    }

    spring = new Spring(springs[springs.length-20].body)
    springs.push(spring)
    for(let k = 0; k<10;k++){
        spring = new Spring(spring.anchor)
        if(k < 9){
            springs.push(spring)
        }else{
            spring.anchor = pin4
            springs.push(spring)
        }
    }

    spring = new Spring(springs[springs.length-30].body)
    springs.push(spring)
    for(let k = 0; k<10;k++){
        spring = new Spring(spring.anchor)
        if(k < 9){
            springs.push(spring)
        }else{
            spring.anchor = pin5
            springs.push(spring)
        }
    }


    pin3.x =  spring.body.x -(1*spring.length*20)+50
    pin4.x =  spring.body.x -(1*spring.length*20)+50
    pin2.x =  spring.body.x -(1*spring.length*20)
    pin2.y =  100 //spring.body.y
    
    let hstop = 0

    let counter = 0
    let pins = []
    pins.push(pin)
    pins.push(pin2)
    pins.push(pin3)
    pins.push(pin4)
    pins.push(pin5)

    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(-10000,-10000,tutorial_canvas.width*100, tutorial_canvas.height*100)
        infooverlay_context.clearRect(-10000,-10000,tutorial_canvas.width*100, tutorial_canvas.height*100)

        dummypin.draw()
        counter++
        hstop++
        // for(let t = 0; t<badsprings.length;t++){
        //     badsprings[t].balance()
        //     badsprings[t].draw()
        // }
        if(counter%275 < 55){
            keysPressed['i'] = true;
            keysPressed['j'] = false;
            keysPressed['l'] = false;
            keysPressed['k'] = false;
            keysPressed['n'] = false;
        }else if(counter%275 < 110){
            keysPressed['j'] = true;
            keysPressed['i'] = false;
            keysPressed['l'] = false;
            keysPressed['k'] = false;
            keysPressed['n'] = false;
        }else if(counter%275 < 165){
            keysPressed['j'] = false;
            keysPressed['i'] = false;
            keysPressed['l'] = true;
            keysPressed['k'] = false;
            keysPressed['n'] = false;
        }else if(counter%275 < 220){
            keysPressed['j'] = false;
            keysPressed['i'] = false;
            keysPressed['l'] = false;
            keysPressed['k'] = false;
            keysPressed['n'] = true;
        }else{
            keysPressed['j'] = false;
            keysPressed['i'] = false;
            keysPressed['l'] = false;
            keysPressed['k'] = true;
            keysPressed['n'] = false;
        }

        // if(keysPressed['k']){
        //     dummypin = pin
        //     pin = pin2
        //     pin2 = dummypin
        // }else if(keysPressed['l']){
        //     dummypin2 = pin
        //     pin = pin3
        //     pin3 = dummypin2
        // }else if(keysPressed['j']){
        //     dummypin3 = pin
        //     pin = pin4
        //     pin4 = dummypin3
        // }
        // if(!keysPressed[' '] && !keysPressed['j']&& !keysPressed['k'] && !keysPressed['l']){
        //     pin.xmom = 0
        //     pin.ymom = 0
        //     pin2.xmom = 0
        //     pin2.ymom = 0
        //     pin3.xmom = 0
        //     pin3.ymom = 0
        //     pin4.xmom = 0
        //     pin4.ymom = 0
        //     pin2.sxmom = 0
        //     pin2.symom = 0
        //     pin3.sxmom = 0
        //     pin3.symom = 0
        //     pin4.sxmom = 0
        //     pin4.symom = 0
        //     pin.sxmom = 0
        //     pin.symom = 0
        //     }

        // pin.draw()
        for(let s = 0; s<springs.length; s++){

            // pin.xmom = 0
            // pin.ymom = 0

           
        // if(!keysPressed[' '] && !keysPressed['j']&& !keysPressed['k'] && !keysPressed['l']){
        //     pin.xmom = 0
        //     pin.ymom = 0
        //     pin2.xmom = 0
        //     pin2.ymom = 0
        //     pin3.xmom = 0
        //     pin3.ymom = 0
        //     pin4.xmom = 0
        //     pin4.ymom = 0
        //     pin2.sxmom = 0
        //     pin2.symom = 0
        //     pin3.sxmom = 0
        //     pin3.symom = 0
        //     pin4.sxmom = 0
        //     pin4.symom = 0
        //     pin.sxmom = 0
        //     pin.symom = 0
        //     }
            if(pegged == 1){
            // pin2.xmom = 0
            // pin2.ymom = 0
            }else{
                // pin2.xmom *= .9
                // pin2.ymom *=.9
                }
            springs[s].balance()
            // pin.xmom = 0
            // pin.ymom = 0
            if(pegged == 1){
                // pin.xmom = 0
                // pin.ymom = 0
                // pin2.xmom = 0
                // pin2.ymom = 0
                // pin3.xmom = 0
                // pin3.ymom = 0
                // pin4.xmom = 0
                // pin4.ymom = 0

  
                // if(!keysPressed[' '] && !keysPressed['j']&& !keysPressed['k'] && !keysPressed['l']){
                //     pin.xmom = 0
                //     pin.ymom = 0
                //     pin2.xmom = 0
                //     pin2.ymom = 0
                //     pin3.xmom = 0
                //     pin3.ymom = 0
                //     pin4.xmom = 0
                //     pin4.ymom = 0
                //     pin2.sxmom = 0
                //     pin2.symom = 0
                //     pin3.sxmom = 0
                //     pin3.symom = 0
                //     pin4.sxmom = 0
                //     pin4.symom = 0
                //     pin.sxmom = 0
                //     pin.symom = 0
                //     }
            }else{
            // pin2.xmom *= .9
            // pin2.ymom *=.9
            }
            // springs[s].move()
            if(pegged == 1){
            // pin2.xmom = 0
            // pin2.ymom = 0
            }
            // springs[s].draw()
        }
        for(let s = 0; s<springs.length; s++){

            springs[s].move()
        }


        for(let  t= 0; t<pins.length;t++){
            for(let  k= 0; k<pins.length;k++){
                if(t!=k){
                    if(pins[t].repelCheck(pins[k])){
                        let distance = ((new Line(pins[k].x, pins[k].y, pins[t].x, pins[t].y, 1, "red")).hypotenuse())-(2*pins[k].radius+pins[t].radius)
                        let angleRadians = Math.atan2(pins[k].y - pins[t].y, pins[k].x - pins[t].x);
                        pins[t].xrepel += (Math.cos(angleRadians)*distance)/2
                        pins[t].yrepel += (Math.sin(angleRadians)*distance)/2
                        pins[k].xrepel += -(Math.cos(angleRadians)*distance)/2
                        pins[k].yrepel += -(Math.sin(angleRadians)*distance)/2
                    }
                }
            }
        }

        for(let t = 0; t<pins.length; t++){
            pins[t].x +=  pins[t].xrepel
            pins[t].y +=  pins[t].yrepel
            pins[t].xrepel = 0
            pins[t].yrepel = 0
        }
        for(let s = 0; s<springs.length; s++){

            springs[s].draw()
        }
        if(keysPressed['c']){
            gravity+=.001
            if(gravity > 1.5){
             gravity = 1.5
            }
            gravity =   parseFloat(gravity.toPrecision(4))
        }
        if(keysPressed['v']){
           gravity-=.001
           if(gravity < -1.5){
            gravity = -1.5
           }
           gravity =   parseFloat(gravity.toPrecision(4))
        }
        if(keysPressed['f']){
            friction-=.0001
            if(friction < .10){
                friction = .10
            }
            friction =   parseFloat(friction.toPrecision(6))
        }
        if(keysPressed['g']){

            friction+=.0001
            if(friction > 1.001){
                friction =1.001
            }
           friction =   parseFloat(friction.toPrecision(6))
        }

   
        // if(keysPressed['i']){
        //     pin2.y -= 5
        // }
        // if(keysPressed['j']){
        //     pin2.x -= 5
        // }

        if(keysPressed['n']){
            pin5.symom -= (pin5.y-dummypin.y)/3000
            pin5.sxmom -= (pin5.x-dummypin.x)/3000


                pin.xmom = 0
                pin.ymom = 0
                pin2.xmom = 0
                pin2.ymom = 0
                pin3.xmom = 0
                pin3.ymom = 0
                pin4.xmom = 0
                pin4.ymom = 0

                // pin5.xmom = 0
                // pin5.ymom = 0


        pin5.drive()
        pin.move()
        pin2.move()
        pin3.move()
        pin4.move()
        pin5.move()
        
        }else    if(keysPressed['i']){
            pin.symom -= (pin.y-dummypin.y)/3000
            pin.sxmom -= (pin.x-dummypin.x)/3000


                // pin.xmom = 0
                // pin.ymom = 0
                pin2.xmom = 0
                pin2.ymom = 0
                pin3.xmom = 0
                pin3.ymom = 0
                pin4.xmom = 0
                pin4.ymom = 0
                pin5.xmom = 0
                pin5.ymom = 0


        pin.drive()
        pin.move()
        pin2.move()
        pin3.move()
        pin4.move()
        pin5.move()
        
        }else   if(keysPressed['k']){
    
            pin2.symom -= (pin2.y-dummypin.y)/3000
            pin2.sxmom -= (pin2.x-dummypin.x)/3000


            pin.xmom = 0
            pin.ymom = 0
            // pin2.xmom = 0
            // pin2.ymom = 0
            pin3.xmom = 0
            pin3.ymom = 0
            pin4.xmom = 0
            pin4.ymom = 0
            pin5.xmom = 0
            pin5.ymom = 0
            pin2.drive()
            pin2.move()
        pin.move()
        pin3.move()
        pin4.move()
        pin5.move()
        }else if(keysPressed['l']){

            pin3.symom -= (pin3.y-dummypin.y)/3000
            pin3.sxmom -= (pin3.x-dummypin.x)/3000
            pin.xmom = 0
            pin.ymom = 0
            pin2.xmom = 0
            pin2.ymom = 0
            // pin3.xmom = 0
            // pin3.ymom = 0
            pin4.xmom = 0
            pin4.ymom = 0
            pin5.xmom = 0
            pin5.ymom = 0
        pin3.drive()
        pin3.move()
        pin4.move()
        pin.move()
        pin2.move()
        pin5.move()
        }else if(keysPressed['j']){

            pin4.symom -= (pin.y-dummypin.y)/3000
            pin4.sxmom -= (pin.x-dummypin.x)/3000

            pin.xmom = 0
            pin.ymom = 0
            pin2.xmom = 0
            pin2.ymom = 0
            pin3.xmom = 0
            pin3.ymom = 0
            // pin4.xmom = 0
            // pin4.ymom = 0
                pin5.xmom = 0
                pin5.ymom = 0
        
        pin4.drive()
        pin4.move()
        pin.move()
        pin2.move()
        pin3.move()
        pin5.move()
        }else{

            pin.xmom = 0
            pin.ymom = 0
            pin2.xmom = 0
            pin2.ymom = 0
            pin3.xmom = 0
            pin3.ymom = 0
            pin4.xmom = 0
            pin4.ymom = 0
            pin5.xmom = 0
            pin5.ymom = 0
            // pin.sxmom = 0
            // pin.symom = 0
            // pin2.sxmom = 0
            // pin2.symom = 0
            // pin3.sxmom = 0
            // pin3.symom = 0
            // pin4.sxmom = 0
            // pin4.symom = 0
        }
        // if(keysPressed['l']){
        //     pin2.x += 5
        // }
        if(keysPressed['h']){
            if(hstop%15 == 0){
                pegged*=-1
            }
        }
        if(keysPressed['e']){
            for(let s = 0; s<springs.length; s++){
                springs[s].length +=.001
            }
        }
        if(keysPressed['q']){
            for(let s = 0; s<springs.length; s++){
                springs[s].length -=.001
                if(springs[s].length < .1){
                    springs[s].length =.1
                }
            }
        }
        // pin.xmom = 0
        // pin.ymom = 0
        if(pegged == 1){
        // pin2.xmom = 0
        // pin2.ymom = 0
        }
        // pin2.unmove() 


        // infooverlay_context.fillStyle = "black";
        // infooverlay_context.font = `${18}px Arial`;
        // // infooverlay_context.fillText(`Friction; ${friction}`, 10,20);

        // // infooverlay_context.fillText(`Gravity; ${gravity} pixels/second`, 10,40);

        // infooverlay_context.fillText(`I`, pin.x-pin.radius/3.5,pin.y-pin.radius);
        // infooverlay_context.fillStyle = "#66FF66";
        // infooverlay_context.fillText(`K`, pin2.x-pin2.radius/2,pin2.y-pin2.radius);
        // infooverlay_context.fillStyle = "black";
        // infooverlay_context.fillText(`L`, pin3.x-pin3.radius/2,pin3.y-pin3.radius);
        // infooverlay_context.fillStyle = "yellow";
        // infooverlay_context.fillText(`J`, pin4.x-pin4.radius/2,pin4.y-pin4.radius);
        // infooverlay_context.fillStyle = "red";
        // infooverlay_context.fillText(`N`, pin5.x-pin5.radius/1.5,pin5.y-pin5.radius);

    }, 10) 



        
})
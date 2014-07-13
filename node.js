var Node = Class.extend({

    init: function(X,Y){
        this.pos = {x: null, y: null};

        this.fillStyle = 'white';
        this.width = 32;
        this.height = 32;

        this.pos.x = X;
        this.pos.y = Y;
        this.h = 0;
        this.g = 0;
        this.f = 0;

        this.northNode = null;
        this.southNode = null;
        this.westNode = null;
        this.eastNode = null;

        this.parentNode = null;

        this.hovering = false;

        this.open = false;
        this.closed = false;
        this.final = false;

        this.isWall = false;
        this.startNode = false;
        this.targetNode = false;
        this.hover();
    },
    calculateFValue: function(){
        this.f = this.h + this.g;
    },
    Render: function(){
      
        if(this.isWall){
            this.fillStyle = 'rgba(119,136,153,1)';
        }else if(this.startNode){
            this.fillStyle = 'lightgreen';
        }else if(this.targetNode){
            this.fillStyle = 'lightcoral';
        }else if(this.open){
            this.fillStyle = 'cyan';
        }else if(this.closed){
            this.fillStyle = 'lightblue';
        }else if(this.final){
            this.fillStyle = 'lightsalmon';
        }
        else if(!this.hovering){
            this.fillStyle = 'white';
        }

        context.beginPath();
        context.fillStyle = this.fillStyle;
        context.rect(this.pos.x, this.pos.y, this.width, this.height);
        context.fill();
        context.closePath();
    },
    hover: function(){
        if(mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.width && mousePos.y > this.pos.y  && mousePos.y < this.pos.y + this.height){
            this.hovering = true;
        }else{
            this.hovering = false;
        }

    },
    checkBounds: function(){
        if(mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.width && mousePos.y > this.pos.y  && mousePos.y < this.pos.y + this.height){
            return true;
        }else{
            return false;
        }
    },   
    update : function(){ 
        // if(currentState !== states.findPath){
        //     this.hover();
        // }else{
        //     this.hovering = false;
        // }

        this.Render();
    }
});
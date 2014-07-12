var Node = Class.extend({

    init: function(X,Y){
        this.pos = {x: null, y: null};

        this.fillStyle = 'lightgoldenrodyellow';
        this.width = 25;
        this.height = 25;

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

        this.isWall = false;
        this.hover();
    },
    calculateFValue: function(){
        this.f = this.h + this.g;
    },
    Render: function(){
        context.beginPath();
        context.fillStyle = this.fillStyle;
        context.rect(this.pos.x, this.pos.y, this.width, this.height);
        context.fill();
        context.closePath();
    },
    hover: function(){
        
        if(states.pickingWalls && this.hovering){
            this.fillStyle = 'rgba(119,136,153,0.5)';
        }else if(this.isWall){
            this.fillStyle = 'rgba(119,136,153,1.0)';
        }else {
            this.fillStyle = 'lightgoldenrodyellow';
        }

        if(mousePos.x > this.pos.x && mousePos.x < this.pos.x + this.width && mousePos.y > this.pos.y  && mousePos.y < this.pos.y + this.height){
            this.hovering = true;
        }else{
            this.hovering = false;
        }
    },
    update : function(){ 
        this.Render();
        this.hover();
    }
});
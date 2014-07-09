var Node = Class.extend({

    init: function(X,Y){
        this.pos = {x: null, y: null};

        this.fillStyle = 'yellow';
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
    Update : function(){ 
        this.Render();
    }
});
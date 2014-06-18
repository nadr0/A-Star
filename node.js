var node = Class.extend({
            init: function(PositionX, PositionY){
                // The x/y position is the upper left of the square
                this.posX = PositionX;
                this.posY = PositionY;

                // The center of the node
                this.centerX = this.posX + (nodesize/2);
                this.centerY = this.posY + (nodesize/2);

                // Width/Height of the square to be drawn
                this.width = nodesize;
                this.height = nodesize;

                // Color
                this.color = 'AliceBlue';

                // The adjacent nodes to this node
                this.northnode = null;
                this.southnode = null;
                this.eastnode = null;
                this.westnode = null;

                this.g = 10;
                this.h = 0;
                this.f = 0;

            },
            draw: function(){
                context.beginPath();
                context.fillStyle = this.color;
                context.fillRect(this.posX, this.posY, this.width, this.height);
                context.closePath();
            },
            calculateFscore: function(){
                this.f = this.g + this.h;
            },


        });
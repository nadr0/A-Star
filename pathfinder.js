var Pathfinder = Class.extend({

    init: function(){
        // Open list contains the testing nodes
        this.openList = [];
        // Closed list contains the nodes that have been checked
        this.closedList = [];
        // Final path contains the path of nodes
        this.finalPath = [];

        // Current checking node
        this.checkingNode = null;


        // Start --> Target
        // The startnode to begin the path
        this.startNode = null;
        // The targetnode to end the path
        this.targetNode = null;

        // The movement cost to go from one tile to another - Manhattan Distance
        // Can only move Up/Down/Left/Right
        this.moveCost = 100;

        // Bool to keep track if the target is found
        this.targetFound = false;

        // Size of the tiles in the datamap
        this.sizeOfTile = 32;

        // Contains all the nodes
        this.allNodes = [];

        // Data array to store the nodes also to draw/create the nodes in the grid formation
        this.data = new Array(canvas.height/this.sizeOfTile);

    },
    fillNodeArrays: function(){

        // Fills the dataArray with nodes and fills the allNodes with the nodes too
        for (var i = 0; i < canvas.height/this.sizeOfTile; i++) {
            for (var j = 0; j < canvas.width/this.sizeOfTile; j++) {
                this.allNodes.push(new Node(j * this.sizeOfTile, i * this.sizeOfTile));
            };
        };

    },
    drawNodes: function (){
        // Draws all the nodes in the data array
        for (var i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i].update();
        };
    },
    findPath: function(){
        if(this.openList.length > 0 && !this.targetFound){
            this.checkingNode = this.getSmallestFValueNode();

            this.addToClosedList(this.checkingNode);
            this.removeFromOpenList(this.checkingNode);

            if(this.checkingNode.northNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.northNode);
            }
            if(this.checkingNode.southNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.southNode);
            }
            if(this.checkingNode.eastNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.eastNode);
            }
            if(this.checkingNode.westNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.westNode);
            }
        }else{
            this.targetFound = false;
            startPathFinding = false;
            currentState = states.noPath;
        }
    },
    adjacentNode: function(currentNode, testingNode){

        // If the testingNode is null, return out
        if(!testingNode){
            return;
        }

        // If the testingNode is a wall, return out
        if(testingNode.isWall){
            return;
        }

        // If the testingNode is not in the closed list - (Has already been checked) 
        if(!this.checkClosedList(testingNode)){
            // If is the testingNode is in the openList

            if(this.checkOpenList(testingNode)){
                var newGCost = currentNode.g + this.moveCost;
                if(newGCost < testingNode.g){
                    testingNode.parentNode = currentNode;
                    testingNode.g = newGCost;
                    testingNode.calculateFValue();
                }
            }else{
                testingNode.parentNode = currentNode;
                testingNode.g = currentNode.g + this.moveCost;
                testingNode.calculateFValue();
                this.addToOpenList(testingNode);
            }
        }
    },
    checkClosedList: function(testing){
        for (var i = 0; i < this.closedList.length; i++) {
            if(testing === this.closedList[i]){
                return true;
            }
        };
        return false;
    },        
    checkOpenList: function(testing){
        for (var i = 0; i < this.openList.length; i++) {
            if(testing === this.openList[i]){
                return true;
            }
        };
        return false;
    },
    addToOpenList: function(node){
        this.openList.push(node);
        node.open = true;
        this.openList.sort(function(a, b) {return a.f - b.f})
    },
    addToClosedList: function(node){
        node.closed = true;
        this.closedList.push(node)
        if(node === this.targetNode){
            this.targetFound = true;
            startPathFinding = false;
        }
    },
    removeFromOpenList: function(node){
        var index = this.openList.indexOf(node);
        node.open = false;
        this.openList.splice(index, 1);
    },
    getSmallestFValueNode: function(){
        return this.openList[0];
    },
    CacluateHueristics: function(){
        for (var i = 0; i < this.allNodes.length; i++) {
            var hueristic = 10 * (  Math.abs(this.allNodes[i].pos.x - this.targetNode.pos.x) + Math.abs(this.allNodes[i].pos.y - this.targetNode.pos.y)   );
            this.allNodes[i].h = hueristic;
        };
    },
    findAdjacentNodes: function(){
        for (var i = 0; i < this.allNodes.length; i++) {
            for (var w = 0; w < this.allNodes.length; w++) {
                if(this.allNodes[i].pos.x + (this.sizeOfTile) === this.allNodes[w].pos.x && this.allNodes[i].pos.y === this.allNodes[w].pos.y){
                    this.allNodes[i].eastNode = this.allNodes[w];
                }
                if(this.allNodes[i].pos.x - (this.sizeOfTile) === this.allNodes[w].pos.x && this.allNodes[i].pos.y === this.allNodes[w].pos.y){
                    this.allNodes[i].westNode = this.allNodes[w];
                }
                if(this.allNodes[i].pos.x === this.allNodes[w].pos.x && this.allNodes[i].pos.y + this.sizeOfTile === this.allNodes[w].pos.y){
                    this.allNodes[i].southNode = this.allNodes[w];
                }
                if(this.allNodes[i].pos.x === this.allNodes[w].pos.x && this.allNodes[i].pos.y - this.sizeOfTile === this.allNodes[w].pos.y){
                    this.allNodes[i].northNode = this.allNodes[w];
                }
            };
        };

    },   
    tracePathBack: function(){
        var node = this.targetNode;
        do{
            node.open = false;
            node.closed = false;
            node.final = true;
            this.finalPath.push(node);
            node = node.parentNode;
        }while(node !== null);
    }


});
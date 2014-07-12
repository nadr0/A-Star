var Pathfinder = Class.extend({

    init: function(Level){
        this.level = Level

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
        this.sizeOfTile = this.level.sizeOfTile;

        // Contains all the nodes
        this.allNodes = [];

        // Data array to store the nodes also to draw/create the nodes in the grid formation
        this.data = new Array(canvas.height/this.sizeOfTile);

    },
    fillNodeArrays: function(){

        // Sets all the nodes to the floor tiles of the level
        for (var i = 0; i < this.level.alltiles.length; i++) {
            // alltiles contains only the floor tiles
            var x = this.level.alltiles[i].posX;
            var y = this.level.alltiles[i].posY;
            // Creates nodes at all the floor tiles positions
            this.allNodes[i] = new Node(x,y);
        };

    },
    drawNodes: function (){
        // Draws all the nodes in the data array
        // for (var i = 0; i < canvas.height/this.sizeOfTile; i++) {
        //     for (var j = 0; j < canvas.width/this.sizeOfTile; j++) {
        //         this.data[i][j].Update();
        //     };
        // };
        for (var i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i].Update();
        };
    },
    findPath: function(){
        // Is the target found?
        if(!this.targetFound){
            // If the target is not found

            // Determine the values for all the surrounding nodes to the current checkingNode


            // Checks northnode
            if(this.checkingNode.northNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.northNode);
            }
            // Check southnode
            if(this.checkingNode.southNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.southNode);
            }
            // Check westnode
            if(this.checkingNode.westNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.westNode);
            }
            // Check eastnode
            if(this.checkingNode.eastNode){
                this.adjacentNode(this.checkingNode, this.checkingNode.eastNode);
            }
        }

        // If the surrounding nodes are not the target 
        if(!this.targetFound){
            // Add the checkingNode to the closedlist for it does not get checked again
            this.addToCloseList(this.checkingNode);
            // Remove from the open lists because it does not need to be checked again
            this.removeFromOpenList(this.checkingNode);
            // Find a new checking node based off the openlist and the F values of each one
            this.checkingNode = this.getSmallestFValueNode();
        }
    },
    adjacentNode: function(currentNode, testingNode){
        // If the testingNode is null the return out
        if(!testingNode){
            return;
        }

        // If the testingNode is the targetNode 
        if(testingNode === this.targetNode){
            // Set the parentNode of the targetNode to the currentNode 
            this.targetNode.parentNode = currentNode;
            // The targetFound set to true for the findPath() stops getting called
            this.targetFound = true;
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
        // Checks if the testing node is in the closed list
        for (var i = 0; i < this.closedList.length; i++) {
            if(testing === this.closedList[i]){
                return true;
            }
        };
        return false;
    },        
    checkOpenList: function(testing){
        // Checks if the testing node is in the open list
        for (var i = 0; i < this.openList.length; i++) {
            if(testing === this.openList[i]){
                return true;
            }
        };
        return false;
    },
    addToOpenList: function(node){
        // Adds nodes to the open list
        this.openList.push(node);
        node.fillStyle = 'cyan';
        this.openList.sort(function(a, b) {return a.f - b.f})
    },
    addToCloseList: function(node){
        // Addes nodes to the closed list
        node.fillStyle = 'lightblue';
        this.closedList.push(node)
    },
    removeFromOpenList: function(node){
        // Removes node from the open list 
        var index = this.openList.indexOf(node);
        this.openList.splice(index, 1);
    },
    getSmallestFValueNode: function(){
        // Finds the smallest F value node in the open list to set as the next checking node
        // var returnNode = this.openList[0];
        // var lowestFValue = this.openList[0].f;

        // for (var i = 0; i < this.openList.length; i++) {
        //     if(this.openList[i].f < lowestFValue){
        //         lowestFValue = this.openList[i].f;
        //         returnNode = this.openList[i];
        //     }
        // };
        returnNode = this.openList[0];
        return returnNode;
    },
    CacluateHueristics: function(){
        // Calculates all the distances from each node to the target
        for (var i = 0; i < this.allNodes.length; i++) {
            var hueristic = 10 * (  Math.abs(this.allNodes[i].pos.x - this.targetNode.pos.x) + Math.abs(this.allNodes[i].pos.y - this.targetNode.pos.y)   );
            this.allNodes[i].h = hueristic;
        };
    },
    findAdjacentNodes: function(){
        // Finds all the adjacent nodes to each node 
        // North, West, East, South
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
    drawAllNodes: function(){
        // draws/renders the nodes for the visual part of the A*
        for (var i = 0; i < canvas.height/this.sizeOfTile; i++) {
            for (var j = 0; j < canvas.width/this.sizeOfTile; j++) {
                this.data[i][j].Update();
            };
        };
    },
    tracePathBack: function(){
        var node = this.targetNode;
        do{
            node.fillStyle = 'springgreen';
            this.finalPath.push(node);
            node = node.parentNode;
        }while(node !== null);
    }


});
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
        this.moveCost = 10;

        // Bool to keep track if the target is found
        this.targetFound = false;

        // Size of the tiles in the datamap
        this.sizeOfTile = 25;

        // Contains all the nodes
        this.allNodes = [];

        // Data array to store the nodes also to draw/create the nodes in the grid formation
        this.data = new Array(canvas.height/sizeOfTile);

    },
    fillNodeArrays: function(){

        // creates the data array to store all the nodes
        for (var i = 0; i < canvas.height/sizeOfTile; i++) {
            for (var j = 0; j < canvas.width/sizeOfTile; j++) { 
                data[i] = new Array(canvas.width/sizeOfTile);
            };
        };

        // Fills the dataArray with nodes and fills the allNodes with the nodes too
        for (var i = 0; i < canvas.height/sizeOfTile; i++) {
            for (var j = 0; j < canvas.width/sizeOfTile; j++) {
                data[i][j] = new Node(j*25, i*25);
                allNodes.push(data[i][j]);
            };
        };

    },
    drawNodes: function (){
        // Draws all the nodes in the data array
        for (var i = 0; i < canvas.height/sizeOfTile; i++) {
            for (var j = 0; j < canvas.width/sizeOfTile; j++) {
                data[i][j].Update();
            };
        };
    },
    findPath: function(){
        // Is the target found?
        if(!targetFound){
            // If the target is not found

            // Determine the values for all the surrounding nodes to the current checkingNode
            if(checkingNode.northNode){
                adjacentNode(checkingNode, checkingNode.northNode);
            }

            if(checkingNode.southNode){
                adjacentNode(checkingNode, checkingNode.southNode);
            }

            if(checkingNode.westNode){
                adjacentNode(checkingNode, checkingNode.westNode);
            }

            if(checkingNode.eastNode){
                adjacentNode(checkingNode, checkingNode.eastNode);
            }
        }

        // If the surrounding nodes are not the target 
        if(!targetFound){
            // Add the checkingNode to the closedlist for it does not get checked again
            addToCloseList(checkingNode);
            // Remove from the open lists because it does not need to be checked again
            removeFromOpenList(checkingNode);
            // Find a new checking node based off the openlist and the F values of each one
            checkingNode = getSmallestFValueNode();
        }
    },
    adjacentNode: function(currentNode, testingNode){
        // If the testingNode is null the return out
        if(!testingNode){
            return;
        }

        // If the testingNode is the targetNode 
        if(testingNode === targetNode){
            // Set the parentNode of the targetNode to the currentNode 
            targetNode.parentNode = currentNode;
            // The targetFound set to true for the findPath() stops getting called
            targetFound = true;
            return;
        }

        // If the testingNode is not in the closed list - (Has already been checked) 
        if(!checkClosedList(testingNode)){
            // If is the testingNode is in the openList

            if(checkOpenList(testingNode)){
                var newGCost = currentNode.g + moveCost;
                if(newGCost < testingNode.g){
                    testingNode.parentNode = currentNode;
                    testingNode.g = newGCost;
                    testingNode.calculateFValue();
                }
            }else{
                testingNode.parentNode = currentNode;
                testingNode.g = currentNode.g + moveCost;
                testingNode.calculateFValue();
                addToOpenList(testingNode);
            }
        }
    },
    checkClosedList: function(testing){
        for (var i = 0; i < closedList.length; i++) {
            if(testing === closedList[i]){
                return true;
            }
        };
        return false;
    },        
    checkOpenList: function(testing){
        for (var i = 0; i < openList.length; i++) {
            if(testing === openList[i]){
                return true;
            }
        };
        return false;
    },
    addToOpenList: function(node){
        openList.push(node);
    },
    addToCloseList: function(node){
    node.fillStyle = 'Cyan';
        closedList.push(node)
    },
    removeFromOpenList: function(node){
        var index = openList.indexOf(node);
        openList.splice(index, 1);
    },
    getSmallestFValueNode: function(){
        var returnNode = openList[0];
        var lowestFValue = openList[0].f;

        for (var i = 0; i < openList.length; i++) {
            if(openList[i].f < lowestFValue){
                lowestFValue = openList[i].f;
                returnNode = openList[i];
            }
        };
        return returnNode;
    },
    CacluateHueristics: function(){
        for (var i = 0; i < allNodes.length; i++) {
            var hueristic = 10 * (  Math.abs(allNodes[i].pos.x - targetNode.pos.x) + Math.abs(allNodes[i].pos.y - targetNode.pos.y)   );
            allNodes[i].h = hueristic;
        };
    },
    findAdjacentNodes: function(){

        for (var i = 0; i < allNodes.length; i++) {
            for (var w = 0; w < allNodes.length; w++) {
                if(allNodes[i].pos.x + (sizeOfTile) === allNodes[w].pos.x && allNodes[i].pos.y === allNodes[w].pos.y){
                    allNodes[i].eastNode = allNodes[w];
                }
                if(allNodes[i].pos.x - (sizeOfTile) === allNodes[w].pos.x && allNodes[i].pos.y === allNodes[w].pos.y){
                    allNodes[i].westNode = allNodes[w];
                }
                if(allNodes[i].pos.x === allNodes[w].pos.x && allNodes[i].pos.y + sizeOfTile === allNodes[w].pos.y){
                    allNodes[i].southNode = allNodes[w];
                }
                if(allNodes[i].pos.x === allNodes[w].pos.x && allNodes[i].pos.y - sizeOfTile === allNodes[w].pos.y){
                    allNodes[i].northNode = allNodes[w];
                }
            };
        };

    },


});
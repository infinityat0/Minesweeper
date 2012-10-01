var board = (function () {
    // private variables/functions
    var noOfMines, size, defaultSize = 10, map = {}, RED_COLOR = '#FF0000', makeNode = function (iName, iMine, iMarked, iExposed, iAdjNodes) {
        var name = iName || '', mine = iMine, marked = iMarked, exposed = iExposed, adjNodes = iAdjNodes || [];
        return {
            getName : function () { return name; },
            setName : function (iName) { name = iName; },
            isMine : function () { return mine; },
            setMine : function (iMine) { mine = iMine; },
            isMarked : function () { return marked; },
            setMarked : function (iMarked) { marked = iMarked; },
            isExposed : function () { return exposed; },
            setExposed : function (iExposed) { exposed = iExposed; },
            getAdjNodes : function () { return adjNodes; },
            setAdjNodes : function (iAdjNodes) { adjNodes = iAdjNodes; }
        };
    }, getAllAdjecentNodes = function (iNodeName) {
        var i, j, x, y, tokens, allAdjNodes = [];
        tokens = iNodeName.split('-');
        x = tokens[0];
        y = tokens[1];
        for (i = x - 1; i < x + 2; i = i + 1) {
            for (j = y - 1; j < y + 2; j = j + 1) {
                if (map[i + "-" + j] && !map[i + "-" + j].isMine() && map[iNodeName] !==map[i + "-" + j]) {
                    allAdjNodes.push(map[i + "-" + j]);
                }
            }
        }
        return allAdjNodes;
    }, getRandomNumber = function (iLimit) {
        var limit = iLimit || defaultSize * defaultSize / 2;
        return Math.floor((Math.random() * limit + 1) % iLimit);
    }, setMine = function (iX, iY) {
        var node = map[iX + "-" + iY], i, j;
        node.setMine(true);
        for (i = iX - 1; i < iX + 2; i = i + 1) {
            for (j = iY - 1; j < iY + 2; j = j + 1) {
                if (map[i + "-" + j] && !map[i + "-" + j].isMine()) {
                    map[i + "-" + j].getAdjNodes().push(node);
                    // Can try this? map[i + "-" + j] && map.getAdjNodes().push(node);
                }
            }
        }
    };
    return {
        // This is the object that gets assigned to the variable board ;
        setSize : function (iSize) { size = iSize; },
        getSize : function () { return size; },
        getDefaultSize : function () { return defaultSize; },
        drawBoard : function (iSize) {
            // Here's some big logic you need to write.
            var i, j, boardHTML = [], rand, noOfBlocks = iSize * iSize, x = 0, y = 0;
            size = iSize;
            noOfMines = getRandomNumber(size * size / 2) + 1;
            boardHTML.push("<table cellpadding=\"1\" cellspacing=\"1\" id = \"table\" class = \"table\">");
            for (i = 0; i < size; i = i + 1) {
                boardHTML.push("<tr>");
                for (j = 0; j < size; j = j + 1) {
                    map[i + "-" + j] = makeNode(i + "-" + j, false, false, false, []);
                    boardHTML.push("<td id = " + i + "-" + j + " class = \"box\" onmousedown=\"gameController.play(event)\" </td>");
                }
                boardHTML.push("</tr>");
            }
            boardHTML.push("</table>");
            document.getElementById('grid').innerHTML = boardHTML.join('');
            for (i = 0; i < noOfMines; i = i + 1) {
                do {
                    rand = getRandomNumber(noOfBlocks);
                    x = Math.floor(rand / size);
                    y = Math.floor(rand % size);
                } while (map[x + "-" + y].isMine());
                setMine(x, y);
            }
        },
        clearBoard : function () {
            map = {};
        },
        showAllMines : function () {
            var i, j;
            for (i = 0; i < size; i = i + 1) {
                for (j = 0; j < size; j = j + 1) {
                    if (map[i + "-" + j].isMine()) {
                        // update the binding in HTML to show mine on the board.
                        document.getElementById(map[i + "-" + j].getName()).style.backgroundImage = 'url(./images/mine.png)';
                        document.getElementById(map[i + "-" + j].getName()).style.backgroundColor =  RED_COLOR;
                    }
                }
            }
        },
        isAMine : function (iNodeName) {
            return map[iNodeName].isMine();
        },
        isExposed : function (iNodeName) {
            return map[iNodeName].isExposed();
        },
        isMarked : function (iNodeName) {
            return map[iNodeName].isMarked();
        },
        setMarked : function (iNodeName) {
            // Ideally one should also alter the view but I'm hoping to set bindings in Backbone.js
            map[iNodeName].setMarked(true);
            document.getElementById(iNodeName).style.backgroundImage = 'url(./images/Flag.PNG)';
        },
        setExposed : function (iNodeName) {
            var nearbyMines = map[iNodeName].getAdjNodes().length, allAdjNodes, adjNode, i;
            // Ideally one should also alter the view but I'm hoping to set bindings in Backbone.js
            map[iNodeName].setExposed(true);
            document.getElementById(iNodeName).innerHTML = nearbyMines;
            document.getElementById(iNodeName).style.backgroundImage = '';
            if (!nearbyMines) {
                allAdjNodes = getAllAdjecentNodes(iNodeName);
                for (i = 0; i < allAdjNodes.length; i = i + 1) {
                    adjNode = allAdjNodes[i];
                    if (!(adjNode.isExposed(iNodeName) || adjNode.isMine())) {
                        this.setExposed(adjNode.getName());
                    }
                }
            }
        },
        getNumberOfMines : function () {
            return noOfMines;
        }
    };
}()), gameController = (function () {
    var isGameStarted, runTime = 0, mines,
        updateStatus = function (iMessage) {
            document.getElementById('message').innerHTML = iMessage;
        },
        updateTime = function () {
            if (isGameStarted) {
                document.getElementById('timeTaken').innerHTML = (++runTime) + " Seconds";
                window.setTimeout(function () { updateTime(); } , 1000);
            }
        },
        updateMines = function () {
            document.getElementById('minesRem').innerHTML = mines;
        };
    // returning object only with it's public methods. 
    return {
        startGame : function () {
            isGameStarted = true;
            runTime = 0;
            var size = parseInt(window.prompt("Enter the size of board to play. [Max = 15 and min = 5]"), 10);
            if (size > 15 || size < 5) {
                size = 7;
                window.alert(" Setting a default size of 7");
            }
            // board.setSize((size > 15 || size < 5) ? 7 : size);
            // board.clearBoard();
            board.drawBoard(size);
            mines = board.getNumberOfMines();
            updateMines();
            updateStatus('');
            updateTime();
        },
        endGame : function () {
            isGameStarted = false;
            board.showAllMines();
        },
        play : function (e) {
            var rightclick, targ, boxName;
            if (!isGameStarted) {
                window.alert("Game has ended");
            }
            e = e || window.event;
            if (e.which) {
                rightclick = (e.which === 3);
            } else if (e.button) {
                rightclick = (e.button === 2);
            }
            e.preventDefault();
            if (e.target) {
                targ = e.target;
            } else if (e.srcElement) {
                targ = e.srcElement;
            }
            if (targ.nodeType === 3) { // defeat Safari bug
                targ = targ.parentNode;
            }
            boxName = targ.id;

            if (rightclick) {
                board.setMarked(boxName);
            } else {
                if (board.isAMine(boxName)) {
                    isGameStarted = false;
                    board.showAllMines();
                    updateStatus("Oops! you stepped on a mine!");
                } else {
                    board.setExposed(boxName);
                }
            }
            return false;
        }
    };
}());

/******************************************************************************/
var boardSize      = "Small";
var statusMessage ;

var hitOnPlayer     = false;
var destroyedPlayer = true ;
var isRandom        = true ;
var order           = [] ;
var proximityIndex  = 1 ;
var noOfMines       = 0 ;
var maxNoOfMines    = 10 ;

var isPlayersTurn   = false;
var isGameEnded     = true ;
var hitColor        = "#FFCD19" ;
var missColor       = "#999999" ;
var normalColor     = "#EEE" ;
var friendColor     = "#99B3CC" ;

var thisX, thisY ;
var secs = 0 ;
var stopCounting = true ;
var size = 10 ; 

/******************************************************************************/
var board = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
                /*
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0 ]
                
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ] */
             ];
/******************************************************************************/
function Draw()
{
    // alert("here.. ");
    getGrid(size) ;
}
/******************************************************************************/
function getGrid(size)
{
    
    document.getElementById('grid').innerHTML = "" ;

    var grid = "<table cellpadding=\"1\" cellspacing=\"1\" id = \"table\""+
                                    " class = \"table\">";
    for(var i = 0 ; i < size ; i++)
    {
        grid = grid + "<tr>" ;
        for(var j = 0 ; j < size ; j++)
        {
            grid = grid +"<td id = box"+i+"_"+j+" class = \"box\" "
                             //+ "onClick = updateProximity("+i+","+j+")"+
                               + "onmousedown=\"eventHandler(event)\""
                             // + "onClick = clicked("+i+","+j+") > "
                               + "</td>" ;
        }
        grid = grid + "</tr>" ;
    }
    grid = grid+ "</table>" ;
    document.getElementById('grid').innerHTML = grid;
}
/******************************************************************************/
/**
*
*
* Function to start the game.
*/
function startGame()
{
    if(!isGameEnded){
        alert("Game has already started");
        return ;
    }
    // alert("The last straw ");
    isGameEnded     = false ;
    size       = eval(prompt ("Enter the size of the board to play. [Max 15 and Min :5 ]","7"));
    if(size>15 || size <5){
        alert("Size out of bounds, defaulted to 7");
        size = 7 ; 
    }
    statusMessage   = "Playing with board size , "+size+"!" ;
    maxNoOfMines = Math.floor(board.length*board.length/2) ;
    reDrawBoard();   
    updateStatusMessage(statusMessage) ;
    /* Empty the board contents */
    emptyBoard();
    /* Place the board at random for both computer and player */
    placeBoard();
    /* update the number of mines and the player name */
    document.getElementById('boardSize').innerHTML = boardSize ;
    document.getElementById('minesRem').innerHTML = noOfMines ;
    stopCounting = false;
    showStopWatch();
}
/******************************************************************************/
/**
 * Comment
 */
function reDrawBoard() {
    board = new Array(size);

    for(var i = 0 ; i < size ;i++ ){
        board[i] = new Array(size);
    }
    
    for(i = 0 ; i < size ; i++){
        for(var j = 0 ; j < size ; j++){
            board[i][j] = 0 ;
        }
    }
    getGrid(size);
}
/******************************************************************************/
function emptyBoard()
{
    var boxID ;
    for(var k = 0 ; k < board.length ; k++)
    {
        for(var l = 0 ; l < board.length ; l++)
        {
            board[k][l] = 0 ;
            boxID = "box"+k+"_"+l+"" ;
            document.getElementById(boxID).style.backgroundColor = normalColor ;
            document.getElementById(boxID).innerHTML = "";
            document.getElementById(boxID).style.backgroundImage = "" ;
        }
    }
}
/******************************************************************************/
function endGame(isAccident)
{
    if(isGameEnded)
    {
        statusMessage   = "Game hasn't started " ;
    }
    else
    {
        var boxID ;
        for(var i = 0 ; i < board.length ; i++)
        {
            for(var j = 0 ; j < board.length ; j++)
            {
                boxID = "box"+i+"_"+j ;
                var color ;
                if(board[i][j] == 0 || board[i][j] ==  2)
                {
                    // good boy!. predicted a flag properly
                    color  = normalColor ;
                }
                else if(board[i][j] == 1 || board[i][j] == -1 ){
                    // Missed a mine ==> 1 ; Marked a wrong mine ==> -1 
                    color  = hitColor ;
                }
                document.getElementById(boxID).style.backgroundColor = color;
            }
        }
        if(isAccident)
        {
            statusMessage   = "Oops! You stepped over a mine. Game Over." ;
        }
        else
        {
            statusMessage   = "You lost! ";
        }
    }
    isGameEnded = true ;
    updateStatusMessage(statusMessage) ;
    alert(statusMessage);
    stopCounting = true ;
    secs = 0 ;
}
/******************************************************************************/
function placeBoard()
{
    /* Every game, we'll have a different number of mines. */
    noOfMines = getRandomNumber1(maxNoOfMines);
    
    // alert("placing started"+noOfMines+"---"+board.length);
    var rNum, rX, rY ;
    for(var i = 0 ; i < noOfMines ; i++)
    {
        rNum = getRandomNumber();
        rX   = Math.floor(rNum/board.length) ;
        rY   = rNum%board.length ;
        if(board[rX][rY] == 1 )
        {
            // alert("Retrying at : {"+rX+","+rY+"}");
            i--;
        }
        else
        {
            // alert("Placed at : {"+rX+","+rY+"}");
            board[rX][rY] = 1 ;
        }            
    }
    // alert("placing done");
}
/******************************************************************************/
/**
 * Function returns random number form 0 - limit
 */
function getRandomNumber1(maxNoOfMines)
{
    // alert(maxNoOfMines);
    var rNum = Math.floor(Math.random()*maxNoOfMines) ;

    /* Even 99.99 on floor will result in 99 */
    return (rNum > maxNoOfMines || rNum == 0 )? getRandomNumber1(maxNoOfMines) : rNum  ;
}
/******************************************************************************/
/**
 * Function returns random number form 0 - board.length*board.length
 */
function getRandomNumber()
{
    /* Even 99.99 on floor will result in 99 */
    return Math.floor((Math.random()*board.length*board.length)) ;
}
/******************************************************************************/
/**
 * Update x, y on mouse over.
 */
function updateXY(x,y) {
    thisX = x ;
    thisY = y ;
    // alert("("+thisX+","+thisY+")");
}
/******************************************************************************/
/**
 *------------------------------------------------------------------------------
 * Function to identify the clicks. 
 *                    Thank you ppK for an awesome script.
 *                          Your book rocks.!.. *<):)
 *----------------------------------------------------------------------------*/
function eventHandler(e) {
    var rightclick;
    if (!e) var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
    // alert('Rightclick: ' + rightclick); // true or false

    var targ;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    if (targ.nodeType == 3) // defeat Safari bug
        targ = targ.parentNode;

    var x  = targ.id.replace("box", "").split("_")[0] ;
    var y  = targ.id.replace("box", "").split("_")[1] ;

    if(rightclick){
        clicked(x,y) ;
    }
    else{
        doubleClick(x,y);
    }
    if(checkGameOver()){
        statusMessage   = "Game over or hasn't started.";
        updateStatusMessage(statusMessage) ;
        isGameEnded = true ;
    }
    return false ;
}
/**
 * This function gets the co-ordinates of the target where missile is launched.
 *
 */
function clicked(x,y)
{
    // alert("checking ");
    if(isGameEnded)
    {
        statusMessage   = "Game over. Start another game to play!" ;
        updateStatusMessage(statusMessage) ;
        return true;
    }
    else
    {
        var link = "" ;
        switch(board[x][y]){
            case -1:
                board[x][y] = 0 ;
                break ;

            case 0 :
                board[x][y] = -1 ;
                link = "url(./images/Flag.PNG)" ;
                break ;

            case 1 :
                link = "url(./images/Flag.PNG)" ;
                board[x][y] = 2 ;
                break ;

            case 2:
                board[x][y] = 1 ;
                break ;
        }
        document.getElementById("box"+x+"_"+y).style.backgroundImage = link ;
    }
    return true ;
}

/**
 * checkGameOver
 */
function checkGameOver() {
    for(var i = 0 ; i < board.length ; i++){
        for(var ii = 0 ; ii < board.length ; ii++){
            if(board[i][ii]== 1 || board[i][ii]== -1 ){
                return false ; 
            }
        }
    }
    return true ;
}
/******************************************************************************/
/**
 * He's stepping on the land. If it has a mine, KABOOM.
 */
function doubleClick(x,y) {

    /* double click is also a click. :( */
    document.getElementById("box"+x+"_"+y).style.backgroundImage = "" ;
    // alert("checking ");
    if(isGameEnded)
    {
        statusMessage   = "Game over. Start another game to play!" ;
        updateStatusMessage(statusMessage) ;
        return ;
    }
    switch(board[x][y])
    {
        case 1 : case 2 :
                endGame(true);
                break ;
        case 0 : case -1:
                /* give the proximity. */
                updateProximity(x,y);
                break ;
    }
}
/******************************************************************************/
/**
 * TO get the stop watch on screen.
 */
function showStopWatch() {
    if(!stopCounting){
        document.getElementById('timeTaken').innerHTML = (++secs)+" Seconds" ;
        setTimeout("showStopWatch()", 1000);
    }
}
/******************************************************************************/
function updateProximity(x,y) {
    var proxMines = 0 ;
    var xArr,yArr ;
    if(x == 0 ){
        xArr = new Array(0,1);
    }
    else if ( x== (board.length -1) ) {
        xArr = new Array(x-0 , x-1);
    }
    else{
        xArr = new Array(x-1+2, x-0 , x-1);
    }
    if(y == 0 ){
        yArr = new Array(y-0 , y-1+2);
    }
    else if ( y == (board.length -1) ) {
        yArr = new Array(y-0 , y-1);
    }
    else{
        yArr = new Array(y-1+2, y-0 , y-1);
    }
    
    
    for(var i = 0 ; i < xArr.length ; i++){
        for (k = 0; k < yArr.length; k++) {
            if(board[xArr[i]][yArr[k]]==1){
                proxMines++ ;
            }
        }
    }
    // alert(proxMines);
    document.getElementById("box"+x+"_"+y).innerHTML = proxMines ;

}
/******************************************************************************/
/**
*
*
*/
function updateStatusMessage(message)
{
    document.getElementById('message').innerHTML = message ;
}
/******************************************************************************/
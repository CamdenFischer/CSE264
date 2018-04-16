/*
    Camden Fischer
    CSE 264 - Web Apps
    Poetry
*/

var counter = 0;
var id;
var list = [];

function ayWeLit(id){

    dragElement(document.getElementById(('movable' + id)));

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elmnt.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;        
        }
    }

    if (checkDelete(id)){
        $('#movable' + id).remove('');

        for (var i = 0; i < list.length; i++){
            var element = list[i];
            if (element.id = id){
                list.remove(i);
            }
        }
        for (var i = 0; i < list.length; i++){
            list[i].id = i;
        }
    }
}
  
function checkDelete(id){
    var buttonPos = $('#movable' + id).position();
    var trashPos = $('#delete').position();

    if (buttonPos.top < (trashPos.top - 15)){ //415
        return false;
    }
    if (buttonPos.left > (trashPos.left + 100)){//100
        return false;
    }
    return true;
}

function addWord(){
    var newWord = $('#newWordInput').val();
    $('body').append("<div class='move' onclick='ayWeLit(" + counter + ")' id='movable" + counter + "'><button id='movablebutton" + counter + "'>" + newWord + "</button></div>"); 
    counter++;
    $('#newWordInput').val(''); 
}

/*
function saveData(){
    $('div').each(function(index) {
        list.push($(this));
    });
    window.alert(JSON.stringify(list));
    localStorage.setItem('buttons', JSON.stringify(list));
}

function getData(){
    var temp = localStorage.getItem('buttons');
    list = JSON.parse(temp);
    counter = list.length;

    for (var i = 0; i < list.length; i++){
        $('body').append(list[i]);
    }

    console.log(temp);
}
*/

function saveData(){
    return;
}
function getData(){
    return;
}
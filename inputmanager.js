function processKey(event){
    //console.log(document.activeElement.nodeName);
    if(document.activeElement.nodeName=='TEXTAREA') return;
    if(event.shiftKey){
        switch(event.keyCode)
        {
            case 65: // A
                document.activeElement.blur();
                document.getElementById('gridsize').value=Number(document.getElementById('gridsize').value)-Number(document.getElementById('gridsize').step);
                update('gridsize',1);
                break;
            case 68: // D
                document.activeElement.blur();
                document.getElementById('gridsize').value=Number(document.getElementById('gridsize').value)+Number(document.getElementById('gridsize').step);
                update('gridsize',1);
                break;
            case 37: // <
                document.activeElement.blur();
                document.getElementById('deltax').value=Number(document.getElementById('deltax').value)-step; 
                update('deltax',1);
                break; 
            case 38: // ^
                document.activeElement.blur();
                document.getElementById('deltay').value=Number(document.getElementById('deltay').value)+step; 
                update('deltay',1);
                break; 
            case 39: // >
                document.activeElement.blur();
                document.getElementById('deltax').value=Number(document.getElementById('deltax').value)+step; 
                update('deltax',1);
                break;
            case 40: // v
                document.activeElement.blur();
                document.getElementById('deltay').value=Number(document.getElementById('deltay').value)-step;
                update('deltay',1);
                break;
        }
    }
}
function createPoint(event){
    var x=converttogridx(event.clientX-event.target.offsetLeft),y=converttogridy(event.clientY-event.target.offsetTop);
    x=snaptogrid(x),y=snaptogrid(y);
    console.log(x,y);
    drawpoint(x,y);
    if(document.getElementById('gridscript').value.length>0 && document.getElementById('gridscript').value[document.getElementById('gridscript')-1]!='\n')
        document.getElementById('gridscript').value+="\n";
    document.getElementById('gridscript').value+="Point "+x+" "+y+";";
    update('gridscript');
}
var locked;
function showHelp(){
    document.getElementById('helpbutton').style.textDecoration="underline";
    document.getElementById('helpbutton').style.fontSize="1.2rem";
    document.getElementById('output').style.display='none';
    document.getElementById('help').style.display='block';
}
function hideHelp(){
    if(locked) return;
    document.getElementById('helpbutton').style.textDecoration="none";
    document.getElementById('helpbutton').style.fontSize="1rem";
    document.getElementById('help').style.display='none';
    document.getElementById('output').style.display='block';
}
function lockHelp(){
    if(locked){
        locked=0;
        document.getElementById('helpbutton').style.color="#777";
        hideHelp();
    }
    else{
        locked=1;
        document.getElementById('helpbutton').style.color="red";
        showHelp();
    }
}
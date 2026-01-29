function update(id, redraw=false){
    //console.log('milka');
    if(document.getElementById(id).nodeName=='INPUT' && document.getElementById(id).type=='checkbox')
        localStorage.setItem(id,document.getElementById(id).checked);    
    else{
        if(document.getElementById(id).value>=1e9) 
            document.getElementById(id).value=1e9;
        else if(document.getElementById(id).value<=-1e9) 
                document.getElementById(id).value=-1e9;
        localStorage.setItem(id,document.getElementById(id).value);
    }
    if(redraw) drawcanvas();
}
function updateAll(){
    update('gridsize');
    update('deltax');
    update('deltay');
    update('showcenter');
    update('showgrid');
    update('showxaxis');
    update('showyaxis');
    update('gridscript');
    drawcanvas();
}
function clear(){
    document.getElementById('gridsize').value=
    document.getElementById('deltax').value=
    document.getElementById('deltay').value="0";
    
    document.getElementById('showcenter').checked=0;
    document.getElementById('showgrid').checked=
    document.getElementById('showxaxis').checked=
    document.getElementById('showyaxis').checked=1;

    document.getElementById('gridscript').value="";
    localStorage.clear();
    updateAll();
}
function confirmgridreset(){
    if(confirm("Are you sure you want to reset the canvas?"))
        clear();
}
function sync(id){
    if(document.getElementById(id).nodeName=='INPUT' && document.getElementById(id).type=='checkbox'){
        document.getElementById(id).checked=(localStorage.getItem(id)=='true');
    }
    else document.getElementById(id).value=localStorage.getItem(id);
}
function syncAll(){
    if(localStorage.length==0) clear();
    sync('gridsize');
    sync('deltax');
    sync('deltay');
    sync('showcenter');
    sync('showgrid');
    sync('showxaxis');
    sync('showyaxis');
    sync('gridscript');
    drawcanvas();
}
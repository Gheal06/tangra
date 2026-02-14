var cache={};
function getItem(id){
    return cache[id];
}
function update(id, redraw=false){
    //console.log('milka');
    if(document.getElementById(id).nodeName=='INPUT' && document.getElementById(id).type=='checkbox')
        cache[id]=document.getElementById(id).checked;    
    else{
        if(document.getElementById(id).value>=1e9) 
            document.getElementById(id).value=1e9;
        else if(document.getElementById(id).value<=-1e9) 
                document.getElementById(id).value=-1e9;
        cache[id]=document.getElementById(id).value;
    }
    localStorage.setItem('tangra_data',JSON.stringify(cache));
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
    localStorage.removeItem('tangra_data');
    updateAll();
}
function confirmgridreset(){
    if(confirm("Are you sure you want to reset the canvas?"))
        clear();
}
function sync(id){
    if(document.getElementById(id).nodeName=='INPUT' && document.getElementById(id).type=='checkbox'){
        document.getElementById(id).checked=cache[id];
    }
    else document.getElementById(id).value=cache[id];
}
function syncAll(){
    if(localStorage.getItem('tangra_data')==null) clear();
    cache=JSON.parse(localStorage.getItem('tangra_data'));
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
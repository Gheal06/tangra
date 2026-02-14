var output,ctx,n=2,unit,step=0,minx,maxx,miny,maxy,midx=0,midy=0;
function snaptogrid(x){
    return Math.round(x/(step/4))*(step/4);
}
function converttogridx(x){
    return minx+(x/output.width)*(maxx-minx);
}
function converttogridy(y){
    return maxy-(y/output.height)*(maxy-miny);
}
function adjustx(x){
    return x*unit-minx*unit;
}
function adjusty(y){
    y-=midy*2;
    return -miny*unit-y*unit;
}
function clearCanvas(){
    ctx.clearRect(0,0,output.width,output.height);
}
function drawsegment(x1, y1, x2, y2, width=4,color="#000000"){
    x1=adjustx(x1);x2=adjustx(x2);
    y1=adjusty(y1);y2=adjusty(y2);
    //console.log(x1,y1,x2,y2);
    ctx.beginPath();
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}
function drawline(x1, y1, x2, y2, width=4,color="#000000"){
    if(x1==x2) y1=miny,y2=maxy;
    else{
        var a=(y2-y1)/(x2-x1),b=y1-x1*a;
        x1=minx,x2=maxx;
        y1=a*x1+b,y2=a*x2+b;
    }
    x1=adjustx(x1);x2=adjustx(x2);
    y1=adjusty(y1);y2=adjusty(y2);
    //console.log(x1,y1,x2,y2);
    ctx.beginPath();
    ctx.lineWidth=width;
    ctx.strokeStyle=color;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}
function drawtext(x1,y1,text,fontsize=20,color="#000000"){
    x1=adjustx(x1),y1=adjusty(y1);
    //console.log(x1,y1,text);
    ctx.font=fontsize+"px sans-serif";
    ctx.fillStyle=color;
    ctx.fillText(text,x1,y1);
}
function drawcircle(x,y,r,color="#000000"){
    x=adjustx(x),y=adjusty(y);
    //console.log(x,y,r);
    ctx.beginPath();
    ctx.arc(x,y,r*unit,0,2 * Math.PI,false);
    //ctx.fillStyle = color;
    //ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
function drawdisk(x,y,r,color="#000000"){
    x=adjustx(x),y=adjusty(y);
    //console.log(x,y,r);
    ctx.beginPath();
    ctx.arc(x,y,r*unit,0,2 * Math.PI,false);
    ctx.fillStyle = color;
    ctx.fill();
    //ctx.lineWidth = 5;
    //ctx.strokeStyle = '#003300';
    //ctx.stroke();
    ctx.closePath();
}
function drawpoint(x,y,r=4,color="#000000"){
    drawdisk(x,y,r/unit,color);
}
function drawpoly(points,color="#000000"){
    for(var i=0;i<points.length;i+=2){
        //drawpoint(points[i],points[i+1]);
        drawsegment(points[i],points[i+1],points[(i+2)%points.length],points[(i+3)%points.length],2,color);   
    }
}
function fillpoly(points,color){
    ctx.beginPath();
    for(var i=0;i<points.length;i+=2) points[i]=adjustx(points[i]),points[i+1]=adjusty(points[i+1]);
    ctx.moveTo(points[0],points[1]);
    for(var i=2;i<points.length;i+=2)
        ctx.lineTo(points[i],points[i+1]);
    ctx.fillStyle = color;
    ctx.fill(); 
    //ctx.stroke();
    ctx.closePath();
}
function nextmultiple(a, b){ // b<0
    return Math.ceil(b/a)*a;
}
function trim(x, precision){
    return Number(x.toFixed(precision));
}
function drawcanvas(){
    clearCanvas();
    //console.log('canvas');
    var showcenter=getItem('showcenter');
    var showgrid=getItem('showgrid');
    var showxaxis=getItem('showxaxis');
    var showyaxis=getItem('showyaxis');
    midx=Number(getItem('deltax'));
    midy=Number(getItem('deltay'));
    step=Math.pow(2,getItem('gridsize'));
    //console.log(showcenter,showgrid,showxaxis,showyaxis,midx,midy,step);
    unit=50/step;
    var font=16;
    if(step>=64) font=12;
    else if(step>=16) font=14;
    else if(step>=8) font=16;
    else if(step>=2) font=18;
    else if(step>=1) font=20;
    else if(step>=0.5) font=18;
    else if(step>=0.25) font=16;
    else font=12;
    //console.log(midx,midy,unit);
    miny=-output.height/unit/2+midy;
    maxy=output.height/unit/2+midy;

    minx=-output.width/unit/2+midx;
    maxx=output.width/unit/2+midx;
    //console.log(minx,maxx,miny,maxy,step);
    //console.log(showcenter,showgrid,showxaxis,showyaxis);
    for(var x=nextmultiple(step,minx);x<=maxx;x+=step){
        if(showxaxis==true){
            //console.log(x);
            drawpoint(x,0,3,"#000000");
            drawtext(x+5/unit,-20/unit,trim(x,3).toString(),font);
        }
        if(x==0 && showyaxis==true) drawsegment(x,miny,x,maxy,3);
        if(showgrid==true) drawsegment(x,miny,x,maxy,1,"#888888");
    }
    for(var y=nextmultiple(step,miny);y<=maxy;y+=step){
        if(showyaxis==true){
            drawpoint(0,y,3,"#000000");
            drawtext(5/unit,y-20/unit,trim(y,3).toString(),font);
        }
        if(y==0 && showxaxis==true) drawsegment(minx,y,maxx,y,3);
        if(showgrid==true) drawsegment(minx,y,maxx,y,1,"#888888");
    }
    if(showcenter==true) drawpoint(midx,midy,4,"#FF0000");
    compilescript();
}
function setupcanvas(){
    //localStorage.clear();
    output=document.getElementById('output');
    ctx=output.getContext("2d");
    syncAll();
}
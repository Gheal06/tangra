function doOp(x,y,op){
    if(x===null || y===null) return null;
    switch(op){
        case '+': return x+y;
        case '-': return x-y;
        case '*': return x*y;
        case '/': return x/y;
        case '^': return Math.pow(x,y);
    }
}
let operations=["+-","*/","^"];
let oplist="+-*/^";
function mindelta(e){
    var delta=0,mindelta=0;
    for(var i=0;i<e.length;i++){
        if(e[i]=='(') delta++;
        else if(e[i]==')') delta--;
        mindelta=Math.min(mindelta,delta);
    }
    return mindelta;
}
function evalExp(e){
    //console.log(e);
    if(e.length==0) return NaN;
    if(validNumber(e)) return parseFloat(e);
    if(e[0]=='(' && e[e.length-1]==')' && mindelta(e.substring(1,e.length-1))>=0) return evalExp(e.substring(1,e.length-1));
    for(var precedence=0;precedence<operations.length;precedence++){
        var delta=0;
        for(var i=e.length-1;i>=0;i--){
            if(e[i]=='(') delta++;
            if(e[i]==')') delta--;
            if(delta==0 && operations[precedence].includes(e[i])){
                if(e[i]=='-' && (oplist.includes(e[i-1]))) continue;
                if(e[i]=='-' && i==0) return -evalExp(e.substring(i+1));
                return doOp(evalExp(e.substring(0,i)),evalExp(e.substring(i+1)),e[i]);
            }
        }
    }
    return null;
}
let charset="x0123456789.+-()*/^";

function parseFunc(f,x){
    var e="";
    for(var i=0;i<f.length;i++){
        if(f[i]=='x') e+='('+x.toString()+')';
        else e+=f[i];
    }
    var ans=evalExp(e);
    //console.log(e);
    if(ans===null) return null;
    else{
        //console.log(ans);
        return trim(ans,6);
    }
}
function drawFunc(f,color){
    for(var i=0;i<f.length;i++) if(!charset.includes(f[i])) return false;
    if(f.length==0) return false;
    //console.log(f);
    let points,prv=parseFunc(f,minx);
    //console.log(prv);
    if(prv==null) return false;
    var increment=step/32;
    for(var i=minx+increment;i<=maxx;i+=increment){
        i=trim(i,6);
        var curr=parseFunc(f,i);
        //if(Math.abs(i)<increment) console.log(curr);
        if(isFinite(prv) && isFinite(curr)){
            drawsegment(i-increment,prv,i,curr,3,color);
            //return;
        }
        prv=curr;
    }
    return true;
}
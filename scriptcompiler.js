var code,ptr;
function getLine(curr_ptr){
    var line=1;
    for(var i=0;i<=curr_ptr;i++)
        line+=(code[i]=='\n');
    return line;
}
function validNumber(str) {
    if (typeof str != "string") return false;
    var num=parseFloat(str);
    return !isNaN(str) && !isNaN(parseFloat(str)) && num==str;
}
function validColor(c){
    return CSS.supports('color',c);
}
var curr_line;
function CPE(message){
    document.getElementById('msg').innerText=message+' (line '+ curr_line+')';
}
function readInstruction(){
    var j=ptr;
    var instruction="";
    while(j<code.length && code[j]!=';'){
        if(code[j]=='%'){
            while(j<code.length && code[j]!='\n') 
                j++;
            continue;
        }
        if(code[j]=='\n'){
            if(!(instruction.length>0 && instruction[instruction.length-1]==" "))
                instruction+=" ";
        }
        else instruction+=code[j];
        j++;
    }
    //console.log(j,code.length);
    ptr=j+1;
    return instruction;
}
/// Point, Segment, Line, Triangle, Filltri, Disk, Circle, Rect, Fillrect, Square, Fillsquare, Polygon, Polyfill, Function
let aliases={Segment: "Segm", Rectangle: "Rect", Triangle: "Tri", Filltriangle: "Filltri", Fillrect: "Fillr", Square: "Sqr", Fillsquare: "Fillsqr", Polygon: "Poly", Polyfill: "Fillpoly", Function: "Func"};
//let valid_instructions=["Point","Segm","Line","Tri","Disk","Circle","Rect","Fillr","Sqr","Fillsqr","Poly","Fillpoly","Func"];
let min_expected_tokens={Point: 3, Segm: 5, Line: 5, Tri: 7, Filltri: 7, Circle: 4, Disk: 4, Rect: 5, Fillr: 5, Sqr: 4, Fillsqr: 4, Poly: 7, Fillpoly: 7, Func: 2, Text: 5};
let max_expected_tokens={Point: 4, Segm: 6, Line: 6, Tri: 8, Filltri: 8, Circle: 5, Disk: 5, Rect: 6, Fillr: 6, Sqr: 5, Fillsqr: 5, Poly: 1000, Fillpoly: 1000, Func: 1000, Text: 6};
function dealias(alias){
    if(aliases[alias]!==undefined) return aliases[alias];
    return alias;
}
function compilescript(){
    line=1,col=0;
    code=getItem('gridscript')+'\n';
    ptr=0;
    document.getElementById('msg').innerText='';
    while(ptr<code.length){
        //console.log(ptr);
        if(code[ptr]==' ' || code[ptr]=='\n'){
            ptr++;
            continue;
        }
        if(code[ptr]=='#'){
            while(ptr<code.length && code[ptr]!='\n') ptr++;
            continue;
        }
        curr_line=getLine(ptr);
        var line=readInstruction();
        if(ptr>code.length){
            CPE("Expected ';' after instruction",ptr-2);
            return;
        }
        var tokens=line.split(' '),instruction=dealias(tokens[0]);
        //console.log(tokens);
        if(min_expected_tokens[instruction]===undefined || max_expected_tokens[instruction]===undefined){
            CPE('Unknown instruction "'+tokens[0]+'"');
            return;
        }
        var min_tokens=min_expected_tokens[instruction],max_tokens=max_expected_tokens[instruction];
        //console.log(min_tokens,tokens,max_tokens);
        if(tokens.length<min_tokens){
            CPE('Not enough parameters provided for instruction "'+tokens[0]+'"');
            return;
        }
        if(tokens.length>max_tokens){
            CPE('Too many parameters provided for instruction "'+tokens[0]+'"');
            return;
        }
        if(instruction=='Tri') instruction='Poly';
        else if(instruction=='Filltri') instruction='Fillpoly';

        if(instruction=='Func'){
            var functiondefinition='',color='#000000',lasttoken=tokens.length-1;
            if(validColor(tokens[lasttoken])){
                color=tokens[lasttoken];
                lasttoken--;
            }
            for(var i=1;i<=lasttoken;i++) functiondefinition+=tokens[i];
            //console.log(functiondefinition);
            if(!drawFunc(functiondefinition,color)){
                CPE('Unable to parse function definition');
                return;
            }
        }
        else if(instruction=='Poly' || instruction=='Fillpoly'){
            var n=tokens.length,color="#000000";
            if(n%2==0){
                if(validColor(tokens[n-1])){
                    color=tokens[n-1];
                    n--;
                }
                else{
                    if(validNumber(tokens[n-1])) CPE('Odd number of coordinates provided for instruction "'+tokens[0]+'"');
                    else CPE('Invalid color "'+tokens[n-1]+'" provided for instruction "'+tokens[0]+'"');
                    return;
                }
            }
            var params=tokens.slice(1,n);
            for(var i=0;i<params.length;i++){
                if(!validNumber(params[i])){
                    CPE('Invalid parameter "'+params[i]+'" provided for instruction "'+tokens[0]+'"');
                    return;
                }
            }
            if(instruction=='Poly') drawpoly(params,color);
            else fillpoly(params,color);
        }
        else{
            var n=tokens.length,color="#000000";
            if(n==max_tokens){
                if(validColor(tokens[n-1])){
                    color=tokens[n-1];
                    n--;
                }   
                else{
                    CPE('Invalid color "'+tokens[n-1]+'" provided for instruction "'+tokens[0]+'"');
                    return;
                }
            }
            var params=tokens.slice(1,n);
            for(var i=0;i<params.length;i++){
                if(instruction=="Text" && i==0) continue;
                if(!validNumber(params[i])){
                    CPE('Invalid parameter "'+params[i]+'" provided for instruction "'+tokens[0]+'"');
                    return;
                }
                params[i]=parseFloat(params[i]);
            }
            //console.log(params[2]);
            if(instruction=='Point') drawpoint(params[0],params[1],4,color);
            else if(instruction=='Segm') drawsegment(params[0],params[1],params[2],params[3],4,color);
            else if(instruction=='Line'){
                if(params[0]==params[2] && params[1]==params[3]){
                    CPE('Coordinates of the two points cannot coincide for instruction "'+tokens[0]+'"');
                    return;
                }
                drawline(params[0],params[1],params[2],params[3],4,color);
            }
            else if(instruction=='Text'){
                drawtext(params[1],params[2],params[0],params[3],color);
            }
            else if(instruction=='Rect') drawpoly([params[0],params[1],params[2],params[1],params[2],params[3],params[0],params[3]],color);
            else if(instruction=='Fillr') fillpoly([params[0],params[1],params[2],params[1],params[2],params[3],params[0],params[3]],color);
            else if(instruction=='Sqr') drawpoly([params[0],params[1],params[0],params[1]+params[2],params[0]+params[2],params[1]+params[2],params[0]+params[2],params[1]],color);
            else if(instruction=='Fillsqr') fillpoly([params[0],params[1],params[0],params[1]+params[2],params[0]+params[2],params[1]+params[2],params[0]+params[2],params[1]],color);
            else if(instruction=='Circle') drawcircle(params[0],params[1],params[2],color);
            else if(instruction=='Disk') drawdisk(params[0],params[1],params[2],color);
            else CPE('Compiler bug');
        }
    }
}
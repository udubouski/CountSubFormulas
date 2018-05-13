function check_str(str) {
    var a=str;
    var str2=str;
    while (true) {
        var a2=a;
        str2=a;
        a=replase_neg_letters(a2);
        a2=a;
        a=replase_letters(a2);
        a2=a;
        /*a=replase_neg_letters_br(a2);
        a2=a;*/
        a=replase_operations_br(a2);
        if (a == str2) {
            break
        }
    }
    return /*replase_operations_res*/(a);
}

function replase_letters(str){
    var regexp = /[A-Z,1,0]/gi;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}
function replase_neg_letters(str){
    var regexp = /\(\![A-Z,1,0]\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}
function replase_neg_letters_br(str){
    var regexp = /\(\![A-Z,1,0]\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}

function replase_operations_br(str){
    var regexp = /\(([A-Z,1,0])(->|&|~|\|)([A-Z,1,0])\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}

function replase_operations_res(str){
    var regexp = /([A-Z,1,0])(->|&|~|\|)([A-Z,1,0])/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}

function check() {
    //"1|0&!0"
    var vir1=document.getElementById('expr1').value;
    var vir2=document.getElementById('expr2').value;
    var all_vir=("("+vir1+")"+"-"+"("+vir2+")");
    if(check_str(vir1)=="A"&&check_str(vir2)=="A")
        //alert(calculate(document.getElementById('expr1').value));
        initCalculation(all_vir);
    else alert("incorrect");
   // alert(check_str(document.getElementById('expr1').value))
    //document.getElementById('expr1').innerHTML="";
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function isDelim(c) {
    return c == ' ';
}

function isOperator(c) {
    return c == '~' || c == '-' || c == '|' || c == '&' || c == '!';
}

function processOperator(st, op) {
    var r = st.pop();
    if (op != '!') {
    var l = st.pop();
    //alert(l + op + r);
    }
    //else alert('!'+r);
    switch (op) {
        case '~':
            if(r==l)
                st.push('1');
            else st.push('0');
            break;
        case '-':
            if(r==l|r=='1')
                st.push('1');
            else st.push('0');
            break;
        case '|':
            if(l=='1'||r=='1')
            st.push('1');
            else st.push('0');
            break;
        case '&':
            if(l==r&&l=='1')
                st.push('1');
            else st.push('0');
            break;
        case '!':
            if(r=='1')
                st.push('0');
            else st.push('1');
            break;
    }
}
var set=[];

function addInSet(el){
    var bool=true;
    for(var i=0; i<set.length;i++){
        if(set[i]==el) {
            bool = false;
            break;
        }
    }
    if(bool){
        set.push(el)
    }
}

function isLetter(s) {
    if (s == '1' || s == '0') {
       // addInSet(s);
        return true;
    }
    else return false;
}

function isVariable(s) {
    if (s >= 'A' && s <= 'Z') {
        return true;
    }
    else return false;
}

function priority(op) {
    switch (op) {
        case '~':
            return 1;
        case '-':
            return 2;
        case '|':
            return 3;
        case '&':
            return 4;
        case '!':
            return 5;
        default:
            return -1;
    }
}

function replase_operations_res(str){
    var regexp = /([A-Z,1,0])(->|&|~|\|)([A-Z,1,0])/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}

function replase_impl(str){
    var regexp = /->/g;
    var ab = str.replace(regexp,"-");
    if(ab!=null||ab!=undefined)
        return ab;
    else return str;
}

function calculate(s){
    var st = [];
    var op = [];
    for (i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (isDelim(c))
            continue;
        if (c == '(')
            op.push('(');
        else if (c == ')') {
            while (op[op.length - 1] != '(')
                processOperator(st, op.pop());
            op.pop();
        } else if (isOperator(c)) {
            while (op.length != 0 && priority(op[op.length - 1]) >= priority(c))
                processOperator(st, op.pop());
            op.push(c);
        } else {
            var operand = "";
            while (i < s.length && (isLetter(s.charAt(i))))
                operand += s.charAt(i++);
            --i;
            st.push(operand);
        }
    }
    while (op.length != 0)
        processOperator(st, op.pop());
    return st[0];
}

var values=[];

function initCalculation(s){
    createVariablesSet(s);
    //alert(set+s);
    var tr=true;
    for(koll=0;koll<Math.pow(2,set.length);koll++) {
        values=[];
        for(i=0;i<set.length;i++)
            values.push('0');
        var val = (koll).toString(2).split("");
        for (i = 0; i < val.length; i++){
            values.push(val[i]);
            values.shift();
        }
      //  alert(values+" "+initVariablesInExpression(s));

        if(calculate(replase_impl(initVariablesInExpression(s)))==0) {
            tr = false;
            break;
        }
    }

    alert(tr);
}

function createVariablesSet(str) {
    for(i=0;i<str.length;i++){
        if(isVariable(str[i])){
            addInSet(str[i])
        }
    }
}

function initVariablesInExpression(str){
    var newStr=str.split("");
    for(i=0;i<str.length;i++){
    for(j=0;j<set.length;j++)
        if(str[i]==set[j]){
            newStr[i]=(values[j]);
            //alert(values[j])
        }
    }
    return newStr.join("");
}
/*
createVariavlesSet("A|B|!(C&!D)");
var variables=[0,0,1,1];
alert(set);
alert(initVariablesInExpression("A|B|!(C&!D)"));*/
//alert(calculate(""));
//alert(set);
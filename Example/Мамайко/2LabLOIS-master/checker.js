function check_str(str) {
       var a=str;
    while (true) {
        var a2=a;
        a=replase_letters(a2);
        a2=a;
        a=replase_neg_letters(a2);
        a2=a;
        a=replase_neg_letters_br(a2);
        a2=a;
        a=replase_operations_br(a2);
        if (a == a2) {
            break
        }
    }
    return replase_operations_res(a);
}

function replase_letters(str){
    var regexp = /\([A-Z,1,0]\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null|ab!=undefined)
    return ab;
    else return str;
}

function replase_neg_letters(str){
    var regexp = /\![A-Z,1,0]/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null|ab!=undefined)
    return ab;
    else return str;
}

function replase_neg_letters_br(str){
    var regexp = /\(\![A-Z,1,0]\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null|ab!=undefined)
    return ab;
    else return str;
}

function replase_operations_br(str){
    var regexp = /\(([A-Z,1,0])(->|&|~|\|)([A-Z,1,0])\)/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null|ab!=undefined)
    return ab;
    else return str;
}

function replase_operations_res(str){
    var regexp = /([A-Z,1,0])(->|&|~|\|)([A-Z,1,0])/g;
    var ab = str.replace(regexp,"A");
    if(ab!=null|ab!=undefined)
        return ab;
    else return str;
}

function check() {
    //"1|0&!0"
    if(check_str(document.getElementById('expr1').value)=="A")
        alert("true");
    else  alert("false");
}

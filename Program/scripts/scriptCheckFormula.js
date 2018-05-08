/*
@author: Весь код данной лабораторной работы полностью разработан студентом группы 521701 Дубовским В.В.
*/
"use strict"

function checkFormula() {
	var firstFormula = document.getElementById("firstFormula").value; 
		var secondFormula = document.getElementById("secondFormula").value; 
    if (firstFormula != "" && secondFormula != "" && verificateFormula(firstFormula) && verificateFormula(secondFormula)) {
      // заменяет минусы в импликациях
        firstFormula = changeImplication(firstFormula); //из второго инпута
        secondFormula = changeImplication(secondFormula);// из первого инпута
        // создает массив символов(констант) из первой формулы
        var FirstSymbolsArray = new Array();
        // считает количество констант
        var numberOfSymbolsFirst = countSymbols(firstFormula, FirstSymbolsArray);

        var SecondSymbolsArray = new Array();
        var numberOfSymbolsSecond = countSymbols(secondFormula, SecondSymbolsArray);
        //
        checkSymbolsOfArrays(FirstSymbolsArray, SecondSymbolsArray);

        var answer;
 
        var firstFormulaMatrix = buildMatrix(firstFormula, FirstSymbolsArray, FirstSymbolsArray.length);
        var secondFormulaMatrix = buildMatrix(secondFormula, SecondSymbolsArray, SecondSymbolsArray.length);

        var followTest = followCheck(firstFormulaMatrix, secondFormulaMatrix);

        if (followTest == true) {
        	answer = "Формула 1:" + secondFormula + " следует из формулы 2:" + firstFormula;
        	alert(answer);
        	
        } else if (followTest == false) {
        	answer = "Формула 1:" + secondFormula + " не следует из формулы 2:" + firstFormula;
        	alert(answer);
        
        }

    } else {
        alert("Неправильно введены формулы")
    }
}
var unaryOrBinaryComplexFormula = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])', 'g');
var atomOrConstant = new RegExp('([A-Z]|[0-1])', 'g');
var replaceFormula = "R";
var result;
var tempFormula;

function verificateFormula(formula){

      while (formula != tempFormula ) {
        tempFormula = formula;
        formula = formula.replace(unaryOrBinaryComplexFormula, replaceFormula);
      }
      tempFormula=0;
    var resultType = formula.match(new RegExp(atomOrConstant, 'g'));
    if ((formula.length == 1) && (resultType != null) && (resultType.length == 1)) {
        return true;
    } else {
        return false;
    }
}

function checkSymbolsOfArrays(FirstSymbolsArray, SecondSymbolsArray) {
    for (var i = 0; i < FirstSymbolsArray.length; i++) {
        if (checkSymbolsInArr(FirstSymbolsArray[i], SecondSymbolsArray) == false) {
            SecondSymbolsArray[SecondSymbolsArray.length] = FirstSymbolsArray[i];
        }
    }
    for (var i = 0; i < SecondSymbolsArray.length; i++) {
        if (checkSymbolsInArr(SecondSymbolsArray[i], FirstSymbolsArray) == false) {
            FirstSymbolsArray[FirstSymbolsArray.length] = SecondSymbolsArray[i];
        }
    }
    for (var i = 0; i < FirstSymbolsArray.length; i++) {
        SecondSymbolsArray[i] = FirstSymbolsArray[i];
    }
}

function checkSymbolsInArr(symbol, masForCheck) {
    for (var i = 0; i < masForCheck.length; i++) {
        if (masForCheck[i] == symbol) {
            return true;
        }
    }
    return false;
}

function changeImplication(formula) {
    var temp = formula;
    for (var i = 0; i < temp.length; i++) {
        var char = temp.substring(i, i + 1);
        if (char == "-") {
            temp = temp.substring(0, i) + temp.substring(i + 1, temp.length);
        }
    }
    return temp;
}

function buildMatrix(formula, masOfSymbols, numberOfSymbols) {
  // считаем количество скобок(операций)
    var numberOfBrackets = countBrackets(formula);
    var column = numberOfSymbols + +numberOfBrackets;
    var line = Math.pow(2, numberOfSymbols);
    var mas = new Array(line);
    for (var i = 0; i < line; i++) {
        for (var j = 0; j < column; j++) {
            mas[i] = new Array(column);
        }
    }
    searchOperation(formula, masOfSymbols);
    fillMatrix(mas, masOfSymbols, numberOfSymbols);
    return mas;
}

function fillMatrix(mas, masOfSymbols, numberOfSymbol) {
    for (var i = 0; i < mas.length; i++) {
        var tempMas = toBinaryNumber(i.toString(2), numberOfSymbol);
        for (var j = 0; j < mas[i].length; j++) {
            if (j < numberOfSymbol) {
                mas[i][j] = tempMas[j];
            } else {
                mas[i][j] = doOperations(mas, i, masOfSymbols, masOfSymbols[j]);
            }
        }
    }
}

function doOperations(mas, line, masOfFormulas, formula) {
    var temp = formula.substring(1, formula.length - 1);
    for (var i = 0; i < temp.length; i++) {
        var char = temp.substring(i, i + 1);
        var char2 = temp.substring(i + 2, i + 3);
        var temp2 = +0;
// проверка на наличие операции
// проверить не только элемент который сейчас
        if (char == "(") {
           do {
               i++;
               char = temp.substring(i, i + 1);
               if( /[& | \| | \- | ~ | !]/.test(char) == true) {
                   temp2 ++;
               }
               if(char == ")") {
                   temp2 --;
               }

            } while (char != ")" && +temp2 != +0);
        }
        if (char == "&" && char2 != ")") {
            return AND(temp, i, masOfFormulas, line, mas);
        } else if (char == "|" && char2 != ")") {
            return OR(temp, i, masOfFormulas, line, mas);
        } else if (char == ">" && char2 != ")") {
            return IMPLICATION(temp, i, masOfFormulas, line, mas);
        } else if (char == "~" && char2 != ")") {
            return EQUIVALENCE(temp, i, masOfFormulas, line, mas);
        } else if (char == "!") {
            return NOT(temp, i, masOfFormulas, line, mas);
        }
    }
}

function toBinaryNumber(number, numberOfSymbols) {
    var mas = new Array(numberOfSymbols);
    for (var i = 0; i < numberOfSymbols - number.length; i++) {
        mas[i] = 0;
    }
    var j = 0;
    for (var i = numberOfSymbols - number.length; i < numberOfSymbols; i++) {
        mas[i] = parseInt(number[j]);
        j++;
    }
    return mas;
}

function searchOperation(formula, masOfSymbols) {
    var masOfOpenedBrackets = new Array();
    var masOfClosedBrackets = new Array();
    var positionOfClosedBracket = 0;
    var positionOfOpenedBracket = 0;
    for (var i = 0; i < formula.length; i++) {
        var char = formula.substring(i, i + 1);
        if (char == ")") {
          // проверяем была ли эта скобка или нет
            if (checkBrackets(masOfClosedBrackets, i) == false) {
                masOfClosedBrackets[masOfClosedBrackets.length] = i;
                positionOfClosedBracket = i;
                var bool = false;
                for (var j = positionOfClosedBracket; j != -1; j--) {
                    var char = formula.substring(i, i + 1);
                    if (char == "(") {
                        if (bool == false) {
                            if (checkBrackets(masOfOpenedBrackets, i) == false) {
                                masOfOpenedBrackets[masOfOpenedBrackets.length] = i;
                                positionOfOpenedBracket = i;
                                bool = true;
                                var subFormula = formula.substring(positionOfOpenedBracket, positionOfClosedBracket + 1);
                                // находим подформулу (символ или выражение)
                                if (checkSymbol(masOfSymbols, subFormula) == false) {
                                  //массив подформул
                                    masOfSymbols[masOfSymbols.length] = subFormula;
                                }
                            }
                        }
                        i--;
                    } else {
                        i--;
                    }
                }
            }
        }
    }
}

//!*
function countSymbols(formula, mas) {
    var result = 0;
    for (var i = 0; i < formula.toString().length; i++) {
        var checkSymbols = false;
        var char = formula.substring(i, i + 1);
        if (/[A-Z]/.test(char) == true) {
            for (var j = 0; j < mas.length + 1; j++) {
                if (mas[j] == char) {
                    checkSymbols = true;
                }
            }
            if (checkSymbols == false) {
                mas[mas.length] = char;
                result++;
            }
        }
    }
    return result;
}

function countBrackets(formula) {
    var result = 0;
    for (var i = 0; i < formula.toString().length; i++) {
        var char = formula.substring(i, i + 1);
        if (char == "(") {
            result++;
        }
    }
    return result;
}
function checkSymbol(mas, symbol) {
    for (var i = 0; i < mas.length; i++) {
        if (mas[i].toString() == symbol.toString()) {
            return true;
        }
    }
    return false;
}
function checkBrackets(mas, position) {
    for (var i = 0; i < mas.length; i++) {
        if (mas[i] == position) {
            return true;
        }
    }
    return false;
}
function findFormula(mas, formula) {
    for (var i = 0; i < mas.length; i++) {
        if (mas[i].toString() == formula.toString()) {
            return i;
        }
    }
    return -1;
}

function AND(temp, position, masOfFormulas, line, mas) {
    var subFormulaLeft = temp.substring(0, position);
    var subFormulaRight = temp.substring(position + 1, temp.length);
    var position1 = findFormula(masOfFormulas, subFormulaLeft);
    var position2 = findFormula(masOfFormulas, subFormulaRight);
    return mas[line][position1] & mas[line][position2];
}

function OR(temp, position, masOfFormulas, line, mas) {
    var subFormulaLeft = temp.substring(0, position);
    var subFormulaRight = temp.substring(position + 1, temp.length);
    var position1 = findFormula(masOfFormulas, subFormulaLeft);
    var position2 = findFormula(masOfFormulas, subFormulaRight);
    return mas[line][position1] | mas[line][position2];
}

function IMPLICATION(temp, position, masOfFormulas, line, mas) {
    var subFormulaLeft = temp.substring(0, position);
    var subFormulaRight = temp.substring(position + 1, temp.length);
    var position1 = findFormula(masOfFormulas, subFormulaLeft);
    var position2 = findFormula(masOfFormulas, subFormulaRight);
    var tempValue1 = mas[line][position1];
    var tempValue2 = mas[line][position2];
    if (tempValue1 == 0 && tempValue2 == 0) {
        return 1;
    } else if (tempValue1 == 0 && tempValue2 == 1) {
        return 1;
    } else if (tempValue1 == 1 && tempValue2 == 0) {
        return 0;
    } else if (tempValue1 == 1 && tempValue2 == 1) {
        return 1;
    }
    // return -1;
}

function EQUIVALENCE(temp, position, masOfFormulas, line, mas) {
    var subFormulaLeft = temp.substring(0, position);
    var subFormulaRight = temp.substring(position + 1, temp.length);
    var position1 = findFormula(masOfFormulas, subFormulaLeft);
    var position2 = findFormula(masOfFormulas, subFormulaRight);
    var tempValue1 = mas[line][position1];
    var tempValue2 = mas[line][position2];
    if (tempValue1 == 0 && tempValue2 == 0) {
        return 1;
    } else if (tempValue1 == 0 && tempValue2 == 1) {
        return 0;
    } else if (tempValue1 == 1 && tempValue2 == 0) {
        return 0;
    } else if (tempValue1 == 1 && tempValue2 == 1) {
        return 1;
    }
    // return -1;
}

function NOT(temp, position, masOfFormulas, line, mas) {
    var subFormulaRight = temp.substring(position + 1, temp.length);
    var position1 = findFormula(masOfFormulas, subFormulaRight);
    return +!mas[line][position1];
}

function followCheck(firstMatrix, secondMatrix) {
    var size = 0;
    if (firstMatrix.length > secondMatrix.length) {
        size = secondMatrix.length;
    } else {
        size = firstMatrix.length;
    }
    for (var i = 0; i < size; i++) {
        if (firstMatrix[i][firstMatrix[i].length - 1] == 1 && secondMatrix[i][secondMatrix[i].length - 1] == 0) {
            return false;
        }
    }
    return true;
}

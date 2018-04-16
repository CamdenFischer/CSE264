var stack = [];
var curDisplay = '0';
var dec = 0;
replace = 0

function click(x){
    switch(x){
        case 'C':
            stack = [];
            curDisplay = '0';
            break;
        case 'push':
            stack.push(parseFloat(curDisplay));
            curDisplay = '';
            break;
        case '/':
            operate('/');
            break;
        case '*':
            operate('*');
            break;
        case '-':
            operate('-');
            break;
        case '+':
            operate('+');
            break;
        case '+/-':
            if (curDisplay.charAt(0) === '-'){
                curDisplay = curDisplay.substring(1, curDisplay.length());
            } else {
                curDisplay = '-' + curDisplay;
            }
            break;
        case '.':
            if (curDisplay.indexOf('.') == -1){
                curDisplay += x;
            }
            break;

        //If it reaches default, it is just a number or a decimal
        //so we add it to the current display
        default:
        if (curDisplay === '0' || replace == 1){
            curDisplay = x;
        } else {
            curDisplay += x;
        }
    }
    updateDisplay();
}

function updateDisplay(){
    document.getElementById("display").value = curDisplay;
}

function operate(x){
    var num1 = stack.pop();
    var num2 = stack.pop();

    if (x === '/'){
        curDisplay = num2 / num1;
    } else if (x === '*'){
        curDisplay = num2 * num1;
    } else if (x === '+'){
        curDisplay = num2 + num1;
    } else if (x === '-'){
        curDisplay = num2 - num1;
    }

    stack.push(parseFloat(curDisplay));
    replace = 1;
}

function clickZero(){
    click('0');
}

function clickOne(){
    click('1');
}

function clickTwo(){
    click('2');
}

function clickThree(){
    click('3');
}

function clickFour(){
    click('4');
}

function clickFive(){
    click('5');
}

function clickSix(){
    click('6');
}

function clickSeven(){
    click('7');
}

function clickEight(){
    click('8');
}

function clickNine(){
    click('9');
}

function clickC(){
    click('C');
}

function clickPush(){
    click('push');
}

function clickDecimal(){
    click('.');
}

function clickDivide(){
    click('/');
}

function clickMultiply(){
    click('*');
}

function clickAdd(){
    click('+');
}

function clickSubtract(){
    click('-');
}

function clickSignSwitch(){
    click('+/-');
}
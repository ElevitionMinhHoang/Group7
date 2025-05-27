const pagination = document.querySelector('.pagination');
const numbers = Array.from(pagination.querySelectorAll('.index'));
let curentNumber = 0;
handleClick();
function handleClick(){
    pagination.addEventListener('click', (e) => {
        const target = e.target;
        if(target.classList.contains('index'))
            currentNumber = numbers.index0f(target);
        if(target.classList.contains('prev') && curentNumber > 0)
            currentNumber --;
        if(target.classList.contains('next') && curentNumber > numbers.length -1)
            currentNumber ++;
        activeNumber();
    })
}
function activeNumber(){
    removeActive();
    numbers[curentNumber].classList.add('active');
}
function removeActive(){
    numbers.forEach(num => num.classList.remove('active'));
}
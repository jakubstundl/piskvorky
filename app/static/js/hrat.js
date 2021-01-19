'use strict';

let isPlaying = 'circle';
let state = "";

const btnsElm = document.querySelectorAll('.square');
for (let i = 0; i < btnsElm.length; i += 1) {
  btnsElm[i].addEventListener('click', () => {
    //console.log("test"+[i])
    
    if (isPlaying === 'circle') {
      if (
        !btnsElm[i].classList.contains('O') &&
        !btnsElm[i].classList.contains('X')
      ) {
        btnsElm[i].classList.add('O');
        btnsElm[i].disabled = true;
        isPlaying = 'cross';
        document.querySelector('.cssCircle').classList.toggle('cssCross');
      }
    } else {
      if (
        !btnsElm[i].classList.contains('O') &&
        !btnsElm[i].classList.contains('X')
      ) {
        btnsElm[i].classList.add('X');
        btnsElm[i].disabled = true;
        isPlaying = 'circle';
        document.querySelector('.cssCircle').classList.toggle('cssCross');
      }
    }
    //isWinningMove(btnsElm[i])

    if (isWinningMove(btnsElm[i])) {
      setTimeout(()=>{
      if (isPlaying === 'circle') {
        if (confirm('Vyhrál křížek')) {
          location.reload()
        };
      } else if 
      (confirm('Vyhrálo kolečko')) {
        location.reload()
      };
    },200)
    }
    console.log(stateOfGame())
  });
}
//vyhra
const getPosition = (field) => {
  let i = 0;
  while (field !== btnsElm[i]) {
    i += 1;
  } //console.log(i)
  let tens = 0;
  let units = 0;
  for (let j = 0; j < i; j += 1) {
    units += 1;
    if (units === 10) {
      tens += 1;
      units = 0;
    }
  }
  //console.log(`tens=${tens} a units=${units}`);
  return {
    row: tens,
    column: units,
  };
};

const getField = (row, column) => {
  const i = row * 10 + column;
  return btnsElm[i];
};
//console.log(getPosition(getField(2,1)))

const getSymbol = (field) => {
  //return undefined
  let temp = undefined;
  if (field.classList.contains('X')) {
    temp = 'cross';
  } else if (field.classList.contains('O')) {
    temp = 'circle';
  }
  return temp;
};

const isWinningMove = (field) => {
  const originalSymbol = getSymbol(field)
  const coordsJSON = getPosition(field)
  const row = coordsJSON.row
  const column = coordsJSON.column

  let rowSymbols = []
  for(let i=0;i<10;i+=1){
    rowSymbols.push(getSymbol(getField(row,i)))
  }

  let columnSymbols = []
    for(let i=0;i<10;i+=1){
      columnSymbols.push(getSymbol(getField(i,column)))
    }
  
  let leanUpSymbols = []
   for(let i=0;i<getCoordsLeanUp(column,row).count;i+=1){
     leanUpSymbols.push( getSymbol(  getField( getCoordsLeanUp(column,row).startY-i,getCoordsLeanUp(column,row).startX+i) )   )
   }
   //console.log(leanUpSymbols)
   let leanDownSymbols = []
   for(let i=0;i<getCoordsLeanDown(column,row).count;i+=1){
     leanDownSymbols.push( getSymbol(  getField( getCoordsLeanDown(column,row).startY+i,getCoordsLeanDown(column,row).startX+i) )   )
   }
   //console.log(leanDownSymbols)
  
   const isWinning = (list) =>{
    let n=0
    for(let i=0;i<list.length;i+=1){
        //console.log(list[i]+' '+originalSymbol)
      if (list[i]===originalSymbol){        
        n+=1
        if(n>4){return true}        
      }else{n=0}    }
    return false
  }


   if( isWinning(rowSymbols) || isWinning(columnSymbols) || isWinning(leanUpSymbols) || isWinning(leanDownSymbols) ){

     return true
   }else{return false}
  
  



  
  
}

const getCoordsLeanUp = (x,y) =>{
  let startX0 = x
  let startY0 = y
  let endX0 = x
  let endY0 = y
  while(startX0>0 && startY0<9){
    startX0 -=1
    startY0 +=1
  }
  while(endX0<9 && endY0>0){
    endX0 +=1
    endY0 -=1
  }
  let tempStartX = startX0
  let tempStartY = startY0
  let count0 = 1
  while(tempStartX!=endX0 && tempStartY!=endY0){
    tempStartX +=1
    tempStartY -=1
    count0 +=1
  }

 return {startX:startX0,startY:startY0,count:count0}
}
const getCoordsLeanDown = (x,y) =>{
  let startX0 = x
  let startY0 = y
  let endX0 = x
  let endY0 = y
  while(startY0>0 && startX0>0){
    startX0 -=1
    startY0 -=1
  }
  while(endY0<9 && endX0<9){
    endX0 +=1
    endY0 +=1
  }
  let tempStartX = startX0
  let tempStartY = startY0
  let count0 = 1
  while(tempStartX!=endX0 && tempStartY!=endY0){
    tempStartX +=1
    tempStartY +=1
    count0 +=1
  }

 return {startX:startX0,startY:startY0,count:count0}
}


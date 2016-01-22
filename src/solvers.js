/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findSolution = function(row, n, board, validator, callback) {

    if (row === n) {

        return callback();

    }

    for (var i = 0; i < n; i++) { //iterate through spaces in each row;

        board.togglePiece(row, i);

        if (!board[validator]()) {

            var result = findSolution(row + 1, n, board, validator, callback);
            if ( result ) {
              return result;
            }
        }

        board.togglePiece(row, i);
    }
};



window.findNRooksSolution = function(n) {
    var board = new Board({
        n: n
    });


    //starting at the beginning.
    var solution = findSolution(0, n, board, "hasAnyRooksConflicts", function() {
        return _.map(board.rows(), function(row) {
            return row.slice();
        });
    });


    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
    return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
    var solutionCount = 0; //fixme

    var board = new Board({
        n: n
    });


    //starting at the beginning.
    findSolution(0, n, board, "hasAnyRooksConflicts", function() {
        solutionCount++;
    });


    console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
    return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
    var board = new Board({
        n: n
    });

    //starting at the beginning.
    var solution = findSolution(0, n, board, "hasAnyQueensConflicts", function() {
        return _.map(board.rows(), function(row) {
            return row.slice();
        });
    }) || board.rows();



    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
    return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
    var solutionCount = 0; //fixme

    var board = new Board({
        n: n
    });


    //starting at the beginning.
    findSolution(0, n, board, "hasAnyQueensConflicts", function() {
            solutionCount++;
    });

    console.log('Number of solutions for ' + n + ' queens:', solutionCount);
    return solutionCount;
};

//WE GENUINELY THOUGHT OF THIS FOR THE RECORD

// rowIndices
// majorIndexes
// minorIndexes

// recover queens in relative steps backward if fails
//If # of Queens doesn't match N
// if answer does not statisfy if statements, recurse
// remove immediate bottom 3
// splice out conflicted spaces
// remove rows and indexes
// iterate through columns
// place queen
// splice from rowInd, majInd, and minInd

// TREE STRUCTURE!!!


//     myBoard = new Board({n: n});

//     //access the array of rows;
//     var allRows = myBoard.rows();
//     //setting variables for row and space index
//     var rowIndex = 0;
//     var spaceIndex = 0;

// //recursive function
//     var findSolution = function(row) {
//
//         for (var i = startingIndex; i < allRows[0].length; i++) { //iterate through spaces in each row;
//                 if (myBoard.hasAnyMinorDiagonalConflicts() === true || myBoard.hasAnyMajorDiagonalConflicts() === true || myBoard.hasAnyColConflicts() === true || myBoard.hasAnyRowConflicts() === true) {
//                     findSolution(allRows[rowIndex][spaceIndex + 1]);
//                 } else {
//                     myBoard.togglePiece(i, rowNumber);
//                 }
//             }
//     };

// //starting at the beginning.
//     findSolution(0);



// _.each(allRows, function(row, index) {
//     _.each(row, function(square) {
//         if (myBoard.hasAnyMinorDiagonalConflicts() === true || myBoard.hasAnyMajorDiagonalConflicts() === true || myBoard.hasAnyColConflicts() === true || myBoard.hasAnyRowConflicts() === true) {
//             myBoard.togglePiece(index, square);
//         } else {
//             continue;
//         }
//     });
// });


/////////////////////




////////////////////////


// window.findNRooksSolution = function(n) {

//     myBoard = new Board({
//         n: n
//     });
//     var rowIndexes = _.range(0, n);
//     // iterate through every row on the board and place one rook
//     // iterating through each column and place rook on random rowIndex
//     for (var colIndex = 0; colIndex < n; colIndex++) { //Column 0
//         var rowIndex = _.random(0, rowIndexes.length - 1);
//         myBoard.togglePiece(rowIndexes[rowIndex], colIndex); //  and 0
//         rowIndexes.splice(rowIndex, 1);
//     }
//     var solution = myBoard.rows();

//     console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
//     return solution;
// };

// window.findNQueensSolution = function(n) {
//     var solution = undefined; //fixme

// var myBoard = new Board({n:n});
// var rowIndices = _.range(0,n);
// var colIndices = _.range(0,n);

// if(n>3){
//   if(n % 2 === 0){ //can only start on even Indices (index: 1,3,5 ...)
//     //must start at even index
//     var evenIndices = _.filter(colIndices, function(value){
//       return value % 2 !== 0;
//     });

//     //store a random value from evenIndices
//     var randomEven = evenIndices[_.random(0,evenIndices.length-1)];
//     // _.random(0,evenIndices.length -1);

//     var counter = 0;
//     _.each(colIndices, function(colIndex){
//       if(colIndex === 0){ //starting point
//         myBoard.togglePiece(colIndex, rowIndices[randomEven]);
//       } else {
//           randomEven+=2;
//             if(rowIndices[randomEven]===undefined){
//             randomEven = 0 + counter; //restart randEven
//             counter++;
//             myBoard.togglePiece(colIndex, rowIndices[randomEven%(rowIndices.length-1)]);
//           } else {
//             myBoard.togglePiece(colIndex, rowIndices[randomEven]);
//           }
//       }
//     });
//     //filter and randomize an even index for start
//   } else { // odd number dimension allows start on anywhere
//     var randStart = _.random(0,n-1);
//     var counter=0;
//     _.each(colIndices, function(colIndex){
//       if(colIndex === 0){ //starting point
//         myBoard.togglePiece(colIndex, rowIndices[randStart]);
//       } else {

//         randStart+=2;
//           if(rowIndices[randStart]===undefined){
//             randStart-=rowIndices.length; //restart randStart
//             myBoard.togglePiece(colIndex, rowIndices[randStart%(rowIndices.length-1)]);
//             counter++;
//           } else {
//             myBoard.togglePiece(colIndex, rowIndices[randStart]);
//           }
//       }
//     });
//   }
// } else {
//   return new Board({n:n});
//   //no solution
// }


//     console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
//     return solution;
// };

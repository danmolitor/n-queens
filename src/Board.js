// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

    window.Board = Backbone.Model.extend({

        initialize: function(params) {
            if (_.isUndefined(params) || _.isNull(params)) {
                console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
                console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
                console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
            } else if (params.hasOwnProperty('n')) {
                this.set(makeEmptyMatrix(this.get('n')));
            } else {
                this.set('n', params.length);
            }
        },

        rows: function() {
            return _(_.range(this.get('n'))).map(function(rowIndex) {
                return this.get(rowIndex);
            }, this);
        },

        togglePiece: function(rowIndex, colIndex) {
            this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
            this.trigger('change');
        },

        _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
            return colIndex - rowIndex;
        },

        _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
            return colIndex + rowIndex;
        },

        hasAnyRooksConflicts: function() {
            return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
        },

        hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
            return (
                this.hasRowConflictAt(rowIndex) ||
                this.hasColConflictAt(colIndex) ||
                this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
                this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
            );
        },

        hasAnyQueensConflicts: function() {
            return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
        },

        _isInBounds: function(rowIndex, colIndex) {
            return (
                0 <= rowIndex && rowIndex < this.get('n') &&
                0 <= colIndex && colIndex < this.get('n')
            );
        },


        /*
                 _             _     _
             ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
            / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
            \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
            |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)
         */
        /*=========================================================================
        =                 TODO: fill in these Helper Functions                    =
        =========================================================================*/

        // ROWS - run from left to right
        // --------------------------------------------------------------
        //
        // test if a specific row on this board contains a conflict
        hasRowConflictAt: function(rowIndex) {
            if (this.attributes.n === 0) {
                return false;
            }

            // thisRow = this.get(rowIndex);
            // //set a counter
            // var count = 0;
            // //iterate throught the spaces on the row
            // _.each(thisRow, function(value) {
            //     //spaces with pieces === 1, so add 1 to count if any exist.
            //     count += value;
            //     console.log(count);
            //     //if there is more than 1, there is a conflict.
            // });
            // if (count > 1) {
            //     return true;
            // }

            // return false;


            return _.filter(this.get(rowIndex), function(value) {
                return value === 1;
            }).length > 1;

        },


        // test if any rows on this board contain conflicts
        hasAnyRowConflicts: function() {
            if (this.attributes.n === 0) {
                return false;
            }
            return _.some(this.rows(), function(row, rowIndex) {
                return this.hasRowConflictAt(rowIndex);
            }.bind(this)); //keep context to board instead of Window


        },



        // COLUMNS - run from top to bottom
        // --------------------------------------------------------------
        //
        // test if a specific column on this board contains a conflict
        hasColConflictAt: function(colIndex) {
            if (this.attributes.n === 0) {
                return false;
            }
            var counter = 0;
            var rows = this.rows();
            for (var i = 0; i < rows.length; i++) {
                if (rows[i][colIndex] === 1) {
                    counter++;
                }
            }

            return counter > 1;
            // refactored from:
            // var columns = _.zip.apply(null, this.rows()); //swap x and y. sees rows as separate args
            // return _.filter(columns[colIndex], function(value) {
            //     return value === 1;
            // }).length > 1;
        },
        hasAnyColConflicts: function() {
            var n = this.attributes.n;
            if (n === 0) {
                return false;
            }

            var conflict = false;

            for (var i = 0; i < n; i++) {
                conflict = this.hasColConflictAt(i) || conflict;
            }
            return conflict;

            // refactored from expensive solution:
            // var columns = _.zip.apply(null, this.rows());
            // return _.some(_.range(0, columns.length), function(colIndex) {
            //     return this.hasColConflictAt(colIndex);
            // }.bind(this)); // keep context in an inner function.

        },

        // Major Diagonals - go from top-left to bottom-right
        // --------------------------------------------------------------
        //
        // test if a specific major diagonal on this board contains a conflict
        hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
            if (this.attributes.n === 0) {
                return false;
            }
            var counter = 0;
            // two each loops, outer loop will be column index and inner will be row index
            _.each(this.rows(), function(row, colIndex) {
                // in inner each loop, check if column index minus row index equals argument value
                _.each(row, function(item, rowIndex) {
                    if (colIndex - rowIndex === majorDiagonalColumnIndexAtFirstRow && item === 1) {
                        counter++;
                    }
                });
            });
            return counter > 1;
        },

        // test if any major diagonals on this board contain conflicts
        hasAnyMajorDiagonalConflicts: function() {
            if (this.attributes.n === 0) {
                return false;
            }
            var indexArr = _.range(-1 * (this.rows().length - 1), this.get(0).length); //[0,1,2,3]
            return _.some(indexArr, function(index) {
                return this.hasMajorDiagonalConflictAt(index);
            }.bind(this));
        },



        // Minor Diagonals - go from top-right to bottom-left
        // --------------------------------------------------------------
        //
        // test if a specific minor diagonal on this board contains a conflict
        hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
            if (this.attributes.n === 0) {
                return false;
            }

            var counter = 0;

            _.each(this.rows(), function(row, colIndex) {
                _.each(row, function(item, rowIndex) {
                    if (colIndex + rowIndex === minorDiagonalColumnIndexAtFirstRow && item === 1) {
                        counter++;
                    }
                });
            });
            return counter > 1;
        },
        // test if any minor diagonals on this board contain conflicts
        hasAnyMinorDiagonalConflicts: function() {
            if (this.attributes.n === 0) {
                return false;
            }
            var indexArr = _.range(0, 2 * (this.get(0).length - 1)); //[0,1,2,3]
            return _.some(indexArr, function(index) {
                return this.hasMinorDiagonalConflictAt(index);
            }.bind(this));
        }

        /*--------------------  End of Helper Functions  ---------------------*/


    });

    var makeEmptyMatrix = function(n) {
        return _(_.range(n)).map(function() {
            return _(_.range(n)).map(function() {
                return 0;
            });
        });
    };

}());

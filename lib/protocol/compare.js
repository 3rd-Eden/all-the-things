'use strict';

/**
 * Line compare methods, they all follow the same API structure. The first
 * argument `line` is a String that needs to be checked, the reset of the
 * arguments are the values of each position.
 *
 * @NOTE it might be faster to do a .charAt or charCode binary comparison.
 */

exports.four = function four(line, c0, c1, c2, c3) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3;
};

exports.five = function five(line, c0, c1, c2, c3, c4) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4;
};

exports.six = function six(line, c0, c1, c2, c3, c4, c5) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5;
};

exports.seven = function seven(line, c0, c1, c2, c3, c4, c5, c6) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6;
};

exports.eight = function eight(line, c0, c1, c2, c3, c4, c5, c6, c7) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6
    && line[7] === c7;
};

exports.nine = function nine(line, c0, c1, c2, c3, c4, c5, c6, c7, c8) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6
    && line[7] === c7
    && line[8] === c8;
};

exports.ten = function ten(line, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6
    && line[7] === c7
    && line[8] === c8
    && line[9] === c9;
};

exports.eleven = function eleven(line, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6
    && line[7] === c7
    && line[8] === c8
    && line[9] === c9
    && line[10] === c10;
};

exports.twelf = function twelf(line, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11) {
  return line[0] === c0
    && line[1] === c1
    && line[2] === c2
    && line[3] === c3
    && line[4] === c4
    && line[5] === c5
    && line[6] === c6
    && line[7] === c7
    && line[8] === c8
    && line[9] === c9
    && line[10] === c10
    && line[11] === c11;
};

module.exports.roundXToNthDecimal = function (X, n) {
  return Math.round(10 ** n * X) / 10 ** n;
};

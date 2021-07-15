module.exports.calcPercent = function (S) {
  S.maxLvl = S.maxLvl < S.lvl ? S.lvl : S.maxLvl;
  S.percent = Math.round((S.lvl * 1000) / S.maxLvl) / 10; // round to the 1st decimal
};

module.exports.reset = (S) => {
  S.lvl = 1;
  S.nextMove = "-";
  S.hasWonInCol = true;
  S.percent = Math.round((1000 * S.lvl) / S.maxLvl) / 10; // round to the 1st decimal
};

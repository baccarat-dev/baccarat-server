module.exports.calcPercent = function (S) {
  console.log(S);
  S.percent = Math.round((S.lvl * 1000) / S.maxlvl) / 10; // round to the 1st decimal
};

module.exports.reset = (S) => {
  S.lvl = 1;
  S.hasWonInCol = true;
  S.percent = Math.round((1000 * S.lvl) / S.maxLvl) / 10; // round to the 1st decimal
};

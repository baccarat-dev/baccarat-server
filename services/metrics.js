const { roundXToNthDecimal } = require("../helper");

exports.calcPersistentMetrics = function (game) {
  const { P_next_pct, B_next_pct } = game.metrics.quickStats;
  const pcts = game.metrics.data.rightAndWrongs.pcts;
  if (P_next_pct === B_next_pct) {
    pcts.push(null);
    return;
  }
  const bet = game.bets[game.round - 1];
  const avgMetric =
    (P_next_pct > B_next_pct && bet === "P") ||
    (P_next_pct < B_next_pct && bet === "B")
      ? true
      : false;
  pcts.push(avgMetric);
  console.log(game.metrics.winsBetweenLossess);
  console.log(pcts);
  const metric = game.metrics.winsBetweenLossess;
  const LOST_4 = pcts
    .slice(pcts.length - 4, pcts.length)
    .every((x) => x === false);
  if (metric.activated && avgMetric) {
    metric.current++;
  }
  if (metric.activated && LOST_4 && game.round >= metric.startingRound + 4) {
    const wins_count = pcts
      .slice(metric.startingRound - 1, pcts.length)
      .reduce((acc, x) => (x ? acc + 1 : acc), 0);
    if (metric.min === null) {
      metric.min = metric.max = wins_count;
    } else {
      metric.min = wins_count < metric.min ? wins_count : metric.min;
      metric.max = wins_count > metric.max ? wins_count : metric.max;
    }
    metric.startingRound = game.round;
    metric.current = 0;
    console.log("LOST ALL 4 ");
    console.log(wins_count);
  }
  if (pcts.length >= 4 && !metric.activated && LOST_4) {
    metric.activated = true;
    metric.startingRound = game.round;
  }
};

exports.calcQuickStats = function (data, game) {
  let pct_sum_P = (pct_sum_B = P_next_count = B_next_count = 0);
  data.strategies.forEach((S) => {
    if (S.nextMove === "P") {
      pct_sum_P += S.percent;
      P_next_count++;
    } else if (S.nextMove === "B") {
      pct_sum_B += S.percent;
      B_next_count++;
    }
  });
  const pct_avg_P = P_next_count
    ? roundXToNthDecimal(pct_sum_P / P_next_count, 1)
    : 0;
  const pct_avg_B = B_next_count
    ? roundXToNthDecimal(pct_sum_B / B_next_count, 1)
    : 0;
  const P_next_pct =
    Math.round((100 * P_next_count) / (P_next_count + B_next_count)) || 0;
  const B_next_pct =
    Math.round((100 * B_next_count) / (P_next_count + B_next_count)) || 0;
  data.stats = game.metrics.quickStats = {
    pct_avg_P,
    pct_avg_B,
    P_next_count,
    B_next_count,
    P_next_pct,
    B_next_pct,
  };
};

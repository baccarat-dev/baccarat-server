const { strategies } = require("../Strategies/all");
const { randArr } = require("./simulator/random");
const { roundXToNthDecimal } = require("../helper");

let init = {
  metrics: {
    data: { rightAndWrongs: { pcts: [] } },
    winsBetweenLossess: {
      min: null,
      max: null,
      current: 0,
      activated: false,
      startIdx: 0,
      endingRound: 0,
    },
    winsPerLvl: { lvl: 1, maxLvl: 4, count: [] },
    quickStats: {
      pct_avg_P: 0,
      pct_avg_B: 0,
      P_next_count: 0,
      B_next_count: 0,
      P_next_pct: 0,
      B_next_pct: 0,
    },
  },
  round: 1,
  bets: [],
  strategies,
  undos: 1,
};

let GAME = JSON.parse(JSON.stringify(init));

exports.runSimulation = runSimulation = (_ids, nbrOfBets, trueRand) => {
  trueRand = false;
  GAME = JSON.parse(JSON.stringify(init));
  GAME.strategies = GAME.strategies.filter((S) => _ids.includes(S._id));
  let time = Date.now();
  for (let i = 0; i < nbrOfBets; i++) {
    const BET = trueRand
      ? randArr[i]
        ? "P"
        : "B"
      : Math.round(Math.random())
      ? "P"
      : "B";
    GAME.bets.push(BET);
    runStrategies(GAME, BET);
    calcMetrics(GAME);
    quickstat(GAME);
    GAME.round++;
  }
  GAME.execTime = Date.now() - time;
  console.log("Finished in ", Date.now() - time, "ms");
  return GAME;
};

function runStrategies(GAME, bet) {
  GAME.strategies.forEach((S) => {
    if (S.enabled) {
      const runStrategy = require("../Strategies/" + S.code);
      runStrategy(S, GAME.round, bet, GAME.bets);
    }
  });
}

function calcMetrics(game) {
  // create array of wins and losses for the metric
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
  const metric = game.metrics.winsBetweenLossess;

  // ------------------------------------------------------

  // ------------------------------------------------------
  const winsPerLvl = game.metrics.winsPerLvl;
  if (avgMetric === false) {
    winsPerLvl.lvl++;
  } else if (avgMetric === true) {
    const i = winsPerLvl.lvl;
    const lvl = winsPerLvl.count.find((x) => x.lvl === i);
    lvl ? lvl.n++ : winsPerLvl.count.push({ lvl: i, n: 1 });
    winsPerLvl.lvl = 1;
  }
  winsPerLvl.count.sort((a, b) => a.lvl - b.lvl);
  // ------------------------------------------------------

  // remove "null" (skip) values from the array of pcts
  let cleanPcts = pcts.filter((x) => x != null); // remove "null" (skip) values from the array
  const LOST_4 = cleanPcts
    .slice(cleanPcts.length - 4)
    .every((x) => x === false);

  if (metric.activated && avgMetric === true) {
    metric.current++;
  }
  if (metric.activated && LOST_4 && cleanPcts.length >= metric.startIdx + 4) {
    const wins_count = cleanPcts
      .slice(metric.startIdx)
      .reduce((acc, x) => (x ? acc + 1 : acc), 0);

    if (metric.min === null) {
      metric.min = wins_count;
      metric.max = wins_count;
    } else {
      metric.min = wins_count < metric.min ? wins_count : metric.min;
      metric.max = wins_count > metric.max ? wins_count : metric.max;
    }
    metric.startIdx = cleanPcts.length;
    metric.current = 0;
  }
  if (cleanPcts.length >= 4 && !metric.activated && LOST_4) {
    // activates the metric for the first time
    metric.activated = true;
    metric.startIdx = cleanPcts.length;
  }
}

function quickstat(game) {
  let pct_sum_P = (pct_sum_B = P_next_count = B_next_count = 0);
  game.strategies
    .filter((x) => x.enabled)
    .forEach((S) => {
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

  const pcts = game.metrics.data.rightAndWrongs.pcts.filter((x) => x != null);
  let losses = 0,
    max_conseq_losses = 0,
    min_conseq_losses = 100,
    wins = 0,
    max_conseq_wins = 0,
    min_conseq_wins = 100;
  pcts.forEach((e) => {
    e === true ? wins++ : (wins = 0);
    e === false ? losses++ : (losses = 0);
    if (losses > max_conseq_losses) max_conseq_losses = losses;
    else min_conseq_losses = losses;
    if (wins > max_conseq_wins) max_conseq_wins = wins;
    else min_conseq_wins = wins;
  });

  game.stats = game.metrics.quickStats = {
    pct_avg_P,
    pct_avg_B,
    P_next_count,
    B_next_count,
    P_next_pct,
    B_next_pct,
    max_conseq_losses,
    max_conseq_wins,
  };
}

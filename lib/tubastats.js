
module.exports = class TubaStatNode {
  constructor(statnode) {
    this.totalPlays = statnode["TotalPlays"] || null;
    this.rushAttempts = statnode["RushAttempts"] || null;
    this.rushPercent = statnode["RushPercent"] || null;
    this.passAttempts = statnode["PassAttempts"] || null;
    this.sacks = statnode["Sacks"] || null;
    this.sackPercent = statnode["SackPercent"] || null;
    this.passPercent = statnode["PassPercent"] || null;
    this.wrTargets = statnode["WRTargets"] || null;
    this.wrTargetPercent = statnode["WRTargetPercent"] || null;
    this.rbTargets = statnode["RBTargets"] || null;
    this.rbTargetPercent = statnode["RBTargetPercent"] || null;
    this.teTargets = statnode["TETargets"] || null;
    this.teTargetPercent = statnode["TETargetPercent"] || null;
    this.completions = statnode["Completions"] || null;
    this.wrRec = statnode["WRRec"] || null;
    this.wrRecPercent = statnode["WRRecPercent"] || null;
    this.rbRec = statnode["RBRec"] || null;
    this.rbRecPercent = statnode["RBRecPercent"] || null;
    this.teRec = statnode["TERec"] || null;
    this.teRecPercent = statnode["TERecPercent"] || null;
  }

  getSortedTargets(){
    return [{
        "position": "te",
        "targets": this.teTargets,
        "targetPct": this.teTargetPercent
    },
    {
        "position": "wr",
        "targets": this.wrTargets,
        "targetPct": this.wrTargetPercent
    },
    {
        "position": "rb",
        "targets": this.rbTargets,
        "targetPct": this.rbTargetPercent
    },
    ].sort((a, b) => {
    if (a.targets < b.targets) {
        return 1;
    } else if (a.targets > b.targets) {
        return -1;
    } else {
        return 0;
    }
    });
  }
  getSortedReceptions(){
    return [{
        "position": "te",
        "receptions": this.teRec,
        "receptionPct": this.teRecPercent
    },
    {
        "position": "wr",
        "receptions": this.wrRec,
        "receptionPct": this.wrRecPercent
    },
    {
        "position": "rb",
        "receptions": this.rbRec,
        "receptionPct": this.rbRecPercent
    },
    ].sort((a, b) => {
    if (a.receptions < b.receptions) {
        return 1;
    } else if (a.receptions > b.receptions) {
        return -1;
    } else {
        return 0;
    }
    });
  }
};



module.exports = class TubaStatNode {
  constructor(statnode) {
    self.totalPlays = statnode["TotalPlays"] || null;
    self.rushAttempts = statnode["RushAttempts"] || null;
    self.rushPercent = statnode["RushPercent"] || null;
    self.passAttempts = statnode["PassAttempts"] || null;
    self.sacks = statnode["Sacks"] || null;
    self.sackPercent = statnode["SackPercent"] || null;
    self.passPercent = statnode["PassPercent"] || null;
    self.wrTargets = statnode["WRTargets"] || null;
    self.wrTargetPercent = statnode["WRTargetPercent"] || null;
    self.rbTargets = statnode["RBTargets"] || null;
    self.rbTargetPercent = statnode["RBTargetPercent"] || null;
    self.teTargets = statnode["TETargets"] || null;
    self.teTargetPercent = statnode["TETargetPercent"] || null;
    self.completions = statnode["Completions"] || null;
    self.wrRec = statnode["WRRec"] || null;
    self.wrRecPercent = statnode["WRRecPercent"] || null;
    self.rbRec = statnode["RBRec"] || null;
    self.rbRecPercent = statnode["RBRecPercent"] || null;
    self.teRec = statnode["TERec"] || null;
    self.teRecPercent = statnode["TERecPercent"] || null;
  }

  getSortedTargets(){
    return [{
        "position": "te",
        "targets": self.teTargets,
        "targetPct": self.teTargetPercent
    },
    {
        "position": "wr",
        "targets": self.wrTargets,
        "targetPct": self.wrTargetPercent
    },
    {
        "position": "rb",
        "targets": self.rbTargets,
        "targetPct": self.rbTargetPercent
    },
    ].sort((a, b) => {
    if (a.targets > b.targets) {
        return 1;
    } else if (a.targets < b.targets) {
        return -1;
    } else {
        return 0;
    }
    });
  }
  getSortedReceptions(){
    return [{
        "position": "te",
        "receptions": self.teRec,
        "receptionPct": self.teRecPercent
    },
    {
        "position": "wr",
        "receptions": self.wrRec,
        "receptionPct": self.wrRecPercent
    },
    {
        "position": "rb",
        "receptions": self.rbRec,
        "receptionPct": self.rbRecPercent
    },
    ].sort((a, b) => {
    if (a.targets > b.targets) {
        return 1;
    } else if (a.targets < b.targets) {
        return -1;
    } else {
        return 0;
    }
    });
  }
};


# FFDiscordBot

[![Build Status](https://travis-ci.org/chrisparsons83/FFDiscordBot.svg?branch=master)](https://travis-ci.org/chrisparsons83/FFDiscordBot) [![codecov](https://codecov.io/gh/chrisparsons83/FFDiscordBot/branch/master/graph/badge.svg)](https://codecov.io/gh/chrisparsons83/RedditFFDiscordBot)
[![Discord](https://img.shields.io/discord/214093545747906562.svg)](https://discord.gg/GZ9ZYYE)

## Current Set of Commands

### !8ball *question* 
Just like the magic 8-ball, it returns a random yes/no/maybe answer based on your question.
```
Input: !8ball Will I win my matchup this week? 
FFDiscordBot: Not in a million years.
```


### !adp *player name* 
This returns the ADP for the major Fantasy Football sites according to the most recent data from [4for4.com](https://www.4for4.com/fantasy-football/adp?paging=0).
```
Input: !adp Keenan Allen 
FFDiscordBot: ADP as of Saturday, August 12, 2017 via 4for4 for Keenan Allen: ESPN: 44, MFL: 46, NFL: 47, Yahoo: 42
```

### !boris *position, scoring format* 
### position are *qb, wr, rb, te, flex, k, dst*
### scoring format are *standard, half, full*
This command return boris chen tier rankings
```
Input: !boris te, half
FFDiscordBot:
Tier 1: Rob Gronkowski NE , Travis Kelce KC , Greg Olsen CAR 
Tier 2: Jordan Reed WAS , Jimmy Graham SEA , Tyler Eifert CIN , Kyle Rudolph MIN 
Tier 3: Delanie Walker TEN , Eric Ebron DET , Martellus Bennett GB , Zach Ertz PHI , Jack Doyle IND , Hunter Henry LAC 
Tier 4: Coby Fleener NO , Jason Witten DAL 
Tier 5: C.J. Fiedorowicz HOU , Austin Hooper ATL , Cameron Brate TB , Julius Thomas MIA , Antonio Gates LAC 
Tier 6: O.J. Howard TB , David Njoku CLE , Evan Engram NYG , Charles Clay BUF , Zach Miller CHI
```
```
Input: !boris dst
FFDiscordBot:
Tier 1: Houston Texans, Denver Broncos, Pittsburgh Steelers
Tier 2: Los Angeles Rams, New England Patriots, Carolina Panthers
Tier 3: Atlanta Falcons, Jacksonville Jaguars, Buffalo Bills
Tier 4: Arizona Cardinals, Tampa Bay Buccaneers, Los Angeles Chargers, Minnesota Vikings
Tier 5: New York Giants, Cincinnati Bengals, Seattle Seahawks
Tier 6: Baltimore Ravens, Philadelphia Eagles, Kansas City Chiefs, Miami Dolphins
```

### !wdis *position, scoring format if required, <player 1> , <player 2> , etc etc*
### position are *qb, wr, rb, te, k, dst*
### scoring format are *standard, half, full* 
This command return the optimal player to start based on Boris' tiers
*if the player isn't boris tiers, the bot will reject the query.*

```
Input: !wdis qb, alex smith, blake bortles
FFDiscordBot:
Boris says: "Start Alex Smith."
```
```
Input: !wdis dst, nyg, was
FFDiscordBot:
Boris says: "Start Washington Redskins."
```
```
Input: !wdis te, half, martellus bennett, hunter henry, cj fiedorowicz
FFDiscordBot:
Boris says: "Start Martellus Bennett."
```

### !choose *list of options* 
This command randomly picks from a comma-separated list of options.
```
Input: !choose peterson,miller,freeman 
FFDiscordBot: freeman
```

### !depthchart *team/mascot,position* 
This returns the depth chart for a team's position from [https://www.cbssports.com](https://www.cbssports.com).
```
Input: !depthchart atl,rb
FFDiscordBot: 
1. Devonta Freeman
2. Tevin Coleman
3. Terron Ward
4. Brian Hill
5. B.J. Daniels
6. Kelvin Taylor
```
### !drivestats *team symbol/mascot* 
Shows major stats for the previous season of a team.
```
Input: !drivestats GB
Green Bay Packers
2020 Offensive Drive Stats (League avg)
Number of offensive drives
9 (11)
Drive Success Rate (1st)
88.60% (74.10%)
Plays (1st)
8.44 plays (6.31)
Yards (1st)
57.33 yds (34.75)
Points (1st)
4.56 pts (2.20)
TD (1st)
55.60% (25.50%)
FG (4th)
22.20% (14.10%)
TO (4th)
0.00% (9.10%)
INT (7th)
0.00% (5.90%)
Fumble (6th)
0.00% (3.20%)
Punts (3rd)
11.10% (34.60%)
```

### !next *team* 
This list the next game for an NFL team. You can query by team abbreviation or their nickname (e.g., NYJ or Jets).
```
Input: !next NO
FFDiscordBot:
@MIA 9:30AM 
```

### !next5 *team* 
This list the next 5 weeks for an NFL team. You can query by team abbreviation or their nickname (e.g., NYJ or Jets).
```
Input: !next5 GB
FFDiscordBot:
1. Seahawks 4:25PM 
2. @Falcons 8:30PM 
3. Bengals 4:25PM 
4. Bears 8:25PM (Thursday)
5. @Cowboys 4:25PM 
```

### !poll *question | <option 1> | <option 2> | etc etc* 
This command creates a poll on strawpoll.me and returns the utrl
```
Input: !poll Is lamar miller a bust? | yes | no | maybe so. | I hate you
FFDiscordBot:
http://www.strawpoll.me/13706843
```

### !roto *player name* 
This pulls up the most recent story on a player from Rotoworld.
```
Input: !roto Tim Tebow
FFDiscordBot: Tim Tebow: Free agent QB Tim Tebow signed a minor-league contract with the New York Mets.

He is your problem now, @Rotoworld_BB. Thu, Sep 8, 2016 08:36:00 AM
```

### !schedule *team* 
This list the next 5 weeks for an NFL team. You can query by team abbreviation or their nickname (e.g., NYJ or Jets).
```
Input: !schedule Packers
FFDiscordBot:
1. Seahawks 4:25PM 
2. @Falcons 8:30PM 
3. Bengals 4:25PM 
4. Bears 8:25PM (Thursday)
5. @Cowboys 4:25PM 
6. @Vikings 1:00PM 
7. Saints 1:00PM 
8. BYE
9. Lions 8:30PM (Monday)
10. @Bears 1:00PM 
11. Ravens 1:00PM 
12. @Steelers 8:30PM 
13. Buccaneers 1:00PM 
14. @Browns 1:00PM 
15. @Panthers 1:00PM 
16. Vikings 8:30PM (Saturday)
17. @Lions 1:00PM
```

### !shuffle *list of options* 
This command shuffle the items from a comma-separated list of options.
```
Input: !shuffle peterson,miller,freeman 
FFDiscordBot: 
  1. freeman
  2. peterson
  3. miller
```

### !snaps *team/mascot, pos, week, year*
Shows offensive snap percentages of team at chosen position\
Position options available: *rb, wr, te*\
Week options available: *1 to 15, all*
Year options available: *2012, 2013, 2014, 2015, 2016, 2017, 2018*
```
Input: !snaps atl, wr, all, 2017
FFDiscordBot: 
Ju.Jones (74.6%)
M.Sanu (73.6%)
T.Gabriel (52.6%)
J.Hardy (37.3%)
M.Hall (7.5%)
A.Roberts (3%)
N.Williams (2.7%)
```

### !teamstats *team symbol/mascot* 
Shows major stats for the previous season of a team.
```
Input: !teamstats NO
New Orlean Saints
2017 Offensive stats (League average)
Total offensive plays
169 plays (163)
Pass/Rush ratio
62.1% / 37.9% (58.8% / 41.2%)
Passing yards attempted
798 yds (719 yds)
Yards per passing attempt
7.60 yds per att (7.50)
Short passes
79.0% (83.0%)
Deep passes
21.0% (17.0%)
Total rushing yards
287 yds (264 yds)
Yards per rushing attempt
4.48 yds per att (3.92)
```

### !teamtargets *team symbol/mascot, pass type* 
### Valid pass type are *total, short, deep, left, mid, right*
Shows statistics for all receivers with greater than or equal to 7% of teams' type targets on a given team.
```
Input: !teamtargets NO, right
FFDiscordBot: 
A. Kamara: 21 (28%)
M. Thomas: 16 (21.3%)
T. Ginn: 6 (8%)
B. Watson: 6 (8%)
```

## Installation for Forks of this Discord Bot
*Node.js 8.0.0 or newer is required.*

1. Run `npm install`
2. Copy `config.js.sample` to `config.js`
3. Enter in your API Key gathered from your [Discord Developers Applications page](https://discordapp.com/developers/applications/me).

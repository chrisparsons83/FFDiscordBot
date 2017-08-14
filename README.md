# RedditFFDiscordBot

[![Build Status](https://travis-ci.org/chrisparsons83/RedditFFDiscordBot.svg?branch=master)](https://travis-ci.org/chrisparsons83/RedditFFDiscordBot)

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
FFDiscordBot: ADP as of Saturday, August 12, 2017 via 4for4 for Michael Crabtree: ESPN: 44, MFL: 46, NFL: 47, Yahoo: 42
```

### !depthchart *team,position* 
This returns the depth chart for a team's position from [https://www.cbssports.com](https://www.cbssports.com).
```
Input: !depthchart atl,rb *Valid positions: qb, rb, fb, te, wr, k, kr, pr*
FFDiscordBot: 
1. Devonta Freeman
2. Tevin Coleman
3. Terron Ward
4. Brian Hill
5. B.J. Daniels
6. Kelvin Taylor
```

### !choose *list of options* 
This command randomly picks from a comma-separated list of options.
```
Input: !choose peterson,miller,freeman 
FFDiscordBot: freeman
```

### !next5 *team symbol* 
This list the next 5 weeks for an NFL team. You can query by team abbreviation or their nickname (e.g., NYJ or Jets).
```
Input: !next5 Seahawks
FFDiscordBot: @GB, SF, @TEN, IND, @LAR
```


### !roto *player name* 
This pulls up the most recent story on a player from Rotoworld.
```
Input: !roto Tim Tebow
FFDiscordBot: Tim Tebow: Free agent QB Tim Tebow signed a minor-league contract with the New York Mets.

He is your problem now, @Rotoworld_BB. Thu, Sep 8, 2016 08:36:00 AM
```

### !symbols
Lists all 32 NFL teams and their 2/3 character abbreviation.

### !teamstats *team symbol* 
Shows major stats for the previous season of a team.
```
Input: !teamstats OAK
FFDiscordBot: Total offensive play: 951    (League avg:  992.0625)  
Pass play: 59.52%            (League avg: 60.85%)  
Rush play: 40.48%            (League avg: 39.15%)  

Attempted passing yards: 4008 yds       (League avg: 4423.25 yds)  
Average yards per pass att: 7.08 yds    (League avg: 7.33 yds)  

Total rushing yds: 1790 yds    (League avg: 1649.75 yds)  
Avg yds per rush: 4.65 yds     (League avg: 4.25 yds)  

Short passes: 85.34%    (League avg: 81.11%)  
Deep passes: 14.66%     (League avg: 18.89%)  

Left pass %: 34.45 %       Mid pass %: 22.79 %      Right pass %: 42.76 %  
Left pass yds: 1414 yds    Mid pass yds: 1097 yds   Right pass yds: 1497 yds  
Left per att: 7.25 yds     Mid per att: 8.50 yds   Right per att: 6.19 yds  

Short left attempts: 170   Short mid attempts:110   Short right attempts: 203  
Yards per att: 6.10 yds    Yards per att: 7.59 yds  Yards per att: 4.42 yds  

Deep left attempts: 25     Deep mid attempts:19     Deep right attempts: 39  
Yds per att: 15.08 yds      Yds per att: 13.79 yds   Yds per att: 15.36 yds  
```

### !teamtargets *team symbol* 
Shows statistics for all receivers with greater than or equal to 7% of teams' targets on a given team.
```
Input: !teamtargets DEN
FFDiscordBot: D. Thomas
Total Targets: 139
Percentage of team's targets: 26.38%
Short Left:  38.85%    Short Mid:  15.11%    Short Right:  28.78%
Deep left:   10.07%      Deep Mid:  0.72%    Deep right:  6.47%

E. Sanders
Total Targets: 124
Percentage of team's targets: 23.53%
Short Left:  28.23%    Short Mid:  9.68%    Short Right:  34.68%
Deep left:   8.06%      Deep Mid:  4.84%    Deep right:  14.52%

D. Booker
Total Targets: 44
Percentage of team's targets: 8.35%
Short Left:  29.55%    Short Mid:  27.27%    Short Right:  40.91%
Deep left:   0.00%      Deep Mid:  0.00%    Deep right:  2.27%

V. Green
Total Targets: 37
Percentage of team's targets: 7.02%
Short Left:  37.84%    Short Mid:  35.14%    Short Right:  16.22%
Deep left:   2.70%      Deep Mid:  5.41%    Deep right:  2.70%
```

## Installation for Forks of this Discord Bot
*Node.js 6.0.0 or newer is required.*

1. Run `npm install`
2. Copy `config.js.sample` to `config.js`
3. Enter in your API Key gathered from your [Discord Developers Applications page](https://discordapp.com/developers/applications/me).
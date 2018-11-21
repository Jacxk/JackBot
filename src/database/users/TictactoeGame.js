const TicTacToe = require('../Schemas.js').TicTacToe;

function playerData(user_id, cb) {
    TicTacToe.findOne({user_id}, (err, doc) => {
        if (err) return cb(err);
        return cb(null, doc);
    });
}

function saveMatch(winner, looser, time, table, isDraw = false) {
    playerData(winner, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) return new TicTacToe({
            user_id: winner,
            wins: 1,
            losses: 0,
            last_matches: [{winner, looser, table, time}],
            draws: (isDraw ? 1 : 0),
        }).save();

        let draws = doc.draws + (isDraw ? 1 : 0);
        let last_matches = doc.last_matches.push({winner, looser, table, time});
        if (last_matches >= 5) last_matches.slice(1) ;

        let winnerData = {
            user_id: winner,
            wins: doc.wins + 1,
            losses: doc.losses,
            last_matches,
            draws,
        };

        TicTacToe.updateOne({user_id: winner}, winnerData, null, (err) => {
            if (err) return console.error(err)
        });
    });

    playerData(looser, function (err, doc) {
        if (err) return console.error(err);
        if (!doc) return new TicTacToe({
            user_id: looser,
            wins: 0,
            losses: 1,
            last_matches: [{winner, looser, table, time}],
            draws: (isDraw ? 1 : 0),
        }).save();

        let draws = doc.draws + (isDraw ? 1 : 0);
        let last_matches = doc.last_matches.push({winner, looser, table, time});
        if (last_matches >= 5) last_matches.slice(1) ;

        let looserData = {
            user_id: looser,
            wins: doc.wins,
            losses: doc.losses + 1,
            last_matches,
            draws,
        };

        TicTacToe.updateOne({user_id: looser}, looserData, null, (err) => {
            if (err) return console.error(err)
        });
    });
}



module.exports = {
    saveMatch,
    playerData
};
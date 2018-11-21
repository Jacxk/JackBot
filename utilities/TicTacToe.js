module.exports.TicTacToe = class TicTacToe {

    constructor(challenger, rival, map) {
        this.map = map;
        this.challenger = challenger;
        this.rival = rival;
        this.playing = challenger;
        this.playing_next = rival;
        this.table_message = null;
        this.current_message = null;
        this.table = [
            {1: null, emote: ':one:'}, {2: null, emote: ':two:'}, {3: null, emote: ':three:'},
            {4: null, emote: ':four:'}, {5: null, emote: ':five:'}, {6: null, emote: ':six:'},
            {7: null, emote: ':seven:'}, {8: null, emote: ':eight:'}, {9: null, emote: ':nine:'}
        ];

        this.time = 60;
        const a = setInterval(() => {
            if (this.time > 0) return this.time--;
            clearInterval(a);
            this.table_message.edit(`Time is up! The player did not play for one minute... Its a DRAW`);
            this.current_message.delete();
            map.delete(this.challenger);
            map.delete(this.rival);
        }, 1000);
        this.interval = a;
    }

    startMatch(channel) {

        const messages = [
            '**' + this.challenger.displayName + ' vs. ' + this.rival.displayName + '**',
            '**' + this.challenger.displayName + ' vs. ' + this.rival.displayName + '**',
            ':one: :two: :three:\n:four: :five: :six:\n:seven: :eight: :nine:'
        ];
        let count = 0;

        channel.send('**Starting match!**').then(message => {
            const interval = setInterval(() => {
                if (count >= 3) {
                    channel.send('***BEGIN!***').then(message => {
                        setTimeout(() => message.edit('**Playing: ' + this.playing.displayName + '**'), 1000);
                        this.current_message = message;
                    });
                    this.table_message = message;
                    return clearInterval(interval);
                }
                message.edit(messages[count]);
                count++;
            }, 1000);
        });

    }

    makeMove(player, number, channel, map) {
        if (player === this.playing_next) return;

        const item = number - 1;
        if (this.table[item][number] !== null)
            return channel.send('You can\'t play there!').then(message => message.delete(3000));

        this.table[item][number] = player;
        if ((this.table[item]['emote'] === ':o:') || (this.table[item]['emote'] === ':x:')) return;
        this.table[item]['emote'] = this.getPlayerSymbol(player);
        this.setPlayingNext(player);
        this.checkPlay(channel);
        this.changeTable();
        this.current_message.edit('**Playing: ' + this.playing.displayName + '**');
        this.setTime(60);
    }

    changeTable() {
        let tableMessage = '';
        for (let i = 0; i < this.table.length; i++) {
            tableMessage += this.table[i]['emote'];
            if ((i == 2) || (i == 5)) tableMessage += '\n';
        }
        if (this.table_message !== null) this.table_message.edit(tableMessage);
    }

    getPlayerSymbol(member) {
        return this.challenger === member ? ':x:' : ':o:';
    };

    checkPlay(channel) {
        let os = [];
        let xs = [];
        let full = [];

        function resetArrays() {
            os = [];
            xs = [];
            full = [];
        }

        const winWith = {
            1: [1, 2, 3],
            2: [4, 5, 6],
            3: [7, 8, 9],

            4: [1, 4, 7],
            5: [2, 5, 8],
            6: [3, 6, 9],

            7: [1, 5, 9],
            8: [3, 5, 7],
        };

        for (let possibility in winWith) {
            winWith[possibility].forEach(poss => {
                for (let i = 0; i < this.table.length; i++) {
                    if (this.table[i].emote === ':x:') {
                        if (poss === i + 1) {
                            xs.push(true);
                            full.push(true);
                        }
                    } else if (this.table[i].emote === ':o:')
                        if (poss === i + 1) {
                            os.push(true);
                            full.push(true);
                        }
                }
            });
            if (full.length >= 9) {
                setTimeout(() => this.table_message.edit('Restarting game, its a DRAW'), 500);
                this.table_message.edit(':one::two::three:\n:four::five::six:\n:seven::eight::nine:');
                resetArrays();
                this.stopMatch();
                break;
            }
            if (TicTacToe.arrayEqual(os, [true, true, true])) {
                setTimeout(() => channel.send(`**${this.challenger.displayName} vs. ${this.rival.displayName}**` +
                    `\nWinner: ${this.playing_next.displayName}`, 500));
                resetArrays();
                this.current_message.delete();
                this.stopMatch();
                break;
            } else if (TicTacToe.arrayEqual(xs, [true, true, true])) {
                setTimeout(() => channel.send(`**${this.challenger.displayName} vs. ${this.rival.displayName}**` +
                    `\nWinner: ${this.playing_next.displayName}`, 500));
                resetArrays();
                this.current_message.delete();
                this.stopMatch();
                break;
            }
            resetArrays();
        }
    }

    setPlayingNext() {

        if (this.playing !== this.playing_next) {
            if (this.playing === this.challenger) {
                this.playing_next = this.challenger;
                this.playing = this.rival;
            }
            else {
                this.playing_next = this.rival;
                this.playing = this.challenger;
            }
        }

        /*player === this.playing ? this.playing = this.rival : this.playing = this.challenger;
        player === this.playing_next ? this.playing_next = this.rival : this.playing_next = this.challenger;*/
    }

    playingWith(player) {
        return player === this.challenger ? this.rival : this.challenger;
    }

    sendPlayingWith(messageUtil, channel, player) {
        return messageUtil.sendError(channel, 'You are currently playing with ' + this.playingWith(player));
    }

    setTime(time) {
        this.time = time;
    }

    stopMatch() {
        clearInterval(this.interval);
        this.map.delete(this.challenger);
        this.map.delete(this.rival);
    }

    static arrayEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
        return true;
    }
};

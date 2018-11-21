const map = new Map();

const addExp = module.exports.addExp = (member, amount) => new Promise(resolve => {
    isOnMap(member);
    const exp = map.get(member.id);

    exp['exp'] += amount;
    addCurrentLvlExp(member, amount);

    levelUp(member, exp);
    map.set(member.id, exp);

    resolve(exp['exp']);
});

const addExpRandom = module.exports.addExpRandom = (member, number1, number2) => new Promise(resolve => {
    addExp(member, Math.floor(Math.random() * number2) + number1).then(exp => resolve(exp));
});

const getExp = module.exports.getExp = (member) => {
    isOnMap(member);
    return map.get(member.id)['exp'];
};

const getCurrentLvlExp = module.exports.getCurrentLvlExp = (member) => {
    isOnMap(member);
    return map.get(member.id)['current_level_exp'];
};

const addCurrentLvlExp = module.exports.addCurrentLvlExp = (member, amount) => {
    isOnMap(member);
    map.get(member.id)['current_level_exp'] += amount;
};

const setCurrentLvlExp = module.exports.setCurrentLvlExp = (member, amount) => {
    isOnMap(member);
    map.get(member.id)['current_level_exp'] = amount;
};

const levelUp = module.exports.levelUp = (member, amount) => new Promise(resolve => {
    const nextLevel = 700 * getLevel(member);
    if (getCurrentLvlExp(member) >= nextLevel) {
        addLevel(member, 1);
        setCurrentLvlExp(member, amount);
    }
    resolve(getLevel(member));
});

module.exports.getStats = (member) => {
    isOnMap(member);
    const toReach = 700 * getLevel(member);

    return getCurrentLvlExp(member) + '/' + toReach;
};

const addLevel = module.exports.addLevel = (member, amount) => new Promise(resolve => {
    isOnMap(member);

    const exp = map.get(member.id);

    exp['level'] += amount;

    map.set(member.id, exp);

    resolve(exp['level']);
});

const getLevel = module.exports.getLevel = (member) => {
    isOnMap(member);
    return map.get(member.id)['level'];
};

const isOnMap = (member) => {
    if (!map.has(member.id)) map.set(member.id, {exp: 0, current_level_exp: 0, level: 1});
};

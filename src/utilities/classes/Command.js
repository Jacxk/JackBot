class Command {
    constructor(name, aliases = []) {
        this._name = name.toLowerCase();
        this._aliases = aliases;
        this._enabled = true;
        this._permission = 'N/A';
        this._description = `${name}.description`;
        this._usage = name;
        this._category = '';
        this._devOnly = false;
    }

    execute(message, args, client) {
    }

    setAliases(aliases) {
        this._aliases = aliases;
    }

    setEnabled(bool) {
        this._enabled = bool;
    }

    setPermission(perms) {
        this._permission = perms.toUpperCase();
    }

    setDescription(description) {
        this._description = description;
    }

    setUsage(usage) {
        this._usage = this._name + ' ' + usage;
    }

    setCategory(category) {
        this._category = category.toLowerCase();
    }

    setDevOnly(bool) {
        this._category = "dev";
        this._devOnly = bool;
    }

    getName() {
        return this._name;
    }

    getAliases() {
        return this._aliases;
    }

    getPermission() {
        return this._permission;
    }

    getCategory() {
        return this._category;
    }

    getUsage() {
        return this._usage;
    }

    getDescription() {
        return this._description;
    }

    isDevOnly() {
        return this._devOnly;
    }

    isEnabled() {
        return this._enabled;
    }
}

module.exports = Command;
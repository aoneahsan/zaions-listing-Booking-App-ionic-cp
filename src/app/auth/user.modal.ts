export class UserModal {
    constructor(public id, public email, private _tokken, private _expireTime) {}

    get tokken() {
        if (!this._expireTime || this._expireTime <= new Date( )) {
            return null;
        }
        else {
            return this._tokken;
        }
    }

    get tokkenDuration() {
        if (!this.tokken) {
            return 0;
        }
        return this._expireTime.getTime() - new Date().getTime();
    }
}
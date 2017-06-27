// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import AppDispatcher from '../dispatcher/app_dispatcher.jsx';
import EventEmitter from 'events';
import Constants from 'utils/constants.jsx';
const ActionTypes = Constants.BlacklistTypes;

const CHANGE_EVENT = 'change';

class BlacklistStoreClass extends EventEmitter {
    constructor() {
        super();
        this.clear();
    }

    clear() {
      this.blacklist = [];
      this.blacklist_offset = 0;
      this.blacklist_count = 0;

      this.not_in_blacklist = [];
      this.not_in_blacklist_offset = 0;
      this.not_in_blacklist_count = 0;

      this.blacklist_member_count = 0;
      this.blacklist_not_in_member_count = 0;
    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    // in blacklist
    setBlacklistPage(offset, count) {
        this.blacklist_offset = offset + count;
        this.blacklist_count = this.blacklist_offset + count;
    }

    getBlacklistPagingOffset() {
        return this.blacklist_offset;
    }

    getBlacklistPagingCount() {
        return this.blacklist_count;
    }

    // not in blacklist
    setNotInBlacklistPage(offset, count) {
        this.not_in_blacklist_offset = offset + count;
        this.not_in_blacklist_count = this.not_in_blacklist_offset + count;
    }

    getNotInBlacklistPagingOffset() {
        return this.not_in_blacklist_offset;
    }

    getNotInBlacklistPagingCount() {
        return this.not_in_blacklist_count;
    }

    // set in blacklist
    setBlacklist(blacklist) {
        this.blacklist = blacklist;
        this.blacklist_member_count = blacklist.length;
    }

    getBlacklist() {
        return this.blacklist;
    }

    // set not in blacklist
    setNotInBlacklist(not_in_blacklist) {
        this.not_in_blacklist = not_in_blacklist;
        this.blacklist_not_in_member_count = not_in_blacklist.length;
    }

    getNotInBlacklist() {
        return this.not_in_blacklist;
    }

    getBlacklistMemberCount() {
        return this.blacklist_member_count;
    }

    getNotInBlacklistMemberCount() {
        return this.blacklist_not_in_member_count;
    }

}

var BlacklistStore = new BlacklistStoreClass();

BlacklistStore.dispatchToken = AppDispatcher.register((payload) => {
    const action = payload.action;

    switch (action.type) {
    case ActionTypes.RECEIVED_BLACKLIST:
        BlacklistStore.setBlacklist(action.blacklist);
        if (action.offset != null && action.count != null) {
            BlacklistStore.setBlacklistPage(action.offset, action.count);
        }
        BlacklistStore.emitChange();
        break;
    case ActionTypes.RECEIVED_NOT_IN_BLACKLIST:
        BlacklistStore.setNotInBlacklist(action.not_in_blacklist);
        if (action.offset != null && action.count != null) {
            BlacklistStore.setNotInBlacklistPage(action.offset, action.count);
        }
        BlacklistStore.emitChange();
        break;
    }
});

export default BlacklistStore;

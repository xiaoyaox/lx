// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.
import AppDispatcher from 'dispatcher/app_dispatcher.jsx';
import * as AsyncClient from 'utils/async_client.jsx';
import Client from 'client/my_web_client.jsx';
import BlacklistStore from 'stores/blacklist_store.jsx';
import Constants from 'utils/constants.jsx';
const ActionTypes = Constants.BlacklistTypes;

export function loadGetBlacklist(offset, limit, success, error) {
    Client.getBlacklist(
        offset,
        limit,
        (data) => {
          // console.log(data);
            AppDispatcher.handleServerAction({
                type: ActionTypes.RECEIVED_BLACKLIST,
                blacklist: data,
                offset,
                count: Object.keys(data).length
            });
            if (success) {
                success(data);
            }
        },
        (err) => {
            AsyncClient.dispatchError(err, 'getBlacklist');

            if (error) {
                error(err);
            }
        }
    );
}

export function loadGetNotInBlacklist(offset, limit, success, error) {
    Client.getNotInBlacklist(
        offset,
        limit,
        (data) => {
          // console.log(data);
            AppDispatcher.handleServerAction({
                type: ActionTypes.RECEIVED_NOT_IN_BLACKLIST,
                not_in_blacklist: data,
                offset,
                count: Object.keys(data).length
            });
            if (success) {
                success(data);
            }
        },
        (err) => {
            AsyncClient.dispatchError(err, 'getNotInBlacklist');

            if (error) {
                error(err);
            }
        }
    );
}

export function loadAddUsersToBlacklist(userId, success, error) {
    Client.addBlacklistUser(
        userId,
        (data) => {
          // console.log(data);
            if (success) {
                success(data);
            }
        },
        (err) => {
            AsyncClient.dispatchError(err, 'addBlacklistUser');

            if (error) {
                error(err);
            }
        }
    );
}

export function loadDeleteBlacklistUsers(userId, success, error) {
    Client.deleteBlacklistUser(
        userId,
        (data) => {
          // console.log(data);
            if (success) {
                success(data);
            }
        },
        (err) => {
            AsyncClient.dispatchError(err, 'deleteBlacklistUser');

            if (error) {
                error(err);
            }
        }
    );
}

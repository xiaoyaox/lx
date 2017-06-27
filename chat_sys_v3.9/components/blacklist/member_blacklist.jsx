// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import BlacklistDeleteButton from './blacklist_delete_button.jsx';
import SearchableUserList from 'components/searchable_user_list/searchable_user_list_container.jsx';

import ChannelStore from 'stores/channel_store.jsx';
import UserStore from 'stores/user_store.jsx';
import TeamStore from 'stores/team_store.jsx';

import {searchUsers, loadProfilesAndTeamMembersAndChannelMembers, loadTeamMembersAndChannelMembersForProfilesList} from 'actions/user_actions.jsx';
import {getChannelStats} from 'utils/async_client.jsx';

import Constants from 'utils/constants.jsx';

import * as UserAgent from 'utils/user_agent.jsx';

import React from 'react';

// blacklist
import {loadGetBlacklist} from 'actions/blacklist_actions.jsx';
import BlacklistStore from 'stores/blacklist_store.jsx';

const USERS_PER_PAGE = 50;

export default class MemberBlacklist extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onStatsChange = this.onStatsChange.bind(this);
        this.search = this.search.bind(this);
        this.loadComplete = this.loadComplete.bind(this);
        this.handleInviteError = this.handleInviteError.bind(this);

        this.searchTimeoutId = 0;

        // const stats = ChannelStore.getCurrentStats();

        this.state = {
            users: [],
            total: 0,
            search: false,
            term: '',
            loading: false
        };
    }

    componentDidMount() {
        BlacklistStore.addChangeListener(this.onChange);
        loadGetBlacklist(0, USERS_PER_PAGE * 2);
    }

    componentWillUnmount() {
        BlacklistStore.removeChangeListener(this.onChange);
    }

    loadComplete() {
        this.setState({loading: false});
    }

    onChange(force) {
        if (this.state.search && !force) {
            return;
        } else if (this.state.search) {
            this.search(this.state.term);
            return;
        }
        const users = Object.assign([], BlacklistStore.getBlacklist());
        for (let i = 0; i < users.length; i++) {
            const user = Object.assign({}, users[i]);
            user.value = user.id;
            user.label = '@' + user.username;
            users[i] = user;
        }

        this.setState({
            users: users,
            total: BlacklistStore.getBlacklistMemberCount()
        });
    }

    onStatsChange() {
        const stats = ChannelStore.getCurrentStats();
        this.setState({total: stats.member_count});
    }

    nextPage(page) {
        loadGetBlacklist((page + 1) * USERS_PER_PAGE, USERS_PER_PAGE);
    }

    search(term) {
        clearTimeout(this.searchTimeoutId);

        if (term === '') {
            this.setState({
                search: false,
                term,
                users: UserStore.getProfileListInChannel(),
                teamMembers: Object.assign([], TeamStore.getMembersInTeam()),
                channelMembers: Object.assign([], ChannelStore.getMembersInChannel())
            });
            this.searchTimeoutId = '';
            return;
        }

        const searchTimeoutId = setTimeout(
            () => {
                searchUsers(
                    term,
                    TeamStore.getCurrentId(),
                    {},
                    (users) => {
                        if (searchTimeoutId !== this.searchTimeoutId) {
                            return;
                        }

                        this.setState({
                            loading: true,
                            search: true,
                            users,
                            term,
                            teamMembers: Object.assign([], TeamStore.getMembersInTeam()),
                            channelMembers: Object.assign([], ChannelStore.getMembersInChannel())
                        });
                        loadTeamMembersAndChannelMembersForProfilesList(users, TeamStore.getCurrentId(), ChannelStore.getCurrentId(), this.loadComplete);
                    }
                );
            },
            Constants.SEARCH_TIMEOUT_MILLISECONDS
        );

        this.searchTimeoutId = searchTimeoutId;
    }

    handleInviteError(err) {
        if (err) {
            this.setState({
                inviteError: err.message
            });
        } else {
            this.setState({
                inviteError: null
            });
        }
    }

    render() {
        const teamMembers = this.state.teamMembers;
        const channelMembers = this.state.channelMembers;
        const users = this.state.users;
        const actionUserProps = {};

        let usersToDisplay;
        if (this.state.loading) {
            usersToDisplay = null;
        } else {
            usersToDisplay = users;

            // for (let i = 0; i < users.length; i++) {
            //     const user = users[i];
            //
            //     if (teamMembers[user.id] && channelMembers[user.id]) {
            //         usersToDisplay.push(user);
            //         actionUserProps[user.id] = {
            //             channel: this.props.channel,
            //             teamMember: teamMembers[user.id],
            //             channelMember: channelMembers[user.id]
            //         };
            //     }
            // }
        }

        return (
            <SearchableUserList
                users={usersToDisplay}
                usersPerPage={USERS_PER_PAGE}
                total={this.state.total}
                nextPage={this.nextPage}
                search={this.search}
                actions={[BlacklistDeleteButton]}
                actionProps={{
                    onInviteError: this.handleInviteError
                }}
                focusOnMount={!UserAgent.isMobile()}
            />
        );
    }
}

MemberBlacklist.propTypes = {

};

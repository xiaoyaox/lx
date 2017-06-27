// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import BlacklistAddButton from './blacklist_add_button.jsx';
import SearchableUserList from 'components/searchable_user_list/searchable_user_list_container.jsx';
import LoadingScreen from '../loading_screen.jsx';

import ChannelStore from 'stores/channel_store.jsx';
import UserStore from 'stores/user_store.jsx';
import TeamStore from 'stores/team_store.jsx';

import {searchUsers} from 'actions/user_actions.jsx';

import * as AsyncClient from 'utils/async_client.jsx';
import * as UserAgent from 'utils/user_agent.jsx';
import Constants from 'utils/constants.jsx';

// blacklist
import {loadGetNotInBlacklist} from 'actions/blacklist_actions.jsx';
import BlacklistStore from 'stores/blacklist_store.jsx';

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

const USERS_PER_PAGE = 50;

export default class AddUsersToBlacklist extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onHide = this.onHide.bind(this);
        this.handleInviteError = this.handleInviteError.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.search = this.search.bind(this);

        this.term = '';
        this.searchTimeoutId = 0;

        // const blacklist_member_count = BlacklistStore.getBlacklistMemberCount();
        // const teamStats = TeamStore.getCurrentStats();

        this.state = {
            users: null,
            total: 0,
            show: true,
            search: false,
            statusChange: false
        };
    }

    componentDidMount() {
        // TeamStore.addStatsChangeListener(this.onChange);
        // ChannelStore.addStatsChangeListener(this.onChange);
        // UserStore.addNotInChannelChangeListener(this.onChange);
        // UserStore.addStatusesChangeListener(this.onStatusChange);
        //
        // AsyncClient.getProfilesNotInChannel(this.props.channel.id, 0);
        // AsyncClient.getTeamStats(TeamStore.getCurrentId());

        BlacklistStore.addChangeListener(this.onChange);

        loadGetNotInBlacklist(0, USERS_PER_PAGE * 2);
    }

    componentWillUnmount() {
        BlacklistStore.removeChangeListener(this.onChange);

        // TeamStore.removeStatsChangeListener(this.onChange);
        // ChannelStore.removeStatsChangeListener(this.onChange);
        // UserStore.removeNotInChannelChangeListener(this.onChange);
        // UserStore.removeStatusesChangeListener(this.onStatusChange);
    }

    onChange(force) {
        if (this.state.search && !force) {
            this.search(this.term);
            return;
        }

        const blacklist_member_count = BlacklistStore.getBlacklistMemberCount();
        const teamStats = TeamStore.getCurrentStats();

        this.setState({
            users: BlacklistStore.getNotInBlacklist(),
            total: BlacklistStore.getNotInBlacklistMemberCount()
        });
    }

    onStatusChange() {
        // Initiate a render to pick up on new statuses
        this.setState({
            statusChange: !this.state.statusChange
        });
    }

    onHide() {
        this.setState({show: false});
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

    nextPage(page) {
        AsyncClient.getProfilesNotInChannel(this.props.channel.id, (page + 1) * USERS_PER_PAGE, USERS_PER_PAGE);
    }

    search(term) {
        clearTimeout(this.searchTimeoutId);

        this.term = term;

        if (term === '') {
            this.onChange(true);
            this.setState({search: false});
            this.searchTimeoutId = '';
            return;
        }

        const searchTimeoutId = setTimeout(
            () => {
                searchUsers(
                    term,
                    TeamStore.getCurrentId(),
                    {not_in_channel_id: ''},
                    (users) => {
                        if (searchTimeoutId !== this.searchTimeoutId) {
                            return;
                        }

                        this.setState({search: true, users});
                    }
                );
            },
            Constants.SEARCH_TIMEOUT_MILLISECONDS
        );

        this.searchTimeoutId = searchTimeoutId;
    }

    render() {
        let inviteError = null;
        if (this.state.inviteError) {
            inviteError = (<label className='has-error control-label'>{this.state.inviteError}</label>);
        }

        let content;
        if (this.state.loading) {
            content = (<LoadingScreen/>);
        } else {
            content = (
                <SearchableUserList
                    users={this.state.users}
                    usersPerPage={USERS_PER_PAGE}
                    total={this.state.total}
                    nextPage={this.nextPage}
                    search={this.search}
                    actions={[BlacklistAddButton]}
                    focusOnMount={!UserAgent.isMobile()}
                    actionProps={{
                        channel: this.props.channel,
                        onInviteError: this.handleInviteError
                    }}
                />
            );
        }

        return (
            <Modal
                dialogClassName='more-modal'
                show={this.state.show}
                onHide={this.onHide}
                onExited={this.props.onHide}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title>
                        <FormattedMessage
                            id='sidebar.createBlacklist'
                            defaultMessage='Add Users to Black List '
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {inviteError}
                    {content}
                </Modal.Body>
            </Modal>
        );
    }
}

AddUsersToBlacklist.propTypes = {
    onHide: React.PropTypes.func
};

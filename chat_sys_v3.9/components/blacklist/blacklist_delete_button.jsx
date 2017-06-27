// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import SpinnerButton from 'components/spinner_button.jsx';

import {loadGetBlacklist, loadDeleteBlacklistUsers} from 'actions/blacklist_actions.jsx';

import React from 'react';
import {FormattedMessage} from 'react-intl';

const USERS_PER_PAGE = 50;

export default class BlacklistDeleteButton extends React.Component {
    static get propTypes() {
        return {
            user: React.PropTypes.object.isRequired,
            onInviteError: React.PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            addingUser: false
        };
    }

    handleClick() {
        if (this.state.addingUser) {
            return;
        }

        this.setState({
            addingUser: true
        });

        loadDeleteBlacklistUsers(
            this.props.user.id,
            () => {
                this.props.onInviteError(null);
                loadGetBlacklist(0, USERS_PER_PAGE * 2);
            },
            (err) => {
                this.setState({
                    addingUser: false
                });

                this.props.onInviteError(err);
            }
        );
    }

    render() {
        return (
            <button
                id='deleteBlackMembers'
                type='button'
                className='btn btn-danger btn-message'
                onClick={this.handleClick}
            >
                <FormattedMessage
                    id='channel_members_dropdown.remove_member'
                    defaultMessage='Remove Member'
                />
            </button>
        );
    }
}

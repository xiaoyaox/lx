// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import MemberBlacklist from './member_blacklist.jsx';

import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';
import ChannelStore from 'stores/channel_store.jsx';

import {canManageMembers} from 'utils/channel_utils.jsx';
import {Constants} from 'utils/constants.jsx';

import React from 'react';
import {Modal} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';

export default class ShowBlacklistUsers extends React.Component {
    constructor(props) {
        super(props);

        this.onHide = this.onHide.bind(this);

        this.state = {
            show: true
        };
    }

    onHide() {
        this.setState({show: false});
    }

    render() {

        let addMembersButton = (
            <a
                id='showAddBlacklistModal'
                className='btn btn-md btn-primary'
                href='#'
                onClick={() => {
                    this.props.showAddBlacklistModal();
                    this.onHide();
                }}
            >
                <FormattedMessage
                    id='blacklist_show.addNew'
                    defaultMessage=' Add New Black List Members'
                />
            </a>
        );

        return (
            <div>
                <Modal
                    dialogClassName='more-modal more-modal--action'
                    show={this.state.show}
                    onHide={this.onHide}
                    onExited={this.props.onModalDismissed}
                >
                    <Modal.Header closeButton={true}>
                        <Modal.Title>
                            <FormattedMessage
                              id='sidebar.blacklist'
                              defaultMessage='Black List'
                            />
                        </Modal.Title>
                        {addMembersButton}
                    </Modal.Header>
                    <Modal.Body
                        ref='modalBody'
                    >
                        <MemberBlacklist  />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

ShowBlacklistUsers.propTypes = {
    onModalDismissed: React.PropTypes.func.isRequired,
    showAddBlacklistModal: React.PropTypes.func.isRequired
};

// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {browserHistory} from 'react-router/es6';

import Client from 'client/web_client.jsx';
import PreferenceStore from 'stores/preference_store.jsx';
import * as Utils from 'utils/utils.jsx';

import SidebarHeaderDropdown from './sidebar_header_dropdown.jsx';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import {Preferences, TutorialSteps, Constants} from 'utils/constants.jsx';
import {createMenuTip} from 'components/tutorial/tutorial_tip.jsx';

import signup_logo from 'images/signup_logo.png';

export default class SidebarHeader extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onPreferenceChange = this.onPreferenceChange.bind(this);

        this.state = this.getStateFromStores();
    }

    componentDidMount() {
        PreferenceStore.addChangeListener(this.onPreferenceChange);
    }

    componentWillUnmount() {
        PreferenceStore.removeChangeListener(this.onPreferenceChange);
    }

    getStateFromStores() {
        const tutorialStep = PreferenceStore.getInt(Preferences.TUTORIAL_STEP, this.props.currentUser.id, 999);

        return {showTutorialTip: tutorialStep === TutorialSteps.MENU_POPOVER && !Utils.isMobile()};
    }

    onPreferenceChange() {
        this.setState(this.getStateFromStores());
    }

    toggleDropdown(e) {
        e.preventDefault();

        this.refs.dropdown.toggleDropdown();
    }

    onClickBackToModules() {
      browserHistory.push('/modules');
    }

    render() {
        var me = this.props.currentUser;
        var profilePicture = null;

        if (!me) {
            return null;
        }
        //src={Client.getUsersRoute() + '/' + me.id + '/image?time=' + me.last_picture_update}
        if (me.last_picture_update) {
            profilePicture = (
                <img
                    className='user__picture'
                    src={Client.getPublicPictureUrl()}
                />
            );
        }

        let tutorialTip = null;
        if (this.state.showTutorialTip) {
            tutorialTip = createMenuTip(this.toggleDropdown);
        }

        let teamNameWithToolTip = null;
        if (this.props.teamDescription === '') {
            teamNameWithToolTip = (
                <div className='team__name'>{this.props.teamDisplayName}</div>
            );
        } else {
            teamNameWithToolTip = (
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='bottom'
                    overlay={<Tooltip id='team-name__tooltip'>{this.props.teamDescription}</Tooltip>}
                    ref='descriptionOverlay'
                >
                    <div className='team__name'>{this.props.teamDisplayName}</div>
                </OverlayTrigger>
            );
        }

        return (
            <div className='team__header theme' style={{padding: "0px"}}>
                {tutorialTip}
                <div className='custom_ant_header'>
                    <div className="custom_ant_header_logo addressbook_logo" onClick={this.onClickBackToModules} style={{marginLeft: "0px", background: "#3f84af"}}>
                      <span className="logo_icon" style={{paddingLeft: "20px"}}><img width="40" height="40" src={signup_logo}/></span>
                      <div className="logo_title">
                        <p>{'@' + me.username}</p><p>司法E通</p>
                      </div>
                    </div>

                </div>
                {/*<div>
                    {profilePicture}
                    <div className='header__info'>
                        <div className='user__name'>{'@' + me.username}</div>
                        {teamNameWithToolTip}
                    </div>
                </div>
                <SidebarHeaderDropdown
                    ref='dropdown'
                    teamType={this.props.teamType}
                    teamDisplayName={this.props.teamDisplayName}
                    teamName={this.props.teamName}
                    currentUser={this.props.currentUser}
                />*/}
            </div>
        );
    }
}

SidebarHeader.defaultProps = {
    teamDisplayName: '',
    teamDescription: '',
    teamType: ''
};
SidebarHeader.propTypes = {
    teamDisplayName: React.PropTypes.string,
    teamDescription: React.PropTypes.string,
    teamName: React.PropTypes.string,
    teamType: React.PropTypes.string,
    currentUser: React.PropTypes.object
};

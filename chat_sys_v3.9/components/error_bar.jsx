// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import {Link} from 'react-router';

import AnalyticsStore from 'stores/analytics_store.jsx';
import ErrorStore from 'stores/error_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as AsyncClient from 'utils/async_client.jsx';
import {ErrorBarTypes, StatTypes} from 'utils/constants.jsx';
import {isLicenseExpiring, isLicenseExpired, isLicensePastGracePeriod, displayExpiryDate} from 'utils/license_utils.jsx';
import * as Utils from 'utils/utils.jsx';

const RENEWAL_LINK = 'https://licensing.3ren.com/renew';

const BAR_DEVELOPER_TYPE = 'developer';
const BAR_CRITICAL_TYPE = 'critical';

export default class ErrorBar extends React.Component {
    constructor() {
        super();

        this.onErrorChange = this.onErrorChange.bind(this);
        this.onAnalyticsChange = this.onAnalyticsChange.bind(this);
        this.handleClose = this.handleClose.bind(this);

        ErrorStore.clearLastError();

        this.setInitialError();

        this.state = ErrorStore.getLastError() || {};
    }

    setInitialError() {
        let isSystemAdmin = false;
        const user = UserStore.getCurrentUser();
        if (user) {
            isSystemAdmin = Utils.isSystemAdmin(user.roles);
        }

        const errorIgnored = ErrorStore.getIgnoreNotification();

        if (!errorIgnored) {
            if (isSystemAdmin && global.mm_config.SiteURL === '') {
                ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.SITE_URL});
                return;
            } else if (global.mm_config.SendEmailNotifications === 'false') {
                ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.PREVIEW_MODE});
                return;
            }
        }

        if (isLicensePastGracePeriod()) {
            if (isSystemAdmin) {
                ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.LICENSE_EXPIRED, type: BAR_CRITICAL_TYPE});
            } else {
                ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.LICENSE_PAST_GRACE, type: BAR_CRITICAL_TYPE});
            }
        } else if (isLicenseExpired() && isSystemAdmin) {
            ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.LICENSE_EXPIRED, type: BAR_CRITICAL_TYPE});
        } else if (isLicenseExpiring() && isSystemAdmin) {
            ErrorStore.storeLastError({notification: true, message: ErrorBarTypes.LICENSE_EXPIRING});
        }
    }

    isValidError(s) {
        if (!s) {
            return false;
        }

        if (!s.message) {
            return false;
        }

        if (s.message === ErrorBarTypes.LICENSE_EXPIRING && !this.state.totalUsers) {
            return false;
        }

        return true;
    }

    componentDidMount() {
        ErrorStore.addChangeListener(this.onErrorChange);
        AnalyticsStore.addChangeListener(this.onAnalyticsChange);
    }

    componentWillUnmount() {
        ErrorStore.removeChangeListener(this.onErrorChange);
        AnalyticsStore.removeChangeListener(this.onAnalyticsChange);
    }

    onErrorChange() {
        var newState = ErrorStore.getLastError();

        if (newState) {
            if (newState.message === ErrorBarTypes.LICENSE_EXPIRING && !this.state.totalUsers) {
                AsyncClient.getStandardAnalytics();
            }
            this.setState(newState);
        } else {
            this.setState({message: null});
        }
    }

    onAnalyticsChange() {
        const stats = AnalyticsStore.getAllSystem();
        this.setState({totalUsers: stats[StatTypes.TOTAL_USERS]});
    }

    handleClose(e) {
        if (e) {
            e.preventDefault();
        }

        if (ErrorStore.getLastError() && ErrorStore.getLastError().notification) {
            ErrorStore.clearNotificationError();
        } else {
            ErrorStore.clearLastError();
        }

        this.setState({message: null});
    }

    render() {
        if (!this.isValidError(this.state)) {
            return <div/>;
        }

        var errClass = 'error-bar';

        if (this.state.type === BAR_DEVELOPER_TYPE) {
            errClass = 'error-bar-developer';
        } else if (this.state.type === BAR_CRITICAL_TYPE) {
            errClass = 'error-bar-critical';
        }

        const renewalLink = RENEWAL_LINK + '?id=' + global.window.mm_license.Id + '&user_count=' + this.state.totalUsers;

        let message = this.state.message;
        if (message === ErrorBarTypes.PREVIEW_MODE) {
            message = (
                <FormattedMessage
                    id={ErrorBarTypes.PREVIEW_MODE}
                    defaultMessage='Preview Mode: Email notifications have not been configured'
                />
            );
        } else if (message === ErrorBarTypes.LICENSE_EXPIRING) {
            message = (
                <FormattedHTMLMessage
                    id={ErrorBarTypes.LICENSE_EXPIRING}
                    defaultMessage='Enterprise license expires on {date}. <a href="{link}" target="_blank">Please renew.</a>'
                    values={{
                        date: displayExpiryDate(),
                        link: renewalLink
                    }}
                />
            );
        } else if (message === ErrorBarTypes.LICENSE_EXPIRED) {
            message = (
                <FormattedHTMLMessage
                    id={ErrorBarTypes.LICENSE_EXPIRED}
                    defaultMessage='Enterprise license is expired and some features may be disabled. <a href="{link}" target="_blank">Please renew.</a>'
                    values={{
                        link: renewalLink
                    }}
                />
            );
        } else if (message === ErrorBarTypes.LICENSE_PAST_GRACE) {
            message = (
                <FormattedMessage
                    id={ErrorBarTypes.LICENSE_PAST_GRACE}
                    defaultMessage='Enterprise license is expired and some features may be disabled. Please contact your System Administrator for details.'
                />
            );
        } else if (message === ErrorBarTypes.SITE_URL) {
            let id;
            let defaultMessage;
            if (global.mm_config.EnableSignUpWithGitLab === 'true') {
                id = 'error_bar.site_url_gitlab';
                defaultMessage = 'Please configure your {docsLink} in the System Console or in gitlab.rb if you\'re using GitLab 3ren.';
            } else {
                id = 'error_bar.site_url';
                defaultMessage = 'Please configure your {docsLink} in the System Console.';
            }

            message = (
                <FormattedMessage
                    id={id}
                    defaultMessage={defaultMessage}
                    values={{
                        docsLink: (
                            <a
                                href='https://docs.3ren.com/administration/config-settings.html#site-url'
                                rel='noopener noreferrer'
                                target='_blank'
                            >
                                <FormattedMessage
                                    id='error_bar.site_url.docsLink'
                                    defaultMessage='Site URL'
                                />
                            </a>
                        ),
                        link: (
                            <Link to='/admin_console/general/configuration'>
                                <FormattedMessage
                                    id='error_bar.site_url.link'
                                    defaultMessage='the System Console'
                                />
                            </Link>
                        )
                    }}
                />
            );
        }

        return (
            <div className={errClass}>
                <span>{message}</span>
                <a
                    href='#'
                    className='error-bar__close'
                    onClick={this.handleClose}
                >
                    {'×'}
                </a>
            </div>
        );
    }
}

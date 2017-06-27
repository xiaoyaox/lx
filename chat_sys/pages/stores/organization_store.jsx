
// import keyMirror from 'key-mirror/keyMirror.js';
import AppDispatcher from '../../dispatcher/app_dispatcher.jsx';
import EventEmitter from 'events';

const ORGANIZATION_CHANGE_EVENT = 'organization_change';
// const SERVER_AUDIT_CHANGE_EVENT = 'server_audit_change';
// const CONFIG_CHANGE_EVENT = 'config_change';
// const ALL_TEAMS_EVENT = 'all_team_change';
// const SERVER_COMPLIANCE_REPORT_CHANGE_EVENT = 'server_compliance_reports_change';

// let OrganizationPayloadSources = keyMirror({
//     SERVER_ACTION: null,
//     VIEW_ACTION: null
// });

class OrganizationStoreClass extends EventEmitter {
    constructor() {
        super();
        this.organizationsData = null;
        this.organizationsFlatData = null;
        this.organizationsFlatDataMap = null;
    }

    emitOrgaChange() {
        this.emit(ORGANIZATION_CHANGE_EVENT);
    }

    addOrgaChangeListener(callback) {
        this.on(ORGANIZATION_CHANGE_EVENT, callback);
    }

    removeOrgaChangeListener(callback) {
        this.removeListener(ORGANIZATION_CHANGE_EVENT, callback);
    }

    getOrgaData() {
        return this.organizationsData;
    }
    getOrgaFlatData() {
        return this.organizationsFlatData;
    }
    getOrgaFlatMap() {
        return this.organizationsFlatDataMap;
    }

    setOrgaData(organizationsData) {
        this.organizationsData = organizationsData;
    }
    setOrgaFlatData(organizationsFlatData) {
        this.organizationsFlatData = organizationsFlatData;
    }
    setOrgaFlatMap(organizationsFlatDataMap) {
        this.organizationsFlatDataMap = organizationsFlatDataMap;
    }

}

var OrganizationStore = new OrganizationStoreClass();
OrganizationStore.setMaxListeners(600);

OrganizationStoreClass.dispatchToken = AppDispatcher.register((payload) => {
    var action = payload.action;
    switch (action.type) {
    case "received_new_organizations":
        OrganizationStore.setOrgaData(action.organizationsData);
        OrganizationStore.setOrgaFlatData(action.organizationsFlatData);
        OrganizationStore.setOrgaFlatMap(action.organizationsFlatDataMap);
        OrganizationStore.emitOrgaChange();
        break;
    // case ActionTypes.RECEIVED_SERVER_AUDITS:
    //     OrganizationStore.saveAudits(action.audits);
    //     OrganizationStore.emitAuditChange();
    //     break;
    // case ActionTypes.RECEIVED_SERVER_COMPLIANCE_REPORTS:
    //     OrganizationStore.saveComplianceReports(action.complianceReports);
    //     OrganizationStore.emitComplianceReportsChange();
    //     break;
    default:
    }
});

export default OrganizationStore;

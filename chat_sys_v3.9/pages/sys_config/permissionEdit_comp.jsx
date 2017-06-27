import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import UserStore from 'stores/user_store.jsx';
import * as organizationUtils from '../utils/organization_utils.jsx';
import * as commonUtils from '../utils/common_utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import { Row, Col, Tree,message ,notification} from 'antd';

const TreeNode = Tree.TreeNode;
notification.config({
  top: 68,
  duration: 3
});
class PermissionEditComp extends React.Component {
  constructor(props) {
      super(props);
      this.onPermissionChecked = this.onPermissionChecked.bind(this);
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'].indexOf('action') != -1;
      this.state = {
        hasOperaPermission:hasOperaPermission, //是否有操作权限。
        organizationId:'',

        permissionsData:[],  //功能权限的数据
        permissionsFlatData:[],
        permissionsFlatMap:{},
        autoExpandParent:true,
        expandedKeys:[],
        checkedKeys:[],
        selectedKeys:[],

        resourcePermissionsData:[], //资源权限的数据
        resourcePermissionsFlatData:[],
        resourcePermissionsFlatMap:{},
        autoExpandParentResource:true,
        expandedKeysResource:[],
        checkedKeysResource:[],
        selectedKeysResource:[],
      };
  }
  componentWillMount(){
    myWebClient.getPermissionsData((data,res)=>{
      let resObj = JSON.parse(res.text);
      // console.log("request server permissionsData:",resObj);
      let flatDataArr = organizationUtils.getPermissionFlatDataArr(resObj.permission); //平行的object数组结构。
      let flatDataMap = organizationUtils.getPermissionFlatMap(flatDataArr);

      let resFlatDataArr = organizationUtils.getPermissionFlatDataArr(resObj.resourcePermission); //平行的object数组结构。
      let resFlatDataMap = organizationUtils.getPermissionFlatMap(resFlatDataArr);
        this.setState({
          "permissionsData":resObj.permission,
          "expandedKeys":this.getTreeDefaultExpandKeys(resObj.permission),
          permissionsFlatData:flatDataArr,
          permissionsFlatMap:flatDataMap,

          "resourcePermissionsData":resObj.resourcePermission,
          // expandedKeysResource:this.getTreeDefaultExpandKeys(resObj.resourcePermission),
          resourcePermissionsFlatData:resFlatDataArr,
          resourcePermissionsFlatMap:resFlatDataMap,

        });
    }, (e,err,res)=>{
      notification.error({message: "获取权限数据失败了！"});

        // console.log("request server orgnizasitions response error info:", err);
    });
  }
  getTreeDefaultExpandKeys(permissionsData){ //只展开第一级的。
    let arr = permissionsData.map((obj) => {
      return obj.resourceId;
    });
    return arr;
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.organizationId != this.props.organizationId){
      this.setState({organizationId:nextProps.organizationId});
      this.getPermissionsDataByOrgaId(nextProps.organizationId);
    }
  }

  getPermissionsDataByOrgaId(organizationId){
    myWebClient.getPermissionsDataByOrgaId(organizationId, (data,res)=>{
      let resObj = JSON.parse(res.text);
      console.log("getPermissionsDataByOrgaId:",resObj);
      let flatArr = organizationUtils.getPermissionFlatDataArr(resObj.permission);
      let checkedKeys = flatArr.map((obj)=>{
        if(obj.permissionId){
          return obj.resourceId;
        }else{
          return '';
        }
      });
      checkedKeys = commonUtils.removeNullValueOfArr(checkedKeys);
      //
      let flatArrResource = organizationUtils.getPermissionFlatDataArr(resObj.resourcePermission);
      let checkedKeysResource = flatArrResource.map((obj)=>{
        if(obj.permissionId){
          return obj.resourceId;
        }else{
          return '';
        }
      });
      checkedKeysResource = commonUtils.removeNullValueOfArr(checkedKeysResource);
      //
      this.setState({
        checkedKeys,
        checkedKeysResource
      });
    }, (e,err,res)=>{
      notification.error({message: "获取权限数据失败了！"});

        // console.log("request server orgnizasitions response error info:", err);
    });
  }

  getPermissionTreeNodes(permissionsData){
    let ele = [];
    $.each(permissionsData, (index, obj)=>{
      if(!obj.sub || obj.sub.length <= 0){ //已经是子节点了。
        ele.push((<TreeNode key={obj.resourceId} title={obj.resourceName}/>));
      }else{ //表示还有孩子节点存在。
        let tempEle = this.getPermissionTreeNodes(obj.sub);
        ele.push((<TreeNode key={obj.resourceId} title={<span>{obj.resourceName}</span>}>{tempEle}</TreeNode>)); //递归调用
      }
    });
    return ele;
  }


  onExpandTree = (expandedKeys,obj,node) => { //功能权限树展开父节点调用。
    // console.log("this.state.expandedKeys--:",expandedKeys);
    this.setState({expandedKeys:expandedKeys,autoExpandParent:false});
  }
  onPermissionChecked = (checkedKeys,e) => {
    // console.log("Permission-onPermissionChecked--:",checkedKeys);//checkedKeys:是个数组，被选中的id.
    this.setState({checkedKeys});
  }
  onSelectPermission = (selectedKeys, info) => {
  //  console.log('onSelect', info);
   this.setState({ selectedKeys });
 }

 onExpandTreeResource = (expandedKeys,obj,node) => { //资源权限树展开一个父节点时。
   this.setState({expandedKeysResource:expandedKeys,autoExpandParentResource:false});
 }
 onPermissionCheckedResource = (checkedKeys,e) => {
   this.setState({checkedKeysResource:checkedKeys});
 }
 onSelectPermissionResource = (selectedKeys, info) => {
   this.setState({ selectedKeysResource:selectedKeys });
 }


 onClickSave = () => {
   console.log("click save permission!");
   let params = this.state.checkedKeys.map((val)=>{
     let obj = this.state.permissionsFlatMap[val];
     obj.organization = this.props.organizationId;
     if(obj.actions){
       return organizationUtils.copyPermissionAttrData(obj);
     }else{
       return '';
     }
   });
   let params2 = this.state.checkedKeysResource.map((val)=>{
     let obj = this.state.resourcePermissionsFlatMap[val];
     obj.organization = this.props.organizationId;
     if(obj.subNum){
       return '';
     }else{
       return organizationUtils.copyPermissionAttrData(obj);
     }
   });
   params = params.concat(params2);
   params = commonUtils.removeNullValueOfArr(params);
   console.log("params:",params);
   myWebClient.updatePermissionsDataByOrgaId(this.props.organizationId, params, (data,res)=>{
     let objArr = JSON.parse(res.text);
     notification.success({message: "编辑权限数据成功！"});
     console.log("after updatePermissionsDataByOrgaId:",objArr);
   }, (e,err,res)=>{
     notification.error({message: "编辑权限数据失败了！"});

   });
 }

  render() {
    const { permissionsData, resourcePermissionsData } = this.state;
    let treeNodes = this.getPermissionTreeNodes(permissionsData || []);
    let resourceTreeNodes = this.getPermissionTreeNodes(resourcePermissionsData || []);
    return (
      <div>
        {this.state.hasOperaPermission?
          (<span>
            <button type="button" className="btn btn-primary" onClick={this.onClickSave}
            disabled={this.props.organizationId?false:true}>保存</button>
          </span>):null
        }
        {permissionsData.length>0?(
          <Row gutter={16}>
            <Col span={12} style={{marginTop:18}}>
            <span style={{fontSize:'1em',paddingLeft:10}}>功能权限：</span>
              <Tree
                showLine
                checkable
                autoExpandParent={this.state.autoExpandParent}
                onExpand={this.onExpandTree}
                expandedKeys={this.state.expandedKeys}
                onCheck={this.onPermissionChecked}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelectPermission}
                selectedKeys={this.state.selectedKeys}
              >
                {treeNodes}
              </Tree>
            </Col>
            <Col span={12} style={{marginTop:18}}>
              <span style={{fontSize:'1em',paddingLeft:10}}>资源权限：</span>
              <Tree
                showLine
                checkable
                onExpand={this.onExpandTreeResource}
                expandedKeys={this.state.expandedKeysResource}
                onCheck={this.onPermissionCheckedResource}
                checkedKeys={this.state.checkedKeysResource}
                onSelect={this.onSelectPermissionResource}
                selectedKeys={this.state.selectedKeysResource}
              >
                {resourceTreeNodes}
              </Tree>
            </Col>
          </Row>
        ):null}
      </div>
    )
  }
}

PermissionEditComp.defaultProps = {
};

PermissionEditComp.propTypes = {
  organizationId:React.PropTypes.string,
  // organizationsFlatDataMap:React.PropTypes.object,
  // getSelectCurOrganization:React.PropTypes.func
};

export default PermissionEditComp;

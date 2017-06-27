import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';

import { Row, Col, Tree,notification } from 'antd';
const TreeNode = Tree.TreeNode;
notification.config({
  top: 68,
  duration: 3
});
class OrganizationTreeComp extends React.Component {
  constructor(props) {
      super(props);
      this.onSelectTreeItem = this.onSelectTreeItem.bind(this);
      this.onExpandTree = this.onExpandTree.bind(this);
      this.state = {
        expandedKeys:[],
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.organizationsData){
      let expandedKeys = this.getTreeDefaultExpandKeys(nextProps.organizationsData);
      this.setState({expandedKeys:expandedKeys});
    }
  }
  getTreeDefaultExpandKeys(organizationsData){ //只展开第一级的组织机构。
    let arr = organizationsData.map((obj) => {
      return obj.id;
    });
    return arr;
  }

  getOrganiTreeNodes(organizationsData){
    let ele = [];
    $.each(organizationsData, (index, obj)=>{
      if(!obj.subOrganization || obj.subOrganization.length <= 0){ //已经是子节点了。
        ele.push((<TreeNode key={obj.id} title={obj.name}/>));
      }else{ //表示还有孩子节点存在。
        let tempEle = this.getOrganiTreeNodes(obj.subOrganization);
        ele.push((<TreeNode key={obj.id} title={<span>{obj.name}</span>}>{tempEle}</TreeNode>)); //递归调用
      }
    });
    return ele;
  }

  onSelectTreeItem(val){
    console.log("onorganization——SelectTreeItem--:",val);//val:是个数组，被选中的id.
    let orga = this.props.organizationsFlatDataMap[val[0]] || {};
    if(orga.name == "administrator" || orga.name == "Administrator"){
      notification.warning({message: "该组织不能编辑和删除！"});
      return;
    }
    this.props.getSelectCurOrganization(orga);
  }

  onExpandTree(expandedKeys,obj,node){
    // console.log("this.state.expandedKeys--:",expandedKeys);
    this.setState({expandedKeys:expandedKeys});
  }

  render() {
    const { organizationsData } = this.props;
    let treeNodes = this.getOrganiTreeNodes(organizationsData || []);
    return (
      <div>
        <Tree
          showLine={true}
          autoExpandParent={true}
          defaultExpandedKeys={this.state.expandedKeys}
          onExpand={this.onExpandTree}
          onSelect={this.onSelectTreeItem}
        >
          {treeNodes}
        </Tree>
      </div>
    )
  }
}

OrganizationTreeComp.defaultProps = {
};

OrganizationTreeComp.propTypes = {
  organizationsData:React.PropTypes.array,
  organizationsFlatDataMap:React.PropTypes.object,
  getSelectCurOrganization:React.PropTypes.func
};

export default OrganizationTreeComp;

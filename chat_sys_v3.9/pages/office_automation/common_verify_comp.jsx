import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { Badge, List, InputItem,TextareaItem,
  Flex,Picker,Button,NavBar,Radio,WhiteSpace} from 'antd-mobile';
import { Icon} from 'antd';
import { createForm } from 'rc-form';
//阅文意见
class CommonVerifyCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"verify",
        isHide:false,
        belongDepart:'148中心',
        selectNotionType:'部门意见',
        verifyCnt:'',//审核意见的内容。
        notionTypes:[], //意见类型
        organizationTypes:[], //组织机构类型
        personList:[], // 人员信息
      };
  }
  componentWillMount(){
    if(this.props.docunid){
      this.getServerNotionType();
      OAUtils.getOrganization({
        tokenunid:this.props.tokenunid,
        successCall: (data)=>{
          console.log("获取OA的组织机构数据：",data);
          let organizationList = OAUtils.formatOrganizationData(data.values);
          let organizationTypes = this.parseOrgaTypes(organizationList) || [];
          let personList = this.parsePersonList(data.values['sortpersonlist'] ||{}) || [];
          this.setState({
            organizationMap:data.values || {},
            organizationTypes:organizationTypes,
            personList:personList,
          });
        }
      });
    }
  }
  parseOrgaTypes = (organizationList)=>{
    return organizationList.map((item)=>{
      return {
        label:item.commonname,
        value:item.commonname
      }
    });
  }
  parsePersonList = (personMap)=>{
    let personList = [];
    for(let key in personMap){
      personList.push({
        label:personMap[key]['commonname'],
        value:personMap[key]['commonname']
      });
    }
    return personList;
  }
  //获取阅文意见类型
  getServerNotionType = ()=>{
    OAUtils.getVerifyNotionTypes({
      modulename:this.props.modulename,
      tokenunid:this.props.tokenunid,
      docunid:this.props.docunid,
      gwlcunid:this.props.gwlcunid,
      successCall: (data)=>{
        console.log("get 签报管理的阅文意见的意见类型数据:",data);
        let notionTypes = this.formatNotionTypes(data.values['yjlx']['items']);
        this.setState({
          notionTypes,
        });
      },
      errorCall: (res)=>{
        console.log("errorCall info--:",res.ErrorText);
        this.setState({
          notionTypes:[{label:'部门意见',value:'部门意见'}]
        });
      }
    });
  }
  formatNotionTypes = (items)=>{
    return items.map((item)=>{
      return {
        label:item.text,
        value:item.value
      }
    });
  }
  onPickerNotionType = (val)=>{ //选择意见类型
    console.log("onPickerNotionType:",val);
    this.setState({selectNotionType:val});
  }
  onPickerOkPlease = (val)=>{ //选择请的方式
    this.setVerifyCnt2Arr(0,val);
  }
  onPickerOkDepartment = (val)=>{ //选择好部门
    this.setVerifyCnt2Arr(1,val);
  }
  onPickerOkMembers = (val)=>{ //选择好人员
    this.setVerifyCnt2Arr(2,val);
  }
  onPickerOkStatus = (val)=>{ //选择好状态
    this.setVerifyCnt2Arr(3,val);
  }
  setVerifyCnt2Arr = (index,val)=>{
    let {verifyCnt} = this.state;
    if(index == 0){
      verifyCnt += val;
    }else if(index == 3){
      verifyCnt += val+"。";
    }else{
      verifyCnt += "-"+val;
    }
    this.setState({
      verifyCnt:verifyCnt,
    });
  }
  onVerifyCntChange = (val)=>{
    console.log("onVerifyCntChange:",val);
    this.setState({
      verifyCnt:val,
    });
  }
  onClickSave = ()=>{
    OAUtils.saveVerifyNotion({
      modulename:this.props.modulename,
      tokenunid:this.props.tokenunid,
      docunid:this.props.docunid,
      gwlcunid:this.props.gwlcunid,
      notionkind:'文字意见',
      notiontype:this.state.selectNotionType,
      content:this.state.verifyCnt,
      successCall: (data)=>{
        console.log("save--签报管理的阅文意见:",data);
        this.props.backDetailCall();
      }
    });
  }
  onNavBarLeftClick = (e) => {
    // this.setState({isHide:true});
    this.props.backDetailCall();
    // setTimeout(()=>this.props.backDetailCall(),1000);
  }
  render() {
    const { getFieldProps } = this.props.form;
    let owerDepartTypes = [
      {
        label:"148中心",
        value:"148中心"
      },{
        label:"市律师协会",
        value:"市律师协会"
      }
    ];
    let pleaseTypes = [
      {
        label:"请",
        value:"请"
      },{
        label:"有请",
        value:"有请"
      },{
        label:"拟请",
        value:"拟请"
      },{
        label:"转请",
        value:"转请"
      }
    ];
    //处理方式，状态
    let handleTypes= [
      {  label:"",value:""},
      { label:"已阅", value:"已阅"},
      { label:"已签收", value:"已签收"},
      {label:"审核",value:"审核"},
      {label:"办理",value:"办理"},
      {label:"已办理",value:"已办理"},
      {label:"批示",value:"批示"},
      {label:"阅办",value:"阅办"},
      {label:"阅示",value:"阅示"},
      {label:"审签",value:"审签"},
      {label:"会签",value:"会签"},
      {label:"同意",value:"同意"},
      {label:"发",value:"发"},
      {label:"不同意",value:"不同意"},
      {label:"拟同意，呈尹局长批示",value:"拟同意，呈尹局长批示"},
      {label:"请阅示",value:"请阅示"},
      {label:"请审签",value:"请审签"},
      {label:"已核稿",value:"已核稿"},
      {label:"同意回复",value:"同意回复"},
      {label:"建议不网上回复",value:"建议不网上回复"},
      {label:"报名",value:"报名"},
      {label:"同意报",value:"同意报"},
    ];
    // let clsName = this.props.isShow && !this.state.isHide?
    // 'oa_detail_container ds_detail_container oa_detail_container_show':
    // 'oa_detail_container ds_detail_container oa_detail_container_hide';
    // <div>文字意见</div>
    // rightContent={[
    //   <Icon key={1} type="save" onClick={this.onClickSave}/>,
    //   <span key={2} onClick={this.onClickSave}>保存</span>
    // ]}
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]}
          >
          阅文意见
        </NavBar>
        <div style={{marginTop:'60px'}}>
          <WhiteSpace size='md'/>
          <Flex><Flex.Item style={{marginLeft:'0.3rem'}}>
            <Radio className="my-radio" checked={true} onChange={e => console.log('checkbox', e)}>文字意见</Radio>
          </Flex.Item></Flex>
          <WhiteSpace size='md'/>
          <div>
            <List style={{ backgroundColor: 'white' }}>
              <Picker data={owerDepartTypes} cols={1}
                {...getFieldProps('belongDepart')}
                value={[this.state.belongDepart]} >
                <List.Item arrow="horizontal">所属部门</List.Item>
              </Picker>
              <Picker data={this.state.notionTypes} cols={1}
                {...getFieldProps('selectNotionType')}
                value={[this.state.selectNotionType]}
                onOk={this.onPickerNotionType}>
                <List.Item arrow="horizontal">意见类型</List.Item>
              </Picker>
            </List>
            <div style={{height:'1.5em',background:'#f3eeee'}}></div>
            <List style={{ backgroundColor: 'white' }}>
              <Picker data={pleaseTypes} cols={1} {...getFieldProps('please')} onOk={this.onPickerOkPlease}>
                <List.Item arrow="horizontal"><Badge size="small" text="1"/>请</List.Item>
              </Picker>
              <Picker data={this.state.organizationTypes} cols={1} {...getFieldProps('department')} onOk={this.onPickerOkDepartment}>
                <List.Item arrow="horizontal"><Badge size="small" text="2"/>部门</List.Item>
              </Picker>
              <Picker data={this.state.personList} cols={1} {...getFieldProps('person')} onOk={this.onPickerOkMembers}>
                <List.Item arrow="horizontal"><Badge size="small" text="3"/>人员</List.Item>
              </Picker>
              <Picker data={handleTypes} cols={1} {...getFieldProps('status')} onOk={this.onPickerOkStatus}>
                <List.Item arrow="horizontal"><Badge size="small" text="4"/>处理方式</List.Item>
              </Picker>
            </List>
            <Flex>
              <Flex.Item>
                <TextareaItem
                  className={'verifyContent'}
                  title=""
                  clear
                  value={this.state.verifyCnt}
                  autoHeight
                  onChange={this.onVerifyCntChange}
                  labelNumber={0}
                />
              </Flex.Item>
            </Flex>
            <div className={'bottom_btn_center'}>
              <Button type="primary" inline style={{ marginRight: '0.3rem' }} onClick={this.onClickSave}>确定</Button>
              <Button type="ghost" inline style={{}} onClick={this.props.backDetailCall}>取消</Button>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

CommonVerifyCompRaw.defaultProps = {
};

CommonVerifyCompRaw.propTypes = {
};
const CommonVerifyComp = createForm()(CommonVerifyCompRaw);
export default CommonVerifyComp;

//工作通知
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import { Button,WhiteSpace, List, InputItem,TextareaItem, Checkbox, Switch} from 'antd-mobile';
import { Icon} from 'antd';
import {createForm} from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);
const CheckboxItem = Checkbox.CheckboxItem;

class WorkNoticeCompRaw extends React.Component {
  constructor(props) {
      super(props);
      this.getBodyPages = this.getBodyPages.bind(this);
      this.state = {
        isMobile: Utils.isMobile(),
        listData:[],
        date: zhNow,
        dpValue: null,
        visible: false,
      };
  }
  componentWillMount(){

  }
  onChange = (date) => {
    // console.log('onChange', date);
    this.setState({
      date,
    });
  }
  onChangevaltype = (val) => {
    console.log(val);
  }
  onChangevalway = (val) => {
    console.log(val);
  }
  getBodyPages(){
    const { getFieldProps } = this.props.form;
    const dataType = [
     { value: 0, label: '外部通知', name:'externalNotice' },
     { value: 1, label: '内部通知', name:'internalNotice' },
     { value: 2, label: '公告', name:'notice' },
    ];
   const dataWay = [
    { value: 3, label: 'APP', name:'app_info' },
    { value: 4, label: '短信', name:'message' },
    ];
    let todayDate=moment().format('ll');
      let bodyMobilePages=(
        <div className="bodyContent">
            <InputItem clear
            placeholder="请输入"
                autoFocus
            >通知起草人:
            </InputItem>
            <List renderHeader={() => '通知内容:'}>
                  <TextareaItem
                     rows={3}
                     placeholder="请输入"
                  />
            </List>
            <InputItem clear
            placeholder={todayDate}
                autoFocus
            >通知发起时间:
            </InputItem>
            <List renderHeader={() => '通知类别:'}>
                 {dataType.map(i => (
                   <List.Item key={i.value}
                      extra={<Switch
                        {...getFieldProps(i.name, {
                          initialValue: false,
                          valuePropName: 'checked',
                        })}
                        onClick={(checked) => { console.log(checked); }}
                      />}
                    >{i.label}</List.Item>
                 ))}
            </List>
            <List renderHeader={() => '发送方式:'}>
                 {dataWay.map(i => (
                   <List.Item key={i.value}
                      extra={<Switch
                        {...getFieldProps(i.name, {
                          initialValue: false,
                          valuePropName: 'checked',
                        })}
                        onClick={(checked) => { console.log(checked); }}
                      />}
                    >{i.label}</List.Item>
                 ))}
            </List>
            <WhiteSpace size="lg" />
            <Button type="primary" size="middle"
            style={{width:'90%',margin:'1em auto'}}>发送</Button>
        </div>
      );
        return bodyMobilePages;
  }

  render() {
  let bodyPages=this.getBodyPages();
    return (
      <div>
        {bodyPages}
      </div>
    )
  }
}

WorkNoticeCompRaw.defaultProps = {
};
WorkNoticeCompRaw.propTypes = {
};

const WorkNoticeComp = createForm()(WorkNoticeCompRaw);
export default WorkNoticeComp;

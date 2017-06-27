
// deprecated
import $ from 'jquery';
import ReactDOM from 'react-dom';

import React from 'react';
import {Link, browserHistory} from 'react-router/es6';

import * as Utils from 'utils/utils.jsx';
import BrowserStore from 'stores/browser_store.jsx';
import UserStore from 'stores/user_store.jsx';

import myWebClient from 'client/my_web_client.jsx';

import { SearchBar, Drawer, List, NavBar } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon, Affix as AffixPc } from 'antd';
import { Form, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const Search = Input.Search;
// import List  from 'antd-mobile/lib/list';

import ModulesDrawer from 'components_test/modules_drawer.jsx';

import logoImage from 'images/signup_logo.png';

import signup_logo from 'images/signup_logo.png';

import superagent from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
superagentJsonapify(superagent);

import * as GlobalActions from 'actions/global_actions.jsx';


function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInPage extends React.Component {
    static get propTypes() {
        return {
            location: React.PropTypes.object.isRequired,
            params: React.PropTypes.object.isRequired
        };
    }
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        return {
            open: false,
            position: 'left',
            addressbookData:[],
            isMobile: Utils.isMobile()
        };
    }
    onNavBarLeftClick = () => {

    }
    onOpenChange = (...args) => {
      console.log(args);
      this.setState({ open: !this.state.open });
    }

    componentWillMount() {
      let _this = this;
    }
    componentDidMount(){
      setTimeout(()=>{
        $('input[type="password"][name="password"]')[0].removeAttribute("disabled");
      },200)
      this.finishSignin();
      // this.props.form.validateFields();
    }

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let submitInfo = this.props.form.getFieldsValue();
            console.log("submitInfo:",submitInfo);
            this.realSubmit();
          }
      });
    }

    realSubmit(){
      let submitInfo = this.props.form.getFieldsValue();
      $.ajax({
            type: "post",
            url: "http://192.168.9.81:10080/users/login",
            data: {login_id:submitInfo.loginId, password:submitInfo.password,token:''},
            dataType: "json",
            headers: {'Content-Type': 'application/json'},
            success: function(data){
                    browserHistory.push('/');
                  console.log("login success: ",data,res);
                     }
        });
      // myWebClient.login(submitInfo.loginId,submitInfo.password,'',
      //   (data,res)=>{
      //     browserHistory.push('/');
      //     console.log("login success: ",data,res);
      //   },(err)=>{
      //     console.log("login error: ",err);
      //   });
    }

    finishSignin(team) {
      myWebClient.getInitialLoad((data) => {
        console.log("getInitialLoad", data);
      })
    }

    render() {
      const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
      let content = (
        <Form onSubmit={this.handleSubmit} className="signin-form-container">
          <FormItem>
            {getFieldDecorator('loginId', {
              rules: [{ required: true, message: '请输入你的用户名!' }],
            })(
              <Input prefix={<Icon type="user" style={{ fontSize: '2rem' }} />} placeholder="用户名：" name='loginId' />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入你的密码!' }],
              initialValue:"",
            })(
              <Input prefix={<Icon type="lock" style={{ fontSize: '2rem' }} />} type="password" placeholder="密码：" name='password' disabled/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{width:'100%'}}>
              登 录
            </Button>
          </FormItem>
        </Form>
      );

      let customClass = '';
// <ModulesDrawer/>
      return (
        <div style={{fontSize:'16px'}}>

          <div className="signup_backgroundImg"></div>
            <div className='col-sm-12'>
                <div className={'signup-team__container ' + customClass}>
                  <div style={{textAlign:'center',lineHeight:'5rem',marginBottom:'2rem'}}>
                      <img className='' src={logoImage} style={{display:'inline-block',width: '5rem',marginRight: '1rem'}}/>
                      <span style={{display:'inline-block',fontWeight:'bold',color:'#fff',lineHeight:'5rem',fontSize:'3.5rem',verticalAlign: 'middle'}}>司法E通</span>
                    </div>
                    <div className='signup__content'>
                      <div className='signup_background'></div>
                        {content}
                    </div>
                </div>
            </div>
        </div>
      );
    }
}
const WrappedNormalLoginForm = Form.create()(SignInPage);

export default WrappedNormalLoginForm;

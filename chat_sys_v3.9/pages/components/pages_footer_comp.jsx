
import $ from 'jquery';
import * as Utils from 'utils/utils.jsx';
import React from 'react';

export default class PagesFooterComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isMobile: Utils.isMobile()
      };
    }
    componentDidMount() {
        // $('body').addClass('sticky');
        // $('#root').addClass('container-fluid');
    }
    componentWillUnmount() {
        // $('body').removeClass('sticky');
        // $('#root').removeClass('container-fluid');
    }
    render() {
        const content = [];

        return (
            <div className='inner_content_wrap'>
                <div className='row' style={{marginBottom:'4rem'}}>
                    {this.props.children}
                </div>
                <div className='' style={{height:'4rem',position:'relative',bottom:0,background:'none',width:'100%',color:'#fff'}}>
                    <div className='col-xs-12'>
                      <div className="row" style={{textAlign:'center'}}>
                        <div>
                          <span style={{marginRight:'1rem'}}>版权所有@长沙市司法局</span>
                          <span>ICP备案10200870号</span>
                          {this.state.isMobile?(<br/>):null}
                          <span>&nbsp;&nbsp;&nbsp;技术支持：湖南必和必拓科技发展公司</span>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
}

PagesFooterComp.defaultProps = {
};

PagesFooterComp.propTypes = {
    children: React.PropTypes.object
};

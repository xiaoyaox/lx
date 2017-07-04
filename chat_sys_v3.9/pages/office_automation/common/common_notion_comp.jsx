import $ from 'jquery';
import React from 'react';
import {  List,Flex,WhiteSpace} from 'antd-mobile';
import { Icon} from 'antd';
//各领导的历史阅文意见
class CommonNotionComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      };
  }
  componentWillMount(){
  }

  render() {
    const { notionList } = this.props;
    const notionListElements = notionList.map((item,index)=>{
      if(item.wordtype == "textnotion"){
        return (
          <div key={index}>
            <div>{item.content}</div>
            <div><span>——{item.ownercommonname}</span></div>
            <div>{item.modifytime}</div>
          </div>
        );
      }else if(item.wordtype == "writenotion"){
        <div key={index}>
          {
            item.content.map((cnt,k)=>{
              reurn (<div key={k}><img href={cnt.preimage}/></div>);
            })
          }
          <div>{item.content}</div>
          <div>{item.preimage?<img href={item.preimage}/>:<span>{item.ownercommonname}</span>}</div>
          <div>{item.modifytime}</div>
        </div>
      }else{
        return <div key={index}></div>;
      }
    });
    return (
      <div className={''} style={{minHeight:'3rem',width:'100%',padding:'0.05rem 0.2rem',border:'1px solid #d6d1d1'}}>
        {notionListElements}
      </div>
    )
  }
}
CommonNotionComp.defaultProps = {
};
CommonNotionComp.propTypes = {
  notionList:React.PropTypes.array,
};
export default CommonNotionComp;

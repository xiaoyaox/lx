import $ from 'jquery';

export function parseContactsData(objArr){ //得到平级的组织结构数据。是一个object数组，去掉了subOrganization字段。
  $.each(objArr, (index, obj)=>{
    obj['key'] = obj.id;
  });
  return objArr;
}

export function getNearestPoint54543() {

}

import $ from 'jquery';

export function removeNullValueOfArr(arr){
  let newArr = arr.filter((val)=>{
    if(typeof val=="string" && val != ""){
      return true;
    }else if(typeof val=="object"){
      return true;
    }else if(typeof val=="array" && val.length>0){
      return true;
    }
    return false;
  });
  return newArr;
}

export function removeValueFromArr(arr,val){
  arr = arr || [];
  let temparr = arr.filter((item)=>{
    if(item == val){
      return false;
    }else{
      return true;
    }
  });
  return temparr;
}

export function getNearestPoint543() {

}

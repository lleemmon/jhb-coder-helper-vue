import sysDictItemsApi from '../api/develop/sysDictItems'
import sysDictApi from '../api/develop/sysDict'

let dictMapList = {} // key => Map_list
let dictMapMap = {} // key => {value => label}
let dictTypeList = []

const copyProperties = (target, source) => {
    for(let key in target){
        let value = source[key]
        if(source[key]){
            target[key] = value
        }
    }
    return target
}

const changeSelectListToMap = (list) => {
    let map = {}
    list.forEach(item => map[item.value] = item.label);
    return map;
}

async function getDictByDictType(dictType) {
    if(dictMapList[dictType] == null || dictMapList[dictType] == undefined){
        let res = await sysDictItemsApi.getByDictType(dictType)
        dictMapList[dictType] = res.data
        let obj = {}
        res.data.forEach(item => {
            obj[item.value] = item.label
        })
        dictMapMap[dictType] = obj
    }
    return dictMapList[dictType];
}

async function getDictType() {
    if(dictTypeList.length == 0){
        let res = await sysDictApi.selection()
        dictTypeList = res.data
    }
    return dictTypeList;
}

//在页面上使用parseCode之前 一定要确保用过getDictByDictType
const parseCode = (dictType, value) => {
    if(dictMapMap[dictType] != null && dictMapMap[dictType] != undefined){
        return dictMapMap[dictType][value] ? dictMapMap[dictType][value] : '';
    }else{
        return ""
    }
}

const removeDictTypeFromCache = (dictType) => {
    console.log("removeDictTypeFromCache", dictType)
    dictMapMap[dictType] = null
    dictMapList[dictType] = null
}

const removeDictList = () => {
    console.log("removeDictList")
    dictTypeList = []
}

export { copyProperties, changeSelectListToMap, getDictByDictType, parseCode, removeDictTypeFromCache, getDictType, removeDictList }
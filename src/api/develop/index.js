import request from '@/utils/request'
import { GET, POST } from '../../common.js'

const api_name = '/develop'

export default {
    // getTableNameSelection() {
    //     return request({
    //         url: `${api_name}/getTableNameSelection`,
    //         method: GET
    //     })
    // }
    getSysGeneratorTableList(data) {
        return request({
            url: `${api_name}/getSysGeneratorTableList`,
            method: POST,
            data: data
        })
    },
    insert(data){
        return request({
            url: `${api_name}/insert`,
            method: POST,
            data: data
        })
    },
    update(data){
        return request({
            url: `${api_name}/update`,
            method: POST,
            data: data
        })
    },
    endGenerator(data){
        return request({
            url: `${api_name}/endGenerator`,
            method: POST,
            data: data
        })
    },
    getAutoCompleteForModule(){
        return request({
            url: `${api_name}/getAutoCompleteForModule`,
            method: GET
        })
    },
    getTableFieldList(tableName){
        return request({
            url: `${api_name}/getTableFieldList`,
            method: POST,
            params: {tableName: tableName}
        })
    },
    getTableFieldList(tableName){
        return request({
            url: `${api_name}/getTableFieldList`,
            method: POST,
            params: {tableName: tableName}
        })
    },
    getMysqlFieldSelection(){
        return request({
            url: `${api_name}/getMysqlFieldSelection`,
            method: GET
        })
    },
    getElementComponentSelection(){
        return request({
            url: `${api_name}/getElementComponentSelection`,
            method: GET
        })
    },
    saveGeneratorConfig(data){
        return request({
            url: `${api_name}/saveGeneratorConfig`,
            method: POST,
            data: data
        })
    },
    frontGenerator(data){
        return request({
            url: `${api_name}/frontGenerator`,
            method: POST,
            data: data
        })
    }
}
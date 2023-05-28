import request from '@/utils/request'
//GET 就是 'get'; POST就是'post';
import { GET, POST } from '../../../common.js'

const api_name = '/develop/sys-dict'

export default {
    get(id) {
        return request({
            url: `${api_name}/get/${id}`,
            method: GET
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
    delete(id){
        return request({
            url: `${api_name}/delete`,
            method: POST,
            params: {id: id}
        })
    },
    page(data){
        return request({
            url: `${api_name}/page`,
            method: POST,
            data: data
        })
    },
    selection(){
        return request({
            url: `${api_name}/selection`,
            method: GET
        })
    }
}
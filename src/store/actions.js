import React from 'react'
import  request  from '@/utils/request'
import {logout,authenticateSuccess,isAuthenticated} from '@/utils/session'
import { Message } from 'antd'
import { replaceImg } from '../utils/util'
import history  from '@/utils/history'
// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_PRIZE = 'SET_USER'
export function setPrize(prize) {
    return {
        type: SET_PRIZE,
        prize
    }
}
//异步刷新token ,防止token 失效
export const REFRESH_TOKEN = 'refresh_token'
export async function refreshToken(params)
{
   let auth = isAuthenticated()
     let  res
     try{
     res =  await request({
        headers: {
            'Authorization': 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0',
        },
        method: 'post',
        url: '/api/oauth/token?grant_type=refresh_token',
        data: {
            refresh_token: auth.refresh_token
        }
     })
     if(res.error) {
         //用于刷新的token 过期
         localStorage.setItem('username', {}) 
         logout()
     }
     if(res.access_token){
         //刷新token 成功
         await authenticateSuccess(JSON.stringify(res))
         let currentTime =  Date.now()/1000;
         localStorage.setItem('expires_time',currentTime +res.expires_in)
         // Replay request
        const {method,url} = params.initialRequest
        try{
        const ret2 = await request({
            method,
            url
        })
        params.resolve(ret2);
       }catch(e){
        params.reject(e);
       }
        
     }

    }catch(e){
        //获取出错
        console.log(e)
        logout()
        history.push('/login')
    }
}

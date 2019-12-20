import React from 'react'
import  request  from '@/utils/request'
import {logout,authenticateSuccess,isAuthenticated} from '@/utils/session'
import { Toast } from 'antd-mobile'
import { replaceImg } from '../utils/util'
import history  from '@/utils/history'
// 虽然用户信息放在localStorage也可以全局使用，但是如果放在localStorage中，用户信息改变时页面不会实时更新
export const SET_USER = 'SET_USER'
export function setUser(user) {
    return {
        type: SET_USER,
        user
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
//修改菜单页表单状态
export const CHANGE_FORM_STATUS = 'change_form_status'
export function changeFormStatus(param){
    return {
        type: CHANGE_FORM_STATUS,
        param
    }
}
//设置菜单
export const SET_MENU = 'set_menu'
export function setMenu(param){
    return {
        type: SET_MENU,
        param
    }
}
export const CHANGE_ACTIVE_MENU = 'changeActiveMenu'
export function changeActiveMenu(param){
    return {
        type: CHANGE_ACTIVE_MENU,
        param
    }
}
//异步获取菜单，从后台获取菜单信息
export function fetchMenu(param) {
    return async function (dispatch) {
        const res = await request({
            methos: 'get',
            url: '/api/admin/menu/tree',
            data: {}
          })
        dispatch(setMenu({
            menuData:res.result || []
        }))
    }
}

//修改角色状态
export const CHANGE_ROLE_STATUS = 'change_role_status'
export function changeRoleStatus(param){
    return {
        type: CHANGE_ROLE_STATUS,
        param
    }
}
//设置角色
export const SET_ROLE = 'set_role'
export function setRole(param){
    return {
        type: SET_ROLE,
        param
    }
}

//设置角色
export const SET_ROLE_DEPARTMENT = 'set_role_department'
export function setDepartRole(param){
    return {
        type: SET_ROLE_DEPARTMENT,
        param
    }
}
//异步获取角色
export function fetchRole(param) {
    return async function (dispatch) {
        const res = await request({
            methos: 'get',
            url: '/api/admin/role/tree',
            data: { code:param}
        })
        if(param==='roleType'){
            dispatch(setRole(res.result || []))
        }else if(param==='departmentType'){
            dispatch(setDepartRole(res.result || []))
        }
    }
}
//设置权限
export const SET_PERMISSION = 'set_permission'
export function setPermission(param){
    return {
        type: SET_PERMISSION,
        param
    }
}

//设置资源或按钮
export const SET_ELEMENT = 'set_element'
export function setElement(param){
    return {
        type: SET_ELEMENT,
        data:param
    }
}
//异步获取按钮或资源，从后台获取信息
export function fetchElement(param) {
    return async function (dispatch) {
        const res = await request({
            methos: 'get',
            url: '/api/admin/element/list',
            data: param
          })
          if(res.code === 200){
              //获取到菜单
              const allMenus =  res.result
              
             



          } 
        
         // dispatch(setElement(||{}))
    }
}


//异步action，从后台获取用户信息
export function getUser(param) {
    return async function (dispatch) {
        const res =await request({
            method:'get',
            url:'/api/admin/user/getUser',
            data:param
        }) 

        dispatch(setUser(res.result || {}))
    }
}

//设置表单属性+字段
export const SET_FORM = 'set_form'
export function setDynamicForm(param){
    return {
        type: SET_FORM,
        data:param
    }
}
export const SET_COLUMNS = 'set_colums'
export function setDynamicFormColumn(param){
    return {
        type: SET_COLUMNS,
        data:param
    }
}
export const ADD_COLUMNS = 'add_colums'
export function addDynamicFormColumn(param){
    return {
        type: ADD_COLUMNS,
        data:param
    }
}

export const SET_WEBSOCKET = 'SET_WEBSOCKET'  //设置websocket对象
export function setWebsocket(websocket) {
    return {
        type: SET_WEBSOCKET,
        websocket
    }
}


export function initWebSocket(user) {    //初始化websocket对象
    return async function (dispatch) {
        const websocket = new WebSocket("ws://" + window.location.hostname + ":8081")
        //建立连接时触发
        websocket.onopen = function () {
            const data = {
                id: user.id,
                username: user.username,
               // avatar: user.avatar
            }
            //当用户第一次建立websocket链接时，发送用户信息到后台，告诉它是谁建立的链接
            websocket.send(JSON.stringify(data))
        }
        //监听服务端的消息事件
        websocket.onmessage = function (event) {
            const data = JSON.parse(event.data)
            //在线人数变化的消息
            if (data.type === 0) {
                dispatch(setOnlinelist(data.msg.onlineList))
                data.msg.text && Toast.info({
                    message: '提示',
                    description: data.msg.text
                })
            }
            //聊天的消息
            if (data.type === 1) {
                dispatch(addChat(data.msg))
                Toast.open({
                    message: data.msg.username,
                    description: <div dangerouslySetInnerHTML={{ __html: replaceImg(data.msg.content) }} />,
                    // icon: <Avatar src={data.msg.userAvatar} />
                })
            }
            console.log(11, data)
        }
        dispatch(setWebsocket(websocket))
        dispatch(initChatList())
    }
}

export const SET_ONLINELIST = 'SET_ONLINELIST'   //设置在线列表
export function setOnlinelist(onlineList) {
    return {
        type: SET_ONLINELIST,
        onlineList
    }
}

//异步action，初始化聊天记录列表
export function initChatList() {
    return async function (dispatch) {
        const res ={} // await json.get('/chat/list')
        dispatch(setChatList(res.data || []))
    }
}

export const SET_CHATLIST = 'SET_CHATLIST'
export function setChatList(chatList) {
    return {
        type: SET_CHATLIST,
        chatList
    }
}

export const ADD_CHAT = 'ADD_CHAT'
export function addChat(chat) {
    return {
        type: ADD_CHAT,
        chat
    }
}
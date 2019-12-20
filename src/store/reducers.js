import { combineReducers } from 'redux'
import { Map } from 'immutable';
import {
    SET_USER, SET_WEBSOCKET, SET_ONLINELIST, SET_CHATLIST, ADD_CHAT, REFRESH_TOKEN,
    CHANGE_FORM_STATUS, SET_MENU,CHANGE_ACTIVE_MENU,SET_PERMISSION, SET_ELEMENT, CHANGE_ROLE_STATUS, 
    SET_ROLE,
    SET_ROLE_DEPARTMENT,
    SET_FORM,
    SET_COLUMNS,
    ADD_COLUMNS
} from './actions'

/**
 * 用户信息
 * @param {*} state 
 * @param {*} action 
 */
function user(state = {}, action) {
    switch (action.type) {
        case SET_USER: {
            return action.user
        }
        case REFRESH_TOKEN: {
            console.log('获取预算信息')
        }
        default:
            return state
    }
}

/**
 * 菜单信息信息
 * @param {*} state 
 * @param {*} action 
 * @param menuData 全部树形列表信息
 * @param accessedMenus 可访问树形菜单
 */
const defaultMenu = { formStatus: '', formEdit: true, currentId: -1, menuData: [] ,accessedMenus:[],activeMenu:{
        code: "buggetManager",
        title: "获取预算",
}}
function menu(state = defaultMenu, action) {
    switch (action.type) {
        case CHANGE_FORM_STATUS: {
            const map = Map(state)
            const ret = map.merge(action.param);
            return ret.toJS()
        }
        case SET_MENU: {
            const map = Map(state)
            let ret = map.set('menuData', action.param.menuData)
            if(action.param.accessedMenus){
                ret = ret.set('accessedMenus',action.param.accessedMenus)
            }
            return ret.toJS()
        }
        case CHANGE_ACTIVE_MENU:{
            const map = Map(state)
            const ret = map.set('activeMenu',action.param)
            return ret.toJS()
        }
    
        default:
            return state
    }
    console.log(state, action)
}
/***按钮或资源 */
const defaultElement = { content: [], totalPages: 1, number: 1, size: 10, pageIndex: 0 }
function element(state = defaultElement, action) {
    switch (action.type) {
        case SET_ELEMENT: {
            let { number, size, content, totalPages } = action.data
            if (number < 1) { number = 1 }
            const map = Map(state)
            const ret = map.merge({ number, size, content, totalPages, pageIndex: (number - 1) * size })
            return ret.toJS();
        }

        default:
            return state
    }
    console.log(state, action)
}

/**
 * 角色信息
 * @param {*} state
 * @param {*} action
 * @param menuData 树形列表信息
 */
const defaultRole = { formStatus: '', formEdit: true, currentId: -1, roleData: [] ,departData:[]}
function role(state = defaultRole, action) {
    switch (action.type) {
        case CHANGE_ROLE_STATUS: {
            const map = Map(state)
            const ret = map.merge(action.param);
            return ret.toJS()
        }
        case SET_ROLE: {
            const map = Map(state)
            const ret = map.set('roleData', action.param)
            return ret.toJS()
    }
        case SET_ROLE_DEPARTMENT: {
            const map = Map(state)
            const ret = map.set('departData', action.param)
            return ret.toJS()
        }
        default:
            return state
    }
    console.log(state, action)
}
/**
 * 权限授权资源
 * @param {*} state
 * @param {*} action
 * @param menuData 列表信息
 */
const defaultPermission = {treeCheckedKeys:[],tableCheckedKeys:[]}
function permission(state = defaultPermission, action) {
    switch (action.type) {
        case SET_PERMISSION: {
            const map = Map(state)
            const ret = map.merge(action.param);
            return ret.toJS()
        }
        default:
            return state
    }
    console.log(state, action)
}
/**
 * 动态表单
 * @param {*} state
 * @param {*} action
 * @param menuData 列表信息
 */
const defaultDynamicForm = {form:{correlations:[],triggers:[]},columns:[],count:0}
function dynamicForm(state = defaultDynamicForm, action) {
    switch (action.type) {
        case SET_FORM: {
            const map = Map(state)
            const ret = map.merge({
                form:action.data
            });
            return ret.toJS()
        }
        case SET_COLUMNS: {
            const map = Map(state)
            const ret = map.merge(action.data);
            return ret.toJS()
        }
        case ADD_COLUMNS:{
            const map = Map(state)
             let columns= map.get('columns');
            columns=columns.push(action.data)
            const ret = map.set({
                columns:columns
            });
            return ret.toJS()
        }
        default:
            return state
    }
    console.log(state, action)
}



/**
 * websocket对象
 * @param {*} state 
 * @param {*} action 
 */
function websocket(state = null, action) {
    switch (action.type) {
        case SET_WEBSOCKET: {
            return action.websocket
        }
        default:
            return state
    }
}

/**
 * 在线列表
 * @param {*} state 
 * @param {*} action 
 */
function onlineList(state = [], action) {
    switch (action.type) {
        case SET_ONLINELIST: {
            return action.onlineList
        }
        default:
            return state
    }
}

/**
 * 聊天记录
 * @param {*} state 
 * @param {*} action 
 */
function chatList(state = [], action) {
    switch (action.type) {
        case SET_CHATLIST: {
            return action.chatList
        }
        case ADD_CHAT: {
            return [...state, action.chat]
        }
        default:
            return state
    }
}


const rootReducer = combineReducers({
    user,
    menu,
    role,
    permission,
    dynamicForm,
    element,
    websocket,
    onlineList,
    chatList,

})

export default rootReducer 
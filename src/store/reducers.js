import { combineReducers } from 'redux'
import { Map } from 'immutable';
import {
    SET_PRIZE
} from './actions'

/**
 * 奖项信息
 * @param {*} state 
 * @param {*} action 
 */
const defaultPrize = {
    prizes:[
        {
            name:'三等奖',
            desc:'金额1000元',
            quantity:30,  //数量
            level:0       //显示顺序
        },
        {
            name:'二等奖',
            desc:'金额2000元',
            quantity:10,  //数量
            level:1       //显示顺序
        },
        {
            name:'一等奖',
            desc:'金额5000元',
            quantity:2,  //数量
            level:2       //显示顺序
        }
    ]
}
function prize(state = {}, action) {
    switch (action.type) {
        case SET_PRIZE: {
            return action.prize
        }
        
        default:
            return state
    }
}




const rootReducer = combineReducers({
    prize,
})

export default rootReducer 
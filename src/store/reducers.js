import { combineReducers } from 'redux'
import { Map, List } from 'immutable';

import {
    SET_PRIZE,
    ADD_WINNER
} from './actions'
const uuidv4 = require('uuid/v4');
/**
 * 奖项信息
 * @param {*} state 
 * @param {*} action 
 */
const defaultLotteryDrawing = {
    setting: [{
        id: uuidv4(),
        title: '三等奖',
        totalCount: 3,
      },{
        id: uuidv4(),
        title: '二等奖',
        totalCount: 2,
      },{
        id: uuidv4(),
        title: '一等奖',
        totalCount: 1,
      }]
}

function lotteryDrawing(state = defaultLotteryDrawing, action) {
    switch (action.type) {
        case SET_PRIZE: {
            return action.prize
        }
        
        default:
            return state
    }
}

/***
 * 奖励池配置
 */
const defaultLotteryPool = {
    allParticipants: [
       {code:1},
       {code:2},
       {code:3},
       {code:4},
       {code:5}
    ], //所有参与者
    winners: [] //获奖者
  };
function lotteryPool(state = defaultLotteryPool, action) {
    switch (action.type) {
        case ADD_WINNER: {
            const map = Map(state)
            let winners =map.get('winners')
            winners.push(action.winner);
            return map.set('winners',winners).toJS()
        }
        
        default:
            return state
    }
}







const rootReducer = combineReducers({
    lotteryDrawing,
    lotteryPool
})

export default rootReducer 
import React from 'react';
import {Button,Row,Col,Modal} from 'antd'
import styles from './IndexPage.module.css';
import LeftDrawer from '@/components/LeftDrawer';
import {  withRouter } from 'react-router-dom'
import {delay} from '@/utils/util'
import Background from  '@/components/Background'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPrize,addWinner} from '@/store/actions'
import DrawService from '@/service/DrawService'
const store = connect(
  (state) => ({
    setting: state.lotteryDrawing.setting, //奖项设置
    winners: state.lotteryPool.winners,
    allParticipants:state.lotteryPool.allParticipants, //参与者
  }),
  (dispatch) => bindActionCreators({setPrize,addWinner}, dispatch)
)
@store
@withRouter
class IndexPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalVisible:false,
      visible: false,//是否显示抽屉
      curPrize:'000',
      runing:false,
      currentPrize: '',//当前奖项
      isPrizeChanged:false,
      selectedParticipant: {}, //选择的参与者
      btnDisabled: false, //按钮是否可点击
    }
    this.lastTime = 0;
  }

  onShuffle = () => {
    // this.props.history.push({
    //   type: 'lottery/shuffle',
    // })
  }

  onRollUp = () => {
    // this.props.dispatch({
    //   type: 'lottery/rollUp'
    // })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  /**
   * 开始or 结束
   */
  tonggole=async ()=>{

    if (this.state.isPrizeChanged) {
      this.setState({
        isPrizeChanged: false,
      });
      this.computeCurrentPrize();
      return;
    }
    try {
      if (this.drawService.isRolling) {
        this.drawService.pickOneThenDo((selected) => {
          selected.prize = this.state.currentPrize;
          this.props.addWinner(selected);
          this.computeCurrentPrize();
        })
      } else {
        this.drawService.rollUp();
      }
    } catch (err) {
      console.error(err.message)
    }

    //  this.setState({
    //     runing:!this.state.runing
    //  })
    //  const {runing} = this.state
    //  if(runing){
    //     clearInterval(this.myNumber);
    //  }else{
    //    this.myNumber = setInterval(()=>{
    //       let  prize=  Math.floor(Math.random() * 300)
    //       this.setState({
    //         curPrize:prize
    //      })

    //       }, 30);
    //  }
  }
  /**
   * 获取标题
   */
  getTitle=()=>{
    const {existingCountOfCurrentPrize,isPrizeChanged,currentPrize,noPrize} = this.state
    if (existingCountOfCurrentPrize=== 0 && !isPrizeChanged) {
      return `${currentPrize.title}(${currentPrize.totalCount}名)`
    } else if(noPrize){
      return "";
    }
    return `${currentPrize.title}(${existingCountOfCurrentPrize} / ${currentPrize.totalCount})`
  }
  /***
   * 获取数字
   */
  getContent=()=>{
    const {existingCountOfCurrentPrize,isPrizeChanged,selectedParticipant,noPrize} = this.state
    if (existingCountOfCurrentPrize === 0 && !this.drawService.isRolling && !isPrizeChanged) {
      return "等待开奖";
    } else if(noPrize){
      return "抽奖结束";
    }
    return (<div className="selectedParticipant">
      <div className="name">{selectedParticipant.code}</div>
    </div>)
  }
  //获取按钮
  getButton=()=>{
    if (this.state.noPrize) {
      return "抽奖结果";
    } else if (this.drawService) {
      return this.drawService.isRolling ? "暂停" : (this.state.isPrizeChanged ? "下一轮" : "开始")
    }
      return '';
  }
  getRetryButton = ()=>{
    if(this.drawService){
          if(this.drawService.isRolling){
            return false;
          }
          if(  this.state.isPrizeChanged){
            return true
          }
    }
    return false
  }

  //计算当前奖项
  computeCurrentPrize=()=>{
    const {isPrizeChanged} = this.state
    const {winners} = this.props
    const currentPrize = this.getCurrentPrize(isPrizeChanged);
    if (currentPrize) {
      const existingCountOfCurrentPrize =winners.filter(winner => winner.prize.id === currentPrize.id).length;
      this.setState({
        currentPrize,
        existingCountOfCurrentPrize
      });
    } else {
      this.setState({
        noPrize: true
      });
    }
    return currentPrize;
  }
  //获取当前的奖项
  getCurrentPrize(next){
    const {winners,setting} = this.props //当前获奖者
    const {currentPrize} = this.state
    const items = winners.filter(winner => (winner.prize.id === currentPrize.id));
    if (!next && (currentPrize.totalCount - items.length || 0) >= 0 && currentPrize) {
      if ((currentPrize.totalCount - items.length || 0) === 0) {
        this.setState({
          isPrizeChanged: true,
        });
      }
      return currentPrize;

  }
    return setting.find((lottery) => {
      const items = winners.filter(winner => (winner.prize.id === lottery.id));
      if ((lottery.totalCount - items.length || 0) <= 0) {
        return false;
      }
      return true
    });
}
  /***
    * 重抽
    */
  showModal=()=>{
    this.setState({
      modalVisible: true,
    });
  }
  handleOk=()=>{
    this.setState({
      modalVisible: false,
    });
  }
  handleCancel=()=>{
    this.setState({
      modalVisible: false,
    });
  }
  render() {
      const {curPrize,runing} = this.state
      const {setting} = this.props
       console.log('setting',setting)

    return (
      <Background>
        <div className={styles.normal}>
         
          <div className={styles.content}>
            <header className={styles.prizeTitle}>
              {this.getTitle()}
            </header>
            <div className={styles.lucky}>
            <Row>
               <span className={styles.prize}>  {this.getContent()}</span>
            </Row>   
              
            <Button type="danger" shape="circle" style={{width:'80px',height:'80px'}}  className={styles.startButton}  onClick={()=>this.tonggole()}  >
                {
                  this.getButton()
                }
            </Button> 
            {this.getRetryButton() ? (
              <Button type="danger" shape="circle" style={{width:'80px',height:'80px'}}  className={styles.startButton}  onClick={()=>this.showModal()}  >
              重抽
              </Button> 
            ) : null}
            

            
            
            </div>
            {/* <div className={styles.footer}>
              <Button onClick={this.onRollUp}>抽奖</Button>
            </div> */}
          </div>

          <div className={styles.drawerTrigger} onClick={this.showDrawer} />
          <LeftDrawer
            {...this.props}
            visible={this.state.visible}
            onClose={this.onClose}
          />
        <Modal
          title="重抽设置"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        </div >
    </Background>
    )
  }


  enterEvent = (e) => {
    let nextTime = Date.now();
    if(this.lastTime !== 0 && nextTime - this.lastTime < 1000){
      return;
    }
    this.lastTime = nextTime;
    if (e.which === 13) {
      this.onRollUp()
    }
  }
  
  componentWillUnmount(){
    window.removeEventListener('keypress', this.enterEvent);
  }

  componentDidMount() {
    const {allParticipants} = this.props
    window.addEventListener('keypress', this.enterEvent)
    this.drawService = DrawService.from(allParticipants)
      .setOnSelectedChangedCallback((selectedItem) => {
        this.setState({
          selectedParticipant: selectedItem,
        });
      })
      .setNoDuplicate(true)
      .setOnPickBlockedChangedCallback((blocked) => {
        this.setState({
          btnDisabled: blocked
        });
      });
    this.computeCurrentPrize();
    // this.props.dispatch({
    //   type: 'lottery/init'
    // })
  }
}
export default IndexPage;
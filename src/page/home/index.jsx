import React from 'react';
import {Button,Row,Col} from 'antd'
import styles from './IndexPage.module.css';
import LeftDrawer from '@/components/LeftDrawer';
import {  withRouter } from 'react-router-dom'
import {delay} from '@/utils/util'
import Background from  '@/components/Background'
import { connect, } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPrize} from '@/store/actions'

const store = connect(
  (state) => ({
    setting: state.prize.prizes, //奖项设置
  }),
  (dispatch) => bindActionCreators({setPrize}, dispatch)
)
@store
@withRouter
class IndexPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visible: false,//是否显示抽屉
      curPrize:'000',
      runing:false,
      winners:[]
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
     this.setState({
        runing:!this.state.runing
     })
     const {runing} = this.state
     if(runing){
        clearInterval(this.myNumber);
     }else{
       this.myNumber = setInterval(()=>{
          let  prize=  Math.floor(Math.random() * 300)
          this.setState({
            curPrize:prize
         })

          }, 30);
     }
  }
  render() {
      const {curPrize,runing} = this.state
      const {setting} = this.props
       console.log('setting',setting)

    return (
      <Background>
        <div className={styles.normal}>
        <span className={styles.prize_grade}> 一等奖3000元</span>
          <div className={styles.content}>
            <div className={styles.lucky}>
              
                <Row>
                  <Col><span className={styles.prize}>{curPrize}</span></Col> 
                </Row>
                <Button type="danger" shape="circle" style={{width:'80px',height:'80px'}}  className={styles.startButton}  onClick={()=>this.tonggole()}  >
                    {runing?'暂停':'开始'}
                </Button> 

            
            
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
    window.addEventListener('keypress', this.enterEvent)
    // this.props.dispatch({
    //   type: 'lottery/init'
    // })
  }
}
export default IndexPage;
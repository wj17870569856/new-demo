<template>
  <div class="guidance wrap">
    <div class="bannerMain">
      <div class="banner">
        <div class="title">数据资产入表评估</div>
        <div class="con">数据资产入表指的是企业原先费用化，但满足资产确认条件的数据资产，可以根据财政部《企业数据资源相关会计处理暂行规定》计入资产负责表相关科目。入表是数据资产化创新应用的基础步骤。</div>
        <div class="btn" @click="guldance()">我要咨询</div>
      </div>
    </div>
    <div class="m_conMain">
      <div class="m_con_main">
        <div class="m_con">
          <h3 class="title">评估流程</h3>
          <div class="lf_con">
              <div class="left">
              <ul>
                <li>
                  <div class="m_title"><span>01</span></div>
                  <div class="con">协助用户便捷、准确地录入企业基础信息、资产信息和数据产出等关键企业数据信息为数据资产评估奠定坚实基础。</div>
                </li>
                <li>
                  <div class="m_title"><span>02</span></div>
                  <div class="con">平台基于用户输入的企业数据关键信息，结合预设的评估标准和核心算法，快速完成数据资产评测，为企业提供明确的资格判断和评测分数。</div>
                </li>
                <li>
                  <div class="m_title"><span>03</span></div>
                  <div class="con">平台基于用户输入的企业数据关键信息，结合预设的评估标准和核心算法，快速完成数据资产评测，为企业提供明确的资格判断和评测分数。</div>
                </li>
              </ul>
            </div>
            <div class="right">
              <img src="../../assets/imgs/guidance_b3.png" alt="">
            </div>
          </div>
        </div>
        <div class="m_bom">
          <h3 class="title">合作案例</h3>
          <div class="m_r_main">
            <div class="m_bom_li">
              <img src="../../assets/imgs/guidance_b6.jpg" alt="">
              <div class="right">
                <div class="m_title">江西冠英智能科技股份有限公司</div>
                <!-- <div class="tips">xx标签</div> -->
                <div class="m_con">赣州工研院成功助推冠英科技集团研发的工业数据产品作为数据资产纳入企业财务报表，该项数据资产入表融资的实现是赣州工研院与赣州银行共同努力下，所达成的首创性示范成果，标志着赣州工研院依托国家级数据交易所等生态，已经具备数据资产“治理、合规、确权、定价、入表、金融化”的全流程闭环能力，并与赣州银行探索出了数据资产融资有效路径，也意味着“数据要素×金融服务”在赣州取得落地突破。</div>
              </div>
            </div>
            <div class="m_bom_li">
              <img src="../../assets/imgs/guidance_b6.jpg" alt="">
              <div class="right">
                <div class="m_title">深泽信息科技（珠海）有限公司</div>
                <!-- <div class="tips">xx标签</div> -->
                <div class="m_con">赣州工研院响应号召，在原有完成江西首单工业制造领域2500万元数据资产入表融资的经验基础上，开创融入粤港澳大湾区新路径，跨地域在珠海市落地数据资产入表服务。此次数据资产入表服务的落地，在深圳数据交易所的指导下，赣州工研院与深译信息科技（珠海）有限公司达成签订合作协议，为深译信息科技（珠海）有限公司提供数据资产合规审查、入表、挂牌、评估等数据资产入表全流程一站式服务，帮助企业实现数据资产入表和价值的提升。</div>
              </div>
          </div>
          </div>
        </div>
      </div>
  </div>
  <div class="my_guidanceBig">
    <div class="my_guidance">
      <div class="my_guidance_main">
        <div class="top">
          <div class="title">我要咨询</div>
          <div class="close" @click="resetForm('form')"></div>
        </div>
        <div class="con">
          <div class="con_top">
          <el-form ref="form" :model="form" size="large" autocomplete="off" :rules="rules" label-width="100px">
              <el-form-item label="咨询内容" prop="content">
                <el-input class="t_con" v-model="form.content" type="text" placeholder="请输入" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="联系人姓名" prop="contact_name">
                <el-input v-model="form.contact_name" type="text" placeholder="请输入" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="contact_email">
                <el-input v-model="form.contact_email" type="text" placeholder="请输入" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="contact_tel">
                <el-input v-model="form.contact_tel" type="text" placeholder="请输入" style="width: 350px;"></el-input>
              </el-form-item>
              <el-form-item label="所属机构" prop="contact_company">
                <el-input v-model="form.contact_company" type="text" placeholder="请输入" style="width: 350px;"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="con_bom">
            <div class="cancel" @click="resetForm('form')">取消</div>
            <div class="git" type="primary" @click="submitForm('form')">提交</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</div>
</template>

<script>
import Api from "../../plugins/api";
import { mapState } from "vuex";
export default {
  name: "guidancePage",
  layout: "guidance",
  computed: {
    ...mapState(["token"]),
  },
  data() {
    return {
     form: {
        content: '',
        contact_name: '',
        contact_email: '',
        contact_tel: '',
        contact_company: ''
      },
      rules : {
        content: [
          { required: true, message: '请输入咨询内容', trigger: 'blur' },
        ],
        contact_name: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
        ],
        contact_email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] }
        ],
        contact_tel: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            // 自定义电话验证逻辑，例如：检查是否为11位数字
            if (!/\d{11}$/.test(value)) {
              callback(new Error('请输入有效的11位电话号码'));
            } else {
              callback();
            }
          }, trigger: 'blur' }
        ],
        contact_company: [
          { required: true, message: '请输入所属机构', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    //打开弹层
    guldance(){
      if (this.token) {
      const my_guidance = document.querySelector('.my_guidanceBig')
      my_guidance.style.display ='block'
       } 
       else {
          this.$message.warning("请登录后查看");
      }
    },
    //提交
    submitForm(formName) {
      if (this.token) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 这里可以添加实际的提交逻辑
              this.$request.post(Api.guidanceList, this.form).then((res) => {
                if (res.code === 0) {
                    this.$message.success("提交成功");
                    this.resetForm('form')
                  } else {
                    this.$message.error(res.msg);
                  }
                });
              } else {
                return false;
              }
          });
        } else {
          this.$message.warning("请登录后查看");
        }
    },
    //取消
    resetForm(formName) {
      const my_guidance = document.querySelector('.my_guidanceBig')
      my_guidance.style.display ='none'
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped lang="less">
.guidance{
  .bannerMain{
    background-image: url('../../assets/imgs/guidance_b1.png');
    padding: 60px 0 60px;
    .banner{
      width: 1300px;
      margin: 0 auto;
      .title{
        font-size: 34px;
        font-weight: bold;
        line-height: 50px;
        margin-bottom: 10px;
        color: #0A1833;
      }
      .con{
        font-size: 14px;
        color: #0A1833;
        line-height: 16px;
      }
      .btn{
        font-size: 14px;
        line-height: 36px;
        color: #fff;
        width: 84px;
        height: 36px;
        background-color: #257FF8;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }
  .m_r_main{
    display: flex;
  }
  .m_conMain{
    background-image: url('../../assets/imgs/guidance_b2.png');
    .m_con_main{
      width: 1300px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px 10px 0px 0px;
      position: relative;
      top: -43px;
      z-index: 99;  }
    .m_con{
        padding-top: 20px;
        .title {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-weight: bold;
          font-size: 34px;
          color: #0a1833;
          line-height: 46px;
          text-align: center;
          position: relative;
          &::after {
            content: "";
            width: 50px;
            height: 6px;
            position: absolute;
            background: #257ff8;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
        .lf_con{
          display: flex;
          justify-content: center;
          margin-top: 35px;
        .left{
          padding: 55px 40px 48px;
          ul{
            li{
              margin-bottom: 50px;
            .m_title{
                position: relative;
                height: 40px;
              span{
                font-size: 70px;
                line-height: 73px;
                position: relative;
                color: #257FF8;
                font-family: YouSheBiaoTiHei-Regular;
                bottom: 38px;
                opacity: .1;
              }
            }
            .m_title::before{
              content: "信息录入";
              color: #0A1833;
              font-size: 20px;
              line-height: 24px;
              margin-bottom: 15px;
              z-index: 999;
              position: absolute;
              font-weight: bold;
            }
            .con{
                color: #0A1833;
                font-size: 16px;
                line-height: 18px;
                margin-bottom: 30px;
            } 
          }
          li:nth-child(2) .m_title::before{
            content:'在线评估'
          }
          li:nth-child(3) .m_title::before{
            content:'服务咨询'
          }
        }
      }
      .right{
        padding: 35px 35px 35px 0;
        img{
          border-radius: 10px;
        }
      }
    }
  }
  .m_bom{
    padding: 0 40px 55px 40px;
        .title {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-weight: bold;
          font-size: 34px;
          color: #0a1833;
          line-height: 46px;
          text-align: center;
          position: relative;
          &::after {
            content: "";
            width: 50px;
            height: 6px;
            position: absolute;
            background: #257ff8;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      .m_bom_li{
          margin-top: 30px;
          background: linear-gradient(to top, #EBEFF6, #fff);
          display: flex;
          justify-content: center;
          padding: 20px;
          border: 1px solid #fff;
          border-radius: 10px;
          margin-right: 20px;
          box-shadow: 2px 2px 8px rgb(0 0 0 / 30%);
          align-items: center;
        img {
          width: 216px;
        }
        .right{
          padding:  5px 17px 10px 30px;
          .m_title{
              font-size: 24px;
              line-height: 29px;
              color: #0A1833;
              margin-bottom: 10px;
          }
          .tips{
              color: #8993A5;
              font-size: 14px;
              line-height: 22px;
              width: 50px;
              background: #C3D3E2;
              text-align: center;
              height: 24px;
          }
          .m_con{
            padding-top: 10px;
            color: #43546F;
            font-size: 16px;
            text-align: justify;
          }
        }
      }
    }
  }
}
.my_guidanceBig{
    display: none;}
.my_guidance{
    position: fixed; /* 使遮罩层相对于浏览器窗口定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明背景 */
    z-index: 999; /* 确保遮罩层位于其他内容之上 */
    display: flex;
    justify-content: center;
    align-items: center;
  .my_guidance_main{
       width: 660px;
      .top{
        border-radius: 10px;
        position: relative;
        .title{
          background-color: #EEF2FC;
          height: 52px;
          line-height: 52px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          padding-left: 20px;
          color: #0A1833;
          font-size: 18px;
        }
      }
      .close{
        content:"";
        background-image: url('../../assets/imgs/guidance_close.png');
        position:absolute;
        display:inline-block;
        width: 16px;
        height: 16px;
        background-size: 16px;
        right: 20px;
        top: 17px;
        cursor: pointer;
      }
      .con{
        background: #fff;
        padding: 20px 0;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .con_top{padding: 0 58px;}
      .con_bom {
        display: flex;
        justify-content: center; 
        align-items: center; 
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1); 
        padding-top: 20px; 
        .cancel{
          width: 120px;
          height: 46px;
          line-height: 46px;
          background-color: #fff;
          text-align: center;
          color: #8993A5;
          border: 1px solid #8993A5;
          border-radius: 5px;
          margin-right: 10px;
          cursor: pointer;
          font-size: 16px;
        }
        .git{
          width: 120px;
          height: 46px;
          line-height: 46px;
          background-color: #257FF8;
          text-align: center;
          color: #fff;
          border: 1px solid #257FF8;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
      }
      .el-form-item{
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>


export default api = {

  /***********登录注册流程 *************/

  register: '/api/Apilogin/register',                     //注册
  login: '/api/Apilogin/login',                           //登陆
  loginByToken: '/api/Apilogin/accordingToken',           //根据token登录
  checkInvateCode: '/api/Apilogin/basisUserQuery',        //根据手机号和邀请码查询用户信息
  getCodeWidthRegister: '/api/Apilogin/sendCode',         //注册时获取手机验证码
  sendCodeWhenLogin: '/api/Apilogin/sendCodeLogin',       //登录时发送验证码
  sendCodeWhenForgetPass: '/api/Apilogin/sendCodeForget', //忘记密码时发送验证码
  forgetPass: '/api/Apilogin/forget',                     //忘记密码重置
  
  /*********** 用户 *****************/

  userInfo: '/api/Apipersonal/information',               // 用户基本信息
  buyPackage: '/api/Apiindex/submissionOrder',            //购买套餐
  becomeAgent: '/api/Apipersonal/becomeAgent',            //成为代理
  myTeam: '/api/Apipersonal/myTeam',                      //我的团队
  getCash: '/api/Apipersonal/applyCashWithdrawal',        //提现申请
  cashList: '/api/Apipersonal/cashWithdrawal',            //
  editMsg: '/api/Apipersonal/informationEdit',            //修改用户信息
  shareBanner: '/api/Apipersonal/myQrcode',               //用户分享二维码
  createBanner: '/api/Apipersonal/updateQrcode',          //用户制作海报

  /********** 首页 ******************/

  sliders: '/api/Apiindex/rotationChart',                  //轮播图
  articleTabs: '/api/Apiindex/articleClass',               //文章分类
  articleList: '/api/Apiindex/article',                    //文章列表
  methodList: '/api/Apiindex/column',                      //我要寻亲
  createLocation: '/api/Apiindex/releaseLocation',         //创建定位
  resultList: '/api/Apiindex/locationList',                //结果列表
  details: '/api/Apiindex/addressDetails',                 //
  packagesList: '/api/Apiindex/setMeal',                   //套餐列表
  show: '/api/Apipersonal/configure',                      //控制反转
  serviceAccout: '/api/Apipersonal/customerService',       //客服QQ账号
  queryOrder: '/api/Apiindex/selectOrderState',            //查询订单
  feedback: '/api/Apipersonal/complaint',                  //反馈
  getShareMsg: '/api/Apiindex/releaseLocationDetails',     //获取定位分享

  //控制反转
  uploaderArticle: '/api/Apiindex/releaseLocationUpper',   //发布文章
  xunqinList: '/api/Apiindex/releaseLocationUpperList',    //寻亲列表
  xunqinShare:'/api/Apiindex/releaseLocationUpperDetails', //分享寻亲链接
  
}
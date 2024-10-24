      <el-menu-item index="/index/information">
        <svg-icon style="margin-right: 5px" iconClass="home" width="20px" height="20px"></svg-icon>
        <span slot="title">工作台</span>
      </el-menu-item>
      <el-menu-item index="/index">
        <svg-icon style="margin-right: 5px" iconClass="workPlat" width="20px" height="20px"></svg-icon>
        <span slot="title">数据可视化大屏</span>
      </el-menu-item>
      <el-submenu index="/index/enroll">
        <template slot="title">
          <svg-icon style="margin-right: 5px" iconClass="game" width="20px" height="20px" ></svg-icon>
          <span>赛事管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/person">
            <svg-icon style="margin-right: 5px" iconClass="person" width="16px" height="16px"
              ></svg-icon>
            用户管理
          </el-menu-item>
          <el-menu-item index="/index/enroll">
            <svg-icon style="margin-right: 5px" iconClass="enroll" width="16px" height="16px"
              ></svg-icon>
            报名管理
          </el-menu-item>
          <el-menu-item index="/index/schedule">
            <svg-icon style="margin-right: 5px" iconClass="schedule" width="16px" height="16px"
              ></svg-icon>
            赛程管理
          </el-menu-item>
          <el-menu-item index="/index/ballot">
            <svg-icon style="margin-right: 5px" iconClass="extract" width="16px" height="16px"
              ></svg-icon>
            抽签管理
          </el-menu-item>
          <el-menu-item index="/index/scheduleMaker">
            <svg-icon style="margin-right: 5px" iconClass="template" width="16px" height="16px"
              ></svg-icon>
            赛程生成模板
          </el-menu-item>
          <el-menu-item index="/index/gamepic">
            <svg-icon style="margin-right: 5px" iconClass="gamepic" width="16px" height="16px"
              ></svg-icon>
            封面制作
          </el-menu-item>
          <el-menu-item index="/index/test">
            <svg-icon style="margin-right: 5px" iconClass="excel" width="16px" height="16px" ></svg-icon>
            导出表单
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/index/blok">

        <template slot="title">
          <svg-icon style="margin-right: 5px" iconClass="publish" width="20px" height="20px" ></svg-icon>
          <span>发布管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/taskGiving">
            <svg-icon style="margin-right: 5px" iconClass="taskPush" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">任务下发</span>
          </el-menu-item>
          <el-menu-item index="/index/blok">
            <svg-icon style="margin-right: 5px" iconClass="champion" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">冠军管理</span>
          </el-menu-item>
          <el-menu-item index="/index/news">
            <svg-icon style="margin-right: 5px" iconClass="text" width="16px" height="16px" ></svg-icon>
            <span slot="title">公告管理</span>
          </el-menu-item>
          <!-- 
        <el-menu-item-group>
          <el-menu-item index="/index/private">
            <svg-icon style="margin-right: 5px" iconClass="private" width="16px" height="16px"
              ></svg-icon>
            自动化发布
          </el-menu-item>
        </el-menu-item-group> -->
          <el-menu-item index="/index/drag">
            <svg-icon style="margin-right: 5px" iconClass="promote" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">晋升图制作</span>
          </el-menu-item>
          <el-menu-item index="/index/banpick">
            <svg-icon style="margin-right: 5px" iconClass="whiteblack" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">合作伙伴</span>
          </el-menu-item>
          <el-menu-item index="/index/storeManager">
            <svg-icon style="margin-right: 5px" iconClass="shopCart" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">商品发布</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/index/authorization">
        <template slot="title">
          <svg-icon style="margin-right: 5px" iconClass="auth" width="20px" height="20px" ></svg-icon>
          <span>审批核销</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/exchange">
            <svg-icon style="margin-right: 5px" iconClass="authCom" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">解说审核</span>
          </el-menu-item>
          <el-menu-item index="/index/task">
            <svg-icon style="margin-right: 5px" iconClass="task" width="16px" height="16px" ></svg-icon>
            <span slot="title">任务审核</span>
          </el-menu-item>
          <el-menu-item index="/index/storeVerify">
            <svg-icon style="margin-right: 5px" iconClass="verify" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">商品核销</span>
          </el-menu-item>
          <el-menu-item index="/index/budget">
            <svg-icon style="margin-right: 5px" iconClass="budget" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">预算录入</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/index/workflow">

        <template slot="title">
          <svg-icon style="margin-right: 5px" iconClass="system" width="20px" height="20px" ></svg-icon>
          <span>系统参数</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/index/introduction">
            <svg-icon style="margin-right: 5px" iconClass="operation" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">操作手册</span>
          </el-menu-item>
          <!-- <el-menu-item index="/index/workflow">
            <svg-icon style="margin-right: 5px" iconClass="assign" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">流程规则</span>
          </el-menu-item> -->
          <!-- <el-menu-item-group>
          <el-menu-item index="/index/jsplumb">
            <svg-icon style="margin-right: 5px" iconClass="line" width="16px" height="16px" ></svg-icon>
            <span slot="title">流程审批</span>
          </el-menu-item>
        </el-menu-item-group> -->
          <el-menu-item index="/index/globalVar">
            <svg-icon style="margin-right: 5px" iconClass="json" width="16px" height="16px" ></svg-icon>
            <span slot="title">全局参数</span>
          </el-menu-item>
          <!-- <el-menu-item index="/index/testSelf">
            <svg-icon style="margin-right: 5px" iconClass="json" width="16px" height="16px" ></svg-icon>
            <span slot="title">浊泉自己玩的</span>
          </el-menu-item> -->
          <!-- <el-menu-item index="/index/exchange">
            <svg-icon style="margin-right: 5px" iconClass="exchange" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">兑换中心</span>
          </el-menu-item> -->
        </el-menu-item-group>
        <!-- <el-menu-item-group>
          <el-menu-item index="/index/apiTest">
            <svg-icon style="margin-right: 5px" iconClass="server" width="16px" height="16px"
              ></svg-icon>
            <span slot="title">测试api</span>
          </el-menu-item>
        </el-menu-item-group> -->
        <!-- <el-menu-item-group>
        <el-menu-item index="/index/process">
          <svg-icon
            style="margin-right: 5px"
            iconClass="server"
            width="16px"
            height="16px"
            
          ></svg-icon>
          <span slot="title">服务器管理</span>
        </el-menu-item>
      </el-menu-item-group> -->
      </el-submenu>
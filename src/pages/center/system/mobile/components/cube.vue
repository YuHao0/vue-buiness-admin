<template>
  <div class="cube-set">
    <div class="title">
      <div class="name">混合排列</div>
      <div class="link underline pull-right">恢复默认</div>
      <div class="link underline pull-right" @click="save()">确定</div>
    </div>
    <div class="module-content">
      <div class="form-wrap">
        <div class="form-name form-name-small">标题</div>
        <input type="text" class="form-control" v-model="formData.title">
        <div class="text-type">
          <span>对齐</span>
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign===1}" @click="titlePosition(1)" src="~assets/system/mobile/textLeft.png" draggable="false">
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign==2}" @click="titlePosition(2)" src="~assets/system/mobile/textCenter.png" draggable="false">
          <img :class="{active:formData.styleAndData.titleStyle.align.horizontalAlign==3}" @click="titlePosition(3)" src="~assets/system/mobile/textRight.png" draggable="false">
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-name form-name-small">标题风格</div>
        <el-radio v-model="formData.styleAndData.titleStyleType" 
          :label='radio.id' v-for="radio in styleSelect.titleStyle" :key="radio.id">
          {{radio.styleName}}
        </el-radio>
      </div>
      <div class="select-temp">
        <div class="temp-name">展示模板</div>
        <div class="temp-list">
          <div class="temp-itme" v-for="item in tempList" :key='item.type' @click="select(item)" :class="{'active':item.type == formData.activeTemp.type}">
            <img :src="item.img">
            <div>{{item.tempInfo.name}}</div>
          </div>
        </div>
        <div class="form-wrap">
          <div class="form-name">填充方式</div>
          <el-radio v-model="formData.styleAndData.scaleType" :label='0'>填充</el-radio>
          <el-radio v-model="formData.styleAndData.scaleType" :label='1'>按比例</el-radio>
        </div>
        <div class="lay-out">
          <div class="name">布局</div>
          <div class="content">
            <div class="lay-out-item item-1" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type === 0">
              <div 
                v-for="item in tempList[0].tempInfo.magicItems" :key="item.id + 'No'"
                :class="{active:activeItem.id===item.id}" @click="setActiveItem(item.id)">
                <img :src="item.image.url" v-show="item.image.url">
              </div>
            </div>
            <div class="lay-out-item item-2" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type == 1">
              <div 
                v-for="item in tempList[1].tempInfo.magicItems" :key="item.id + 'No'"
                :class="{active:activeItem.id===item.id}" @click="setActiveItem(item.id)">
                <img :src="item.image.url" v-show="item.image.url">
              </div>
            </div>
            <div class="lay-out-item item-3" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type == 2">
              <div 
                v-for="item in tempList[2].tempInfo.magicItems" :key="item.id + 'No'"
                :class="{active:activeItem.id===item.id}" @click="setActiveItem(item.id)">
                <img :src="item.image.url" v-show="item.image.url">
              </div>
            </div>
            <div class="lay-out-item item-4" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type == 3">
              <div 
                v-for="item in tempList[3].tempInfo.magicItems" :key="item.id + 'No'"
                :class="{active:activeItem.id===item.id}" @click="setActiveItem(item.id)">
                <img :src="item.image.url" v-show="item.image.url">
              </div>
            </div>
            <div class="lay-out-item item-5" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type == 4">
              <div :class="{active:activeItem.id===0}" @click="setActiveItem(0)" style="grid-area:header">
              </div>
              <div :class="{active:activeItem.id===0}" @click="setActiveItem(0)" style="grid-area:header">
                <img :src="tempList[4].tempInfo.magicItems[0].image.url" v-show="tempList[4].tempInfo.magicItems[0].image.url">
              </div>
              <div :class="{active:activeItem.id==1}" @click="setActiveItem(1)">
                <img :src="tempList[4].tempInfo.magicItems[1].image.url" v-show="tempList[4].tempInfo.magicItems[1].image.url">
              </div>
              <div :class="{active:activeItem.id==2}" @click="setActiveItem(2)">
                <img :src="tempList[4].tempInfo.magicItems[2].image.url" v-show="tempList[4].tempInfo.magicItems[2].image.url">
              </div>
            </div>
            <div class="lay-out-item item-6" 
              :style="{
                gridColumnGap:formData.styleAndData.spacing+'px',
                gridRowGap:formData.styleAndData.spacing+'px'
              }" 
              v-show="formData.activeTemp.type == 5">
              <div :class="{active:activeItem.id===0}" @click="setActiveItem(0)" style="grid-area:header">
              </div>
              <div :class="{active:activeItem.id===0}" @click="setActiveItem(0)" style="grid-area:header;height:166px;">
                <img :src="tempList[5].tempInfo.magicItems[0].image.url" v-show="tempList[5].tempInfo.magicItems[0].image.url">
              </div>
              <div :class="{active:activeItem.id===1}" @click="setActiveItem(1)">
                <img :src="tempList[5].tempInfo.magicItems[1].image.url" v-show="tempList[5].tempInfo.magicItems[1].image.url">
              </div>
              <div :class="{active:activeItem.id===2}" @click="setActiveItem(2)">
                <img :src="tempList[5].tempInfo.magicItems[2].image.url" v-show="tempList[5].tempInfo.magicItems[2].image.url">
              </div>
            </div>
            <div class="custom-cube" v-show="formData.activeTemp.type == 9" ref='customCube'
              @mousemove="mousemove($event)" @mousedown="mousedown($event)" @mouseup="mouseup($event)" @mouseleave="mouseleave()">
              <div class="item" v-for="item in customCubeList" :key="item.index" :index="item.index">
                <!-- <div>{{item.start.x}}{{item.start.y}}</div>
                <div>{{item.end.x}}{{item.end.y}}</div>
                <div>{{item.select}}</div> -->
              </div>
              <div class="select-mask" ref="mask" v-show="mouseMoveStart"></div>
              <div class="select-cube" v-for='item in selectList' :key="item.key" 
                :style="{
                  left:item.startX * 85 + 'px',
                  top:item.startY * 85 + 'px',
                  width:(item.endX - item.startX) * 85 + 'px',
                  height:(item.endY - item.startY) * 85 + 'px'
                }" 
                @mouseup="mouseleave()"
                :class="{active:activeItem.id===item.id}" @click="setActiveItem(item.id)">
                <span class="close" @click="deleteSelectCube(item.id)" @click.stop>X</span>
                <img :src="item.image.url" v-show="item.image.url">
                <span class="name" v-show="!item.image.url">{{(item.endX - item.startX)*150}}*{{(item.endY - item.startY)*150}}或同比例</span>  
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-name">图片间距</div>
        <input type="text" class="form-control" v-model="formData.styleAndData.spacing">
      </div>
      <div class="blue-wrap">
        <div class="img-wrap inline-block">
          <div class="img-alt">
            <img :src="activeItem.image.url" v-if="activeItem.image.url">
          </div>
          <upload v-on:uploadSuccess="uploadSuccess" class="link underline">更换图片</upload>
        </div>
        <div class="form-content inline-block">
          <div class="form-wrap">
            <div class="form-name">跳转</div>
            <select class="form-control" v-model="activeItem.image.jump.jumpType">
              <option value="">请选择</option>
              <option v-for="jump in jumpList" :key='jump.code' :value="jump.code">{{jump.remark}}</option>
            </select>
          </div>
          <div class="form-wrap">
            <div class="form-name">活动ID/链接</div>
            <input type="text" class="form-control" v-model="activeItem.image.jump.jumpData">
          </div>
        </div>
      </div>
      <div class="other-set-wrap">
        <div class="form-wrap">
          <div class="form-name">模块其他设置</div>
          <el-radio v-model="formData.styleAndData.styleType" 
            :label='radio.id' v-for="radio in styleSelect.other" :key="radio.id">
            {{radio.styleName}}
          </el-radio>
          <el-radio v-model="formData.styleAndData.styleType" :label='0'>自定义</el-radio>
        </div>
        <div class="other-set" v-show="formData.styleAndData.styleType == 0">
          <div class="form-wrap form-flex-wrap">
            <div class="form-name form-name-middle">模块间距</div>
            <div class="form-flex">
                <span>上</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[1]">
                <span>下</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[3]">
                <span>左</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[0]">
                <span>右</span>
                <input maxlength="3" type="text" class="form-control" v-model="formData.styleAndData.paddingArr[2]">
            </div>
          </div>
          <div class="form-wrap">
            <div class="form-name form-name-middle">模块背景</div>
            <el-color-picker v-model="formData.styleAndData.backgroundStyle.color"></el-color-picker>
            <upload v-on:uploadSuccess="setUpload" class="form-name add-img">
              <div v-show="!formData.styleAndData.backgroundStyle.imageUrl">上传图片</div>
              <el-popover
                v-show="formData.styleAndData.backgroundStyle.imageUrl"
                placement="right"
                width="200"
                trigger="hover">
                <img style="width:100%;height:100%" :src="formData.styleAndData.backgroundStyle.imageUrl">
                <span slot="reference">查看图片</span>
              </el-popover>
            </upload>
          </div>
          <div class="form-wrap">
            <div class="form-name form-name-middle">分割线显示</div>
            <el-radio v-model="formData.styleAndData.hideDividers" :label='0'>显示</el-radio>
            <el-radio v-model="formData.styleAndData.hideDividers" :label='1'>不显示</el-radio>
          </div>
          <div class="form-wrap">
            <div class="form-name form-name-middle">分割线高度</div>
            <input type="text" class="form-control" v-model="formData.styleAndData.divider.height">
          </div>
          <div class="form-wrap">
            <div class="form-name form-name-middle">分割线颜色</div>
            <el-color-picker v-model="formData.styleAndData.divider.color"></el-color-picker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  },
  data() {
    return {
      jumpList:[],
      styleSelect:{
        titleStyle:[],
        displayStyle:[],
        other:[]
      },
      formData:{
        layoutType:7,
        name:'混合排列',
        module:'cube',
        activeTemp:{},
        title:'',
        styleAndData:{
          styleType:0,
          padding:'',
          paddingArr:['','','',''],
          backgroundStyle:{
            imageUrl:'',
            color:''
          },
          hideDividers:0,
          divider:{
            height:'',
            color:''
          },
          titleStyleType:0,
          titleStyle:{
            align:{
              horizontalAlign:0
            }
          },
          scaleType:0,
          spacing:10,
          column:'',
          row:'',
          displayTemplate:'',
          magicItems:[]
        }
      },
      activeItem:{},
      tempList:[],
      customCubeList:[],
      selectInfo:{
        start:{x:'',y:''},
        end:{x:'',y:''},
        rotate:'' // 坐标替换 1不替换 2上下镜像 3中心对称 4左右镜像
      },
      selectList:[],
      mouseMoveStart:false
    }
  },
  methods:{
    getEditData(data){
      this.console(data);
      this.formData = this.extend(this.formData,data);
      this.formData.activeTemp = this.formData.styleAndData;
      this.formData.activeTemp.type = this.formData.activeTemp.displayTemplate;
      this.formData.activeTemp.index = this.formData.activeTemp.displayTemplate;
      this.formData.styleAndData.magicItems.forEach((item,index)=>{
        item.id = index;
      });
      if(this.formData.activeTemp.type == 9){
        this.formData.activeTemp.index = 6;
        this.selectList = this.formData.styleAndData.magicItems;
      }
      this.tempList[this.formData.activeTemp.index].tempInfo.magicItems = this.copy(this.formData.styleAndData.magicItems);
      this.formData.activeTemp.tempInfo = this.copy(this.tempList[this.formData.activeTemp.index].tempInfo);
      this.setActiveItem(0);
    },
    setUpload(data){
      this.formData.styleAndData.backgroundStyle.imageUrl = data.data;
    },
    uploadSuccess(data){
      this.activeItem.image.url = data.data;
    },
    setActiveItem(index){
      console.log('setActiveItem');
      if(!this.tempList[this.formData.activeTemp.index].tempInfo.magicItems.length){
        this.activeItem = {
          image:{
            url:'',
            jump:{
              jumpData:'',
              jumpType:''
            }
          }
        }
        return;
      }
      this.activeItem = this.tempList[this.formData.activeTemp.index].tempInfo.magicItems[index||0];
      console.log(this.activeItem);
    },
    titlePosition(type){
      this.formData.styleAndData.titleStyle.align.horizontalAlign = type;
    },
    base(e){
      return {
        x:e.pageX - this.$refs.customCube.offsetLeft,
        y:e.pageY - this.$refs.customCube.offsetTop
      }
    },
    deleteSelectCube(index){
      let key
      this.selectList.forEach((item ,itemIndex) => {
        if(index == item.id){
          key = itemIndex;         
        }
      })
      this.selectList.splice(key,1);
    },
    select(item){
      this.formData.activeTemp = item;
      this.setActiveItem();
    },
    mouseleave(){
      this.mouseMoveStart = false;
      this.$refs.mask.style.width = 0;
      this.$refs.mask.style.height = 0;
    },
    mousemove(e){
      if(this.mouseMoveStart){
        var width = this.base(e).x - this.$refs.mask.style.left.split('px')[0];
        var height = this.base(e).y - this.$refs.mask.style.top.split('px')[0];
        this.$refs.mask.style.transform = '';
        if(width<0&&height<0){
          this.selectInfo.rotate = 3;
          this.$refs.mask.style.transform = 'rotate(180deg)';
          width = Math.abs(width);
          height = Math.abs(height);
        }
        if(width>0&&height<0){
          this.selectInfo.rotate = 2;
          this.$refs.mask.style.transform = 'matrix(1,0,0,-1,0,0)';
          height = Math.abs(height);
        }
        if(width<0&&height>0){
          this.selectInfo.rotate = 4;
          this.$refs.mask.style.transform = 'matrix(-1,0,0,1,0,0)';
          width = Math.abs(width);
        }
        this.$refs.mask.style.width = width + 'px';
        this.$refs.mask.style.height = height + 'px';
      }
    },
    mousedown(e){
      console.log(e);
      if(!!~e.target.className.indexOf('select-cube') || !!~e.target.offsetParent.className.indexOf('select-cube')){
        return;
      }
      this.mouseMoveStart = true;
      this.selectInfo.start = this.base(e);
      this.selectInfo.rotate = 1;
      this.$refs.mask.style.left = this.base(e).x + 'px';
      this.$refs.mask.style.top = this.base(e).y + 'px';
    },
    mouseup(e){
      if(!!~e.target.className.indexOf('select-cube') || !!~e.target.offsetParent.className.indexOf('select-cube')){
        return;
      }
      this.selectInfo.end = this.base(e);
      let temp = {start:{},end:{}};
      switch(this.selectInfo.rotate){
        //  2上下镜像 3中心对称 4左右镜像
        case 2:
          temp.start.x = this.selectInfo.start.x;
          temp.end.x = this.selectInfo.end.x;
          temp.start.y = this.selectInfo.end.y;
          temp.end.y = this.selectInfo.start.y;
          this.selectInfo.start = temp.start;
          this.selectInfo.end = temp.end;
          break;
        case 3:
          temp.start.x = this.selectInfo.end.x;
          temp.end.x = this.selectInfo.start.x;
          temp.start.y = this.selectInfo.end.y;
          temp.end.y = this.selectInfo.start.y;
          this.selectInfo.start = temp.start;
          this.selectInfo.end = temp.end;
          break;
        case 4:
          temp.start.x = this.selectInfo.end.x;
          temp.end.x = this.selectInfo.start.x;
          temp.start.y = this.selectInfo.start.y;
          temp.end.y = this.selectInfo.end.y;
          this.selectInfo.start = temp.start;
          this.selectInfo.end = temp.end;
          break;
      }
      this.mouseMoveStart = false;
      this.$refs.mask.style.width = 0;
      this.$refs.mask.style.height = 0;
      this.getSelect();
    },
    getSelect() {
      console.log(JSON.stringify(this.selectInfo));
      let startX = Math.floor(this.selectInfo.start.x / 85);
      let startY = Math.floor(this.selectInfo.start.y / 85);
      let endX = Math.ceil(this.selectInfo.end.x / 85);
      let endY = Math.ceil(this.selectInfo.end.y / 85);
      if(startX>4||startY>4||endX>4||endY>4){
        return;
      }
      if(startX == endX){
         console.log(startX,endX,'X');
        if(startX == 4){
          startX-=1
        }else{
          endX+=1;
        }
      }
      if(startY == endY){
        console.log(startY,endY,'Y');
        if(startY == 4){
          startY-=1
        }else{
          endY+=1;
        }
      }
      console.log(startX,startY,endX,endY);
      this.selectList.push({
        id:this.selectList.length,
        key:'No' + this.selectList.length,
        startX:startX,
        startY:startY,
        endX:endX,
        endY:endY,
        image:{
          url:'',
          jump:{
            jumpData:'',
            jumpType:''
          }
        }
      });
      this.tempList[6].tempInfo.magicItems = this.selectList;
      this.customCubeList.forEach((item)=>{
        if(item.start.x >= startX&&item.start.y >= startY&&item.end.x <= endX&&item.end.y <= endY){
          item.select = true;
        }
      });
    },
    save(){
      // this.formData.styleAndData.magicItems = this.formData.activeTemp.tempInfo.magicItems;
      this.formData.styleAndData.magicItems = this.tempList[this.formData.activeTemp.index].tempInfo.magicItems;
      this.formData.styleAndData.displayTemplate = this.formData.activeTemp.displayTemplate;
      this.formData.styleAndData.padding = this.formData.styleAndData.paddingArr.toString();
      this.formData.styleAndData.column = this.formData.activeTemp.tempInfo.columnCount;
      this.formData.styleAndData.row = this.formData.activeTemp.tempInfo.rowCount;
      this.$emit('listenSet',this.formData);
    },
    setTempInfo(type){
      let temp = {
            rowCount:'',
            columnCount:'',
            magicItems:[],
            name:''
          };
      switch(type){
        case 0:
          temp.rowCount = 1;
          temp.columnCount = 2;
          temp.name = '1行2列';
          for(let i=0;i<2;i++){
            temp.magicItems.push({
              id:i,
              startX:i,
              startY:0,
              endX:i+1,
              endY:1,
              image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
            });
          }
          break;
        case 1:
          temp.rowCount = 1;
          temp.columnCount = 3;
          temp.name = '1行3列';
          for(let i=0;i<3;i++){
            temp.magicItems.push({
              id:i,
              startX:i,
              startY:0,
              endX:i+1,
              endY:1,
              image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
            });
          }
          break;
        case 2:
          temp.rowCount = 1;
          temp.columnCount = 4;
          temp.name = '1行4列';
          for(let i=0;i<4;i++){
            temp.magicItems.push({
              id:i,
              startX:i,
              startY:0,
              endX:i+1,
              endY:1,
              image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
            });
          }
          break;
        case 3:        
          temp.rowCount = 2;
          temp.columnCount = 2;
          temp.name = '2行2列';
          for(let i=0;i<4;i++){
            temp.magicItems.push({
              id:i,
              startX:i%2 == 0 ? 0 : 1,
              startY:Math.floor(i/2),
              endX:i%2 == 0 ? 1 : 2,
              endY:i<2 ? 1 : 2,
              image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
            });
          }
          break;
        case 4:     
          temp.rowCount = 2;
          temp.columnCount = 2;
          temp.name = '左1右2';
          temp.magicItems.push({
            id:0,
            startX:0,
            startY:0,
            endX:1,
            endY:2,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          temp.magicItems.push({
            id:1,
            startX:1,
            startY:0,
            endX:2,
            endY:1,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          temp.magicItems.push({
            id:2,
            startX:1,
            startY:1,
            endX:2,
            endY:2,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          break;
        case 5:       
          temp.rowCount = 2;
          temp.columnCount = 2;
          temp.name = '上1下2';
           temp.magicItems.push({
            id:0,
            startX:0,
            startY:0,
            endX:2,
            endY:1,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          temp.magicItems.push({
            id:1,
            startX:0,
            startY:1,
            endX:1,
            endY:2,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          temp.magicItems.push({
            id:2,
            startX:1,
            startY:1,
            endX:2,
            endY:2,
            image:{
                url:'',
                jump:{
                  jumpData:'',
                  jumpType:''
                }
              }
          });
          break;
        case 9:
          temp.rowCount = 4;
          temp.columnCount = 4;
          temp.name = '自定义';
          break;
      }
      return temp;
    },
    init(){
      for(let i=0;i<7;i++){
        this.tempList.push({
          index:i,
          displayTemplate:i==6 ? 9: i,
          type:i==6 ? 9: i,
          active:false
        });
        this.tempList[i].tempInfo = this.setTempInfo(i==6 ? 9 : i);
        import(`assets/system/mobile/cube/temp${i+1}.png`).then(res=>{
          this.$set(this.tempList[i],'img',res.default);
        });
      }
      this.formData.activeTemp = this.tempList[0];
      this.setActiveItem(0);
      for(let i=1;i<17;i++){
        let item = {
          index:i,
          start:{x:'',y:''},
          end:{x:'',y:''}
        };
        item.start.x = i%4 -1;
        item.start.y = Math.floor(i/4);
        if(i%4==0){
          item.start.x = 3;
          item.start.y = i/4 - 1;
        }
        item.end.x = item.start.x + 1;
        item.end.y = item.start.y + 1;
        this.customCubeList.push(item);
      }
    }
  },
  created() {
    this.$nextTick(()=>{
      console.log(this.$refs);
    });
    this.init();
    this.api.index.jumpType({layoutType:this.formData.layoutType}).then(result=>{
      this.jumpList = result.data;
    });
    this.api.index.getModuleStyle({layoutType:this.formData.layoutType}).then(result=>{
      result.data.forEach(item=>{
        switch(item.part){
          case 1:
            this.styleSelect.other.push(item);
          break;
          case 2:
            this.styleSelect.titleStyle.push(item);
          break;
          case 3:
            this.styleSelect.displayStyle.push(item);
          break;
        }
      });
      this.formData.styleAndData.titleStyleType = this.styleSelect.titleStyle[0].id;
      this.formData.styleAndData.styleType = this.styleSelect.other[0].id;
    });
  }
}
</script>
<style lang='scss'>
  .cube-set{
    background: #fff;
    border-radius: 4px;
    .select-temp{
      .temp-name{
        display: inline-block;
        vertical-align: top;
      }
      .temp-list{
        display: inline-block;
        margin-left: 10px;
        width: 342px;
        .temp-itme{
          float: left;
          padding: 2px;
          margin-right: 10px;
          margin-bottom: 10px;
          width: 104px;
          height: 100px;
          cursor: pointer;
          border:1px solid $border-color;
          text-align: center;
          font-size: 12px;
          div{
            margin-top: 2px;
          }
          &.active{
            border:1px solid $org-color;
          }
          img{
            width: 100%;
          }
        }
      }
    }
    .lay-out{
      height: 342px;
      margin-bottom: 15px;
      .name{
        display: inline-block;
        width: 56px;
        text-align: right;
        margin-right: 10px;
        vertical-align: top;
      }
      .content{
        display: inline-block;
        width: 342px;
        height: 342px;
      }
      .custom-cube{
        border:1px solid $border-color;
        overflow: hidden;
        position: relative;
        .item{
          float: left;
          width: 85px;
          height: 85px;
          background: #F5F8FC;
          border:1px solid $border-color;
        }
        .select-mask{
          position: absolute;
          z-index: 10;
          border: 1px solid $main-color;
          background: #FFDFE9;
          transform-origin: left top;
          width: 0;
          height: 0;
        }
        .select-cube{
          position: absolute;
          z-index: 5;
          border: 1px solid $main-color;
          background: #FFDFE9;
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          &.active{
            border:1px solid blue;
          }
          .close{
            position:absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
          }
          .name{
            text-align: center;
            display: block;
            width: 100%;
            color:$main-color;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .lay-out-item{
        display: grid;
        width: 342px;
        height: 342px;
        div{
          cursor: pointer;
          background: #c5e2ff;
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
        .active{
          border:1px solid $main-color;
        }
      }
      .item-1{
        grid-template-columns:repeat(2,1fr);
        grid-template-rows:342px;
      }
      .item-2{
        grid-template-columns:repeat(3,1fr);
        grid-template-rows:342px;
      }
      .item-3{
        grid-template-columns:repeat(4,1fr);
        grid-template-rows:342px;
      }
      .item-4{
        grid-template-columns:repeat(2,1fr);
        grid-template-rows:repeat(2,1fr);
      }
      .item-5{
        grid-template-columns:repeat(2,1fr);
        grid-template-rows:repeat(2,1fr);
        grid-template-areas: 
          "header ."
          "header .";
      }
      .item-6{
        grid-template-columns:repeat(2,1fr);
        grid-template-rows:repeat(2,1fr);
        grid-template-areas: 
          "header header"
          ". .";
      }
    }
    .module-content{
      .blue-wrap{
        margin-bottom: 20px;
      }
    }
  }
</style>
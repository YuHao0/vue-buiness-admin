<template>
  <div class="promotion-detail">
    <h2 class="big-title">基本信息</h2>
    <div class="wrap info-wrap">
      <div class="info-wrap-item">
        <div class="form-wrap">
          <div class="form-name">活动名称</div>
          <input class="form-control long-input" v-model="activityParams.actName" placeholder="请输入活动名称" />
        </div>
        <div class="form-wrap">
          <div class="form-name">活动时间</div>
          <el-date-picker class="timepicker-control" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择开始时间" v-model="activityParams.startTime"></el-date-picker>
          <!-- <span class="time-mid">－</span> -->
          <el-date-picker class="timepicker-control" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  placeholder="请选择结束时间" v-model="activityParams.endTime"></el-date-picker>
        </div>
        <div class="form-wrap">
          <div class="form-name">海报图片</div>
          <upload uploadType='2' v-on:uploadSuccess="uploadPCSuccess">
            <a class="poster-img">PC配图 +</a>
          </upload>
          <upload uploadType='2' v-on:uploadSuccess="uploadAppSuccess">
            <a class="poster-img">App配图 +</a>
          </upload>
        </div>
      </div>
      <div class="info-wrap-item info-editor-right">
        <div class="form-wrap pc-item" v-show="activityParams.bannerImage.bannerImageUrlForPC">
          <div class="form-name">PC配图</div>
          <img :src="activityParams.bannerImage.bannerImageUrlForPC" />
        </div>
        <div class="form-wrap pc-item" v-show="activityParams.bannerImage.bannerImageUrlForAPP">
          <div class="form-name">App配图</div>
          <img :src="activityParams.bannerImage.bannerImageUrlForAPP" />
        </div>
      </div>
      <div class="info-editor-item">
        <div class="form-wrap">
          <div class="form-name">活动介绍</div>
          <div class="editor-wrap">
            <editor v-model="activityParams.summary"></editor>
          </div>
        </div>
      </div>
      <div class="info-wrap-rule">
        <h4>活动规则</h4>
        <div class="form-wrap">
          <div class="form-name">活动类型</div>
          <select class="form-control long-input" v-model="activityParams.actType" :class="{'unset-select':!activityParams.actType}">
            <option value="">请选择活动类型</option>
            <option v-for="item in typeList" :key="item.code" :value="item.code">{{item.remark}}</option>
          </select>
        </div>
        <div class="form-wrap" v-show="activityParams.actType!==3">
          <div class="form-name">货币</div>
          <select class="form-control long-input" v-model="actCurrency" :class="{'unset-select':!actCurrency}">
            <option value="">请选择</option>
            <option v-for="item in currencyList" :key="item.code" :value="item.code">{{item.mixName}}</option>
          </select>
        </div>

        <!-- 满减 -->
        <div class="type-content" v-show="activityParams.actType===2">
          <div class="form-wrap">
            <div class="form-name">满减规则</div>
            <div class="rule-content">
              <div class="rule-row" v-for="(item, index) in limitRules" :key="index+'limitPrice'">
                <span class="text">满</span>
                <input type="text" class="form-control" placeholder="请填写金额" v-model="item.limitPrice" />
                <span class="text">{{currencyName}}减</span>
                <input type="text" class="form-control" placeholder="请填写金额" v-model="item.reductionPrice" />
                <span class="text">{{currencyName}}</span>
                <a class="add-btn" @click="addLimitPrice()">添加</a>
                <a class="add-btn" @click="delLimitPrice(index)" v-show="index > 0">删除</a>
              </div>
            </div>
          </div>
        </div>

        <!-- 满赠 -->
        <div class="type-content" v-show="activityParams.actType===4">
          <div class="form-wrap">
            <div class="form-name">满赠设置</div>
            <div class="rule-content">
              <el-radio name="give" v-model="ladderParams.type" :label="1">阶梯满赠</el-radio>
              <el-radio name="give" v-model="ladderParams.type" :label="2">高价满赠</el-radio>
            </div>
          </div>
          <div v-for="(item, index) in ladderParams.fullGiftLimitList" :key="index+'ladder'">
            <div class="form-wrap">
              <div class="form-name">{{index+1}}级优惠</div>
              <div class="rule-content">
                <span class="text">满</span>
                <input type="text" class="form-control" placeholder="请填写金额" v-model="item.limitPrice" />
                <span class="text">{{currencyName}}赠送</span>
                <a class="select-ladder" @click="selectLadder(index)">选择赠品</a>
              </div>
            </div>
            <div class="form-wrap add-ladder" v-show="item.giftInfoList.length>0">
              <div class="form-name">赠品信息</div>
              <div class="rule-content">
                <div class="spec-list">
                  <table>
                    <thead>
                      <tr>
                        <th class="w300">赠品名称</th>
                        <th class="w200">赠品规格</th>
                        <th class="w100">库存</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(sku, sku_index) in item.giftInfoList" :key="sku_index+'sku'">
                        <td>
                          <img :src="sku.mainImg" />
                          <p class="sname">{{sku.itemName}}</p>
                        </td>
                        <td>{{sku.skuValue}}</td>
                        <td>{{sku.stockNum}}</td>
                        <td>
                          <a class="link" @click="removeLadderGoods(item, sku_index)">删除</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="form-wrap">
            <a class="btn-fill-org-main" @click="addLadder">添加{{ladderParams.fullGiftLimitList.length+1}}级优惠</a>
          </div>
        </div>

        <!-- 折扣 -->
        <div class="type-content" v-show="activityParams.actType===3">
          <div class="form-wrap">
            <div class="form-name">活动规则</div>
            <div class="rule-content">
              <input type="text" class="form-control discount" placeholder="请填写0-1,0.1表示1折,1表示不打折" v-model="actDiscount" />
            </div>
          </div>
        </div>

        <!-- 打包 -->
        <div class="type-content" v-show="activityParams.actType===5">
          <div class="form-wrap">
            <div class="form-name">打包价</div>
            <div class="rule-content">
              <div class="rule-row" v-for="(item, index) in packingPriceList" :key="index+'packingPriceList'">
                <span class="text">满</span>
                <input type="text" class="form-control" placeholder="请填写件数" v-model="item.itemNum" />
                <span class="text">件,打包价</span>
                <input type="text" class="form-control" placeholder="请填写金额" v-model="item.price" />
                <span class="text">{{currencyName}}</span>
                <a class="add-btn" @click="addPackingPrice()">添加</a>
                <a class="add-btn" @click="delPackingPrice(index)" v-show="index > 0">删除</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    <h2 class="big-title">活动商品</h2>
    <div class="tab-bar">
      <div class="tab-item" :class="{'active':currentTab===1}" @click="changeTab(1)">选择商品</div>
      <div class="tab-item" :class="{'active':currentTab===2}" @click="changeTab(2)" v-show="activityParams.actType===1">设置活动价</div>
    </div>
    <div class="wrap act-wrap" v-show="currentTab===1">
      <div class="list-wrap">
        <div class="search-bar" v-show="selectTab===1">
          <a class="btn-fill-org-main" @click="showBrandModal = true">品牌选择</a>
          <span class="btn-org-small" v-for="(item, index) in selectBrand" :key="index+'brand'">
            {{item.name}}
            <a href="javascript:;" @click="removeSearchBrand(index)">X</a>
          </span>
          <a class="btn-fill-main" @click="showCategoryModal = true">类目选择</a>
          <span class="btn-small" v-show="selectCate.id">
            {{selectCate.name}}
            <a href="javascript:;" @click="removeSearchCate()">X</a>
          </span>
          <a class="btn-fill-main btn-fill-main-shop" @click="showShopModal = true">店铺选择</a>
          <span class="btn-small btn-small-shop" v-for="(item, index) in selectShop" :key="index+'shop'">
            {{item.name}}
            <a href="javascript:;" @click="removeSearchShop(index)">X</a>
          </span>
          <select class="form-control" v-model="goodsParams.itemChannelTypes" :class="{'unset-select':!goodsParams.itemChannelTypes}" v-show="!userConfig.singleChannel">
            <option value="">渠道选择</option>
            <option v-for="item in channelList" :key="item.channelType" :value="item.channelType">{{item.channelTypeName}}</option>
          </select>
          <input type="text" class="form-control" placeholder="商品名称" v-model="goodsParams.keyword" />
          <a class="btn-fill-main" @click="getGoodsList()">搜索</a>
          <a class="btn-fill-grey-main" @click="clearSearch()">清空</a>
        </div>
        <div class="search-bar select-bar">
          <div class="right" v-show="selectTab===1">
            <span class="text">批量操作：</span>
            <a class="btn-fill-org-main" @click="batchSelect()">批量加入</a>
            <a class="btn-fill-org-main" @click="pageSelect()">本页加入</a>
          </div>
          <div class="select-tab" :class="{'active':selectTab===1}" @click="changeSelectTab(1)">商品列表</div>
          <div class="select-tab" :class="{'active':selectTab===2}" @click="changeSelectTab(2)">已选择</div>
          <div class="select-tab" :class="{'active':selectTab===3}" @click="changeSelectTab(3)">已置顶</div>
        </div>
        <div class="select-inner" v-show="selectTab===1">
          <table class="table">
            <thead>
              <tr>
                <th class="dot" :class="{'active':checkAll}" @click="selectAll()"></th>
                <th class="table-w100">商品图片</th>
                <th class="table-w340">商品名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in goodsList" :key="item.id" :class="{'selected':item.isSelected}">
                <td class="dot" :class="{'active':item.checked}" @click="selectCheckItem(item)"></td>
                <td>
                  <el-popover
                    placement="right"
                    width="260"
                    trigger="hover">
                    <img style="width:100%;height:100%" :src="item.mainImageUrl">
                    <img slot="reference" :src="item.mainImageUrl"/>
                  </el-popover>
                </td>
                <td>
                  <el-popover class="ellipsis"
                    placement="right"
                    width="260"
                    trigger="hover">
                    <span>{{item.name}}</span>
                    <span slot="reference">{{item.name}}</span>
                  </el-popover>
                </td>
                <td>
                  <a class="link" @click="selectItem(item)" v-show="!item.isSelected">选取</a>
                  <span class="hasSelected" v-show="item.isSelected">已选取</span>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination v-show="total>0" :total="total" :page.sync="goodsParams.page" :limit.sync="goodsParams.limit" @pagination="getGoodsList()" />
        </div>
        <div class="select-inner" v-show="selectTab===2">
          <table class="table">
            <thead>
              <tr>
                <!-- <th class="dot"></th> -->
                <th class="table-w100">商品图片</th>
                <th class="table-w340">商品名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selected" :key="item.id" :class="{'selected':item.isToped}">
                <!-- <td class="dot"></td> -->
                <td>
                  <el-popover
                    placement="right"
                    width="260"
                    trigger="hover">
                    <img style="width:100%;height:100%" :src="item.mainImageUrl">
                    <img slot="reference" :src="item.mainImageUrl"/>
                  </el-popover>
                </td>
                <td>
                  <el-popover class="ellipsis"
                    placement="right"
                    width="260"
                    trigger="hover">
                    <span>{{item.name}}</span>
                    <span slot="reference">{{item.name}}</span>
                  </el-popover>
                </td>
                <td>
                  <a class="link" @click="cancelItem(item, index)">取消</a>
                  <a class="link" @click="setTop(item)" v-show="!item.isToped">置顶</a>
                  <span class="hasSelected" v-show="item.isToped">已置顶</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="select-inner" v-show="selectTab===3">
          <table class="table">
            <thead>
              <tr>
                <th class="dot"></th>
                <th class="table-w100">商品图片</th>
                <th class="table-w340">商品名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in toped" :key="item.id">
                <td class="dot"></td>
                <td>
                  <el-popover
                    placement="right"
                    width="260"
                    trigger="hover">
                    <img style="width:100%;height:100%" :src="item.mainImageUrl">
                    <img slot="reference" :src="item.mainImageUrl"/>
                  </el-popover>
                </td>
                <td>
                  <el-popover class="ellipsis"
                    placement="right"
                    width="260"
                    trigger="hover">
                    <span>{{item.name}}</span>
                    <span slot="reference">{{item.name}}</span>
                  </el-popover>
                </td>
                <td>
                  <a class="link" @click="unsetTop(index)">取消置顶</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="wrap set-wrap" v-show="currentTab===2">
      <div class="search-bar">
        <el-radio v-model="setStatus" :label="1">
          <span class="text">全部减价</span>
          <input type="text" class="form-control" v-model="activityParams.actStrategy.allPriceReduction" />
          <span class="text">{{currencyName}}</span>
        </el-radio>
        <el-radio v-model="setStatus" :label="2" class="one-price">
          <span class="text">全场一口价</span>
          <input type="text" class="form-control" v-model="activityParams.actStrategy.allOnePrice" />
          <span class="text">{{currencyName}}</span>
        </el-radio>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="dot"></th>
            <th class="table-w100">商品图片</th>
            <th class="table-w340">商品名称</th>
            <th class="table-w200">活动策略</th>
            <th class="table-w200"></th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in activityParams.actStrategy.itemPriceReductionInfoList" :key="item.id">
            <td class="dot"></td>
            <td>
              <el-popover
                placement="right"
                width="260"
                trigger="hover">
                <img style="width:100%;height:100%" :src="item.mainImageUrl">
                <img slot="reference" :src="item.mainImageUrl"/>
              </el-popover>
            </td>
            <td>
              <el-popover class="ellipsis"
                placement="right"
                width="260"
                trigger="hover">
                <span>{{item.name}}</span>
                <span slot="reference">{{item.name}}</span>
              </el-popover>
            </td>
            <td>
              <el-input :placeholder="activityParams.actStrategy.allPriceReduction" v-model="item.priceReduction" size="mini" :disabled="setStatus!==1">
                <template slot="prepend">减价</template>
              </el-input>
            </td>
            <td>
              <el-input :placeholder="activityParams.actStrategy.allOnePrice" v-model="item.onePrice" size="mini" :disabled="setStatus!==2">
                <template slot="prepend">一口价</template>
              </el-input>
            </td>
            <td>
              <a class="link" @click="cancelSetItem(item, index)">取消选取</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <SelectShop v-if="showShopModal" v-on:dialogShop="dialogShop" v-on:dialogShopCancel="dialogShopCancel"></SelectShop>
    <SelectBrand v-if="showBrandModal" v-on:dialogBrand="dialogBrand" v-on:dialogBrandCancel="dialogBrandCancel"></SelectBrand>
    <SelectCategory v-if="showCategoryModal" v-on:dialogCategory="dialogCategory" v-on:dialogCategoryCancel="dialogCategoryCancel" :multiply="false"></SelectCategory>
    <selectActGoods v-if="showGoodsModal" :gift="1" v-on:dialogGoods="dialogGoods" v-on:dialogGoodsCancel="dialogGoodsCancel"></selectActGoods>
    <div class="save-box">
      <h2 class="title">操作</h2>
      <div class="save-inner">
        <a href="javascript:;" class="btn-main" @click="saveActivity()">保存</a>
        <router-link :to="{ name: '平台促销'}" class="btn-fill-main">返回</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SelectBrand from '@/components/selectBrand/index.vue';
import SelectCategory from '@/components/selectCategory/index.vue';
import SelectShop from '@/components/selectShop/index.vue';
import Pagination from '@/components/pagination';
import editor from '@/components/tinymce/tinymce.vue';
import selectActGoods from '@/components/selectActGoods/index.vue';
export default {
  data() {
    return {
      currentTab: 1,
      checkAll: false,
      showBrandModal: false,
      showCategoryModal: false,
      showShopModal: false,
      showGoodsModal: false,
      selectBrand: [],
      selectShop: [],
      selectCate: {},
      typeList: [],
      currencyList: [],
      channelList: [],
      goodsList: [],
      detailPriceReductionInfo: {},
      goodsParams: {
        page: 1,
        limit: 10,
        status: 1,
        itemChannelTypes: '',
        keywordType: 2,
        keyword: ''
      },
      total: 0,
      selected: [],
      toped: [],
      selectTab: 1, // 商品列表:1, 已选择:2, 已置顶:3
      selectGoodsList: [],
      topGoodsList: [],
      setStatus: 0,
      actCurrency: '',
      currencyName: '',
      limitRules: [{  // 满减列表
        limitPrice: '',
        reductionPrice: ''
      }], 
      packingPriceList: [{  // 打包价
        itemNum: '',
        price: ''
      }],
      actDiscount: '',  // 折扣
      ladderParams: {   // 满赠
        type: 1,
        fullGiftLimitList: [{
          limitPrice: '',
          giftInfoList: []
        }]
      },
      selectLadderIndex: 0,
      activityParams: {
        actName: '',
        actType: '',
        startTime: '',
        endTime: '',
        summary: '',
        bannerImage: {
          bannerImageUrlForPC: '',
          bannerImageUrlForAPP: ''
        },
        actStrategy: {
          allPriceReduction: '',
          allOnePrice: '',
          itemPriceReductionInfoList: []
        }
      }
    }
  },
  created() {
    this.id = this.$route.params.id || '';
    this.getType();
    this.getCurrency();
    this.getChannel();
    this.getGoodsList();
    if(this.id) {
      this.getDetail(this.id);
    }
  },
  methods: {
    getType() {
      this.api.activity.typeList({}).then((res) => {
        this.typeList = res.data;
      });
    },
    getCurrency() {
      this.api.common.currency({}).then((res) => {
        this.currencyList = res.data;
        this.currencyList.forEach(item => {
          item.mixName = item.symbol + ' ' + item.name;
        });
      });
    },
    getChannel() {
      this.api.goods.channel({}).then((res) => {
        this.channelList = res.data;
      });
    },
    getDetail(id) {
      this.api.activity.detail({id: id}).then((res) => {
        this.activityParams.actName = res.data.actName;
        this.activityParams.actType = res.data.actType;
        this.activityParams.shopId = res.data.shopId;
        this.activityParams.startTime = res.data.startTime;
        this.activityParams.endTime = res.data.endTime;
        this.activityParams.bannerImage.bannerImageUrlForPC = res.data.bannerImage.bannerImageUrlForPC;
        this.activityParams.bannerImage.bannerImageUrlForAPP = res.data.bannerImage.bannerImageUrlForAPP;
        this.activityParams.summary = res.data.summary;
        this.selected = res.data.actScope;
        if(this.selected.length>0) {
          this.selected.forEach(item => {
            item.mainImageUrl = item.mainImg;
          });
        }
        this.toped = res.data.headItemList;
        if(this.toped.length>0) {
          this.toped.forEach(item => {
            item.mainImageUrl = item.mainImg;
          });
        }

        // 降价
        if(res.data.actType === 1) {
          this.actCurrency = res.data.actStrategy.currency;
          if(res.data.actStrategy) {
            if(res.data.actStrategy.allOnePrice || res.data.actStrategy.allOnePrice === 0) {
              this.setStatus = 2;
              this.activityParams.actStrategy.allOnePrice = res.data.actStrategy.allOnePrice;
              this.activityParams.actStrategy.allPriceReduction = '';
            }
            if(res.data.actStrategy.allPriceReduction || res.data.actStrategy.allPriceReduction === 0) {
              this.setStatus = 1;
              this.activityParams.actStrategy.allPriceReduction = res.data.actStrategy.allPriceReduction;
              this.activityParams.actStrategy.allOnePrice = '';
            }
            if(res.data.actStrategy.itemPriceReductionInfoList.length>0) {
              this.activityParams.actStrategy.itemPriceReductionInfoList = res.data.actStrategy.itemPriceReductionInfoList;
              this.detailPriceReductionInfo = res.data.actStrategy;
            }
          }
        }

        // 满减
        if(res.data.actType === 2) {
          if(res.data.actStrategy) {
            this.actCurrency = res.data.actStrategy.currency;
            this.limitRules = res.data.actStrategy.fullReductionLimitList;
          }
        }

        // 折扣
        if(res.data.actType === 3) {
          if(res.data.actStrategy) {
            this.actDiscount = res.data.actStrategy.discount;
          }
        }

        // 满赠
        if(res.data.actType === 4) {
          this.ladderParams = res.data.actStrategy;
          this.ladderParams.fullGiftLimitList.forEach(ladder => {
            ladder.giftInfoList.forEach(gift => {
              gift.mainImg = gift.itemImg;
            });
          });
        }

        // 打包价
        if(res.data.actType === 5) {
          if(res.data.actStrategy) {
            this.actCurrency = res.data.actStrategy.currency;
            this.packingPriceList = res.data.actStrategy.packingPriceList;
          }
        }
        
        this.checkToped();
        this.checkSelected();
      });
    },
    addLimitPrice() {
      this.limitRules.push({
        limitPrice: '',
        reductionPrice: ''
      });
    },
    delLimitPrice(index) {
      this.limitRules.splice(index, 1);
    },
    addPackingPrice() {
      this.packingPriceList.push({
        itemNum: '',
        price: ''
      });
    },
    delPackingPrice(index) {
      this.packingPriceList.splice(index, 1);
    },
    addLadder() {
      this.ladderParams.fullGiftLimitList.push({
        limitPrice: '',
        giftInfoList: []
      });
    },
    getGoodsList() {
      let params = this.copy(this.goodsParams);
      if(this.selectBrand.length>0) {
        let ids = '';
        this.selectBrand.forEach(item => {
          ids += item.id + ',';
        });
        ids = ids.substring(0, ids.length-1);
        params.brandIds = ids;
      }
      if(this.selectShop.length>0) {
        let ids = [];
        this.selectShop.forEach(item => {
          ids.push(item.id);
        });
        ids = ids.join(',');
        params.shopIds = ids;
      }
      if(this.selectCate.id) {
        params.cateId = this.selectCate.id;
      }
      this.api.goods.list(params).then((res) => {
        res.data.dataList.forEach((item) => {
          item.checked = false;
        });
        this.goodsList = res.data.dataList;
        this.total = res.data.total;
        this.goodsList.forEach(item => {
          item.isSelected = false;
          item.isToped = false;
        });
      });
    },
    clearSearch() {
      this.goodsParams = {
        page: 1,
        limit: 10,
        status: 1,
        itemChannelTypes: '',
        keywordType: 2,
        keyword: ''
      };
      this.selectBrand = [];
      this.selectCate = {};
      this.getGoodsList();
    },
    checkSelected() {
      if(this.selected.length>0) {
        let selectIds = [];
        this.selected.forEach(item => {
          selectIds.push(item.id);
        });
        this.goodsList.forEach(goods => {
          if(selectIds.indexOf(goods.id) != -1) {
            goods.isSelected = true;
          } else {
            goods.isSelected = false;
          }
        });
      } else {
        this.goodsList.forEach(goods => {
          goods.isSelected = false;
        });
      }
    },
    checkToped() {
      if(this.toped.length>0) {
        let topIds = [];
        this.toped.forEach(item => {
          topIds.push(item.id);
        });
        this.selected.forEach(select => {
          if(topIds.indexOf(select.id) != -1) {
            select.isToped = true;
          } else {
            select.isToped = false;
          }
        });
      } else {
        this.selected.forEach(select => {
          select.isToped = false;
        });
      }
    },
    selectCheckItem(item) {
      this.checkAll = true;
      item.checked = !item.checked;
      this.goodsList.forEach((item) => {
        if(!item.checked) {
          this.checkAll = false;
        }
      });
    },
    selectAll() {
      this.checkAll = !this.checkAll;
      this.goodsList.forEach((item) => {
        if(this.checkAll) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
    },
    changeTab(tab) {
      if(tab === 2) {
        this.activityParams.actStrategy.itemPriceReductionInfoList = [];
        if(this.selected.length===0) {
          this.$message.info({message:'请先选择活动商品', showClose:true});
        } else {
          this.selected.forEach(item => {
            this.activityParams.actStrategy.itemPriceReductionInfoList.push({
              itemId: item.id,
              mainImageUrl: item.mainImageUrl,
              name: item.name,
              priceReduction: '',
              onePrice: ''
            });
          });
          if(this.detailPriceReductionInfo.itemPriceReductionInfoList) {
            if(this.detailPriceReductionInfo.allPriceReduction) {
              this.detailPriceReductionInfo.itemPriceReductionInfoList.forEach(item => {
                this.activityParams.actStrategy.itemPriceReductionInfoList.forEach(cell => {
                  if(item.itemId === cell.itemId) {
                    cell.priceReduction = item.priceReduction;
                  }
                });
              });
            } else {
              this.detailPriceReductionInfo.itemPriceReductionInfoList.forEach(item => {
                this.activityParams.actStrategy.itemPriceReductionInfoList.forEach(cell => {
                  if(item.itemId === cell.itemId) {
                    cell.onePrice = item.onePrice;
                  }
                });
              });
            }
          }
          this.currentTab = tab;
        }
      } else {
        this.currentTab = tab;
      }
    },
    batchSelect() {
      let target = [];
      this.goodsList.forEach(item => {
        if(item.checked) {
          target.push(item);
        }
      });
      if(target.length === 0) {
        this.$message.info({message:'至少选择一件商品', showClose:true});
      } else {
        if(this.selected.length>0) {
          let existed = [];
          this.selected.forEach(item => {
            existed.push(item.id);
          });
          let success = false;
          target.forEach(item => {
            if(existed.indexOf(item.id) === -1) {
              this.selected.push(item);
              success = true;
            }
          });
          if(success) {
            this.$message.success({message:'已选取', showClose:true});
            this.checkSelected();
          } else {
            this.$message.info({message:'商品均已被选取', showClose:true});
          }
        } else {
          this.selected = this.copy(target);
          this.$message.success({message:'已选取', showClose:true});
          this.checkSelected();
        }
      }
    },
    pageSelect() {
      let target = this.copy(this.goodsList);
      if(target.length === 0) {
        return
      }
      if(this.selected.length>0) {
        let existed = [];
        this.selected.forEach(item => {
          existed.push(item.id);
        });
        let success = false;
        target.forEach(item => {
          if(existed.indexOf(item.id) === -1) {
            this.selected.push(item);
            success = true;
          }
        });
        if(success) {
          this.$message.success({message:'已选取', showClose:true});
          this.checkSelected();
        } else {
          this.$message.info({message:'商品均已被选取', showClose:true});
        }
      } else {
        this.selected = this.copy(target);
        this.$message.success({message:'已选取', showClose:true});
        this.checkSelected();
      }
    },
    changeSelectTab(tab) {
      this.selectTab = tab;
    },
    uploadPCSuccess(res) {
      this.activityParams.bannerImage.bannerImageUrlForPC = res.data;
    },
    uploadAppSuccess(res) {
      this.activityParams.bannerImage.bannerImageUrlForAPP = res.data;
    },
    dialogShop(res) {
      this.selectShop = res.shopList;
      this.showShopModal = false;
    },
    dialogShopCancel() {
      this.showShopModal = false;
    },
    removeSearchShop(index) {
      this.selectShop.splice(index, 1);
    },
    dialogBrand(res) {
      this.selectBrand = res.brandList;
      this.showBrandModal = false;
    },
    dialogBrandCancel() {
      this.showBrandModal = false;
    },
    removeSearchBrand(index) {
      this.selectBrand.splice(index, 1);
    },
    dialogCategory(res) {
      this.selectCate = res.categoryList[0];
      this.showCategoryModal = false;
    },
    dialogCategoryCancel() {
      this.showCategoryModal = false;
    },
    removeSearchCate() {
      this.selectCate = {};
    },
    selectItem(item) {
      if(this.selected.length>0) {
        let exist = false;
        this.selected.forEach(goods => {
          if(goods.id === item.id) {
            exist = true
          }
        });
        if(!exist) {
          this.selected.push(item);
          this.checkSelected();
          this.$message.success({message:'已选取', showClose:true});
        } else {
          this.$message.info({message:'不能选取相同的商品', showClose:true});
        }
      } else {
        this.selected.push(item);
        this.checkSelected();
        this.$message.success({message:'已选取', showClose:true});
      }
    },
    cancelItem(item, index) {
      if(this.toped.length>0) {
        let pos = '';
        this.toped.forEach((top, i) => {
          if(top.id === item.id) {
            pos = i;
          }
        });
        if(pos || pos === 0) {
          this.$msgbox({
            title: '',
            message: '该商品已被置顶，确认取消？',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否'
          }).then(action => {
            if(action === 'confirm') {
              this.toped.splice(pos, 1);
              this.selected.splice(index, 1);
              this.checkSelected();
            }
          });
        } else {
          this.selected.splice(index, 1);
          this.checkSelected();
        }
      } else {
        this.selected.splice(index, 1);
        this.checkSelected();
      }
    },
    cancelSetItem(item, index) {
      if(this.toped.length>0) {
        let pos = '';
        this.toped.forEach((top, i) => {
          if(top.id === item.itemId) {
            pos = i;
          }
        });
        if(pos || pos === 0) {
          this.$msgbox({
            title: '',
            message: '该商品已被置顶，确认取消？',
            showCancelButton: true,
            confirmButtonText: '是',
            cancelButtonText: '否'
          }).then(action => {
            if(action === 'confirm') {
              this.toped.splice(pos, 1);
              this.activityParams.actStrategy.itemPriceReductionInfoList.splice(index, 1);
              this.checkToped();
              let select_pos = '';
              this.selected.forEach((sel, sel_i) => {
                if(sel.id === item.itemId) {
                  select_pos = sel_i;
                }
              });
              if(select_pos || select_pos === 0) {
                this.selected.splice(select_pos, 1);
              }
              this.checkSelected();
            }
          });
        } else {
          this.activityParams.actStrategy.itemPriceReductionInfoList.splice(index, 1);
          this.checkToped();
          let select_pos = '';
          this.selected.forEach((sel, sel_i) => {
            if(sel.id === item.itemId) {
              select_pos = sel_i;
            }
          });
          if(select_pos || select_pos === 0) {
            this.selected.splice(select_pos, 1);
          }
          this.checkSelected();
        }
      } else {
        this.activityParams.actStrategy.itemPriceReductionInfoList.splice(index, 1);
        this.checkToped();
        let select_pos = '';
        this.selected.forEach((sel, sel_i) => {
          if(sel.id === item.itemId) {
            select_pos = sel_i;
          }
        });
        if(select_pos || select_pos === 0) {
          this.selected.splice(select_pos, 1);
        }
        this.checkSelected();
      }
    },
    setTop(item) {
      if(this.toped.length>0) {
        let exist = false;
        this.toped.forEach(top => {
          if(top.id === item.id) {
            exist = true;
          }
        });
        if(!exist) {
          this.toped.push(item);
          this.checkToped();
          this.$message.success({message:'已置顶', showClose:true});
        } else {
          this.$message.info({message:'不能置顶相同的商品', showClose:true});
        }
      } else {
        this.toped.push(item);
        this.checkToped();
        this.$message.success({message:'已置顶', showClose:true});
      }
    },
    unsetTop(index) {
      this.toped.splice(index, 1);
      this.checkToped();
    },
    selectLadder(index) {
      this.selectLadderIndex = index;
      this.showGoodsModal = true;
    },
    removeLadderGoods(item, index) {
      item.giftInfoList.splice(index, 1);
    },
    dialogGoods(res) {
      let goodsList = [];
      res.goodsList.forEach(goods => {
        goods.selectedSku.forEach(sku => {
          goodsList.push({
            itemId: goods.itemId,
            itemName: goods.itemName,
            mainImg: goods.mainImg,
            channelType: goods.selectedChannel,
            skuId: sku.skuId,
            skuValue: sku.skuValue,
            stockNum: sku.stockNum
          });
        });
      });
      this.ladderParams.fullGiftLimitList[this.selectLadderIndex].giftInfoList = goodsList;
      this.showGoodsModal = false;
    },
    dialogGoodsCancel() {
      this.showGoodsModal = false;
    },
    saveActivity() {
      let params = this.copy(this.activityParams);
      if(!params.actType) {
        this.$message.info({message: '请选择活动类型', showClose: true });
        return
      }
      let actStrategy = {};

      // 减价,一口价
      if(params.actType === 1) {
        if(this.setStatus === 0) {
          this.$message.info({message: '请选择一种活动策略', showClose: true });
          return
        } 
        if (this.setStatus === 1) {
          if(!params.actStrategy.allPriceReduction) {
            this.$message.info({message:'请输入减价金额', showClose:true});
            return
          }
          let itemPriceReductionInfoList = [];
          actStrategy.currency = this.actCurrency;
          actStrategy.allPriceReduction = params.actStrategy.allPriceReduction;
          delete actStrategy.allOnePrice;
          params.actStrategy.itemPriceReductionInfoList.forEach(item => {
            if(item.priceReduction || item.priceReduction === 0) {
              itemPriceReductionInfoList.push({
                itemId: item.itemId,
                priceReduction: item.priceReduction
              });
            }
          });
          params.actStrategy.itemPriceReductionInfoList = itemPriceReductionInfoList;
        } else {
          let itemPriceReductionInfoList = [];
          actStrategy.allOnePrice = params.actStrategy.allOnePrice;
          delete actStrategy.allPriceReduction;
          params.actStrategy.itemPriceReductionInfoList.forEach(item => {
            if(item.allOnePrice || item.allOnePrice === 0) {
              itemPriceReductionInfoList.push({
                itemId: item.itemId,
                allOnePrice: item.allOnePrice
              });
            }
          });
          params.actStrategy.itemPriceReductionInfoList = itemPriceReductionInfoList;
        }
        params.actStrategy.currency = this.actCurrency;
        if(!params.actStrategy.currency) {
          this.$message.info({message: '请选择货币', showClose: true});
          return
        }
      }
      
      let actScope = {
        itemIdList: []
      };
      this.selected.forEach(item => {
        actScope.itemIdList.push(item.id);
      });
      params.actScope = actScope;
      if(this.toped.length>0) {
        let headItemIds = [];
        this.toped.forEach(item => {
          headItemIds.push(item.id);
        });
        params.headItemIds = headItemIds;
      }

      // 满减
      if(params.actType === 2) {
        params.actStrategy = {
          fullReductionLimitList: this.copy(this.limitRules),
          currency: this.actCurrency || ''
        };
        if(!params.actStrategy.currency) {
          this.$message.info({message: '请选择货币', showClose: true});
          return
        }
      }

      // 折扣
      if(params.actType === 3) {
        params.actStrategy = {
          discount: this.copy(this.actDiscount)
        }
        if(!params.actStrategy.discount) {
          this.$message.info({message: '请输入折扣', showClose: true});
          return
        }
      }

      // 满赠
      if(params.actType === 4) {
        let gifts = [];
        this.ladderParams.fullGiftLimitList.forEach(ladder => {
          let ladderItem = {
            limitPrice: ladder.limitPrice,
            giftInfoList: []
          };
          ladder.giftInfoList.forEach(gift => {
            ladderItem.giftInfoList.push({
              itemId: gift.itemId,
              skuId: gift.skuId,
              channelType: gift.channelType
            });
          });
          gifts.push(ladderItem);
        });
        params.actStrategy = {
          type: this.ladderParams.type,
          fullGiftLimitList: gifts,
          currency: this.actCurrency
        };
        if(!params.actStrategy.currency) {
          this.$message.info({message: '请选择货币', showClose: true});
          return
        }
      }

      // 打包
      if(params.actType === 5) {
        params.actStrategy = {
          currency: this.actCurrency,
          packingPriceList: this.copy(this.packingPriceList)
        }
        if(!params.actStrategy.currency) {
          this.$message.info({message: '请选择货币', showClose: true});
          return
        }
      }

      this.console('params:', params);
      params.actStrategy = JSON.stringify(params.actStrategy);
      params.bannerImage = JSON.stringify(params.bannerImage);
      params.actScope = JSON.stringify(params.actScope);
      if(this.id) {
        params.id = this.id;
        this.api.activity.edit(params).then((res) => {
          this.$message.success({message:res.message, showClose:true});
          this.$router.push({ name: '平台促销' });
        });
      } else {
        this.api.activity.add(params).then((res) => {
          this.$message.success({message:res.message, showClose:true});
          this.$router.push({ name: '平台促销' });
        });
      }
    }
  },
  components: {
    editor,
    Pagination,
    SelectBrand,
    SelectCategory,
    SelectShop,
    selectActGoods
  },
  watch: {
    'actCurrency': function(val) {
      this.currencyName = '';
      this.currencyList.forEach(item => {
        if(val === item.code) {
          this.currencyName = item.name;
        }
      });
    }
  }
}
</script>

<style lang="scss">
.promotion-detail{
  padding-right: 260px;
  position: relative;
  // 富文本编辑器的宽度
  min-width: 1345px!important; 
  .save-box{
    position: fixed;
    top: 55px;
    right: 15px;
    .title{
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      padding: 10px 0;
    }
    .save-inner{
      background: #fff;
      padding: 20px 20px 20px 40px;
      border-radius: 4px;
      .btn-main{
          margin-right: 20px;
      }
    }
  }
  .big-title{
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .wrap{
    background: #fff;
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    box-shadow: 0 2px 3px #E5E5E5;
    border-radius: 4px;
    .add-ladder{
      padding-bottom: 15px;
    }
    .form-wrap{
      margin-bottom: 15px;
      .form-name{
        vertical-align: top;
        line-height: 30px;
        width: 60px;
      }
      .app-name{
        margin-left: 10px;
      }
      &:last-child{
        margin-bottom: 0;
      }
      .upload-container{
        display: inline-block;
      }
    }
  }
  .info-wrap{
    .info-wrap-item{
      display: inline-block;
      vertical-align: top;
      padding-right: 20px;
      width: 550px;
    }
    .info-editor-item{
      padding-top: 10px;
    }
    .info-editor-right{
      width: calc(100% - 550px);
    }
    .info-wrap-rule{
      padding-top: 20px;
      border-top: 1px solid $border-color;
      margin-top: 20px;
      h4{
        font-weight: bold;
        padding-bottom: 15px;
      }
      .type-content{
        .rule-content{
          display: inline-block;
          vertical-align: top;
          .el-radio{
            line-height: 30px;
          }
          .rule-row{
            margin-bottom: 10px;
            .form-control{
              width: 112px;
            }
            .add-btn{
              font-size: 14px;
              color: #F06941;
              text-decoration: underline;
              margin-left: 10px;
              cursor: pointer;
            }
            &:last-child{
              margin-bottom: 0;
            }
          }
          .text{
            display: inline-block;
            vertical-align: top;
            padding: 0 10px;
            line-height: 30px;
          }
          .select-ladder{
            display: inline-block;
            vertical-align: top;
            width: 110px;
            height: 26px;
            border: 1px dashed #F06941;
            color: #F06941;
            text-align: center;
            line-height: 26px;
            margin-right: 10px;
            border-radius: 15px;
            cursor: pointer;
            margin-top: 2px;
          }
          .discount{
            width: 330px;
          }
          .spec-list {
            table {
              width: 700px;
              border-collapse: collapse;
              border-spacing: 0;
              border-radius: 4px;
              overflow: hidden;
              box-shadow: 0 0 0 1px $border-color;
              thead {
                background: #EBEFFC;
              }
              tr {
                .w300{
                  width: 300px;
                }
                .w200{
                  width: 200px;
                }
                .w100{
                  width: 100px;
                }
                th, td {
                  text-align: left;
                  line-height: 40px;
                  padding: 0 10px;
                  .form-control{
                    width: 100%;
                  }
                  .del{
                    margin-left: 10px;
                    color: $main-color;
                  }
                  img{
                    display: inline-block;
                    vertical-align: top;
                    max-width: 54px;
                    max-height: 54px;
                  }
                  .sname{
                    display: inline-block;
                    vertical-align: top;
                    width: 200px;
                    white-space: normal;
                    word-break: break-all;
                    font-size: 14px;
                    line-height: 18px;
                    padding-left: 10px;
                  }
                }
                td{
                  line-height: 18px;
                  padding: 10px;
                }
              }
            }
          }
        }
      }
    }
    .pc-item, .app-item{
      p{
        color: #333333;
        font-size: 14px;
        padding-bottom: 10px;
      }
      img{
        border-radius: 4px;
      }
    }
    .pc-item{
      img{
        max-width: 172px;
        max-height: 90px;
      }
    }
    .app-item{
      img{
        max-width: 172px;
        max-height: 60px;
      }
    }
    .form-wrap{
      .poster-img{
        display: inline-block;
        vertical-align: top;
        width: 90px;
        height: 30px;
        border: 1px dashed #F06941;
        color: #F06941;
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
        border-radius: 15px;
      }
      .long-input{
        width: 330px;
      }
      .content-textarea{
        width: 304px;
        height: 80px;
      }
      .time-mid{
        padding: 0 10px;
      }
      .el-input__inner{
        width: 160px;
        height: 30px;
      }
      .el-date-editor.el-input{
        width: 160px;
        margin-right: 10px;
      }
      .el-input__icon{
        line-height: 30px;
      }
      .selected-modal{
        display: inline-block;
        vertical-align: top;
        line-height: 30px;
        padding-right: 15px;
        font-weight: bold;
      }
    }
  }
  .act-wrap{
    padding-right: 0;
    .list-wrap{
      .btn-fill-main-shop{
        color: #3A62E1;
        border-color: #3A62E1;
      }
      .btn-small-shop{
        background: #3A62E1;
        border-color: #3A62E1;
      }
      .search-bar{
        padding: 10px 0;
        border: none;
        border-radius: 0;
        .btn-org-small, .btn-small{
          margin-left: 10px;
          a{
            color: #fff;
          }
        }
        .btn-fill-main, .btn-fill-grey-main{
          margin-left: 20px;
        }
        .form-control{
          margin-left: 20px;
        }
        .select-tab{
          display: inline-block;
          vertical-align: top;
          padding: 15px 20px;
          border-left: 1px solid $border-color;
          border-top: 1px solid $border-color;
          cursor: pointer;
          &:last-child{
            border-right: 1px solid $border-color;
          }
        }
        .active{
          border-color: $main-color;
          position: relative;
          color: $main-color;
          &::before{
            content: "";
            position: absolute;
            height: calc(100% + 1px);
            width: 1px;
            background: $main-color;
            top: -1px;
            right: -1px;
          }
          &::after{
            content: "";
            position: absolute;
            width: calc(100% + 2px);
            height: 1px;
            background: $main-color;
            bottom: -1px;
            left: -1px;
          }
        }
      }
      .select-bar{
        padding-bottom: 0;
        border-bottom: 1px solid $border-color;
        .right{
          float: right;
          padding-right: 20px;
          .text{
            color: #333333;
            font-size: 14px;
            font-weight: bold;
          }
          .btn-fill-org-main{
            margin-left: 10px;
          }
        }
      }
      .table{
        .selected{
          background: #efefef;
        }
        td{
          vertical-align: top;
          padding-top: 20px;
          line-height: 20px;
          .link{
            margin-right: 10px;
          }
          .hasSelected{
            color: #999;
          }
        }
      }
    }
  }
  .set-wrap{
    .search-bar{
      padding-left: 0;
      .form-control{
        margin: 0 10px;
      }
      .one-price{
        margin-left: 30px;
      }
    }
    .el-input{
      .el-input-group__append, .el-input-group__prepend{
        padding: 0 10px;
      }
    }
  }
}
</style>

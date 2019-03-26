<template>
    <div class="goods-detail">
        <h2 class="big-title" v-show="firstCateList.length>0">类目选择</h2>
        <div class="type-wrap" v-show="firstCateList.length>0">
            <div class="type-content-wrap" :class="{'mb15':secondCateList.length>0}">
                <div class="type-title">一级类目：</div>
                <div class="type-content border-bottom">
                    <div class="type-item" v-for="(item, index) in firstCateList" :key="index+'first'" :class="{'active':selectedCate.first===item.id}">
                        <!-- <a href="javascript:;" @click="selectCate(1, item)">{{item.name}}({{item.count}})</a> -->
                        <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(1, item)">
                            {{item.name}}
                            <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
                            <span class="item-count" v-show="item.count>99">(99+)</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="type-content-wrap" :class="{'mb15':thirdCateList.length>0}" v-show="secondCateList.length>0">
                <div class="type-title">二级类目：</div>
                <div class="type-content">
                    <div class="type-item" v-for="(item, index) in secondCateList" :key="index+'second'" :class="{'active':selectedCate.second===item.id}">
                        <!-- <a href="javascript:;" @click="selectCate(2, item)">{{item.name}}({{item.count}})</a> -->
                        <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(2, item)">
                            {{item.name}}
                            <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
                            <span class="item-count" v-show="item.count>99">(99+)</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="type-content-wrap mb15" v-show="thirdCateList.length>0">
                <div class="type-title">三级类目：</div>
                <div class="type-content">
                    <div class="type-item" v-for="(item, index) in thirdCateList" :key="index+'third'" :class="{'active':selectedCate.third===item.id}">
                        <!-- <a href="javascript:;" @click="selectCate(3, item)">{{item.name}}({{item.count}})</a> -->
                        <a href="javascript:;" class="ellipsis" :class="{'pr40':item.count>99}" @click="selectCate(3, item)">
                            {{item.name}}
                            <span class="item-count" v-show="item.count<=99">({{item.count}})</span>
                            <span class="item-count" v-show="item.count>99">(99+)</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="big-title">宝贝图片</h2>
        <div class="img-wrap">
            <div class="main-img">
                <img :src="mainImgUrl" v-show="mainImgUrl"/>
                <div class="main-img-null" v-show="!mainImgUrl">未设置</div>
                <p>商品主图</p>
            </div>
            <div class="img-item" v-for="(item, index) in goodsImages" :key="index+'img'" :class="{'img-hover':item.showBtn}" @mouseenter="item.showBtn=true" @mouseleave="item.showBtn=false">
                <img :src="item.url"/>
                <div class="set-main" v-show="item.showBtn"><a class="btn-fill-org-main" @click="setMainImg(item)">设为主图</a></div>
                <img src="~assets/goods/remove_spec.png" v-show="item.showBtn" class="remove-img" @click="removeImg(item, index)" />
            </div>
            <a href="javascript:;" class="addGoodsImg" v-show="goodsImages.length<=4">
                <upload uploadType='2' v-on:uploadSuccess="uploadSuccess">
                    <img src="~/assets/goods/addGoodsImg.png"/>
                </upload>
            </a>
            <el-popover v-show="goodsImages.length>4"
                placement="right"
                width="260"
                trigger="hover">
                <p>最多选择5张图片</p>
                <div class="noMoreGoodsImg" slot="reference">
                    <img src="~/assets/goods/addGoodsImg.png"/>
                </div>
            </el-popover>
        </div>
        <h2 class="big-title">宝贝参数</h2>
        <div class="info-wrap">
            <h2 class="info-title">基本介绍:</h2>
            <div class="info-item">
                <span class="info-item-title">商品名称</span>
                <input type="text" class="form-control" v-model="goodsParams.name" placeholder="请输入商品名称"/>
                <!-- <span class="info-item-title">品牌名称</span>
                <el-select class="el-form-control" v-model="goodsParams.brandName" filterable remote :remote-method="remoteMethod" @change="chooseBrand()">
                    <el-option
                        v-for="item in searchBrandList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select> -->
            </div>
            <div class="info-item">
                <span class="info-item-title">宝贝描述</span>
                <textarea class="form-control desc" placeholder="请输入您的宝贝描述(最多100个字符)" maxlength="100" v-model="goodsParams.desc"></textarea>
            </div>
            <div class="info-item">
                <span class="info-item-title">温馨提示</span>
                <input type="text" class="form-control" v-model="goodsParams.info"/>
            </div>
            <div class="info-item">
                <span class="info-item-title">品牌名称</span>
                <span class="selected-modal" v-show="goodsParams.brandName">{{goodsParams.brandName}}</span>
                <a class="btn-fill-main" @click="showBrandModal=true">选择品牌</a>
                <el-select class="el-form-control" v-model="goodsParams.brandName" filterable remote :remote-method="remoteMethod" @change="chooseBrand()">
                    <el-option
                        v-for="item in searchBrandList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
            </div>
            <div class="info-item">
                <span class="info-item-title">商品店铺</span>
                <span class="selected-modal" v-show="goodsParams.shopName">{{goodsParams.shopName}}</span>
                <a class="btn-fill-main" @click="showShopModal=true">选择店铺</a>
                <el-select class="el-form-control" v-model="goodsParams.shopName" filterable remote :remote-method="remoteShopMethod" @change="chooseShop()">
                    <el-option
                        v-for="item in searchShopList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
            </div>
            <div class="info-item">
                <span class="info-item-title">上架状态</span>
                <el-radio class="goods-status" v-model="goodsParams.status" :label="1">上架</el-radio>
                <el-radio class="goods-status" v-model="goodsParams.status" :label="2">下架</el-radio>
            </div>
            <div class="info-item">
                <span class="info-item-title">设为赠品</span>
                <el-radio class="goods-status" v-model="goodsParams.gift" :label="1">是</el-radio>
                <el-radio class="goods-status" v-model="goodsParams.gift" :label="0">否</el-radio>
            </div>
            <div class="info-item">
                <span class="info-item-title">预售商品</span>
                <el-radio class="goods-status" v-model="goodsParams.presell" :label="1">是</el-radio>
                <el-radio class="goods-status" v-model="goodsParams.presell" :label="0">否</el-radio>
            </div>
        </div>
        <h2 class="big-title">宝贝规格</h2>
        <div class="spec-wrap">
            <div class="name-item">
                <span>货币</span>
                <select class="form-control" v-model="goodsParams.currency">
                    <option v-for="(item, index) in currencyList" v-bind:value="item.code" :key="index+'currency'">{{item.symbol}} {{item.name}}</option>
                </select>
            </div>
            <div class="name-item" v-for="(item, index) in setSkuNameValues" :key="index+'sku'">
                <span>规格{{index+1}}</span>
                <input type="text" class="form-control name-input" placeholder="如:size" v-model="item.skuName"/>
                <input type="text" class="form-control name-input" placeholder="请输入规格值(多个用“,”分隔)" v-model="item.skuValuesStr" @keyup.enter="enterSkuValues(item, index, true)"/>
                <a class="btn-main" @click="enterSkuValues(item, index, true)">保存</a>
                <a class="btn-fill-main" @click="addSkuRow()" v-show="index===0">+ 新规格</a>
                <a href="javascript:;" class="link" v-show="index!==0" @click="removeSkuRow(index)">删除此规格</a>
            </div>
            <div class="value-item" v-for="(item, index) in goodsParams.skuNameValues" :key="index+'spec'" v-show="item.skuValues.length>0">
                <span>规格{{index+1}}可选</span>
                <div class="value-box">
                    <span v-for="(spec, specIndex) in item.skuValues" :key="specIndex" class="value-item-spec">
                        <span class="spec">
                            {{spec}}
                            <img src="~assets/goods/remove_spec.png" @click="removeSpec(item, specIndex, index)"/>
                        </span>
                        <div class="sku-img" v-if="index===0">
                            <upload uploadType='2' v-on:uploadSuccess="uploadSKUSuccess" :index="specIndex" v-show="!goodsParams.firstSpecImages[specIndex]">
                                <a class="btn-fill-org-main">添加图片</a>
                            </upload>
                            <img :src="goodsParams.firstSpecImages[specIndex]" class="imageUrl" v-show="goodsParams.firstSpecImages[specIndex]" />
                            <upload uploadType='2' v-on:uploadSuccess="uploadSKUSuccess" :index="specIndex" v-show="goodsParams.firstSpecImages[specIndex]">
                                <a class="link">更换</a>
                            </upload>
                            <a class="link del-spec-img" v-show="goodsParams.firstSpecImages[specIndex]" @click="removeSpecImg(specIndex)">删除</a>
                        </div>
                    </span>
                </div>
            </div>
            <div>
                <a class="btn-fill-main" @click="openMixModal()" v-show="false">添加组合装</a>
                <span class="set-sku-weight">
                    <span class="text">添加重量</span>
                    <input type="text" class="form-control" v-model="batchWeight" />
                    <span class="kg">KG</span>
                    <a href="javascript:;" class="btn-main" @click="batchSetWeight">添加</a>
                </span>
            </div>
            <div class="spec-list">
                <table>
                    <thead>
                    <tr>
                        <th>规格</th>
                        <th>UPC</th>
                        <th>重量(kg)</th>
                        <th>原价</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in goodsParams.skuList" :key="index" @click="selectSKU(item)" :class="{'selectedTr':selectedSKUName===item.displayName}">
                        <td>{{item.displayName}}</td>
                        <td>
                            <input type="text" class="form-control" v-model="item.upc" v-show="!item.groupSkuValue" @click.stop />
                        </td>
                        <td>
                            <input type="text" class="form-control" v-model="item.weight" @click.stop />
                        </td>
                        <td>
                            <input type="text" class="form-control" v-model="item.originalPrice" @click.stop />
                        </td>
                        <td>
                            <a href="javascript:;" class="link" @click.stop="btnSelectSKU(item)" v-show="!userConfig.singleChannel">渠道设置</a>
                            <a href="javascript:;" class="link" @click.stop="btnSetPrice(item)" v-show="userConfig.singleChannel">价格设置</a>
                            <a href="javascript:;" class="del" @click.stop="delRow(index)">删除</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <h2 class="big-title" v-show="selectedSKUName">{{userConfig.singleChannel?'价格':'渠道'}}设置</h2>
        <div class="channel-wrap" v-for="(sku, sku_index) in goodsParams.skuList" :key="sku_index+'sku'" v-show="selectedSKUName===sku.displayName">
            <div class="channel-item" v-for="(item, index) in sku.skuChannels" :key="index+'channel'">
                <div class="channel-title">
                    <span v-show="!userConfig.singleChannel">{{item.channelTypeName}}</span>
                    <span v-show="userConfig.singleChannel">价格设置</span>
                    <a class="link" @click="removeSkuChannel(sku, item)" v-show="!userConfig.singleChannel">删除此渠道</a>
                </div>
                <div class="price">
                    <span>页面价</span>
                    <input type="text" class="form-control" placeholder="单行输入" v-model="item.price"/>
                </div>
                <div class="price">
                    <span>运费模板</span>
                    <select class="form-control" v-model="item.expressFeeTemplateId" :class="{'unset-select':!item.expressFeeTemplateId}">
                        <option value="">请选择运费模板</option>
                        <option v-for="temp in expressTempList" :key="temp.id" :value="temp.id">{{temp.templateName}}</option>
                    </select>
                </div>
                <div class="supplier">
                    <p>供应商</p>
                    <div class="supplier-item" v-for="(sup, sup_index) in item.supplierList" :key="sup_index+'sup'">
                        <span>{{sup.supplierName}}:</span>
                        <span>渠道价</span>
                        <input type="text" class="form-control supplier-input" v-model="sup.channelPrice"/>
                        <span>库存</span>
                        <input type="text" class="form-control supplier-input" v-model="sup.stock"/>
                        <!-- <span>运费模板</span>
                        <select type="text" class="form-control supplier-select" v-model="sup.expressFeeTemplateId">
                            <option v-for="(opt, opt_index) in sup.expressFeeTemplates" :key="opt_index+'opt'" v-bind:value="opt.id">{{opt.templateName}}</option>
                        </select> -->
                    </div>
                </div>
            </div>
        </div>
        <h2 class="big-title">图文详情</h2>
        <div class="editor-wrap">
            <editor v-model="goodsParams.richDesc"></editor>
        </div>
        <div class="save-box">
            <h2 class="title">操作</h2>
            <div class="save-inner">
                <a href="javascript:;" class="btn-main" @click="saveGoods()">保存</a>
                <router-link :to="{ name: '商品管理'}" class="btn-fill-main">返回</router-link>
            </div>
        </div>

        <selectShop v-if="showShopModal" v-on:dialogShop="dialogShop" v-on:dialogShopCancel="dialogShopCancel" :multiply="false"></selectShop>
        <SelectBrand v-if="showBrandModal" v-on:dialogBrand="dialogBrand" v-on:dialogBrandCancel="dialogBrandCancel" :multiply="false"></SelectBrand>
        <el-dialog title="添加组合装:" :visible.sync="addShow" width="840px">
            <div class="dialog-form">
                <div class="modal-item" v-for="(item, index) in modalSkuValues" :key="index+'sku'">
                    <span>规格{{index+1}}可选</span>
                    <div class="item-content">
                        <span class="spec-item" v-for="(val, val_index) in item.skuValues" :key="val_index+'val'" @click="selectMixItem(item, val)" :class="{'spec_active':item.activeSpec===val}">{{val}}</span>
                    </div>
                </div>
                <div class="modal-item current-mix-box">
                    <span>当前已选</span>
                    <div class="item-content" v-show="modalSkuValues.length>0">
                        <span class="current-mix" v-for="(item, index) in modalSkuValues" :key="index+'cur'">
                            {{item.activeSpec}}
                            <span v-show="index != modalSkuValues.length-1">+</span>
                        </span>
                        <a href="javascript:;" class="btn-fill-main" @click="appendMix()">添加</a>
                    </div>
                </div>
                <div class="set-current">
                    <input type="text" class="form-control set-name" placeholder="请输入组合名称" v-model="modalParams.groupSkuValue"/>
                    <span class="colon" v-show="mixedList.length>0">:</span>
                    <div class="conected-spec" v-for="(item, index) in mixedList" :key="index+'mix'">
                        <span class="conected-spec-name">
                            {{item.mixedName}}
                            <img src="~assets/goods/remove_mix_spec.png"/>
                        </span>
                        <span class="conected-spec-count">
                            <span class="count">{{item.quantity}}</span>
                            <span class="set-count">
                                <span class="add-count" @click="setQuantity(1, item)"></span>
                                <span class="reduce-count" @click="setQuantity(2, item)"></span>
                            </span>
                        </span>
                        <span class="colon" v-if="index<mixedList.length-1">
                            <img src="~assets/goods/connect.png"/>
                        </span>
                    </div>
                </div>
                <div class="modal-item modal-item-bot">
                    <span>重量</span>
                    <input type="text" class="form-control" placeholder="请输入组合重量" v-model="modalParams.weight"/>
                </div>
                <div class="modal-item modal-item-bot">
                    <span>原价</span>
                    <input type="text" class="form-control" placeholder="请输入原价" v-model="modalParams.originalPrice"/>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="btn-main" @click="saveModal()">保存</button>
                <button class="btn-fill-grey-main" @click="addShow = false">取消</button>
            </span>
        </el-dialog>

        <el-dialog title="渠道设置:" :visible.sync="showChannelModal" width="840px">
            <div class="dialog-form channel-dialog">
                <div class="search-item selected－brand">
                    <span class="title">已选渠道：</span>
                    <span class="selected-item" v-for="(item, index) in selectedChannelList" :key="index+'selected'">
                        {{item.channelTypeName}}
                        <a href="javascript:;" @click="removeChannel(index)">X</a>
                    </span>
                </div>
                <div class="search-item selected-box">
                    <span class="brand-item" v-for="item in channelList" :key="item.channelType">
                        <a class="link" @click="selectChannel(item)">{{item.channelTypeName}}</a>
                    </span>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <button class="btn-main" @click="saveChannelModal()">保存</button>
                <button class="btn-fill-grey-main" @click="showChannelModal = false">取消</button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import selectShop from '@/components/selectShop/index.vue';
    import selectBrand from '@/components/selectBrand/index.vue';
    import editor from '@/components/tinymce/tinymce.vue';
    export default {
        data() {
            return {
                id: '',
                isShelves: true,
                showShopModal: false,   // 选择店铺弹窗
                showBrandModal: false,  // 选择品牌弹窗
                addShow: false,     // 组合装弹窗
                showChannelModal: false,    // 渠道设置弹窗
                detailLoaded: false,
                selectedChannelList: [],
                selectedSKUName: '',
                selectedSKUItem: {},
                categoryTree: [],
                mainImgUrl: '',
                firstCateList: [],
                secondCateList: [],
                thirdCateList: [],
                searchBrandList: [],
                searchShopList: [],
                selectedCate: {
                    first: '',
                    second: '',
                    third: ''
                },
                batchWeight: '',
                currencyList: [],
                channelList: [],
                expressTempList: [],
                setSkuNameValues: [
                    {
                        skuName: '',
                        skuValuesStr: ''
                    }
                ],
                goodsImages: [],
                goodsParams: {
                    status: 1,
                    gift:0,
                    presell:0,
                    currency: '',
                    richDesc: '',
                    categoryId: '',
                    brandId: '',
                    brandName: '',
                    shopId: '',
                    shopName: '',
                    firstSpecImages: [],
                    addImages: [],
                    delImageIds: [],
                    skuNameValues: [],
                    skuList: []
                },
                modalSkuValues: [],
                mixedList: [],
                modalParams: {},
                currentModal: []
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                // 获取商品id
                this.id = this.$route.params.id || '';
                // 获取货币列表
                this.api.common.currency({}).then((res) => {
                    this.currencyList = res.data;
                    this.goodsParams.currency = this.currencyList[0].code;
                });
                // 获取渠道列表
                this.api.goods.channel({}).then((res) => {
                    this.channelList = res.data;
                    this.channelList.forEach(item => {
                        item.expressFeeTemplateId = '';
                        item.price = '';
                        if(item.supplierList && item.supplierList.length>0) {
                            item.supplierList.forEach(sup => {
                                sup.channelPrice = '';
                                sup.stock = '';
                            });
                        }
                    });
                    if(this.userConfig.singleChannel) {
                        let temp = this.channelList[0];
                        this.channelList = [];
                        if(temp) {
                            this.channelList.push(temp);
                        }
                    }
                    if(this.id){
                        // 获取商品详情
                        this.getDetail();
                    }
                });
                // 获取一级类目
                this.getCate(0, '');
                if(!this.id) {
                    this.remoteMethod('');
                    this.remoteShopMethod('');
                }
                // 获取所有类目 
                this.api.category.tree({hasCount: true}).then((res) => {
                    this.categoryTree = res.data;
                });
                // 获取运费模板列表
                this.api.feetemplate.allTemp({}).then((res) => {
                    this.expressTempList = res.data;
                });
            },
            getCate(level, id) {
                let pId = id ? id : 0;
                this.api.category.categoryNode({parentId:pId}).then((res) => {
                    if(level===0){
                        this.firstCateList = res.data;
                        this.secondCateList = [];
                        this.thirdCateList = [];
                    } else if (level===1){
                        this.secondCateList = res.data;
                        this.thirdCateList = [];
                    }else{
                        this.thirdCateList = res.data;
                    }
                });
            },
            removeSkuChannel(sku, item) {
                this.$msgbox({
                    title: '',
                    message: '确认删除该渠道？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(action => {
                    if(action === 'confirm') {
                        let potision = '';
                        sku.skuChannels.forEach((i, index) => {
                            if(i.channelType === item.channelType) {
                                potision = index;
                            }
                        });
                        if(potision) {
                            sku.skuChannels.splice(potision, 1);
                        }
                    }
                });
            },
            uploadSuccess(res) {
                this.goodsParams.addImages.push({
                    url: res.data,
                    type: 0,
                    showBtn: false
                });
                this.goodsImages.push({
                    url: res.data,
                    type: 0,
                    showBtn: false
                });
            },
            uploadSKUSuccess(res) {
                this.$set(this.goodsParams.firstSpecImages, res.index, res.data);
            },
            removeSpecImg(index) {
                this.$set(this.goodsParams.firstSpecImages, index, '');
            },
            selectCate(type, item) {
                if(type === 1){
                    if(this.selectedCate.first !== item.id){
                        this.getCate(1, item.id);
                        this.selectedCate.first = item.id;
                        this.selectedCate.second = '';
                        this.selectedCate.third = '';
                    }
                } else if (type === 2){
                    if(this.selectedCate.second !== item.id){
                        this.getCate(2, item.id);
                        this.selectedCate.second = item.id;
                        this.selectedCate.third = '';
                    }
                }else{
                    this.selectedCate.third = item.id;
                }
            },
            enterSkuValues(item, index, create) {
                if(!item.skuName || !item.skuValuesStr){
                    return
                }
                let targetList = [];
                let list = item.skuValuesStr.split(',');
                list.forEach((item) => {
                    if(item && targetList.indexOf(item) === -1) {
                        targetList.push(item);
                    }
                });
                this.$set(this.goodsParams.skuNameValues, index, {
                    skuName: item.skuName,
                    skuValues: targetList
                });
                if(create){
                    this.createSKU();
                }
            },
            createSKU() {
                let list = [];   // 计算若干个规格相叠加
                let tempList = [];  // 生成新skuList前将之前的skuList存起来
                let mixList = [];   // 若旧skuList中有组合规格则将其存起来
                this.goodsParams.skuNameValues.forEach((item) => {
                    list.push(item.skuValues);
                });
                if(this.goodsParams.skuList.length>0){
                    tempList = this.copy(this.goodsParams.skuList);
                }
                this.goodsParams.skuList = [];
                this.doExchange(list).forEach((item) => {
                    let skuItem = item.split('+');
                    let skuItemValues = [];
                    skuItem.forEach((sku, sku_index) => {
                        skuItemValues.push({skuName:this.goodsParams.skuNameValues[sku_index].skuName, skuValue:sku});
                    });
                    this.goodsParams.skuList.push({
                        displayName:item,
                        upc:'',
                        skuValues:skuItemValues,
                        originalPrice:'',
                        weight:'',
                        skuChannels:[]
                    });
                });
                if(tempList.length>0){
                    tempList.forEach((item) => {
                        if(item.groupSkuValue){
                            mixList.push(item);
                        }
                        this.goodsParams.skuList.forEach((s) => {
                            if(s.displayName === item.displayName){
                                s.upc = item.upc,
                                s.originalPrice = item.originalPrice,
                                s.weight = item.weight,
                                s.skuChannels = item.skuChannels
                            }
                        });
                    });
                }
                if(mixList.length>0){
                    var remain = [];
                    this.goodsParams.skuList.forEach((item) => {
                        remain.push(item.displayName);
                    });
                    mixList.forEach((item) => {
                        if(remain.indexOf(item.displayName) == -1){
                            this.goodsParams.skuList.push(item);
                        }
                    });
                }
            },
            doExchange(arr){
                let len = arr.length;
                // 当数组大于等于2个的时候
                if(len >= 2){
                    // 第一个数组的长度
                    let len1 = arr[0].length;
                    // 第二个数组的长度
                    let len2 = arr[1].length;
                    // 2个数组产生的组合数
                    let lenBoth = len1 * len2;
                    //  申明一个新数组,做数据暂存
                    let items = new Array(lenBoth);
                    // 申明新数组的索引
                    let index = 0;
                    // 2层嵌套循环,将组合放到新数组中
                    for(let i=0; i<len1; i++){
                        for(let j=0; j<len2; j++){
                            items[index] = arr[0][i] +"+"+ arr[1][j];
                            index++;
                        }
                    }
                    // 将新组合的数组并到原数组中
                    let newArr = new Array(len -1);
                    for(let i=2;i<arr.length;i++){
                        newArr[i-1] = arr[i];
                    }
                    newArr[0] = items;
                    // 执行回调
                    return this.doExchange(newArr);
                }else{
                    return arr[0];
                }
            },
            selectSKU(item) {
                if(this.selectedSKUName === item.displayName){
                    this.selectedSKUName = '';
                }else{
                    this.selectedSKUName = item.displayName;
                }
            },
            chooseBrand() {
                this.searchBrandList.forEach((item) => {
                    if(item.name === this.goodsParams.brandName) {
                        this.goodsParams.brandId = item.id;
                    }
                });
            },
            chooseShop() {
                this.searchShopList.forEach((item) => {
                    if(item.name === this.goodsParams.shopName) {
                        this.goodsParams.shopId = item.id;
                    }
                });
            },
            delRow(index) {
                this.goodsParams.skuList.splice(index, 1);
            },
            addSkuRow() {
                let item = {
                    skuName: '',
                    skuValuesStr: ''
                };
                this.setSkuNameValues.push(item);
            },
            removeSpec(item, specIndex, index) {
                item.skuValues.splice(specIndex, 1);
                if(!item.skuValues.length) {
                    this.goodsParams.skuNameValues.splice(index, 1);
                }
                this.createSKU();
            },
            removeSkuRow(index) {
                this.setSkuNameValues.splice(index, 1);
                this.goodsParams.skuNameValues.splice(index, 1);
                this.createSKU();
            },
            removeImg(item, index) {
                if(this.mainImgUrl === item.url){
                    this.mainImgUrl = '';
                }
                if(this.id){
                    this.goodsParams.delImageIds.push(item.id);
                }
                this.goodsImages.splice(index, 1);
            },
            openMixModal() {
                if(this.goodsParams.skuNameValues.length===0){
                    this.$message.warning({message:'请添加至少一个规格', showClose:true});
                    return
                }
                this.modalSkuValues = [];
                this.modalSkuValues = this.copy(this.goodsParams.skuNameValues);
                this.modalSkuValues.forEach((item) => {
                    this.$set(item, 'currentSpec', {
                        skuName: '',
                        skuValue: ''
                    });
                    this.$set(item, 'activeSpec', '');
                });
                this.mixedList = [];
                this.modalParams = {};
                this.addShow = true;
            },
            selectMixItem(item, val) {
                item.currentSpec = {
                    skuName: item.skuName,
                    skuValue: val
                }
                item.activeSpec = val;
            },
            batchSetWeight() {
                if(this.goodsParams.skuList.length===0){
                    this.$message.info({message:'请先新增一个规格', showClose:true});
                } else if (!this.batchWeight) {
                    this.$message.info({message:'请输入批量更改的重量', showClose:true});
                } else {
                    this.goodsParams.skuList.forEach((item) => {
                        item.weight = this.batchWeight;
                    });
                }
            },
            appendMix() {
                let targetValues = [];
                let mixName = '';
                this.modalSkuValues.forEach((item) => {
                    targetValues.push(item.currentSpec);
                    mixName += item.activeSpec + '+';
                });
                mixName = mixName.substring(0, mixName.length-1);
                let item = {
                    mixedName:mixName,
                    skuValues:targetValues,
                    quantity:1
                };
                this.mixedList.push(item);
            },
            setMainImg(item) {
                this.goodsImages.forEach((img) => {
                    img.type = 0;
                });
                item.type = 1;
                this.mainImgUrl = item.url;
            },
            setQuantity(type, item) {
                if(type === 1){
                    item.quantity += 1;
                }else{
                    if(item.quantity === 1){
                        this.$message.warning({message:'数量不能少于1', showClose:true});
                        return
                    }else{
                        item.quantity -= 1;
                    }
                }
            },
            dialogShop(res) {
                this.goodsParams.shopId = res.shopList[0].id;
                this.goodsParams.shopName = res.shopList[0].name;
                this.showShopModal = false;
            },
            dialogShopCancel() {
                this.showShopModal = false;
            },
            dialogBrand(res) {
                this.goodsParams.brandId = res.brandList[0].id;
                this.goodsParams.brandName = res.brandList[0].name;
                this.showBrandModal = false;
            },
            dialogBrandCancel() {
                this.showBrandModal = false;
            },
            getDetail() {
                this.detailLoaded = true;
                this.api.goods.detail({id: this.id}).then((res) => {
                    let detail = res.data;
                    this.goodsParams.name = detail.name;
                    this.goodsParams.brandId = detail.brandId;
                    this.goodsParams.brandName = detail.brandName;
                    this.goodsParams.shopId = detail.shopId;
                    this.goodsParams.shopName = detail.shopName;
                    this.goodsParams.desc = detail.desc;
                    this.goodsParams.info = detail.info;
                    this.goodsParams.status = detail.status;
                    this.goodsParams.richDesc = detail.richDesc;
                    this.goodsParams.currency = detail.currency;
                    this.goodsParams.firstSpecImages = detail.skuNameValues[0];
                    this.setSkuNameValues = [];
                    // 获取类目信息并展示
                    setTimeout(() => {
                        this.categoryTree.forEach(first => {
                            if(first.id === detail.cateId1) {
                                this.selectedCate.first = detail.cateId1;
                                this.secondCateList = first.children || [];
                                if(this.secondCateList && this.secondCateList.length>0) {
                                    this.secondCateList.forEach(second => {
                                        if(second.id === detail.cateId2) {
                                            this.selectedCate.second = second.id;
                                            this.thirdCateList = second.children;
                                            this.thirdCateList.forEach(third => {
                                                if(third.id === detail.cateId3) {
                                                    this.selectedCate.third = third.id;
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    });
                    if(detail.imageList) {
                        detail.imageList.forEach((item) => {
                            item.showBtn = false;
                            if(item.type === 1){
                                this.mainImgUrl = item.url;
                            }
                        });
                    } else {
                        this.mainImgUrl = ''
                    }
                    this.goodsImages = detail.imageList || [];
                    detail.skuNameValues.forEach((item) => {
                        this.setSkuNameValues.push({
                            skuName: item.skuName,
                            skuValuesStr: item.skuValues.join(',')
                        });
                    });
                    this.goodsParams.firstSpecImages = [];
                    if(detail.skuNameValues && detail.skuNameValues[0].skuValueImages) {
                        this.goodsParams.firstSpecImages.length = detail.skuNameValues[0].skuValues.length;
                        if(detail.skuNameValues[0].skuValueImages) {
                            detail.skuNameValues[0].skuValueImages.forEach((item) => {
                                this.goodsParams.firstSpecImages.push(item.imageUrl);
                            });
                        } else {
                            detail.skuNameValues[0].skuValues.forEach(() => {
                                this.goodsParams.firstSpecImages.push('');
                            })
                        }
                    }
                    this.setSkuNameValues.forEach((item, index) => {
                        this.enterSkuValues(item, index, false);
                    });
                    detail.skuList.forEach((item) => {
                        let obj = {
                            skuChannels:this.copy(this.channelList)
                        };
                        obj.id = item.id;
                        obj.upc = item.upc;
                        obj.weight = item.weight;
                        obj.skuValues = item.skuValues;
                        obj.originalPrice = item.originalPrice;
                        if(item.skuChannels){
                            obj.skuChannels.forEach((i) => {
                                item.skuChannels.forEach((j) => {
                                    if(i.channelType == j.channelType) {
                                        i.price = j.price;
                                        i.expressFeeTemplateId = j.expressFeeTemplateId || '';
                                        i.supplierList.forEach((x) => {
                                            j.supplierStocks.forEach((y) => {
                                                if(x.id === y.supplierId) {
                                                    x.supplierName = y.supplierName;
                                                    x.channelPrice = y.channelPrice;
                                                    x.stock = y.stock;
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                            // 去除返回值中没有的渠道
                            let uniqueChannel = [];
                            item.skuChannels.forEach(z => {
                                obj.skuChannels.forEach(g => {
                                    if(z.channelType === g.channelType){
                                        uniqueChannel.push(g);
                                    }
                                });
                            });
                            obj.skuChannels = uniqueChannel;
                        }
                        if(!item.group){
                            let dName = '';
                            item.skuValues.forEach((sku) => {
                                dName += sku.skuValue+'+';
                            });
                            dName = dName.substring(0, dName.length-1);
                            obj.displayName = dName;
                        } else {
                            let dName = '［' + item.groupSkuValue + '］';
                            item.skuGroup.forEach((group) => {
                                dName += '(';
                                group.skuValues.forEach((sku) => {
                                    dName += sku.skuValue +'+';
                                });
                                dName = dName.substring(0, dName.length-1)+')*'+group.quantity+'+';
                            });
                            dName = dName.substring(0, dName.length-1);
                            obj.displayName = dName;
                            obj.groupSkuValue = item.groupSkuValue;
                        }
                        this.goodsParams.skuList.push(obj);
                    });
                });
            },
            saveGoods() {
                this.goodsParams.categoryId = this.selectedCate.third || this.selectedCate.second || this.selectedCate.first || '';
                let params = this.copy(this.goodsParams);
                this.goodsImages.forEach(img => {
                    if(img.type == 1) {
                        if(img.id) {
                            params.addImages.push(img);
                            params.delImageIds.push(img.id);
                        } else {
                            params.addImages.forEach(i => {
                                if(i.url == img.url) {
                                    i.type = 1;
                                }
                            })
                        }
                    }
                });
                params.skuList.forEach((item) => {
                    item.skuChannels.forEach((sku) => {
                        sku.supplierStocks = this.copy(sku.supplierList);
                        delete sku.supplierList;
                        delete sku.channelTypeName;
                        sku.supplierStocks.forEach((sup) => {
                            sup.supplierId = sup.id;
                            delete sup.id;
                            delete sup.supplierName;
                            delete sup.expressFeeTemplates;
                        });
                    });
                });
                if(!params.skuNameValues.length){
                    this.$message.warning({message:'请输入规格', showClose:true});
                    return;
                }
                let firstSpecImages = [];
                params.firstSpecImages.forEach((item, index) => {
                    firstSpecImages.push({
                        skuValue: params.skuNameValues[0].skuValues[index],
                        imageUrl: item || ''
                    });
                });
                params.skuNameValues[0].skuValueImages = [];
                firstSpecImages.forEach((item) => {
                    if(item.skuValue) {
                        params.skuNameValues[0].skuValueImages.push(item);
                    }
                });
                delete params.firstSpecImages;
                params.addImages = JSON.stringify(params.addImages);
                params.skuNameValues = JSON.stringify(params.skuNameValues);
                params.skuList = JSON.stringify(params.skuList);
                this.console(params);
                let formData = {};
                for(let index in params){
                    if(params[index]!==''){
                        formData[index] = params[index];
                    }
                }
                if(this.id) {
                    formData.id = this.id;
                    if(params.delImageIds.length){
                        formData.delImageIds = JSON.stringify(params.delImageIds);
                    }
                    this.api.goods.update(formData).then((res) => {
                        this.$message.success({message:res.message, showClose:true});
                        this.$router.push({ name: '商品管理' });
                    });
                } else {
                    this.api.goods.add(formData).then((res) => {
                        this.$message.success({message:res.message, showClose:true});
                        this.$router.push({ name: '商品管理' });
                    });
                }
            },
            btnSelectSKU(item){
                this.selectedSKUName = '';
                this.selectedChannelList = [];
                this.selectedSKUItem = item;
                if(item.skuChannels && item.skuChannels.length>0) {
                    item.skuChannels.forEach(channel => {
                        this.selectedChannelList.push(channel);
                    });
                }
                this.showChannelModal = true;
            },
            btnSetPrice(item) {
                this.selectedSKUName = item.displayName;
                if(item.skuChannels && item.skuChannels.length>0) {
                    return
                }
                this.$set(item, 'skuChannels', this.copy(this.channelList));
            },
            removeChannel(index) {
                this.selectedChannelList.splice(index, 1);
            },
            selectChannel(item) {
                if(this.selectedChannelList.length>0){
                    let exist = false;
                    this.selectedChannelList.forEach((channel) => {
                        if(channel.channelType === item.channelType){
                            exist = true;
                        }
                    });
                    if(!exist){
                        this.selectedChannelList.push(item);
                    }
                } else {
                    this.selectedChannelList.push(item);
                }
            },
            saveChannelModal() {
                // this.console(this.selectedChannelList);
                // this.console(this.selectedSKUItem);
                this.selectedSKUItem.skuChannels = this.copy(this.selectedChannelList);
                this.selectedSKUName = this.copy(this.selectedSKUItem.displayName);
                this.showChannelModal = false;
            },
            saveModal() {
                let displayName = '［'+this.modalParams.groupSkuValue+'］';
                this.mixedList.forEach((item) => {
                    displayName += '('+item.mixedName+')*'+item.quantity+'+';
                });
                displayName = displayName.substring(0, displayName.length-1);
                let mixItem = {
                    displayName: displayName,
                    originalPrice: this.modalParams.originalPrice,
                    groupSkuValue: this.modalParams.groupSkuValue,
                    weight:this.modalParams.weight,
                    skuGroup:this.mixedList,
                    skuChannels:this.copy(this.channelList)
                };
                this.goodsParams.skuList.push(mixItem);
                this.addShow = false;
            },
            remoteMethod(query) {
                this.api.brand.list({name: query}).then((res) => {
                    this.searchBrandList = res.data.dataList;
                });
            },
            remoteShopMethod(query) {
                this.api.store.allShop({name: query}).then((res) => {
                    this.searchShopList = res.data;
                });
            }
        },
        watch: {
            
        },
        components: {
            'editor': editor,
            'selectShop': selectShop,
            'SelectBrand': selectBrand
        }
    }
</script>
<style lang='scss'>
    .goods-detail {
        padding-right: 260px;
        padding-bottom: 50px;
        position: relative;
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
        .big-title {
            color: #333333;
            font-size: 14px;
            font-weight: bold;
            padding-bottom: 10px;
        }
        .type-wrap {
            margin-bottom: 20px;
            padding: 10px 0 10px 20px;
            background: $white-color;
            box-shadow: 0 2px 3px $border-color;
            border-radius: 4px;
            .mb15{
                margin-bottom: 15px;
            }
            .type-content-wrap {
                display: flex;
                &:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: 0;
                }
                .type-title {
                    width: 110px;
                    font-weight: 600;
                    line-height: 30px;
                }
                .type-content {
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    flex: 1;
                    .type-item{
                        min-width: 80px;
                        line-height: 30px;
                        border-radius: 15px;
                        margin-right: 10px;
                        .ellipsis{
                            padding-right: 30px;
                            width: auto;
                            max-width: 100%;
                            position: relative;
                            .item-count{
                                position: absolute;
                                right: 5px;
                                top: 0;
                            }
                        }
                        .pr40{
                            padding-right: 40px;
                        }
                        a{
                            display: inline-block;
                            vertical-align: top;
                            color: #333;
                            height: 28px;
                            line-height: 28px;
                            padding: 0 8px;
                            border-radius: 28px;
                            border: 1px solid #fff;
                        }
                    }
                    .active{
                        a{
                            border:1px solid rgba($color: $main-color, $alpha: 0.6);
                            color:$main-color;
                        }
                    }
                }
            }
        }
        .img-wrap {
            margin-bottom: 20px;
            padding: 20px;
            background: $white-color;
            box-shadow: 0 2px 3px $border-color;
            border-radius: 4px;
            .main-img {
                display: inline-block;
                vertical-align: top;
                padding-right: 30px;
                width: 130px;
                height: 130px;
                margin-right: 30px;
                position: relative;
                &::after {
                    content: '';
                    position: absolute;
                    width: 1px;
                    height: 100px;
                    right: 0;
                    top: 0;
                    background: $border-color;
                }
                img {
                    height: 100px;
                    width: 100px;
                }
                p {
                    width: 100px;
                    text-align: center;
                    color: #333333;
                    font-size: 12px;
                    padding-top: 13px;
                    left: 0;
                    bottom: -30px;
                }
                .main-img-null{
                    line-height: 100px;
                    text-align: center;
                }
            }
            .img-item {
                display: inline-block;
                vertical-align: top;
                width: 100px;
                height: 132px;
                margin-right: 20px;
                position: relative;
                img {
                    height: 100px;
                    width: 100px;
                }
                .remove-img{
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 20px;
                    right: -10px;
                    top: -10px;
                    cursor: pointer;
                    border: none;
                }
                .set-main {
                    width: 100px;
                    text-align: center;
                    .btn-fill-org-main {
                        display: inline-block;
                        height: 22px;
                        line-height: 22px;
                        margin-top: 10px;
                        cursor: pointer;
                    }
                }
            }
            .img-hover{
                img{
                    border: 1px solid #F06941;
                }
            }
            .addGoodsImg {
                display: inline-block;
                vertical-align: top;
                width: 100px;
                height: 100px;
                text-align: center;
                border: 1px dashed $border-color;
                cursor: pointer;
                .upload-container{
                    height: 100%;
                    .image-uploader{
                        height: 100%;
                        .el-upload{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                img {
                    margin-top: 40px;
                }
            }
            .noMoreGoodsImg{
                display: inline-block;
                vertical-align: top;
                width: 100px;
                height: 100px;
                text-align: center;
                border: 1px dashed $border-color;
                background: #efefef;
                img {
                    margin-top: 40px;
                }
            }
        }
        .info-wrap {
            margin-bottom: 20px;
            padding: 20px;
            background: $white-color;
            box-shadow: 0 2px 3px $border-color;
            border-radius: 4px;
            .info-title {
                color: #333333;
                font-size: 14px;
                padding-left: 8px;
                font-weight: bold;
                padding-bottom: 15px;
                position: relative;
                &::before {
                    content: '';
                    position: absolute;
                    width: 3px;
                    height: 13px;
                    background: $org-color;
                    left: 0;
                    top: 0;
                }
            }
            .info-item {
                padding-bottom: 15px;
                position: relative;
                .info-item-title {
                    display: inline-block;
                    vertical-align: top;
                    width: 108px;
                    text-align: right;
                    color: #333333;
                    font-size: 14px;
                    padding-right: 10px;
                    line-height: 30px;
                }
                .selected-modal{
                    display: inline-block;
                    vertical-align: top;
                    line-height: 30px;
                    padding-right: 15px;
                    font-weight: bold;
                }
                .form-control {
                    display: inline-block;
                    vertical-align: top;
                    width: 320px;
                }
                .el-form-control{
                    height: 30px;
                    width: 320px;
                    .el-input{
                        height: 30px;
                        .el-input__inner{
                            height: 30px;
                        }
                    }
                }
                .desc {
                    width: 722px;
                    height: 78px;
                    resize: none;
                }
                .shelves-name {
                    width: 38px;
                    padding-right: 0;
                    margin-right: 20px;
                    cursor: pointer;
                }
                .shelves {
                    display: inline-block;
                    vertical-align: top;
                    width: 12px;
                    height: 12px;
                    margin-top: 7px;
                    background: $org-color;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .un-shelves {
                    display: inline-block;
                    vertical-align: top;
                    width: 12px;
                    height: 12px;
                    margin-top: 7px;
                    background: #fff;
                    border: 1px solid #979797;
                    border-radius: 12px;
                    cursor: pointer;
                }
                .goods-status{
                    line-height: 30px;
                }
                .brand-box{
                    position: absolute;
                    background: #fff;
                    padding: 5px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px $border-color;
                    z-index: 5;
                    left: 535px;
                    top: 35px;
                    width: 300px;
                    max-height: 200px;
                    overflow: auto;
                    .brand-item{
                        padding: 5px;
                        font-size: 14px;
                        line-height: 16px;
                        cursor: pointer;
                        &:hover{
                            background: #f7f7f7;
                        }
                    }
                }
                .el-form-control{
                    height: 30px;
                    width: 200px;
                    margin-left: 20px;
                    .el-input{
                        height: 30px;
                        .el-input__inner{
                            height: 30px;
                        }
                    }
                }
            }
        }
        .spec-wrap {
            margin-bottom: 20px;
            padding: 20px 20px 25px;
            background: $white-color;
            box-shadow: 0 2px 3px $border-color;
            border-radius: 4px;
            .name-item {
                padding-bottom: 20px;
                span {
                    display: inline-block;
                    vertical-align: top;
                    width: 78px;
                    text-align: left;
                    color: #333333;
                    font-size: 14px;
                    line-height: 30px;
                }
                .link{
                    line-height: 30px;
                    padding-left: 8px;
                }
                .form-control {
                    display: inline-block;
                    vertical-align: top;
                }
                .name-input {
                    width: 300px;
                    margin-right: 20px;
                }
                .btn-main{
                    margin-right: 20px;
                }
                .btn-fill-main {
                    height: 30px;
                    cursor: pointer;
                }
            }
            .value-item {
                padding-bottom: 20px;
                span {
                    display: inline-block;
                    vertical-align: top;
                    width: 78px;
                    text-align: left;
                    color: #333333;
                    font-size: 14px;
                    line-height: 30px;
                }
                .value-box {
                    display: inline-block;
                    vertical-align: top;
                    white-space: normal;
                    width: 730px;
                    .value-item-spec{
                        width: unset;
                        margin-right: 15px;
                        .spec{
                            width: unset;
                            height: 30px;
                            line-height: 30px;
                            color: #333333;
                            border: 1px dashed $border-color;
                            padding: 0 20px;
                            margin-right: 10px;
                            position: relative;
                            img {
                                position: absolute;
                                width: 20px;
                                height: 20px;
                                border-radius: 20px;
                                right: -10px;
                                top: -10px;
                                cursor: pointer;
                            }
                        }
                    }
                    .sku-img{
                        display: inline-block;
                        vertical-align: top;
                        .imageUrl{
                            display: inline-block;
                            vertical-align: top;
                            width: 30px;
                            height: 30px;
                            border-radius: 2px;
                        }
                        .link{
                            margin-left: 10px;
                            line-height: 30px;
                        }
                        .del-spec-img{
                            color: $main-color;
                        }
                        .upload-container{
                            display: inline-block;
                            vertical-align: top;
                        }
                    }
                }
            }
            .set-sku-weight{
                position: relative;
                .text{
                    // margin-left: 592px;
                    margin-left: 692px;
                    margin-right: 10px;
                    font-size: 14px;
                    color: #333;
                    font-weight: bold;
                }
                .form-control{
                    width: 80px;
                    padding-right: 35px;
                }
                .kg{
                    position: absolute;
                    right: 80px;
                    top: 2px;
                }
                .btn-main{
                    min-width: 60px;
                    width: 60px;
                    margin-left: 10px;
                }
            }
            .spec-list {
                padding-top: 20px;
                table {
                    width: 910px;
                    border-collapse: collapse;
                    border-spacing: 0;
                    border-radius: 4px;
                    overflow: hidden;
                    box-shadow: 0 0 0 1px $border-color;
                    thead {
                        background: #EBEFFC;
                    }
                    tr {
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
                        }
                    }
                    .selectedTr{
                        background: #f7f7f7;
                    }
                }
            }
        }
        .channel-wrap {
            margin-bottom: 20px;
            .channel-item {
                display: inline-block;
                vertical-align: top;
                background: #fff;
                border-radius: 4px;
                width: 520px;
                overflow: hidden;
                margin: 0 15px 15px 0;
                &:nth-child(4n){
                    margin-right: 0;
                }
                &:nth-child(4n-3){
                    .channel-title{
                        background: #E54F7F;
                    }
                }
                &:nth-child(4n-2){
                    .channel-title{
                        background: #A855E5;
                    }
                }
                &:nth-child(4n-1){
                    .channel-title{
                        background: #EA6157;
                    }
                }
                &:nth-child(4n){
                    .channel-title{
                        background: #517ADC;
                    }
                }
                .channel-title {
                    height: 40px;
                    padding-left: 20px;
                    span {
                        display: inline-block;
                        line-height: 40px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: bold;
                    }
                    .link {
                        font-size: 14px;
                        float: right;
                        color: #fff;
                        border-color: #fff;
                        margin: 7px 10px 0 0;
                        height: 26px;
                        line-height: 26px;
                    }
                }
                .price {
                    padding-left: 20px;
                    padding-top: 15px;
                    span {
                        display: inline-block;
                        vertical-align: top;
                        width: 70px;
                        line-height: 30px;
                        color: #333333;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .form-control {
                        width: 200px;
                    }
                }
                .supplier {
                    padding: 20px 0 30px;
                    p {
                        font-size: 14px;
                        color: #333333;
                        font-weight: bold;
                        padding-left: 20px;
                    }
                    .supplier-item {
                        padding: 20px 20px 0;
                        white-space: normal;
                        word-break: break-all;
                        span {
                            color: #333333;
                            font-size: 14px;
                            margin-left: 10px;
                        }
                        .supplier-price {
                            color: $main-color;
                            padding: 0 20px 0 8px;
                        }
                        .supplier-input {
                            width: 100px;
                            margin-left: 10px;
                        }
                        .supplier-select{
                            min-width: 100px;
                            width: 100px;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        .editor-wrap {

        }
        .dialog-form {
            .modal-item {
                padding-bottom: 15px;
                span {
                    display: inline-block;
                    vertical-align: top;
                    width: 78px;
                    font-size: 14px;
                    color: #333333;
                    font-weight: bold;
                    line-height: 30px;
                }
                .item-content {
                    display: inline-block;
                    vertical-align: top;
                    width: 410px;
                    white-space: normal;
                    word-break: break-all;
                    .spec-item {
                        display: inline-block;
                        vertical-align: top;
                        font-weight: normal;
                        width: auto;
                        height: 30px;
                        padding: 0 30px;
                        border: 1px dashed $border-color;
                        line-height: 30px;
                        border-radius: 4px;
                        margin-right: 15px;
                        cursor: pointer;
                    }
                    .spec_active{
                        border-color: #E1376C;
                        color: #E1376C;
                    }
                    .current-mix {
                        font-weight: normal;
                        width: unset;
                        span{
                            width: unset;
                            padding-right: 5px;
                        }
                    }
                    .btn-fill-main {
                        height: 20px;
                        line-height: 20px;
                        padding: 0 8px;
                        min-width: auto;
                        margin-top: 4px;
                        margin-left: 10px;
                    }
                }
            }
            .current-mix-box{
                padding-bottom: 0;
            }
            .modal-item-bot {
                padding-top: 15px;
                padding-bottom: 0;
            }
            .set-current {
                .set-name {
                    width: 122px;
                    border: 1px solid #DDDDDD;
                    padding-left: 10px;
                    margin-top: 15px;
                }
                .colon {
                    line-height: 30px;
                    padding: 0 10px;
                    vertical-align: bottom;
                }
                span {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 30px;
                    color: #333;
                }
                .conected-spec {
                    display: inline-block;
                    vertical-align: top;
                    margin-top: 15px;
                    .conected-spec-name {
                        position: relative;
                        padding: 0 30px;
                        border: 1px dashed #999999;
                        border-radius: 4px;
                        margin-right: 10px;
                        img {
                            position: absolute;
                            right: -10px;
                            top: -10px;
                            width: 20px;
                            height: 20px;
                        }
                    }
                    .conected-spec-count {
                        border: 1px solid #DDDDDD;
                        border-radius: 4px;
                        .count {
                            padding: 0 10px;
                        }
                        .set-count {
                            width: 20px;
                            height: 30px;
                            background: #DDDDDD;
                            .add-count {
                                display: block;
                                height: 13px;
                                background: url('~assets/goods/add.png') no-repeat center bottom;
                                margin-bottom: 3px;
                                cursor: pointer;
                            }
                            .reduce-count {
                                display: block;
                                height: 13px;
                                background: url('~assets/goods/reduce.png') no-repeat center top;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
        .channel-dialog{
            .search-item{
                padding-bottom: 10px;
                span{
                    display: inline-block;
                    vertical-align: top;
                    line-height: 30px;
                }
                .title{
                    color: #333;
                    font-weight: bold;
                    font-size: 14px;
                    width: 82px;
                }
                .form-control{
                    width: 670px;
                }
                .letter{
                    cursor: pointer;
                    margin-right: 14px;
                    &.active{
                        color: #F06941;
                    }
                }
                .selected-item{
                    margin-top: 4px;
                    height: 22px;
                    line-height: 22px;
                    padding: 0 20px 0 8px;
                    border-radius: 22px;
                    background: $main-color;
                    color: #fff;
                    margin-right: 10px;
                    font-size: 12px;
                    max-width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    position: relative;
                    a{
                        position: absolute;
                        color: #fff;
                        font-size: 12px;
                        top: 0;
                        right: 10px;
                    }
                }
                }
                .selected－brand{
                    padding-top: 10px;
                    padding-bottom: 20px;
                }
                .selected-box{
                    max-height: 200px;
                    overflow: auto;
                .brand-item{
                    display: inline-block;
                    vertical-align: top;
                    width: 20%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .link{
                        display: inline-block;
                        vertical-align: top;
                        line-height: 30px;
                        color: #333;
                        border-radius: 30px;
                        padding: 0 8px;
                        border: 1px solid #fff;
                        max-width: 100%;
                        &:hover{
                            color: $main-color;
                            border: 1px solid $main-color;
                        }
                    }
                }
            }
        }
    }
</style>
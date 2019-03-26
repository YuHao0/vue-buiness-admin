export default {
    apiUrlList: {
        user: {
            login:'/partneruser/partner_user_login.do'
        },
        goods: {
            list: '/item/item_list.do',
            add: '/item/add_item.do',
            detail: '/item/get_item_detail.do',
            update: '/item/update_item.do',
            setStatus: '/item/update_item_status.do',
            brand: '/brand/query_brand_list.do',
            supplier:'/supplier/supplier_list.do',
            channel: '/channel/channel_list.do',
            buyer: '/user/user_list.do',
            actGoods: '/item/query_item_for_act.do'
        },
        folder:{
            add:'/filefolder/add_file_folder.do',
            query:'/filefolder/query_file_folder_by_id.do',
            rename:'/filefolder/rename_file.do',
            getImg:'/filefolder/query_images.do',
            deleteFile:'/filefolder/deleted_file.do',
            move:'/filefolder/move_file.do'
        },
        brand: {
            list: '/brand/query_brand_list.do',
            del: '/brand/delete_brand.do',
            add: '/brand/add_brand.do',
            update: '/brand/update_brand.do',
            detail: '/brand/get_brand_by_id.do',
            setStatus: '/brand/update_brand_status.do',
            letterList: '/brand/query_brand_by_name.do'
        },
        category: {
            cate: '/partnercategory/query_category_list.do',
            thirdCate: '/partnercategory/query_third_category_list.do',
            add: '/partnercategory/add_category.do',
            edit: '/partnercategory/update_category.do',
            del: '/partnercategory/delete_category.do',
            tree: '/partnercategory/get_category_tree.do',
            detail: '/partnercategory/get_category_by_id.do',
            setStatus: '/partnercategory/update_status.do',
            categoryNode: '/partnercategory/query_category_by_parent.do'  // 获取子类目列表
        },
        notice: {
            list: '/announcement/query_announcement.do',
            setStatus: '/announcement/update_announcement_status.do',
            add: '/announcement/add_announcement.do',
            detail: '/announcement/get_announcement_by_id.do',
            edit: '/announcement/update_announcement.do',
            del: '/announcement/delete_announcement.do',
            type: '/announcement/announcement_jump_type.do'
        },
        invoice: {
            list: '/invoice/query_invoice_record.do',
            detail: '/invoice/get_invoice_record.do',
            uploadImg: '/invoice/upload_invoice_image.do'
        },
        supplier: {
            list: '/supplier/query_supplier.do',
            add: '/supplier/add_supplier.do',
            detail: '/supplier/get_supplier_detail.do',
            edit: '/supplier/update_supplier.do',
            del: '/supplier/delete_supplier.do'
        },
        activity: {
            list: '/activity/activity_list.do',
            typeList: '/activity/actity_type_list.do',
            add: '/activity/add_activity.do',
            edit: '/activity/update_activity.do',
            detail: '/activity/get_activity.do',
            setStatus: '/activity/update_activity_status.do',
            delAct: '/activity/delete_activity.do',
            display: '/activity/display_terminal_list.do',
            buyLimit: '/activity/flash_sale_activity_list.do',
            getBuyLimit:'/activity/get_flash_sale_activity.do',
            addBuyLimit:'/activity/add_flash_sale_activity.do',
            delBuyLimit: '/activity/delete_flash_sale_activity.do',
            updateBuyLimit:'/activity/update_flash_sale_activity.do',
            moveBuyLimit:'/activity/update_flash_sale_item_index.do',
        },
        groupBuy:{
            add:'/groupbuying/add_group_buying.do',
            list:'/groupbuying/query_group_buying.do',
            delete:'/groupbuying/delete_group_buying.do',
            get:'/groupbuying/get_group_buying_by_id.do',
            update:'/groupbuying/update_group_buying.do',
            updateStatus:'/groupbuying/update_group_buying_status.do'
        },
        presell:{
            add:'/presell/add_presell.do',
            list:'/presell/query_presell.do',
            delete:'/presell/delete_presell.do',
            get:'/presell/get_presell_detail.do',
            update:'/presell/update_presell.do',
            updateStatus:'/presell/update_presell_status.do'
        },
        coupon: {
            list: '/coupon/query_coupon_config_list.do',
            add: '/coupon/add_coupon_config.do',
            detail: '/coupon/get_coupon_config.do',
            del: '/coupon/delete_coupon_config.do'
        },
        hotKeyword: {
            list: '/hotkeyword/query_hot_keyword.do',
            add: '/hotkeyword/add_hot_keyword.do',
            detail: '/hotkeyword/get_hot_keyword_by_id.do',
            edit: '/hotkeyword/update_hot_keyword.do',
            del: '/hotkeyword/delete_hot_keyword.do',
            batchDel: '/hotkeyword/delete_batch_hot_keyword.do',
            typeList: '/hotkeyword/hot_keyword_jump_type.do',
            setStatus: '/hotkeyword/update_hot_keyword_status.do'
        },
        store: {
            list: '/shop/query_shop.do',
            add: '/shop/add_shop.do',
            del: '/shop/delete_shop.do',
            detail: '/shop/get_shop_detail.do',
            edit: '/shop/update_shop.do',
            setStatus: '/shop/update_shop_status.do',
            allShop: '/shop/query_shop_list.do'
        },
        role: {
            list: '/partnerrole/query_partner_role.do',
            detail: '/partnerrole/get_partner_role_by_id.do',
            add: '/partnerrole/add_partner_role.do',
            edit: '/partnerrole/update_partner_role.do',
            del: '/partnerrole/delete_partner_role.do',
            all: '/partnerrole/get_partner_role_list.do'
        },
        staff: {
            list: '/partneruser/query_partner_user_list.do',
            detail: '/partneruser/get_partner_user_detail.do',
            add: '/partneruser/add_partner_user.do',
            edit: '/partneruser/update_partner_user.do',
            resetPassword: '/partneruser/update_self_password.do',
            initPassword: '/partneruser/update_init_password.do',
            del: '/partneruser/delete_partner_user.do',
            batchDel: '/partneruser/delete_partner_user_list.do',
            levelList: '/user/query_user_level_rule.do',
            levelDetail: '/user/get_user_level_rule.do',
            addLevel: '/user/add_user_level_rule.do',
            updateLevel: '/user/update_user_level_rule.do',
            delLevel: '/user/delete_user_level_rule.do',
            setLevelStatus: '/user/update_user_level_rule_status.do',
            auditList: '/user/audit_user_list.do',
            auditUser: '/user/audit_user.do',
            disableUser: '/user/disable_user.do',
            recharge: '/user/user_top_up_record.do'
        },
        feetemplate: {
            list: '/expressfeetemplate/query_express_fee_template.do',
            setStatus: '/expressfeetemplate/update_express_fee_template_status.do',
            del: '/expressfeetemplate/delete_express_fee_template.do',
            add: '/expressfeetemplate/add_express_fee_template.do',
            edit: '/expressfeetemplate/update_express_fee_template.do',
            detail: '/expressfeetemplate/get_express_fee_template_by_id.do',
            allTemp: '/expressfeetemplate/query_template_list.do'
        },
        order: {
            list: '/order/order_list.do',
            detail: '/order/order_info.do',
            addExp: '/express/add_order_express.do',
            delExp: '/express/delete_order_express.do',
            split: '/order/order_split.do',
            importLog: '/order/upload_express.do',
            inventory: '/inventory/query_inventory.do',
            exportOrder: '/order/download_order.do',
            changeSupplier: '/order/change_supplier.do',
            orderRefund: '/order/order_refund.do',
            refund: '/order/refund_from_order.do',
            refundReason: '/order/refund_reason_list.do',
            refundDetail: '/order/refund_detail.do',
            platform: '/order/get_pay_platform.do',
            refuse: '/order/refuse_order.do',
            applyPass: '/order/order_refund_apply_check.do',
            applyRefund: '/order/order_refund_apply_review.do',
            resetAmount: '/order/update_refund_amount.do'
        },
        consumer: {
            user: '/user/user_list.do'
        },
        address: {

        },
        progress: {
            rate: '/common/progress_rate.do',
            result: '/common/progress_result.do'
        },
        common: {
            jumpType:'/common/jump_type.do',
            currency:'/common/currency_list.do',
            menu: '/menu/get_menu_by_user.do',
            expressAddress: '/areaaddress/query_area_address_list_for_express.do',
            expressCompany: '/expresscompany/query_express_company_list.do',
            logout: '/partneruser/partner_user_logout.do',
            config: '/config/get_system_config.do',
            smsList: '/config/sms_channel_list.do',
            accountConfig: '/config/get_config_by_type.do',
            updateAccountConfig: '/config/edit_config.do',
            pageConfig: '/systeminfo/get_system_info.do',
            updatePageConfig: '/systeminfo/update_system_info.do'
        },
        system: {
            agreement: '/agreement/update_agreement.do',
            agreementDetail: '/agreement/get_agreement.do',
            bannerList: '/pcconfig/banner/banner_config_list.do',
            moveBanner: '/pcconfig/banner/update_banner_config_order.do',
            addBanner: '/pcconfig/banner/add_banner_config.do',
            editBanner: '/pcconfig/banner/update_banner_config.do',
            setBannerStatus: '/pcconfig/banner/update_banner_config_status.do',
            bannerDetail: '/pcconfig/banner/get_banner_config.do',
            delBanner: '/pcconfig/banner/delete_banner_config.do',
            tabList: '/pcconfig/tab/tab_config_list.do',
            moveTab: '/pcconfig/tab/update_tab_config_order.do',
            addTab: '/pcconfig/tab/add_tab_config.do',
            editTab: '/pcconfig/tab/update_tab_config.do',
            setTabStatus: '/pcconfig/tab/update_tab_config_status.do',
            tabDetail: '/pcconfig/tab/get_tab_config.do',
            delTab: '/pcconfig/tab/delete_tab_config.do'
        },
        index:{
            moduleList:'/index/index_forward.do',
            getModule:'/index/get_module_and_data.do',
            addModule:'/index/add_index_tab_module_and_data.do',
            updateModule:'/index/update_index_tab_module_and_data.do',
            deleteModule:'/index/deleted_module_and_data.do',
            moduleOrder:'/index/update_index_tab_module_order.do',
            moduleType:'/index/layout_type.do',
            updateBottomBar:'/index/update_bottom_bar.do',
            getBottomBar:'/index/get_bottom_bar.do',
            goodsListContent:'/index/product_content.do',
            jumpType:'/index/jump_type_for_layout.do',
            getModuleStyle:'/index/index_tab_module_styles.do'
        }
    },
    static:{
        upload:'/upload/upload_file.do'
    }
}
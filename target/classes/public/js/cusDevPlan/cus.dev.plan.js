layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //加载数据表格
    var tableIns = table.render({
        id:'saleChanceTable'
        //容器的id
        ,elem: '#saleChanceList'
        //容器的高度full-差值
        ,height: 'full-125'
        //单元格的最小宽度
        ,cellMinWidth:95
        //访问数据的url，后台的数据接口
        ,url: ctx + '/sale_chance/list?flag=1'
        //开启分页
        ,page: true
        //每页显示的数量
        ,limit: 10
        //每页页数的可选项
        ,limits:[10,20,30,40,50]
        //开启头部工具栏
        ,toolbar:'#toolbarDemo'
        //表头
        ,cols: [[
            //field:要求field属性值与返回值的数据在对应的属性字段名一致
            //title:设置列的标题
            //sort:是否排序
            //fixed:固定列
            {type:'checkbox',fixed: 'center'}
            ,{field: 'id', title: '编号', sort: true, fixed: 'left'}
            ,{field: 'chanceSource', title: '机会来源',align:'center'}
            ,{field: 'customerName', title: '客户名称',align:'center'}
            ,{field: 'cgjl', title: '成功几率',align:'center'}
            ,{field: 'overview', title: '概要',align:'center'}
            ,{field: 'linkMan', title: '联系人',align:'center'}
            ,{field: 'linkPhone', title: '联系号码',align:'center'}
            ,{field: 'description', title: '描述',align:'center'}
            ,{field: 'createMan', title: '创建人',align:'center'}
            ,{field: 'createDate', title: '创建时间',align:'center'}
            ,{field: 'updateDate', title: '修改时间',align:'center'}
            ,{field: 'devResult', title: '开发状态',align:'center',templet: function (d) {
                    //调用函数，返回格式化的结果
                    return formatDevResult(d.devResult);
                }}
            ,{title: '操作',templet:'#op',field: 'right',align: 'center',minWidth:150}
        ]]
    });

    /**
     * 格式化开发状态
     * 0-表示未开发
     * 1-表示开发中
     * 2-表示开发成功
     * 3-表示开发失败
     * 其他-未知
     * @param devResult
     */
    function formatDevResult(devResult) {
        if(devResult == 0){
            return "<div style='color: yellow'>未开发<div/>"
        }else if (devResult == 1){
            return "<div style='color: orange'>开发中<div/>"
        }else if(devResult == 2){
            return "<div style='color: green'>开发成功<div/>"
        }else if (devResult == 3){
            return "<div style='color: red'>开发失败<div/>"
        }else{
            return "<div style='color: black'>未知<div/>"
        }
    }

    /**
     * 搜索按钮的点击事件
     */
    $(".search_btn").click(function () {

        /**
         * 表格重载
         *  多条件查询
         */
        tableIns.reload({
            where: { //设定异步数据接口的额外参数，任意设
                //通过文本框的值获得参数
                customerName: $("[name='customerName']").val()//客户名称
                ,createMan: $("[name='createMan']").val()//创建人
                ,devResult:$("#devResult").val()//状态
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

    /**
     * 监听行工具栏事件
     */
    table.on('tool(saleChances)',function (data) {
        console.log(data);
        //判断对应的事件类型
        if (data.event == "dev"){
            //添加操作
            openCusDevPlanDialog('计划项数据开发',data.data.id);
        }else if (data.event == "info"){
            //删除操作
            openCusDevPlanDialog('计划项数据维护',data.data.id);
        }
    });

    /**
     * 打开计划项开发页面
     * @param title
     * @param id
     */
    function openCusDevPlanDialog(title,id) {
        //iframe层
        layui.layer.open({
            type: 2,
            title: title,
            area: ['800px', '550px'],
            content: ctx + "/cus_dev_plan/toCusDevPlanPage?id="+id, //iframe的url
            maxmin:true
        });
    }

});

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
        ,url: ctx + '/sale_chance/list'
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
            ,{field: 'uname', title: '分配人',align:'center'}
            ,{field: 'assignTime', title: '分配时间',align:'center'}
            ,{field: 'createDate', title: '创建时间',align:'center'}
            ,{field: 'updateDate', title: '修改时间',align:'center'}
            ,{field: 'state', title: '分配状态',align:'center',templet: function (d) {
                    //调用函数，返回格式化的结果
                    return formatState(d.state);
                }}
            ,{field: 'devResult', title: '开发状态',align:'center',templet: function (d) {
                    //调用函数，返回格式化的结果
                    return formatDevResult(d.devResult);
                }}
            ,{title: '操作',templet:'#saleChanceListBar',field: 'right',align: 'center',minWidth:150}
        ]]
    });

    /**
     * 格式化分配状态值
     * 0-表示未分配
     * 1-表示已分配
     * 其他-未知
     * @param state
     */
    function formatState(state) {
        if(state == 0){
            return "<div style='color: yellow'>未分配<div/>"
        }else if (state == 1){
            return "<div style='color: green'>已分配<div/>"
        }else {
            return "<div style='color: black'>未知<div/>"
        }
    }

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
                ,state:$("[name='state']").val()//状态
            }
            ,page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    });

    /**
     * 监听头部工具栏事件
     */
    table.on('toolbar(saleChances)',function (data) {
        console.log(data);
        //判断对应的事件类型
        if (data.event == "add"){
            //添加操作
            openSaleChanceDialog();
        }else if (data.event == "del"){
            //删除操作
            deleteSaleChance(data);
        }
    });

    /**
     * 打开添加/修改营销机会数据的窗口
     *      如果id为空为添加操作
     *      如果id不为空为修改操作
     */
    function openSaleChanceDialog(saleChanceId) {
        var title = "<h2>营销机会管理 - 添加营销机会</h2>";
        var url = ctx + "/sale_chance/toSaleChancePage"
        //判断
        if (saleChanceId != null && saleChanceId != ''){
            title = "<h2>营销机会管理 - 修改营销机会</h2>";
            //请求地址传递营销机会的id
            url += '?saleChanceId=' +saleChanceId;
        }

        //iframe层
        layui.layer.open({
            type: 2,
            title: title,
            area: ['500px', '620px'],
            content: url, //iframe的url
            maxmin:true
        });
    }

    /**
     * 删除营销机会（删除多条记录）
     * @param data
     */
    function deleteSaleChance(data){
        //获取数据表格选中的行数据
        var checkStatus = table.checkStatus("saleChanceTable");
        //console.log(checkStatus);

        //先获得所有被选中记录对应的数据
        var saleChanceData = checkStatus.data;

        //判断用户是否选择的记录
        if (saleChanceData.length < 1){
            layer.msg("请选择要删除的记录！",{icon:5});
            return;
        }

        //询问是否删除
        layer.confirm('您确定要删除选中的记录吗？',{icon:3,title:'营销机会管理'},function (index) {
           layer.close(index);
           //传递的参数是数组
           var ids = "ids=";
           //循环选中的行记录数据
            for (var i = 0;i < saleChanceData.length;i ++){
                if (i < saleChanceData.length-1){
                    ids = ids + saleChanceData[i].id + "&ids=";
                }else {
                    ids = ids + saleChanceData[i].id;
                }
            }
            //console.log(ids);

            //发送ajax请求，执行删除操作
            $.ajax({
                type:"post",
                url:ctx + "/sale_chance/delete",
                data:ids,
                success:function (result) {
                    //判断删除结果
                    if(result.code == 200){
                        layer.msg("删除成功！",{icon:6});
                        //刷新表格
                        tableIns.reload();
                    }else {
                        layer.msg(result.msg,{icon: 5});
                    }
                }
            });
        });

    }

    /**
     * 行工具栏监听
     */
    table.on('tool(saleChances)',function (data) {
        //判断类型
        if (data.event == "edit"){
            //得到营销机会的id
            var saleChanceId = data.data.id;
            openSaleChanceDialog(saleChanceId)
        }else if (data.event == "del"){
            layer.confirm('确定要删除该记录吗？',{icon:3,title:"营销机会管理"},function (index) {
                layer.close(index);
                $.ajax({
                    type:"post",
                    url:ctx + "/sale_chance/delete",
                    data:{
                        ids:data.data.id
                    },
                    success:function (result) {
                        //判断删除结果
                        if(result.code == 200){
                            layer.msg("删除成功！",{icon:6});
                            //刷新表格
                            tableIns.reload();
                        }else {
                            layer.msg(result.msg,{icon: 5});
                        }
                    }
                });
            });
        }
    });

});

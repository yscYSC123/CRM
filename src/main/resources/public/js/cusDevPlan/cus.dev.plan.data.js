layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //加载计划项数据表格
    var tableIns = table.render({
        id:'cusDevPlanTable'
        //容器的id
        ,elem: '#cusDevPlanList'
        //容器的高度full-差值
        ,height: 'full-125'
        //单元格的最小宽度
        ,cellMinWidth:95
        //访问数据的url，后台的数据接口
        ,url: ctx + '/cus_dev_plan/list?saleChanceId='+$("[name='id']").val()
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
            ,{field: 'planItem', title: '计划项',align:'center'}
            ,{field: 'planDate', title: '计划时间',align:'center'}
            ,{field: 'exeAffect', title: '执行效果',align:'center'}
            ,{field: 'createDate', title: '创建时间',align:'center'}
            ,{field: 'updateDate', title: '修改时间',align:'center'}
            ,{title: '操作',templet:'#cusDevPlanListBar',field: 'right',align: 'center',minWidth:150}
        ]]
    });

    /**
     * 监听头部工具栏事件
     */
    table.on('toolbar(cusDevPlans)',function (data) {
        //判断对应的事件类型
        if (data.event == "add"){
            //添加计划项
            openAddOrUpdateCusDevPlanDialog();
        }else if (data.event == "success"){
            //开发成功
            updateSaleChanceDevResult(2);
        }else if (data.event == "failed"){
            //开发失败
            updateSaleChanceDevResult(3);
        }
    });

    /**
     * 监听行工具栏
     */
    table.on('tool(cusDevPlans)',function (data) {
        if (data.event == "edit"){
            openAddOrUpdateDialog(data.data.id);
        }else if (data.event == "del"){
            deleteCusDevPlan(data.data.id);
        }
    });

    /**
     * 打开添加计划项页面
     */
    function openAddOrUpdateCusDevPlanDialog(id) {
        var title = "添加计划项";
        var url = ctx + "/cus_dev_plan/toAddOrUpdateCusDevPlanPage?sId="+$("[name='id']").val();

        if (id != null && id != ''){
            title = "修改计划项";
            url += "&id="+id;
        }

        //iframe层
        layui.layer.open({
            type: 2,
            title: title,
            area: ['500px', '300px'],
            content: url, //iframe的url
            maxmin:true
        });
    }

    /**
     * 删除
     */
    function deleteCusDevPlan(id) {
        layer.confirm('您确认要删除该记录吗？',{icon:3,title:'开发项数据管理'},function (index) {
            //发送ajax请求，执行删除操作
            $.post(ctx + '/cus_dev_plan/delete',{id:id},function (result) {
                if (result.code == 200){
                    layer.msg('删除成功',{icon:6});
                    tableIns.reload();
                }else {
                    layer.msg(result.msg,{icon:5});
                }
            });
        });
    }

    function updateSaleChanceDevResult(devResult) {
        //弹出确认框询问用户
        layer.confirm('您确认执行该操作吗?',{icon:3,title:"营销机会管理"},function (index) {
            var sId = $("[name = 'id']").val();
            $.post(ctx+'/sale_chance/updateSaleChanceDevResult',{id:sId,devResult:devResult},function (result) {
                if (result.code == 200){
                    layer.msg('更新成功',{icon:6});
                    layer.closeAll("iframe");
                    parent.location.reload();
                }else {
                    layer.msg(result.msg,{icon:5});
                }
            });
        });
    }

});

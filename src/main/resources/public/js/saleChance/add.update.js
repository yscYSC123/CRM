layui.use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //监听表单事件
    form.on('submit(addOrUpdateSaleChance)',function (data) {
        //加载层
        var index = layer.msg("提交数据中，请稍后...",{
            icon:16,
            time:false,
            shade:0.8
        });

        //发送ajax请求
        var url = ctx + "/sale_chance/add";

        //通过营销机会的id判断当前需要执行添加操作是否为修改操作
        var saleChanceId = $("[name='id']").val();
        if (saleChanceId != null && saleChanceId != ''){
            url = ctx + "/sale_chance/update";
        }

        $.post(url,data.field,function (result) {
            //判断操作是否添加成功
            if (result.code == 200){
                layer.msg("操作成功！",{icon:6});
                //关闭加载层
                layer.close(index);
                //关闭弹出层
                layer.closeAll("iframe");
                //刷新父窗口
                parent.location.reload();
            }else{
                layer.msg(result.msg,{icon:5});
            }
        });
        return false;

    });

    //关闭弹出层
    $("#closeBtn").click(function () {
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    //加载指派人
    $.ajax({
        type:"get",
        url:ctx + "/user/queryAllSales",
        data:{},
        success:function (data){
            //判断返回的数据是否为空
            if (data != null){
                //获取隐藏域设置的指派人id
                var assignManId = $("#assignManId").val();

                for (var i = 0;i < data.length;i ++){
                    var opt = "";
                    if (assignManId == data[i].id){
                        //设置下拉选项选中
                        opt = "<option value='"+data[i].id+"' selected>"+data[i].uname+"</option>";
                    }else {
                        //设置下拉选项
                        opt = "<option value='"+data[i].id+"'>"+data[i].uname+"</option>";
                    }

                    //将下拉项设置到下拉框中
                    $("#assignMan").append(opt);
                }
            }
            //重新渲染下拉框内容
            layui.form.render("select");
        }
    });

});
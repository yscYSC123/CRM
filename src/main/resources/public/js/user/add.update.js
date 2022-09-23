layui.use(['form', 'layer','formSelects'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    var formSelects = layui.formSelects;

    /**
     * 表单submit监听
     */
    form.on('submit(addOrUpdateUser)',function (data) {
        //加载层
        var index = top.layer.msg("提交数据中，请稍后...",{
            icon:16,
            time:false,
            shade:0.8
        });

        //得到所有的表单元素
        var formData = data.field;

        //请求的地址
        var url = ctx + "/user/add";

        //判断用户id是否为空
        if ($("[name = 'id']").val()){
            url = ctx + "/user/update";
        }

        $.post(url,formData,function (result) {
            //判断操作是否添加成功
            if (result.code == 200){
                top.layer.msg("操作成功！",{icon:6});
                //关闭加载层
                top.layer.close(index);
                //关闭弹出层
                layer.closeAll("iframe");
                //刷新父窗口
                parent.location.reload();
            }else{
                layer.msg(result.msg,{icon:5});
            }
        });
        //阻止表单提交
        return false;
    });

    //关闭弹出层
    $("#closeBtn").click(function () {
        //当你在iframe页面关闭自身时
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭
    });

    /**
     * 加载角色下拉框
     * 配置远程搜索，请求头，请求参数，请求类型等
     */
    var userId = $("[name = 'id']").val();
    //加载下拉框
    formSelects.config("selectId",{
        type: "post",  //请求方式
        searchUrl: ctx + "/role/queryAllRoles?userId="+userId,
        keyName: 'roleName',    //下拉框的文本值
        keyVal: 'id'
    },true);

});
export const introOption = {
    // 这里是更换成中文（默认英文）
    prevLabel: "上一步",
    nextLabel: "下一步",
    skipLabel: "跳过",
    doneLabel: "完成",
    /* 引导说明框相对高亮说明区域的位置 */
    tooltipPosition: "bottom",
    /* 引导说明文本框的样式 */
    tooltipClass: "intro-tooltip",
    /* 说明高亮区域的样式 */
    highlightClass: "intro-highlight",
    /* 是否使用键盘Esc退出 */
    exitOnEsc: true,
    /* 是否允许点击空白处退出 */
    exitOnOverlayClick: false,
    /* 提示边框的padding */
    helperElementPadding: 2,
    /* 是否显示说明的数据步骤 */
    showStepNumbers: false,
    /* 是否允许键盘来操作 */
    keyboardNavigation: true,
    /* 是否按键来操作 */
    showButtons: true,
    /* 是否使用点显示进度 */
    showBullets: false,
    /* 是否显示进度条 */
    showProgress: false,
    /* 是否滑动到高亮的区域 */
    scrollToElement: true,
    /* 遮罩层的透明度 */
    overlayOpacity: 0.9,
    /* 当位置选择自动的时候，位置排列的优先级 */
    positionPrecedence: ["bottom", "top", "right", "left"],
    /* 是否禁止与元素的相互关联 */
    disableInteraction: false,
    /* 是否在第一步隐藏上一步 */
    hidePrev: true,
    /* 是否在最后一步隐藏下一步 */
    hideNext: true,
    /* steps步骤，可以写个工具类保存起来 */
    steps: [
        {
            // title: 'Welcome',
            element: "#step1",
            intro: "通过点击该按钮发起新流程。",
        },
        {
            element: "#step2",
            intro: "这行展示的所有流程审批记录。",
        },
        {
            element: "#step3",
            intro: "这行展示的最终审批的结论。",
        },
        {
            element: "#step4",
            intro: "最后要通过点击保存修改按钮保存审批的操作。",
        }
    ],
}
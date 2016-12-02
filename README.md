# jquery-xcalendar
简单的日历控件
##例如：
$("#cal").xcalendar({
            onRender: function(date) {
                return [
                    "经济舱<span>￥3000</span>",
                    "头等舱<span>￥3000</span>",
                    "商务舱<span>￥3000</span>"
                ];
            },
            onEnter: function(now, fn) {
                console.log("切换到" + now.getFullYear() + "-" + (now.getMonth() + 1));
                setTimeout(function() {
                    fn && fn();
                }, 200);
            },
            onSelect: function(list) {
                console.log(list);
            }
        });

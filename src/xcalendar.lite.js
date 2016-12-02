    $.fn.xcalendar = function(options) {
        var obj = $(this);
        var defaults = {
            onRender: null,
            onRefresh: null,
            onEnter: null,
            onEnd: null,
            onSelect: null
        }
        var options = $.extend(defaults, options);
        var title, pre_month, next_month, now = new Date(),
            days, min_height = 0,
            now_month = now.getMonth(),
            now_year = now.getFullYear(),
            refresh, setting, today, tmp_today = new Date(),
            day_active = false;
        //日历的结构
        var html = "<div class=\"title\"><a class=\"refresh\" href=\"javascript:\" ;></a><a class=\"today\" href=\"javascript:\">Today</a><span></span><a class=\"setting\" href=\"javascript:;\"></a><a class=\"next\" href=\"javascript:;\"></a><a class=\"pre\" href=\"javascript:;\"></a></div>" +
            "<div class=\"weeks list\">" +
            "<div class=\"week item\">Sun</div>" +
            "<div class=\"week item\">Mon</div>" +
            "<div class=\"week item\">Tue</div>" +
            "<div class=\"week item\">Wed</div>" +
            "<div class=\"week item\">Thu</div>" +
            "<div class=\"week item\">Fri</div>" +
            "<div class=\"week item\">Sat</div>" +
            "</div><div class=\"days list\"></div>";
        obj.html(html);

        function calDate(i) {
            if (i) now.setMonth(now.getMonth() + i);
            now_month = now.getMonth();
            now_year = now.getFullYear();
            render();
        }
        //获取本月的具体天数
        function getMonthes() {
            var temp_date = now;
            var first_week = temp_date.getDay();
            var days_count = new Date(now_year, now_month + 1, 0).getDate();
            var pre_month = new Date(now_year, now_month - 1, 0);
            var pre_days_count = pre_month.getDate();
            var day_arr = [];
            for (var i = 0; i < first_week; i++) {
                day_arr[first_week - i - 1] = {
                    day: pre_days_count - i,
                    date: new Date(now_year, now_month - 1, pre_days_count - i)
                }
            }
            for (var i = 0; i < days_count; i++) {
                day_arr[i + first_week] = {
                    day: i + 1,
                    date: new Date(now_year, now_month, i + 1)
                }
            }
            var len = day_arr.length % 7;
            for (var i = 0; i < 7 - len; i++) {
                day_arr.push({
                    day: i + 1,
                    date: new Date(now_year, now_month + 1, i + 1)
                });
            }
            return day_arr;
        }

        function load() {
            days.html("<div class=\"load\"></div>");
        }

        function toString(curr_day) {
            return curr_day.getFullYear() + "-" + (curr_day.getMonth() + 1) + "-" + curr_day.getDate();
        }

        function getRandomColor() {
            var colors = [
                "rgb(245, 105, 84)", "rgb(0, 115, 183)", "rgb(0, 192, 239)", "rgb(0, 166, 90)", "rgb(245, 105, 24)", "#025aa5", "#f0ad4e", "#5bc0de", "#5cb85c", "#d9534f"
            ];
            return colors[Math.round(Math.random() * (colors.length - 1))];
        }
        //渲染方法
        function render() {
            function update() {
                var arr = getMonthes();
                title.text((now_month + 1) + "/" + now_year);
                var cls = "pre";
                days.empty();
                for (var i = 0; i < arr.length; i++) {
                    var cls_now = "";
                    if (now_year == tmp_today.getFullYear() && now_month == tmp_today.getMonth() && arr[i].day == tmp_today.getDate()) cls_now = "now";
                    cls = cls == "" && arr[i].day == 1 ? "next" : cls == "pre" && arr[i].day == 1 ? "" : cls;
                    var data = options.onRender && options.onRender(arr[i].date);
                    var html = "<div class=\"day item " + cls + " " + cls_now + "\" style=\"min-height:" + min_height + "px;\" data-day=\"" + toString(arr[i].date) + "\">" +
                        "<div class=\"date\">" + arr[i].day + "</div>" +
                        "<div class=\"txt\">";
                    for (var j = 0; j < data.length; j++) {
                        html += "<div style=\"background:" + getRandomColor() + ";\">" + data[j] + "</div>";
                    }
                    html += "</div></div>";
                    days.append(html);
                }
                options.onEnd && options.onEnd(now);
            }
            if (options.onEnter) {
                load();
                options.onEnter(now, update);
            } else { update(); }
        }
        //初始化
        function init() {
            title = $(".title span", obj);
            pre_month = $(".title .pre", obj);
            next_month = $(".title .next", obj);
            days = $(".days", obj);
            refresh = $(".title .refresh", obj);
            today = $(".title .today", obj);
            setting = $(".title .setting", obj);
            min_height = days.width() / 7 >> 0;
            now.setDate(1);
            render();
            pre_month.click(function() {
                calDate(-1);
            });
            next_month.click(function() {
                calDate(1);
            });
            refresh.click(function() {
                options.onRefresh && options.onRefresh(now);
                render();
            });
            today.click(function() {
                now = new Date();
                calDate();
                render();
            });
            $(".weeks .week", obj).click(function() {
                var index = $(this).index();
                $(".day", obj).each(function() {
                    if ($(this).index() % 7 == index && !$(this).hasClass("active")) {
                        $(this).addClass("active");
                    } else {
                        $(this).removeClass("active");
                    }
                });
            });
            obj.on("mouseleave", function() {
                day_active = false;
            }).on("mousedown", ".day", function() {
                day_active = true;
            }).on("mouseup", ".day", function() {
                day_active = false;
            }).on("mouseover", ".day", function() {
                if (day_active) $(this).addClass("active");
            }).on("click", ".day", function() {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            });
            setting.click(function() {
                options.onSelect && options.onSelect($(".days .active", obj));
            });
        }
        init();
    }
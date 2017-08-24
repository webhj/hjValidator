/**
/**
 @author wjl(794520386@qq.com)
 @Site:webhj.com  || https://webhj.github.io/jlvalidate
 @Created by QQ794520386 on 2017/6/1.
 */
;(function() {
    var defaults = {
        trigger: 'change',
        correct: false,
        callback: null
    };
    // 规则
    var rules = {
            required: function() {
                return this.val() !== '';
            },
            regex: function() {
                //data-regex中自定义正则
                return new RegExp(this.data('regex')).test(this.val());
            },
            int: function() {
                return /^\+?[1-9][0-9]*$/.test(this.val());
            },
            ln: function() {
                return String(this.val()).length >= Number(this.data('ln'))
            },
            mn: function() {
                return String(this.val()).length <= Number(this.data('mn'))
            },
            lt: function() {
                return Number(this.val()) <= Number(this.data('lt'))
            },
            gt: function() {
                return Number(this.val()) >= Number(this.data('gt'))
            },
            email: function() {
                return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.val())
            }

        },
        rulesMsg = {
            required: '不能为空',
            regex: '',
            int: '请输入正整数',
            ln: function() {
                return '至少' + this.data('ln') + '位数'
            },
            mn: function() {
                return '最多' + this.data('mn') + '位数'
            },
            lt: function() {
                return '不能大于' + this.data('lt')
            },
            gt: function() {
                return '不能小于' + this.data('gt')
            },
            email: '请输入正确的邮箱'
        }
    $.fn.hjValidator = function(options) {
        var opts = $.extend({}, defaults, options || {});
        var $fileds = $(this).find('input').not('[type=button],[type=submit],[type=reset]');
        $fileds.on(opts.trigger, function() {
            var $this = $(this);
            $this.next().remove();
            var result = true;
            $.each(rules, function(rule, facotry) {
                    var dataRyle = $this.data(rule);
                    if (dataRyle) {
                        //console.log($this.attr('name') + '需要验证' + rule)
                        var result = facotry.call($this);
                        var dataMsg = $this.data(rule + '-msg'),
                            noDataMsg = rulesMsg[rule];
                        if (!result) {
                            if (dataMsg) {
                                $this.after('<span class="errorMsg" style="color:#f00">' + dataMsg + '</span>')
                            } else if (typeof noDataMsg == 'function') {
                                $this.after('<span class="errorMsg" style="color:red">' + noDataMsg.call($this) + '</span>')
                            } else if (typeof noDataMsg == 'string') {
                                $this.after('<span class="errorMsg" style="color:red">' + noDataMsg + '</span>')
                            }
                        }
                        return result
                    }

                })
                //当correct为true时标志正确提示
            if ($this.next().size() < 1 && opts.correct) {
                $this.after('<span style="color:green">输入正确</span>');
            }
        });

        //回车和提交时整个验证
        $(this).on('submit', function() {
            $fileds.each(function() {
                $(this).trigger('focus').blur();
            });
            var $errorMsg = $('.errorMsg').length;
            //验证通过提交
            if (!$errorMsg) {
                return typeof opts.callback == 'function' && opts.callback();
            } else {
                return false;
            }

        }).on('reset', function() {
            //重置删除提示信息
            $fileds.next().remove();
        })

    }


})(window.jQuery)

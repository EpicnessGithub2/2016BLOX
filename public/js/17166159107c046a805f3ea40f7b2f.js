; // bundle: page___5986a2a5889e9c639007ecd85de1f9cf_m
; // files: utilities/dialog.js, Login/ForgotPasswordOrUsername.js, utilities/popover.js, Navigation/ShopAmazon.js, GenericConfirmation.js

; // utilities/dialog.js
typeof Roblox == "undefined" && (Roblox = {}), typeof Roblox.Dialog == "undefined" && (Roblox.Dialog = function() {
    function d() {
        n.isOpen = !1, r()
    }

    function nt(r) {
        var v, s, h, o, a;
        n.isOpen = !0, v = {
            titleText: "",
            bodyContent: "",
            footerText: "",
            acceptText: Roblox.Resources.Dialog.yes,
            declineText: Roblox.Resources.Dialog.No,
            acceptColor: f,
            declineColor: e,
            xToCancel: !1,
            onAccept: function() {
                return !1
            },
            onDecline: function() {
                return !1
            },
            onCancel: function() {
                return !1
            },
            imageUrl: null,
            allowHtmlContentInBody: !1,
            allowHtmlContentInFooter: !1,
            dismissable: !0,
            fieldValidationRequired: !1,
            onOpenCallback: function() {},
            cssClass: null
        }, r = $.extend({}, v, r), u.overlayClose = r.dismissable, u.escClose = r.dismissable, s = $(t), s.html(r.acceptText), s.attr("class", r.acceptColor), s.unbind(), s.bind("click", function() {
            return l(s) ? !1 : (r.fieldValidationRequired ? y(r.onAccept) : c(r.onAccept), !1)
        }), h = $(i), h.html(r.declineText), h.attr("class", r.declineColor), h.unbind(), h.bind("click", function() {
            return l(h) ? !1 : (c(r.onDecline), !1)
        }), o = $('[data-modal-type="confirmation"]'), o.find(".modal-title").text(r.titleText), r.imageUrl == null ? o.addClass("noImage") : (o.find("img.modal-thumb").attr("src", r.imageUrl), o.removeClass("noImage")), r.cssClass != null && o.addClass(r.cssClass), r.allowHtmlContentInBody ? o.find(".modal-message").html(r.bodyContent) : o.find(".modal-message").text(r.bodyContent), $.trim(r.footerText) == "" ? o.find(".modal-footer").hide() : o.find(".modal-footer").show(), r.allowHtmlContentInFooter ? o.find(".modal-footer").html(r.footerText) : o.find(".modal-footer").text(r.footerText), o.modal(u), a = $(".modal-header .close"), a.unbind(), a.bind("click", function() {
            return c(r.onCancel), !1
        }), r.xToCancel || a.hide(), $("#rbx-body").addClass("modal-mask"), r.onOpenCallback()
    }

    function a(n) {
        n.hasClass(e) ? n.addClass(h) : n.hasClass(v) ? n.addClass(o) : n.hasClass(f) && n.addClass(s)
    }

    function l(n) {
        return n.hasClass(s) || n.hasClass(h) || n.hasClass(o) ? !0 : !1
    }

    function p() {
        var n = $(t),
            r = $(i);
        a(n), a(r)
    }

    function w() {
        var u = $(t),
            r = $(i),
            n = s + " " + h + " " + o;
        u.removeClass(n), r.removeClass(n)
    }

    function b() {
        if (n.isOpen) {
            var i = $(t);
            i.click()
        }
    }

    function k() {
        var n = $(i);
        n.click()
    }

    function r(t) {
        n.isOpen = !1, typeof t != "undefined" ? $.modal.close(t) : $.modal.close(), $("#rbx-body").removeClass("modal-mask")
    }

    function c(n) {
        r(), typeof n == "function" && n()
    }

    function y(n) {
        if (typeof n == "function") {
            var t = n();
            if (t !== "undefined" && t == !1) return !1
        }
        r()
    }

    function tt(n, t) {
        var i = $(".modal-body");
        n ? (i.find(".modal-btns").hide(), i.find(".modal-processing").show()) : (i.find(".modal-btns").show(), i.find(".modal-processing").hide()), typeof t != "undefined" && t !== "" && $.modal.close("." + t)
    }
    var v = "btn-primary-md",
        f = "btn-secondary-md",
        e = "btn-control-md",
        o = "btn-primary-md disabled",
        s = "btn-secondary-md disabled",
        h = "btn-control-md disabled",
        g = "btn-none",
        t = ".modal-btns #confirm-btn",
        i = ".modal-btns #decline-btn",
        n = {
            isOpen: !1
        },
        u = {
            overlayClose: !0,
            escClose: !0,
            opacity: 80,
            zIndex: 1040,
            overlayCss: {
                backgroundColor: "#000"
            },
            onClose: d,
            focus: !1
        };
    return {
        open: nt,
        close: r,
        disableButtons: p,
        enableButtons: w,
        clickYes: b,
        clickNo: k,
        status: n,
        toggleProcessing: tt,
        green: v,
        blue: f,
        white: e,
        none: g
    }
}()), $(document).keypress(function(n) {
    Roblox.Dialog.isOpen && n.which === 13 && Roblox.Dialog.clickYes()
});

; // Login/ForgotPasswordOrUsername.js
Roblox = Roblox || {}, Roblox.ForgotPasswordOrUsername = function() {
    function f(t, i) {
        i === "MobileResetPasswordSuccess" ? window.location = w : (n.find(t).val(""), Roblox.Dialog.open({
            titleText: "Success!",
            bodyContent: "You have successfully activated your account.",
            acceptText: "OK",
            acceptColor: Roblox.Dialog.white,
            declineColor: Roblox.Dialog.none,
            dismissable: !0,
            xToCancel: !0,
			onAccept: z
        }))
    }

	function z() {
        window.location.href = "https://www.rbx2016.tk/games";
    }
	
    function u(n, t) {
        n.text(t)
    }

    function t(t, u) {
        n.find(l).each(function(n, f) {
            var e = $(f).find(h);
            $(f).attr("id") === u.attr("id") ? t ? ($(f).addClass(i), e.removeClass(r)) : ($(f).removeClass(i), e.addClass(r)) : ($(f).removeClass(i), e.addClass(r))
        })
    }

    function d() {
        var i = n.find(p);
        i.click(function() {
            var i = n.find(s).val(),
                r = {
                    username: i
                };
            $.ajax({
                type: "POST",
                url: k,
                data: r,
                dataType: "json"
            }).done(function(i) {
                var r = n.find(g),
                    e = n.find(v);
                i.success ? (f(s, i.message), t(!1, r)) : (u(e, i.message), t(!0, r))
            })
        })
    }

    function c() {
        var r = n.find(a);
        r.click(function() {
            var r = n.find(e).val(),
                s = {
                    email: r
                };
            $.ajax({
                type: "POST",
                url: b,
                data: s,
                dataType: "json"
            }).done(function(r) {
                var s = n.find(o),
                    h = n.find(y);
                r.success ? (f(e), t(!1, s)) : (n.find(o).addClass(i), u(h, r.message), t(!0, s))
            })
        })
    }

    function nt() {
        d(), c()
    }
    var n = $("#form-forgot-password-username"),
        k = Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/Login/ResetPasswordByUsername") : "/Login/ResetPasswordByUsername",
        b = Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/Login/GetUsernameByEmail") : "/Login/GetUsernameByEmail",
        w = Roblox && Roblox.Endpoints ? Roblox.Endpoints.getAbsoluteUrl("/login/resetpasswordrequest/success") : "/login/resetpasswordrequest/success",
        p = "#forgot-password-btn",
        a = "#forgot-username-btn",
        l = ".form-group",
        h = ".form-control-label",
        g = "#form-username",
        o = "#form-email",
        s = "#username",
        e = "#email",
        i = "form-has-error form-has-feedback",
        v = "#form-username-error",
        y = "#form-email-error",
        r = "hidden";
    $(function() {
        nt()
    })
}();

; // utilities/popover.js
var Roblox = Roblox || {};
Roblox.Popover = function() {
    "use strict";

    function u(n, i) {
        var u = $(n),
            f = $(i),
            e = $(t),
            h = e.outerWidth(),
            c = u.find(r).outerWidth(),
            l = e.offset().left,
            o = 0,
            s;
        (u.hasClass("bottom") || u.hasClass("top")) && (s = $("body").outerWidth() - parseInt(f.width() + f.offset().left), o = $("body").outerWidth() - l - s - h / 2 - c / 2, u.find(r).css("right", o))
    }

    function f(t) {
        return t.data("hiddenClassName") && (n = t.data("hiddenClassName")), n
    }

    function o() {
        $(t).on("click touchstart", function(t) {
            var s = $(this).data("bind"),
                h = s ? "#" + s : i,
                r = $(h),
                c = $(this).data("container"),
                l = c ? "#" + c : e,
                o;
            n = f(r), r.hasClass("manual") || r.toggleClass(n), o = !r.hasClass(n), $(document).triggerHandler("Roblox.Popover.Status", {
                isOpen: o,
                eventType: t.type
            }), o && u(h, l)
        })
    }

    function s() {
        $("body").on("click touchstart", function(r) {
            $(t).each(function() {
                var u = $(this).data("bind"),
                    t = u ? $("#" + u) : $(i),
                    o = "roblox-popover-open-always",
                    e = "roblox-popover-close";
                if (n = f(t), $(t).hasClass(o) && !$(r.target).hasClass(e)) return !1;
                !$(r.target).hasClass(e) && ($(this).is(r.target) || $(this).has(r.target).length !== 0 || t.has(r.target).length !== 0 || t.hasClass(n) || r.type !== "click") || (t.addClass(n), $(document).triggerHandler("Roblox.Popover.Status", {
                    isHidden: !0,
                    eventType: r.type
                }))
            })
        })
    }

    function h() {
        o(), s()
    }
    var t = ".roblox-popover",
        i = ".roblox-popover-content",
        e = ".roblox-popover-container",
        r = ".arrow",
        n = "hidden";
    return $(function() {
        h()
    }), {
        setUpTrianglePosition: u
    }
}();

; // Navigation/ShopAmazon.js
Roblox = Roblox || {}, Roblox.ShopAmazon = function() {
    function t() {
        $("a.roblox-shop-interstitial").on("click", function(n) {
            n.preventDefault(), Roblox.Dialog.open({
                titleText: "You are leaving ROBLOX",
                bodyContent: r(),
                allowHtmlContentInBody: !0,
                acceptText: "Continue to Shop",
                declineText: "Cancel",
                xToCancel: !0,
                acceptColor: Roblox.Dialog.green,
                declineColor: Roblox.Dialog.white,
                onAccept: i
            })
        })
    }

    function i() {
        window.open(n, "_blank")
    }

    function r() {
        return "<p>Your are about to visit our amazon store. You will be redirected to ROBLOX merchandise store on <a class='text-link' target='_blank' href='" + n + "' >Amazon.com</a>.</p> <p>Please note that you need to be over 18 to purchase products online. The amazon store is not part of rbx2016.tk and is governed by a separate privacy policy.</p>"
    }

    function u() {
        t()
    }
    var n = "https://www.amazon.com/roblox?&_encoding=UTF8&tag=r05d13-20&linkCode=ur2&linkId=4ba2e1ad82f781c8e8cc98329b1066d0&camp=1789&creative=9325";
    $(function() {
        u()
    })
}();

; // GenericConfirmation.js
typeof Roblox == "undefined" && (Roblox = {}), typeof Roblox.GenericConfirmation == "undefined" && (Roblox.GenericConfirmation = function() {
    function w() {
        n.isOpen = !1, t()
    }

    function k(t) {
        var a, e, o, s, l;
        n.isOpen = !0, a = {
            titleText: "",
            bodyContent: "",
            footerText: "",
            acceptText: Roblox.Resources.GenericConfirmation.yes,
            declineText: Roblox.Resources.GenericConfirmation.No,
            acceptColor: u,
            declineColor: f,
            xToCancel: !1,
            onAccept: function() {
                return !1
            },
            onDecline: function() {
                return !1
            },
            onCancel: function() {
                return !1
            },
            imageUrl: null,
            allowHtmlContentInBody: !1,
            allowHtmlContentInFooter: !1,
            dismissable: !0,
            fieldValidationRequired: !1,
            onOpenCallback: function() {}
        }, t = $.extend({}, a, t), c.overlayClose = t.dismissable, c.escClose = t.dismissable, e = $(i), e.html(t.acceptText), e.attr("class", "btn-large " + t.acceptColor), e.unbind(), e.bind("click", function() {
            return v(e) ? !1 : (t.fieldValidationRequired ? nt(t.onAccept) : h(t.onAccept), !1)
        }), o = $(r), o.html(t.declineText), o.attr("class", "btn-large " + t.declineColor), o.unbind(), o.bind("click", function() {
            return v(o) ? !1 : (h(t.onDecline), !1)
        }), $('[data-modal-handle="confirmation"] div.Title').text(t.titleText), s = $("[data-modal-handle='confirmation']"), t.imageUrl == null ? s.addClass("noImage") : (s.find("img.GenericModalImage").attr("src", t.imageUrl), s.removeClass("noImage")), t.allowHtmlContentInBody ? $("[data-modal-handle='confirmation'] div.Message").html(t.bodyContent) : $("[data-modal-handle='confirmation'] div.Message").text(t.bodyContent), $.trim(t.footerText) == "" ? $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').hide() : $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').show(), t.allowHtmlContentInFooter ? $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').html(t.footerText) : $('[data-modal-handle="confirmation"] div.ConfirmationModalFooter').text(t.footerText), $("[data-modal-handle='confirmation']").modal(c), l = $("a.genericmodal-close"), l.unbind(), l.bind("click", function() {
            return h(t.onCancel), !1
        }), t.xToCancel || l.hide(), t.onOpenCallback()
    }

    function a(n) {
        n.hasClass(f) ? n.addClass(s) : n.hasClass(l) ? n.addClass(e) : n.hasClass(u) && n.addClass(o)
    }

    function v(n) {
        return n.hasClass(o) || n.hasClass(s) || n.hasClass(e) ? !0 : !1
    }

    function b() {
        var n = $(i),
            t = $(r);
        a(n), a(t)
    }

    function g() {
        var u = $(i),
            t = $(r),
            n = o + " " + s + " " + e;
        u.removeClass(n), t.removeClass(n)
    }

    function p() {
        if (n.isOpen) {
            var t = $(i);
            t.click()
        }
    }

    function y() {
        var n = $(r);
        n.click()
    }

    function t(t) {
        n.isOpen = !1, typeof t != "undefined" ? $.modal.close(t) : $.modal.close()
    }

    function h(n) {
        t(), typeof n == "function" && n()
    }

    function nt(n) {
        if (typeof n == "function") {
            var i = n();
            if (i !== "undefined" && i == !1) return !1
        }
        t()
    }
    var l = "btn-primary",
        u = "btn-neutral",
        f = "btn-negative",
        e = "btn-disabled-primary",
        o = "btn-disabled-neutral",
        s = "btn-disabled-negative",
        d = "btn-none",
        i = "#roblox-confirm-btn",
        r = "#roblox-decline-btn",
        n = {
            isOpen: !1
        },
        c = {
            overlayClose: !0,
            escClose: !0,
            opacity: 80,
            overlayCss: {
                backgroundColor: "#000"
            },
            onClose: w
        };
    return {
        open: k,
        close: t,
        disableButtons: b,
        enableButtons: g,
        clickYes: p,
        clickNo: y,
        status: n,
        green: l,
        blue: u,
        gray: f,
        none: d
    }
}()), $(document).keypress(function(n) {
    Roblox.GenericConfirmation.status.isOpen && n.which === 13 && Roblox.GenericConfirmation.clickYes()
});
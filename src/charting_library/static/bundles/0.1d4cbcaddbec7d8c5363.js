(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    '29gu': function (e, t, o) {
      'use strict';
      var n =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e && 'function' == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              },
        s = o('uOxu').getLogger('CommonUI.CreateTVBlockPlugin');
      (e.exports.createTvBlockPlugin = function (e) {
        if (e)
          return function (t, o, n) {
            function s(t, o) {
              return o ? e[t](l, o) : e[t](l);
            }
            var a,
              l = $(this);
            return 'get' === t
              ? 'function' == typeof e[(a = o)]
                ? s(a, n)
                : e[a]
              : e[t]
              ? l.each(function () {
                  return s(t, void 0);
                })
              : l;
          };
      }),
        (e.exports.createTvBlockWithInstance = function (e, t) {
          function o(e, t, o) {
            return void 0 === o ? e[t]() : e[t](o);
          }
          if (e && t)
            return (
              (e = e.toString()),
              function (a, l, i) {
                var c, r, d;
                return (
                  'get' === a
                    ? (c = l)
                    : ((r = l),
                      'object' === (void 0 === a ? 'undefined' : n(a)) && void 0 === l
                        ? ((r = a), (a = 'init'))
                        : 'string' != typeof a && (a = 'init')),
                  'getInstance' === a
                    ? $(this).eq(0).data(e)
                    : 'destroy' === a
                    ? (d = $(this).eq(0).data(e))
                      ? void ('function' == typeof d.destroy
                          ? (o(d, 'destroy', r), $(this).eq(0).removeData(e))
                          : s.logError('[Block Plugin] ' + e + ' does not support destroy command'))
                      : void console.warn(
                          '[Block Plugin] Trying to execute destroy method of ' + e + ' but it has not been inited'
                        )
                    : 'get' === a
                    ? (d = $(this).eq(0).data(e))
                      ? 'function' == typeof d[c]
                        ? o(d, c, i)
                        : d[c]
                      : void console.warn(
                          '[Block Plugin] Trying to get prop or execute method of ' + e + ' but it has not been inited'
                        )
                    : $(this).each(function () {
                        var n = $(this),
                          l = n.data(e);
                        void 0 === l && ((l = void 0 === r ? t(n) : t(n, r)), n.data(e, l)),
                          'init' !== a &&
                            ('function' == typeof l[a]
                              ? o(l, a, r)
                              : s.logError('[Block Plugin] ' + e + ' does not support command ' + a));
                      })
                );
              }
            );
        });
    },
    QwKQ: function (e, t, o) {
      'use strict';
      (function (n) {
        var s, a, l, i, c, r;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (s = (function () {
            function e(e, t) {
              var o, n;
              for (o = 0; o < t.length; o++)
                ((n = t[o]).enumerable = n.enumerable || !1),
                  (n.configurable = !0),
                  'value' in n && (n.writable = !0),
                  Object.defineProperty(e, n.key, n);
            }
            return function (t, o, n) {
              return o && e(t.prototype, o), n && e(t, n), t;
            };
          })()),
          (a = o('29gu')),
          o('b6p+'),
          (l = o('uOxu').getLogger('Ui.TvControlCheckbox')),
          (i = {
            labelWrapper:
              '{{#hasLabel}}<label>{{#labelLeft}}<span class="tv-control-checkbox__label {{#labelAddClass}}{{labelAddClass}}{{/labelAddClass}}">{{labelLeft}}</span>{{/labelLeft}}{{> inputWrapper }}{{#labelRight}}<span class="tv-control-checkbox__label {{#labelAddClass}}{{labelAddClass}}{{/labelAddClass}}">{{labelRight}}</span>{{/labelRight}}</label>{{/hasLabel}}{{^hasLabel}}{{> inputWrapper }}{{/hasLabel}}',
            inputWrapper:
              '<{{ tag }} class="{{ customClass }}{{#disabled}} i-disabled{{/disabled}}">{{^hasCheckbox}}{{> checkbox }}{{/hasCheckbox}}{{> box }}{{> ripple }}</{{ tag }}>',
            checkbox:
              '<input{{#id}} id="{{ id }}"{{/id}} class="{{> checkboxClass }}" type="checkbox"{{#name}} name="{{ name }}"{{/name}}{{#checked}} checked{{/checked}}{{#disabled}} disabled{{/disabled}}>',
            checkboxClass: '{{ customClass }}__input',
            box:
              '<span class="{{ customClass }}__box {{#boxAddClass}}{{boxAddClass}}{{/boxAddClass}}">' +
              o('aLUT') +
              '</span>',
            ripple: '<span class="{{ customClass }}__ripple js-ripple"></span>',
          }),
          (c = 'i-inited'),
          (r = (function () {
            function e(t) {
              var o,
                n = t.customClass,
                s = void 0 === n ? 'tv-control-checkbox' : n,
                a = t.$checkbox,
                i = t.tag,
                r = t.id,
                d = t.name,
                u = t.checked,
                b = t.disabled,
                h = t.labelLeft,
                p = t.labelRight,
                f = t.labelAddClass,
                k = t.boxAddClass;
              if (
                ((function (e, t) {
                  if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
                })(this, e),
                (this.$el = null),
                void 0 === i && (i = h || p ? 'span' : 'label'),
                (o = a instanceof $ && !!a.length))
              ) {
                if (!a.is('input[type=checkbox]'))
                  return void l.logError('`$checkbox` need to be input[type=checkbox]');
                if (a.hasClass(c)) return;
                this._setInputId(a, r),
                  this._setInputClass(a, s),
                  this._setInputName(a, d),
                  this._setInputChecked(a, u),
                  this._setInputDisabled(a, b),
                  (u = !!a.prop('checked')),
                  (b = !!a.attr('disabled'));
              }
              (this.$el = this.render({
                $checkbox: a,
                hasCheckbox: o,
                customClass: s,
                tag: i,
                id: r,
                name: d,
                checked: u,
                disabled: b,
                labelLeft: h,
                labelRight: p,
                hasLabel: h || p,
                labelAddClass: f,
                boxAddClass: k,
              })),
                (this.$checkbox = o ? a : this.$el.find('input[type=checkbox]'));
            }
            return (
              s(e, [
                {
                  key: '_setInputId',
                  value: function (e, t) {
                    void 0 !== t && e.attr('id', t);
                  },
                },
                {
                  key: '_setInputClass',
                  value: function (e, t) {
                    var o = n.render(i.checkboxClass, { customClass: t });
                    e.addClass(o);
                  },
                },
                {
                  key: '_setInputName',
                  value: function (e, t) {
                    void 0 !== t && e.attr('name', t);
                  },
                },
                {
                  key: '_setInputChecked',
                  value: function (e, t) {
                    void 0 !== t && e.prop('checked', !!t);
                  },
                },
                {
                  key: '_setInputDisabled',
                  value: function (e, t) {
                    void 0 !== t && (t ? e.setAttribute('disabled', 'disabled') : e.removeAttr('disabled'));
                  },
                },
                {
                  key: 'render',
                  value: function (e) {
                    var t = e.$checkbox,
                      o = $(n.render(i.labelWrapper, e, i));
                    return (
                      e.hasCheckbox &&
                        (o.insertBefore(t),
                        o
                          .find('.' + e.customClass)
                          .andSelf()
                          .filter('.' + e.customClass)
                          .eq(0)
                          .prepend(t.detach()),
                        t.addClass(c)),
                      o
                    );
                  },
                },
                {
                  key: 'checked',
                  set: function (e) {
                    this._setInputChecked(this.$checkbox, !!e);
                  },
                  get: function () {
                    return !!this.$checkbox.prop('checked');
                  },
                },
              ]),
              e
            );
          })()),
          ($.fn.tvControlCheckbox = (0, a.createTvBlockWithInstance)('tv-control-checkbox', function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            return new r(TradingView.mergeObj(t, { $checkbox: e }));
          })),
          (t.default = r),
          (e.exports = t.default);
      }.call(this, o('OiQe')));
    },
    aLUT: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11px" height="9px"><path fill="none" fill-rule="evenodd" stroke-width="2" d="M1 3.22l3.415 3.496L10 1"/></svg>';
    },
    'b6p+': function (e, t, o) {},
  },
]);

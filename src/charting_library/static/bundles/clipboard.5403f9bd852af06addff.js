(window.webpackJsonp = window.webpackJsonp || []).push([
  ['clipboard'],
  {
    Ddwv: function (t, e, n) {
      var o, i, r;
      (i = [t, n('YDNs'), n('wOJ8'), n('TiCD')]),
        void 0 ===
          (r =
            'function' ==
            typeof (o = function (t, e, n, o) {
              'use strict';
              function i(t) {
                return t && t.__esModule ? t : { default: t };
              }
              function r(t, e) {
                var n = 'data-clipboard-' + t;
                if (e.hasAttribute(n)) return e.getAttribute(n);
              }
              var a = i(e),
                c = i(n),
                l = i(o),
                u =
                  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t;
                      },
                s = (function () {
                  function t(t, e) {
                    var n, o;
                    for (n = 0; n < e.length; n++)
                      ((o = e[n]).enumerable = o.enumerable || !1),
                        (o.configurable = !0),
                        'value' in o && (o.writable = !0),
                        Object.defineProperty(t, o.key, o);
                  }
                  return function (e, n, o) {
                    return n && t(e.prototype, n), o && t(e, o), e;
                  };
                })(),
                f = (function (t) {
                  function e(t, n) {
                    !(function (t, e) {
                      if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                    })(this, e);
                    var o = (function (t, e) {
                      if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                      return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
                    })(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
                    return o.resolveOptions(n), o.listenClick(t), o;
                  }
                  return (
                    (function (t, e) {
                      if ('function' != typeof e && null !== e)
                        throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
                      (t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                          value: t,
                          enumerable: !1,
                          writable: !0,
                          configurable: !0,
                        },
                      })),
                        e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
                    })(e, t),
                    s(
                      e,
                      [
                        {
                          key: 'resolveOptions',
                          value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            (this.action = 'function' == typeof t.action ? t.action : this.defaultAction),
                              (this.target = 'function' == typeof t.target ? t.target : this.defaultTarget),
                              (this.text = 'function' == typeof t.text ? t.text : this.defaultText),
                              (this.container = 'object' === u(t.container) ? t.container : document.body);
                          },
                        },
                        {
                          key: 'listenClick',
                          value: function (t) {
                            var e = this;
                            this.listener = (0, l.default)(t, 'click', function (t) {
                              return e.onClick(t);
                            });
                          },
                        },
                        {
                          key: 'onClick',
                          value: function (t) {
                            var e = t.delegateTarget || t.currentTarget;
                            this.clipboardAction && (this.clipboardAction = null),
                              (this.clipboardAction = new a.default({
                                action: this.action(e),
                                target: this.target(e),
                                text: this.text(e),
                                container: this.container,
                                trigger: e,
                                emitter: this,
                              }));
                          },
                        },
                        {
                          key: 'defaultAction',
                          value: function (t) {
                            return r('action', t);
                          },
                        },
                        {
                          key: 'defaultTarget',
                          value: function (t) {
                            var e = r('target', t);
                            if (e) return document.querySelector(e);
                          },
                        },
                        {
                          key: 'defaultText',
                          value: function (t) {
                            return r('text', t);
                          },
                        },
                        {
                          key: 'destroy',
                          value: function () {
                            this.listener.destroy(),
                              this.clipboardAction && (this.clipboardAction.destroy(), (this.clipboardAction = null));
                          },
                        },
                      ],
                      [
                        {
                          key: 'isSupported',
                          value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ['copy', 'cut'],
                              e = 'string' == typeof t ? [t] : t,
                              n = !!document.queryCommandSupported;
                            return (
                              e.forEach(function (t) {
                                n = n && !!document.queryCommandSupported(t);
                              }),
                              n
                            );
                          },
                        },
                      ]
                    ),
                    e
                  );
                })(c.default);
              t.exports = f;
            })
              ? o.apply(e, i)
              : o) || (t.exports = r);
    },
    TiCD: function (t, e, n) {
      var o = n('b+/x'),
        i = n('jFDo');
      t.exports = function (t, e, n) {
        if (!t && !e && !n) throw new Error('Missing required arguments');
        if (!o.string(e)) throw new TypeError('Second argument must be a String');
        if (!o.fn(n)) throw new TypeError('Third argument must be a Function');
        if (o.node(t))
          return (function (t, e, n) {
            return (
              t.addEventListener(e, n),
              {
                destroy: function () {
                  t.removeEventListener(e, n);
                },
              }
            );
          })(t, e, n);
        if (o.nodeList(t))
          return (function (t, e, n) {
            return (
              Array.prototype.forEach.call(t, function (t) {
                t.addEventListener(e, n);
              }),
              {
                destroy: function () {
                  Array.prototype.forEach.call(t, function (t) {
                    t.removeEventListener(e, n);
                  });
                },
              }
            );
          })(t, e, n);
        if (o.string(t))
          return (function (t, e, n) {
            return i(document.body, t, e, n);
          })(t, e, n);
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
      };
    },
    YDNs: function (t, e, n) {
      var o, i, r;
      (i = [t, n('gvr7')]),
        void 0 ===
          (r =
            'function' ==
            typeof (o = function (t, e) {
              'use strict';
              var n,
                o = (n = e) && n.__esModule ? n : { default: n },
                i =
                  'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                    ? function (t) {
                        return typeof t;
                      }
                    : function (t) {
                        return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                          ? 'symbol'
                          : typeof t;
                      },
                r = (function () {
                  function t(t, e) {
                    var n, o;
                    for (n = 0; n < e.length; n++)
                      ((o = e[n]).enumerable = o.enumerable || !1),
                        (o.configurable = !0),
                        'value' in o && (o.writable = !0),
                        Object.defineProperty(t, o.key, o);
                  }
                  return function (e, n, o) {
                    return n && t(e.prototype, n), o && t(e, o), e;
                  };
                })(),
                a = (function () {
                  function t(e) {
                    !(function (t, e) {
                      if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                    })(this, t),
                      this.resolveOptions(e),
                      this.initSelection();
                  }
                  return (
                    r(t, [
                      {
                        key: 'resolveOptions',
                        value: function () {
                          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                          (this.action = t.action),
                            (this.container = t.container),
                            (this.emitter = t.emitter),
                            (this.target = t.target),
                            (this.text = t.text),
                            (this.trigger = t.trigger),
                            (this.selectedText = '');
                        },
                      },
                      {
                        key: 'initSelection',
                        value: function () {
                          this.text ? this.selectFake() : this.target && this.selectTarget();
                        },
                      },
                      {
                        key: 'selectFake',
                        value: function () {
                          var t,
                            e = this,
                            n = 'rtl' == document.documentElement.getAttribute('dir');
                          this.removeFake(),
                            (this.fakeHandlerCallback = function () {
                              return e.removeFake();
                            }),
                            (this.fakeHandler =
                              this.container.addEventListener('click', this.fakeHandlerCallback) || !0),
                            (this.fakeElem = document.createElement('textarea')),
                            (this.fakeElem.style.fontSize = '12pt'),
                            (this.fakeElem.style.border = '0'),
                            (this.fakeElem.style.padding = '0'),
                            (this.fakeElem.style.margin = '0'),
                            (this.fakeElem.style.position = 'absolute'),
                            (this.fakeElem.style[n ? 'right' : 'left'] = '-9999px'),
                            (t = window.pageYOffset || document.documentElement.scrollTop),
                            (this.fakeElem.style.top = t + 'px'),
                            this.fakeElem.setAttribute('readonly', ''),
                            (this.fakeElem.value = this.text),
                            this.container.appendChild(this.fakeElem),
                            (this.selectedText = (0, o.default)(this.fakeElem)),
                            this.copyText();
                        },
                      },
                      {
                        key: 'removeFake',
                        value: function () {
                          this.fakeHandler &&
                            (this.container.removeEventListener('click', this.fakeHandlerCallback),
                            (this.fakeHandler = null),
                            (this.fakeHandlerCallback = null)),
                            this.fakeElem && (this.container.removeChild(this.fakeElem), (this.fakeElem = null));
                        },
                      },
                      {
                        key: 'selectTarget',
                        value: function () {
                          (this.selectedText = (0, o.default)(this.target)), this.copyText();
                        },
                      },
                      {
                        key: 'copyText',
                        value: function () {
                          var t = void 0;
                          try {
                            t = document.execCommand(this.action);
                          } catch (e) {
                            t = !1;
                          }
                          this.handleResult(t);
                        },
                      },
                      {
                        key: 'handleResult',
                        value: function (t) {
                          this.emitter.emit(t ? 'success' : 'error', {
                            action: this.action,
                            text: this.selectedText,
                            trigger: this.trigger,
                            clearSelection: this.clearSelection.bind(this),
                          });
                        },
                      },
                      {
                        key: 'clearSelection',
                        value: function () {
                          this.trigger && this.trigger.focus(), window.getSelection().removeAllRanges();
                        },
                      },
                      {
                        key: 'destroy',
                        value: function () {
                          this.removeFake();
                        },
                      },
                      {
                        key: 'action',
                        set: function () {
                          var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'copy';
                          if (((this._action = t), 'copy' !== this._action && 'cut' !== this._action))
                            throw new Error('Invalid "action" value, use either "copy" or "cut"');
                        },
                        get: function () {
                          return this._action;
                        },
                      },
                      {
                        key: 'target',
                        set: function (t) {
                          if (void 0 !== t) {
                            if (!t || 'object' !== (void 0 === t ? 'undefined' : i(t)) || 1 !== t.nodeType)
                              throw new Error('Invalid "target" value, use a valid Element');
                            if ('copy' === this.action && t.hasAttribute('disabled'))
                              throw new Error(
                                'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                              );
                            if ('cut' === this.action && (t.hasAttribute('readonly') || t.hasAttribute('disabled')))
                              throw new Error(
                                'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                              );
                            this._target = t;
                          }
                        },
                        get: function () {
                          return this._target;
                        },
                      },
                    ]),
                    t
                  );
                })();
              t.exports = a;
            })
              ? o.apply(e, i)
              : o) || (t.exports = r);
    },
    'b+/x': function (t, e) {
      (e.node = function (t) {
        return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType;
      }),
        (e.nodeList = function (t) {
          var n = Object.prototype.toString.call(t);
          return (
            void 0 !== t &&
            ('[object NodeList]' === n || '[object HTMLCollection]' === n) &&
            'length' in t &&
            (0 === t.length || e.node(t[0]))
          );
        }),
        (e.string = function (t) {
          return 'string' == typeof t || t instanceof String;
        }),
        (e.fn = function (t) {
          return '[object Function]' === Object.prototype.toString.call(t);
        });
    },
    gvr7: function (t, e) {
      t.exports = function (t) {
        var e, n, o, i;
        return (
          'SELECT' === t.nodeName
            ? (t.focus(), (e = t.value))
            : 'INPUT' === t.nodeName || 'TEXTAREA' === t.nodeName
            ? ((n = t.hasAttribute('readonly')) || t.setAttribute('readonly', ''),
              t.select(),
              t.setSelectionRange(0, t.value.length),
              n || t.removeAttribute('readonly'),
              (e = t.value))
            : (t.hasAttribute('contenteditable') && t.focus(),
              (o = window.getSelection()),
              (i = document.createRange()).selectNodeContents(t),
              o.removeAllRanges(),
              o.addRange(i),
              (e = o.toString())),
          e
        );
      };
    },
    jFDo: function (t, e, n) {
      function o(t, e, n, o, r) {
        var a = function (t, e, n, o) {
          return function (n) {
            (n.delegateTarget = i(n.target, e)), n.delegateTarget && o.call(t, n);
          };
        }.apply(this, arguments);
        return (
          t.addEventListener(n, a, r),
          {
            destroy: function () {
              t.removeEventListener(n, a, r);
            },
          }
        );
      }
      var i = n('lNia');
      t.exports = function (t, e, n, i, r) {
        return 'function' == typeof t.addEventListener
          ? o.apply(null, arguments)
          : 'function' == typeof n
          ? o.bind(null, document).apply(null, arguments)
          : ('string' == typeof t && (t = document.querySelectorAll(t)),
            Array.prototype.map.call(t, function (t) {
              return o(t, e, n, i, r);
            }));
      };
    },
    lNia: function (t, e) {
      var n,
        o = 9;
      'undefined' == typeof Element ||
        Element.prototype.matches ||
        ((n = Element.prototype).matches =
          n.matchesSelector ||
          n.mozMatchesSelector ||
          n.msMatchesSelector ||
          n.oMatchesSelector ||
          n.webkitMatchesSelector),
        (t.exports = function (t, e) {
          for (; t && t.nodeType !== o; ) {
            if ('function' == typeof t.matches && t.matches(e)) return t;
            t = t.parentNode;
          }
        });
    },
    wOJ8: function (t, e) {
      function n() {}
      (n.prototype = {
        on: function (t, e, n) {
          var o = this.e || (this.e = {});
          return (o[t] || (o[t] = [])).push({ fn: e, ctx: n }), this;
        },
        once: function (t, e, n) {
          function o() {
            i.off(t, o), e.apply(n, arguments);
          }
          var i = this;
          return (o._ = e), this.on(t, o, n);
        },
        emit: function (t) {
          for (
            var e = [].slice.call(arguments, 1), n = ((this.e || (this.e = {}))[t] || []).slice(), o = 0, i = n.length;
            o < i;
            o++
          )
            n[o].fn.apply(n[o].ctx, e);
          return this;
        },
        off: function (t, e) {
          var n,
            o,
            i = this.e || (this.e = {}),
            r = i[t],
            a = [];
          if (r && e) for (n = 0, o = r.length; n < o; n++) r[n].fn !== e && r[n].fn._ !== e && a.push(r[n]);
          return a.length ? (i[t] = a) : delete i[t], this;
        },
      }),
        (t.exports = n),
        (t.exports.TinyEmitter = n);
    },
  },
]);

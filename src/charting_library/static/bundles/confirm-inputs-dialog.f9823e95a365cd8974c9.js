(window.webpackJsonp = window.webpackJsonp || []).push([
  ['confirm-inputs-dialog'],
  {
    KFNk: function (t, e, n) {},
    wv8n: function (t, e, n) {
      'use strict';
      var o, i, l, a, s, c, r, d;
      Object.defineProperty(e, '__esModule', { value: !0 }),
        (e.show = function (t, e) {
          var n,
            a,
            d,
            u,
            p,
            f,
            v,
            g,
            y,
            _,
            m,
            w = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          for (
            w = $.extend({}, { title: $.t('Confirm Inputs'), callback: function (t) {} }, w),
              n = null,
              a = (0, o.createDialog)({
                title: w.title,
                contentWrapTemplate: '<div class="tv-dialog__section tv-dialog__section--no-border"></div>',
                width: c,
                closeOnClickAtOtherDialogs: !0,
                destroyOnClose: !0,
                actionsWrapTemplate:
                  '<div class="tv-dialog__section tv-dialog__section--actions tv-dialog__section--actions-adaptive tv-dialog__section--no-border">',
                isClickOutFn: function (t) {
                  var e = n.symbolSearchPopup();
                  if (e) return e[0] !== t.target && !e[0].contains(t.target) && void 0;
                },
                actions: [
                  {
                    name: 'apply',
                    type: 'primary',
                    text: $.t('Apply'),
                    key: 13,
                  },
                ],
              }),
              r = a,
              d = (0, l.merge)({}, e.defaults.inputs),
              u = 0;
            u < e.inputs.length;
            ++u
          )
            (p = e.inputs[u]).confirm || delete d[p.id];
          (f = new s.default({ inputs: d })),
            (v = {
              metaInfo: function () {
                return e;
              },
              symbolsResolved: function () {
                return null;
              },
              resolvedSymbolInfoBySymbol: function () {
                return null;
              },
            }),
            (g = a.$content),
            a.open(),
            (y = (n = new i.StudyInputsPropertyPage(f, t.model(), v, !0, a.zIndex)).widget()),
            g.append(y),
            Array.prototype.forEach.call(g.find('select'), function (t) {
              var e = $(t),
                n = 'tv-select-container dialog';
              e.hasClass('tv-select-container-fontsize') && (n += ' tv-select-container-fontsize'),
                e.selectbox({ speed: 100, classHolder: n });
            }),
            $('input[type="text"]', g).addClass('tv-text-input inset dialog'),
            $('input.ticker', g).TVTicker(),
            a.on('action:apply', function () {
              var t = w.callback,
                e = f.state();
              t(e), a.close();
            }),
            (_ = a.$content.innerWidth() - a.$content.width()),
            (m = y.width() + _) > c && a.$el.css('max-width', m),
            g.find('input,select').first().focus();
        }),
        (e.instance = function () {
          return r;
        }),
        (o = n('YDhE')),
        (i = n('L9lC')),
        (l = n('ogJP')),
        (a = n('tc+8')),
        (s = (d = a) && d.__esModule ? d : { default: d }),
        n('PVgW'),
        n('jgM0'),
        n('KFNk'),
        (c = 450),
        (r = null);
    },
  },
]);

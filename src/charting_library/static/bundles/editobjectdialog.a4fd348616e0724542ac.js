(window.webpackJsonp = window.webpackJsonp || []).push([
  ['editobjectdialog'],
  {
    KFNk: function (t, e, i) {},
    Kqsj: function (t, e, i) {
      'use strict';
      (function (t) {
        function o(t, e, i) {
          (this._source = t), (this._model = e), (this._undoCheckpoint = i);
        }
        var a, n, r, s, l, p, c, d, u, h;
        i('jgM0'),
          i('KFNk'),
          (a = i('Ss5c').LineDataSource),
          (n = i('GVHu').Study),
          (r = i('qJq3').Series),
          (s = i('fgLi').DataSource),
          (l = i('FQhm')),
          (p = i('bR4N').bindPopupMenu),
          (c = i('QloM')),
          (d = i('GAqT').TVOldDialogs),
          (u = i('tITk').trackEvent),
          (h = i('CW80').isLineTool),
          i('PVgW'),
          (o.prototype.hide = function (t) {
            d.destroy(this._dialogTitle, { undoChanges: !!t });
          }),
          (o.prototype._onDestroy = function (t, e) {
            var i,
              o,
              a = (e || {}).undoChanges;
            $(window).unbind('keyup.hidePropertyDialog'),
              a
                ? (i = this._undoCheckpoint ? this._undoCheckpoint : this._undoCheckpointOnShow) &&
                  this._model.undoToCheckpoint(i)
                : this._source.hasAlert.value() &&
                  ((o = this._source),
                  setTimeout(function () {
                    o.localAndServerAlersMismatch && o.synchronizeAlert(!0);
                  })),
              this._undoCheckpointOnShow && delete this._undoCheckpointOnShow,
              window.lineToolPropertiesToolbar && window.lineToolPropertiesToolbar.refresh();
          }),
          (o.prototype.isVisible = function () {
            return this._dialog && this._dialog.is(':visible');
          }),
          (o.prototype.focusOnText = function () {
            this._dialog.find('input[type="text"]').focus().select();
          }),
          (o.prototype.switchTab = function (t, e) {
            var i, o;
            if (this._tabs)
              return (
                (i = null),
                t ? (t = t.valueOf()) : null === t && (t = void 0),
                'string' == typeof t &&
                  $.each(this._tabs, function (e, o) {
                    if (o.name === t) return (i = o), !1;
                  }),
                'object' == typeof t &&
                  $.each(this._tabs, function (e, o) {
                    if (t === o || $(o.labelObject).is(t) || $(o.wrapperObject).is(t)) return (i = o), !1;
                  }),
                i || (i = this._tabs[~~t]),
                !!i &&
                  ($.each(this._tabs, function (t, e) {
                    var o = e === i;
                    $(e.wrapperObject)[o ? 'show' : 'hide'](),
                      $(e.labelObject)[o ? 'addClass' : 'removeClass']('active');
                  }),
                  e && (o = this.activeTabSettingsName()) && TVSettings.setValue(o, i.name),
                  this._dialog.height() + 100 > $(window).height() && !i.isScrollable && this.makeScrollable(i),
                  $(':focus').blur(),
                  !0)
              );
          }),
          (o.prototype.makeScrollable = function (t) {
            var e = t.wrapperObject,
              i = $(t.objects[0]),
              o = i.width();
            e.css({ height: $(window).height() / 1.4, overflow: 'auto' }),
              i.css('width', o + 20),
              (t.isScrollable = !0);
          }),
          (o.prototype.appendToTab = function (t, e, i, o, a, n) {
            var r, s;
            ($(t).is('table') && !$(t).find('tr').size()) ||
              (this._tabs || (this._tabs = []),
              $.each(this._tabs, function (t, i) {
                if (i.name === e) return (r = t), !1;
              }),
              void 0 === r &&
                (this._tabs.push({
                  name: e,
                  localizedName: $.t(e),
                  objects: $(),
                  displayPriority: 0,
                  defaultOpen: 0,
                  isButton: !!a,
                  callback: a ? n || function () {} : null,
                }),
                (r = this._tabs.length - 1)),
              ((s = this._tabs[r]).objects = s.objects.add(t)),
              (s.displayPriority = Math.max(s.displayPriority || 0, i || 0)),
              (s.defaultOpen = Math.max(s.defaultOpen || 0, o || 0)));
          }),
          (o.prototype.insertTabs = function () {
            function t(t) {
              a && a === t.name && (t.defaultOpen = Math.max(~~t.defaultOpen, c.TabOpenFrom.UserSave)),
                (!i || ~~i.defaultOpen < ~~t.defaultOpen) && (i = t),
                (t.labelObject = $('<a href="#" class="properties-tabs-label tv-tabs__tab"></a>')
                  .text(t.localizedName)
                  .appendTo(e._tabContainer)),
                t.labelObject.on('mousedown', function (t) {
                  function i(t) {
                    var e;
                    n = n || ((e = t), Math.abs(o - e.pageX) > 5 || Math.abs(a - e.pageY) > 5);
                  }
                  var o = t.pageX,
                    a = t.pageY,
                    n = !1,
                    r = this;
                  $(r).on('mousemove', i),
                    $(r).one('mouseup', function () {
                      n || e.switchTab(r, !0), $(r).off('mousemove', i);
                    });
                });
              var o = $('<div class="main-properties"></div>');
              (t.wrapperObject = $().add(o)),
                t.objects.each(function (e, i) {
                  var a = $(i);
                  a.is('table')
                    ? (a.data('layout-separated') &&
                        ((t.wrapperObject = t.wrapperObject
                          .add('<div class="properties-separator"></div>')
                          .add((o = $('<div class="main-properties"></div>')))),
                        a.removeData('layout-separated')),
                      o.append(a),
                      a.children('tbody').each(function (e, a) {
                        if (0 !== e && $(a).data('layout-separated')) {
                          t.wrapperObject = t.wrapperObject
                            .add('<div class="properties-separator"></div>')
                            .add((o = $('<div class="main-properties"></div>')));
                          var n = $(i).clone(!0, !1).appendTo(o);
                          n.children().remove(), n.append(a), $(a).removeData('layout-separated');
                        }
                      }))
                    : o.append(a);
                }),
                t.wrapperObject.appendTo(e._container);
            }
            var e, i, o, a;
            this._tabs &&
              (this._tabs.sort(function (t, e) {
                return (e.displayPriority || 0) - (t.displayPriority || 0);
              }),
              (e = this),
              (i = null),
              (o = this.activeTabSettingsName()) && (a = TVSettings.getValue(o)),
              $.each(this._tabs, function (i, o) {
                var a;
                o.isButton
                  ? (((a = o).labelObject = $('<a href="#" class="properties-tabs-label tv-tabs__tab"></a>')
                      .text(a.localizedName)
                      .appendTo(e._tabContainer)),
                    a.labelObject.bind('click', a.callback))
                  : t(o);
              }),
              this.switchTab(i));
          }),
          (o.prototype.activeTabSettingsName = function () {
            var t = this._source;
            if (t)
              return t instanceof r
                ? 'properties_dialog.active_tab.chart'
                : t instanceof a
                ? 'properties_dialog.active_tab.drawing'
                : t instanceof n
                ? 'properties_dialog.active_tab.study'
                : void 0;
          }),
          (o.prototype.show = function (e) {
            function o(t, e) {
              P.hide(!!e);
            }
            var b, f, _, y, g, m, T, v, w, P, C, S, k, O, D, x, j, I, N, B, L, V, F, R, A;
            if (
              t.enabled('property_pages') &&
              ((b = i('kSsA')),
              (f = (e = e || {}).onWidget || !1),
              (_ = null),
              TradingView.isInherited(this._source.constructor, r) &&
                ((_ = 'series-properties-dialog'), u('GUI', 'Series Properties')),
              TradingView.isInherited(this._source.constructor, n) &&
                ((_ = 'indicator-properties-dialog'),
                (y =
                  !this._source.isPine() || this._source.isStandardPine()
                    ? this._source.metaInfo().description
                    : 'Custom Pine'),
                u('GUI', 'Study Properties', y)),
              h(this._source) &&
                ((_ = 'drawing-properties-dialog'), u('GUI', 'Drawing Properties', this._source.name())),
              TradingView.isInherited(this._source.constructor, s) && this._model.addSourceToSelection(this._source),
              (g = b.createStudyStrategyPropertyPage(this._source, this._model)),
              (m = b.createInputsPropertyPage(this._source, this._model)),
              (T = b.createStylesPropertyPage(this._source, this._model)),
              (v = b.createVisibilitiesPropertyPage(this._source, this._model)),
              (w = b.createDisplayPropertyPage(this._source, this._model)),
              (m && !m.widget().is(':empty')) || T || g)
            )
              return (
                (P = this),
                (C = null !== m),
                (S = this._source.title()),
                (k = e.ownerDocument || this._model._chartWidget.widget().prop('ownerDocument')),
                (O = d
                  .createDialog(S, {
                    hideTitle: !0,
                    dragHandle: '.properties-tabs',
                    ownerDocument: k,
                  })
                  .attr('data-dialog-type', _)),
                (D = O.find('._tv-dialog-content')),
                (x = $('<div class="properties-tabs tv-tabs"></div>').appendTo(D)),
                (j = []),
                (I = 400),
                (this._tabs = j),
                (this._dialog = O),
                (this._dialogTitle = S),
                (this._container = D),
                (this._tabContainer = x),
                (this._undoCheckpointOnShow = this._model.createUndoCheckpoint()),
                O.on('destroy', function (t, e) {
                  e = e || {};
                  m && m.destroy(),
                    g && g.destroy(),
                    T && T.destroy(),
                    w && w.destroy(),
                    v && v.destroy(),
                    $('select', D).each(function () {
                      $(this).selectbox('detach');
                    }),
                    P._onDestroy(t, e);
                }),
                !this._model.readOnly() &&
                  g &&
                  g.widget().each(function (t, e) {
                    var i,
                      o,
                      a = +$(e).data('layout-tab-priority');
                    isNaN(a) && (a = c.TabPriority.Properties),
                      (i = ~~$(e).data('layout-tab-open')),
                      void 0 === (o = $(e).data('layout-tab')) && (o = c.TabNames.properties),
                      P.appendToTab(e, o, a, i);
                  }),
                this._model.readOnly() ||
                  !C ||
                  m.widget().is(':empty') ||
                  m.widget().each(function (t, e) {
                    var o,
                      a,
                      n = i('n3Kh'),
                      r = m instanceof n,
                      s = +$(e).data('layout-tab-priority');
                    TradingView.isNaN(s) && (s = r ? c.TabPriority.Coordinates : c.TabPriority.Inputs),
                      (o = ~~$(e).data('layout-tab-open')),
                      void 0 === (a = $(e).data('layout-tab')) && (a = r ? c.TabNames.coordinates : c.TabNames.inputs),
                      P.appendToTab(e, a, s, o);
                  }),
                T &&
                  T.widget().each(function (t, e) {
                    var o,
                      a,
                      n,
                      r = +$(e).data('layout-tab-priority');
                    TradingView.isNaN(r) && (r = c.TabPriority.Style),
                      (o = ~~$(e).data('layout-tab-open')),
                      (a = i('Yc1q')),
                      !o && T instanceof a && (o = c.TabOpenFrom.Default),
                      void 0 === (n = $(e).data('layout-tab')) && (n = c.TabNames.style),
                      P.appendToTab(e, n, r, o);
                  }),
                w &&
                  w.widget().each(function (t, e) {
                    var i,
                      o,
                      a = +$(e).data('layout-tab-priority');
                    TradingView.isNaN(a) && (a = c.TabPriority.Display),
                      (i = ~~$(e).data('layout-tab-open')),
                      void 0 === (o = $(e).data('layout-tab')) && (o = c.TabNames.properties),
                      P.appendToTab(e, o, a, i);
                  }),
                v &&
                  v.widget().each(function (t, e) {
                    P.appendToTab(e, c.TabNames.visibility, c.TabPriority.Display, !1);
                  }),
                this._source instanceof n && !!this._source.metaInfo().pine && this._source.metaInfo(),
                this.insertTabs(),
                this._helpItemRequired() && this._createHelp(),
                (L = 110),
                $('.js-dialog').each(function () {
                  var t = parseInt($(this).css('z-index'), 10);
                  t > L && (L = t);
                }),
                O.css('z-index', L),
                (N = $('<div class="main-properties main-properties-aftertabs"></div>').appendTo(D)),
                (B = $('<div class="dialog-buttons">').appendTo(N)),
                (V = function () {
                  v && v.loadData(), m && m.loadData();
                }),
                (!f || window.is_authenticated) &&
                T &&
                'function' == typeof T.createTemplateButton &&
                t.enabled('linetoolpropertieswidget_template_button')
                  ? (P._templateButton = T.createTemplateButton({
                      popupZIndex: L,
                      defaultsCallback: e.onResetToDefault,
                      loadTemplateCallback: V,
                    })
                      .addClass('tv-left')
                      .appendTo(B))
                  : TradingView.isInherited(this._source.constructor, n)
                  ? ((F = [
                      {
                        title: $.t('Reset Settings'),
                        action: e.onResetToDefault,
                      },
                      {
                        title: $.t('Save As Default'),
                        action: function () {
                          P._source.properties().saveDefaults();
                        },
                      },
                    ]),
                    (R = $(
                      '<a href="#" class="_tv-button tv-left">' +
                        $.t('Defaults') +
                        '<span class="icon-dropdown"></span></a>'
                    ))
                      .on('click', function (t) {
                        t.preventDefault();
                        var e = $(this);
                        e.is('.active') || e.trigger('button-popup', [F, !0]);
                      })
                      .appendTo(B),
                    p(R, null, {
                      direction: 'down',
                      event: 'button-popup',
                      notCloseOnButtons: !0,
                      zIndex: L,
                    }))
                  : $('<a class="_tv-button tv-left">' + $.t('Defaults') + '</a>')
                      .appendTo(B)
                      .click(e.onResetToDefault),
                $('<a class="_tv-button ok">' + $.t('OK') + '</a>')
                  .appendTo(B)
                  .click(function () {
                    P.hide();
                  }),
                $('<a class="_tv-button cancel">' + $.t('Cancel') + '</a>')
                  .appendTo(B)
                  .on('click', function (t) {
                    o(0, !0);
                  }),
                O.find('._tv-dialog-title a').on('click', o),
                $(window).bind('keyup.hidePropertyDialog', function (t) {
                  13 === t.keyCode &&
                    'textarea' !== t.target.tagName.toLowerCase() &&
                    (P._templateButton && P._templateButton.trigger('hide-popup'), P.hide());
                }),
                $('select', D).each(function () {
                  var t = $(this),
                    e = 'tv-select-container dialog';
                  t.hasClass('tv-select-container-fontsize') && (e += ' tv-select-container-fontsize'),
                    t.selectbox({ speed: 100, classHolder: e });
                }),
                $('input[type="text"]', D).addClass('tv-text-input inset dialog'),
                $('input.ticker', D).TVTicker(),
                O.css('min-width', I + 'px'),
                d.applyHandlers(O, e),
                (A = {
                  top: ($(window).height() - O.height()) / 2,
                  left: ($(window).width() - O.width()) / 2,
                }),
                T && 'function' == typeof T.dialogPosition && (A = T.dialogPosition(A, O) || A),
                d.positionDialog(O, A),
                window.lineToolPropertiesToolbar && window.lineToolPropertiesToolbar.hide(),
                l.emit('edit_object_dialog', {
                  objectType:
                    this._source === this._model.mainSeries()
                      ? 'mainSeries'
                      : this._source instanceof a
                      ? 'drawing'
                      : this._source instanceof n
                      ? 'study'
                      : 'other',
                  scriptTitle: this._source.title(),
                }),
                O
              );
          }),
          (o.prototype._helpItemRequired = function () {
            return this._source._metaInfo && !!this._source._metaInfo.helpURL;
          }),
          (o.prototype._createHelp = function () {
            var t = $('<a class="help" href="#" target="_blank" title="' + $.t('Help') + '"></a>');
            t.attr('href', this._source._metaInfo.helpURL), this._tabContainer.prepend(t);
          }),
          (o.prototype.dialogWidget = function () {
            return this._dialog;
          }),
          (e.EditObjectDialog = o);
      }.call(this, i('Kxc7')));
    },
    Yc1q: function (t, e, i) {
      'use strict';
      function o(t) {
        function e(e, i, o) {
          t.call(this, e, i, o),
            (this._linetool = o),
            (this._templateList = new p(this._linetool._constructor, this.applyTemplate.bind(this)));
        }
        return (
          inherit(e, t),
          (e.prototype.applyTemplate = function (t) {
            this.model().applyLineToolTemplate(this._linetool, t, 'Apply Drawing Template'), this.loadData();
          }),
          (e.prototype.createTemplateButton = function (t) {
            var e = this;
            return (
              (t = $.extend({}, t, {
                getDataForSaveAs: function () {
                  return e._linetool.template();
                },
              })),
              this._templateList.createButton(t)
            );
          }),
          e
        );
      }
      function a(t, e, i) {
        r.call(this, t, e), (this._linetool = i);
      }
      var n = i('DxCR'),
        r = n.PropertyPage,
        s = n.ColorBinding,
        l = i('jNEI').addColorPicker,
        p = i('guTw');
      inherit(a, r),
        (a.prototype.createOneColorForAllLinesWidget = function () {
          var t = $("<td class='colorpicker-cell'>");
          return (
            this.bindControl(
              new s(l(t), this._linetool.properties().collectibleColors, !0, this.model(), 'Change All Lines Color', 0)
            ),
            { label: $('<td>' + $.t('Use one color') + '</td>'), editor: t }
          );
        }),
        (a.prototype.addOneColorPropertyWidget = function (t) {
          var e = this.createOneColorForAllLinesWidget(),
            i = $('<tr>');
          i.append($('<td>')).append(e.label).append(e.editor), i.appendTo(t);
        }),
        ((a = o(a)).createTemplatesPropertyPage = o),
        (t.exports = a);
    },
    n3Kh: function (t, e, i) {
      'use strict';
      function o(t, e, i) {
        n.call(this, t, e), (this._linetool = i), this.prepareLayout();
      }
      var a = i('DxCR'),
        n = a.PropertyPage,
        r = a.GreateTransformer,
        s = a.LessTransformer,
        l = a.ToIntTransformer,
        p = a.SimpleStringBinder;
      i('PVgW'),
        inherit(o, n),
        (o.BarIndexPastLimit = -5e4),
        (o.BarIndexFutureLimit = 15e3),
        (o.prototype.bindBarIndex = function (t, e, i, a) {
          var n = [l(t.value()), r(o.BarIndexPastLimit), s(o.BarIndexFutureLimit)];
          this.bindControl(this.createStringBinder(e, t, n, !0, i, a));
        }),
        (o.prototype.createPriceEditor = function (t) {
          var e,
            i,
            o,
            a = this._linetool,
            n = a.ownerSource().formatter(),
            r = function (t) {
              return n.format(t);
            },
            s = function (t) {
              var e = n.parse(t);
              if (e.res) return null != e.price ? e.price : e.value;
            },
            l = $("<input type='text'>");
          return (
            l.TVTicker({
              step: n._minMove / n._priceScale || 1,
              formatter: r,
              parser: s,
            }),
            t &&
              ((e = [
                function (e) {
                  var i = s(e);
                  return void 0 === i ? t.value() : i;
                },
              ]),
              (i = 'Change ' + a.title() + ' point price'),
              (o = this.createStringBinder(l, t, e, !1, this.model(), i)).addFormatter(function (t) {
                return n.format(t);
              }),
              this.bindControl(o)),
            l
          );
        }),
        (o.prototype._createPointRow = function (t, e, i) {
          var o,
            a,
            n,
            r,
            s = $('<tr>'),
            l = $('<td>');
          return (
            l.html($.t('Price') + i),
            l.appendTo(s),
            (o = $('<td>')).appendTo(s),
            this.createPriceEditor(e.price).appendTo(o),
            (a = $('<td>')).html($.t('Bar #')),
            a.appendTo(s),
            (n = $('<td>')).appendTo(s),
            (r = $("<input type='text'>")).appendTo(n),
            r.addClass('ticker'),
            this.bindBarIndex(e.bar, r, this.model(), 'Change ' + this._linetool.title() + ' point bar index'),
            s
          );
        }),
        (o.prototype.prepareLayoutForTable = function (t) {
          var e,
            i,
            o,
            a,
            n = this._linetool.points(),
            r = n.length;
          for (e = 0; e < n.length; e++)
            (i = n[e]),
              (o = this._linetool.properties().points[e]) &&
                ((a = e || r > 1 ? ' ' + (e + 1) : ''), this._createPointRow(i, o, a).appendTo(t));
        }),
        (o.prototype.prepareLayout = function () {
          (this._table = $(document.createElement('table'))),
            this._table.addClass('property-page'),
            this._table.attr('cellspacing', '0'),
            this._table.attr('cellpadding', '2'),
            this.prepareLayoutForTable(this._table),
            this.loadData();
        }),
        (o.prototype.widget = function () {
          return this._table;
        }),
        (o.prototype.createStringBinder = function (t, e, i, o, a, n) {
          return new p(t, e, i, o, a, n);
        }),
        (t.exports = o);
    },
  },
]);

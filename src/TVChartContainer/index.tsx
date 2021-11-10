import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  widget,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  Timezone,
} from '../charting_library/charting_library.min';
import { apiBaseUrl, isServer } from 'utils/constant';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
  overrides: any;
  locale: ChartingLibraryWidgetOptions['locale'];
}

export interface ChartContainerState {}

// function getLanguageFromURL(): LanguageCode | null {
//   const regex = new RegExp("[\\?&]lang=([^&#]*)");
//   const results = regex.exec(location.search);
//   return results === null
//     ? null
//     : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
// }

function getTimeZone() {
  const nowDate = new Date();
  const offset = -(nowDate.getTimezoneOffset() / 60);
  const timezoneArr = [
    {
      type: 'America/Sao_Paulo',
      value: -2,
    },
    {
      type: 'America/Argentina/Buenos_Aires',
      value: -3,
    },
    {
      type: 'America/Caracas',
      value: -4,
    },
    {
      type: 'America/New_York',
      value: -5,
    },
    {
      type: 'America/Chicago',
      value: -6,
    },
    {
      type: 'America/Phoenix',
      value: -7,
    },
    {
      type: 'America/Vancouver',
      value: -8,
    },
    {
      type: 'Pacific/Honolulu',
      value: -10,
    },
    {
      type: 'Pacific/Fakaofo',
      value: -11,
    },
    {
      type: 'Europe/London',
      value: 0,
    },
    {
      type: 'Europe/Paris',
      value: 1,
    },
    {
      type: 'Europe/Athens',
      value: 2,
    },
    {
      type: 'Europe/Moscow',
      value: 3,
    },
    {
      type: 'Asia/Dubai',
      value: 4,
    },
    {
      type: 'Asia/Ashkhabad',
      value: 5,
    },
    {
      type: 'Asia/Almaty',
      value: 6,
    },
    {
      type: 'Asia/Bangkok',
      value: 7,
    },
    {
      type: 'Asia/Kathmandu',
      value: 5.75,
    },
    {
      type: 'Asia/Kolkata',
      value: 5.5,
    },
    {
      type: 'Asia/Shanghai',
      value: 8,
    },
    {
      type: 'Asia/Tehran',
      value: 4.5,
    },
    {
      type: 'Asia/Tokyo',
      value: 9,
    },
    {
      type: 'Australia/ACT',
      value: 9.5,
    },
    {
      type: 'Australia/Sydney',
      value: 10,
    },
    {
      type: 'Pacific/Auckland',
      value: 12,
    },
    {
      type: 'Pacific/Chatham',
      value: 13,
    },
  ];
  let timeZone = 'Europe/Moscow';

  timezoneArr.forEach((zone) => {
    if (zone.value === offset) {
      timeZone = zone.type;
    }
  });

  return timeZone;
}

interface TVChartContainerProps {
  interval: string;
  symbol: string;
  locale: LanguageCode;
}

const TVChartContainer: React.FC<TVChartContainerProps> = ({ symbol, interval, locale }) => {
  const defaultProps: ChartContainerProps = {
    symbol: symbol && symbol !== '' ? symbol : 'BTC_USDT',
    interval: '60' as ResolutionString,
    containerId: 'tv_chart_container',
    datafeedUrl: apiBaseUrl,
    libraryPath: '/charting_library/',
    chartsStorageUrl: apiBaseUrl,
    chartsStorageApiVersion: '1.1',
    clientId: 'koindex.io',
    userId: 'koindex',
    fullscreen: false,
    autosize: true,
    locale: 'en',
    studiesOverrides: { SYMBOL_STRING_DATA: 'line' },
    overrides: {
      'mainSeriesProperties.style': 1,
      volumePaneSize: 'small',
    },
  };

  const [activeChart, setActiveChart] = useState<any>(null);

  useEffect(() => {
    if (isServer()) return;
    if (symbol && activeChart === null) {
      const widgetOptions: ChartingLibraryWidgetOptions = {
        symbol: symbol ?? (defaultProps.symbol as string),
        datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(defaultProps.datafeedUrl),
        interval: interval ?? (defaultProps.interval as ChartingLibraryWidgetOptions['interval']),
        container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
        library_path: defaultProps.libraryPath as string,
        locale: locale,
        //  getLanguageFromURL() || "en",
        disabled_features: [
          'use_localstorage_for_settings',
          'volume_force_overlay',
          'timeframes_toolbar',
          'display_market_status',
          'context_menus',
          'header_symbol_search',
          'header_widget_dom_node',
          'header_compare',
          'header_widget_dom_node',
          'header_fullscreen_button',
          // "header_widget",
          'timeframes_toolbar',
          // "edit_buttons_in_legend",
        ],
        enabled_features: [],
        charts_storage_url: defaultProps.chartsStorageUrl,
        charts_storage_api_version: defaultProps.chartsStorageApiVersion,
        client_id: defaultProps.clientId,
        user_id: defaultProps.userId,
        fullscreen: defaultProps.fullscreen,
        autosize: defaultProps.autosize,
        studies_overrides: defaultProps.studiesOverrides,
        theme: 'Dark',
        numeric_formatting: {
          decimal_sign: '.',
        },
        overrides: defaultProps.overrides,
        timezone: getTimeZone() as Timezone,
      };
      const w = new widget(widgetOptions);

      w.onChartReady(() => {
        w.activeChart().setResolution(interval as ResolutionString, () => {});
        setActiveChart(w.activeChart());
        // set chart type
        // w.activeChart().setChartType(3);
        // trigger close volume setting
        // const deleteBtn = (w as any)._iFrame.contentDocument.querySelector(
        //   "a.pane-legend-icon.delete"
        // );
        // if (deleteBtn) {
        //   deleteBtn.click();
        // }
        // console.log(w);
        // console.log((w.activeChart() as any)._chartWidget);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, activeChart, locale]);

  useEffect(() => {
    if (activeChart) {
      activeChart.setResolution(interval as ResolutionString, () => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval]);

  useEffect(() => {
    if (activeChart) {
      activeChart.setSymbol(symbol, () => {});
    }
  }, [symbol, activeChart]);

  return <div id={defaultProps.containerId} className={styles.TVChartContainer} />;
};

export default TVChartContainer;

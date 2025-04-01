import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';
import * as echarts from 'echarts';;

const MiniChart = ({ data, height = 250 }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ${c0}'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: '#d9d9d9'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      },
      axisLabel: {
        formatter: '${value}',
        color: '#666'
      }
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(24, 144, 255, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(24, 144, 255, 0.03)'
            }]
          }
        },
        emphasis: {
          focus: 'series'
        },
        showSymbol: false,
        data: data.map(item => item.value)
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default MiniChart;
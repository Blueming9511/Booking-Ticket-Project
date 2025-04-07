import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import dayjs from "dayjs";

const RevenueChart = ({ data, height = 400 }) => {
  const [bookingDetails = [], bookings = []] = data || [[], []];

  // Memoize combined data to prevent unnecessary recalculations
  const combinedData = useMemo(() => {
    return bookingDetails.map((detail) => ({
      ...detail,
      booking: bookings.find((b) => b.bookingCode === detail.bookingCode),
    }));
  }, [bookingDetails, bookings]);

  // Prepare chart data with memoization
  const chartData = useMemo(() => {
    if (!combinedData.length) return { dates: [], amounts: [] };

    const dailyData = combinedData.reduce((acc, item) => {
      const date = dayjs(item.booking?.createdAt || item.createdAt).format(
        "DD/MM/YYYY"
      );
      if (!date) return acc;
      
      acc[date] = (acc[date] || 0) + (item.booking?.totalPrice || item.totalAmount || 0);
      return acc;
    }, {});

    const sortedEntries = Object.entries(dailyData).sort(
      (a, b) => dayjs(a[0], "DD/MM/YYYY") - dayjs(b[0], "DD/MM/YYYY")
    );

    return {
      dates: sortedEntries.map(([date]) => date),
      amounts: sortedEntries.map(([_, amount]) => amount),
    };
  }, [combinedData]);

  const { dates, amounts } = chartData;

  const option = {
    // Enhanced tooltip with better styling
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "#e8e8e8",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "#333",
        fontSize: 12,
      },
      formatter: (params) => {
        const date = params[0].axisValue;
        const value = params[0].data;
        return `
          <div style="font-weight: 600; color: #1890ff">${date}</div>
          <div>Revenue: <strong>${value.toLocaleString()} VND</strong></div>
        `;
      },
      axisPointer: {
        type: "shadow",
        shadowStyle: {
          color: "rgba(24, 144, 255, 0.1)",
        },
      },
    },
    // Optimized grid layout
    grid: {
      top: "10%",
      left: "2%",
      right: "2%",
      bottom: "15%",
      containLabel: true,
    },
    // Enhanced X-axis
    xAxis: {
      type: "category",
      data: dates,
      axisLine: {
        lineStyle: {
          color: "#e8e8e8",
          width: 1,
        },
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: "#e8e8e8",
        },
      },
      axisLabel: {
        color: "#666",
        fontSize: 11,
        rotate: 45,
        formatter: (value) => value.split("/").slice(0, 2).join("/"),
      },
    },
    // Enhanced Y-axis
    yAxis: {
      type: "value",
      name: "Revenue (VND)",
      nameTextStyle: {
        color: "#666",
        fontSize: 12,
        padding: [0, 0, 10, 0],
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: "#f0f0f0",
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#666",
        fontSize: 11,
        formatter: (value) => {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
          return value;
        },
      },
    },
    // Enhanced series
    series: [
      {
        name: "Revenue",
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#40c4ff" },
            { offset: 1, color: "#0288d1" },
          ]),
          borderRadius: [6, 6, 0, 0],
          shadowColor: "rgba(0, 0, 0, 0.1)",
          shadowBlur: 10,
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#81d4fa" },
              { offset: 1, color: "#0277bd" },
            ]),
          },
        },
        data: amounts,
        animationEasing: "elasticOut",
        animationDuration: 1000,
      },
    ],
    // Enhanced data zoom
    dataZoom: [
      {
        type: "slider",
        show: dates.length > 10, // Only show if data exceeds 10 days
        xAxisIndex: [0],
        height: 20,
        bottom: 5,
        borderColor: "#e8e8e8",
        fillerColor: "rgba(24, 144, 255, 0.1)",
        handleStyle: {
          color: "#fff",
          borderColor: "#1890ff",
        },
        textStyle: {
          color: "#666",
        },
      },
      {
        type: "inside",
        xAxisIndex: [0],
        zoomOnMouseWheel: true,
        moveOnMouseWheel: true,
      },
    ],
    // Additional visual enhancements
    backgroundColor: "#fff",
    animation: true,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      opts={{ renderer: "svg" }}
      notMerge={true}
      lazyUpdate={true}
      theme="light"
    />
  );
};

export default RevenueChart;
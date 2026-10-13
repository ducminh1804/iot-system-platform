import React from 'react';
import { motion } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Activity, Cpu, HardDrive, Wifi, RefreshCw, Zap } from 'lucide-react';

export function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dữ liệu telemetry đã được làm mới!', {
        description: 'Đã cập nhật 12 thiết bị cảm biến lúc ' + new Date().toLocaleTimeString(),
      });
    }, 600);
  };

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      data: ['Nhiệt độ (°C)', 'Độ ẩm (%)', 'Điện năng (W)'],
      textStyle: { color: '#888888' },
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00'],
      axisLine: { lineStyle: { color: '#444' } },
      axisLabel: { color: '#888' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#888' },
    },
    series: [
      {
        name: 'Nhiệt độ (°C)',
        type: 'line',
        smooth: true,
        data: [26, 25, 24, 25, 28, 32, 34, 33, 31],
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0)' },
            ],
          },
        },
      },
      {
        name: 'Độ ẩm (%)',
        type: 'line',
        smooth: true,
        data: [65, 70, 75, 72, 60, 52, 48, 50, 55],
        itemStyle: { color: '#06b6d4' },
      },
      {
        name: 'Điện năng (W)',
        type: 'line',
        smooth: true,
        data: [120, 115, 110, 130, 210, 290, 310, 280, 240],
        itemStyle: { color: '#8b5cf6' },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trung tâm Giám sát IoT</h1>
          <p className="text-muted-foreground text-sm">
            Hệ thống theo dõi thời gian thực, vi xử lý và luồng dữ liệu cảm biến.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
          <Button size="sm" onClick={() => toast.info('Đang gửi lệnh ping kiểm tra Gateway...')}>
            <Zap className="mr-2 h-4 w-4" />
            Ping Gateway
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gateway Kết Nối</CardTitle>
            <Wifi className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 / 4 Active</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-500"
              >
                100% Online
              </Badge>
              <span className="text-muted-foreground text-xs">Ping: 12ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cảm Biến Hoạt Động</CardTitle>
            <Activity className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128 Nodes</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-cyan-500/20 bg-cyan-500/10 text-xs text-cyan-500"
              >
                +12 hôm nay
              </Badge>
              <span className="text-muted-foreground text-xs">2 cảnh báo nhẹ</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tải CPU Vi Xử Lý</CardTitle>
            <Cpu className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.4%</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground text-xs">ESP32 & Raspberry Pi 5</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lưu Trữ Telemetry</CardTitle>
            <HardDrive className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB / 32 GB</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Thời gian lưu: 90 ngày</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Biểu Đồ Telemetry Thời Gian Thực (ECharts)</CardTitle>
              <CardDescription>
                Theo dõi diễn biến Nhiệt độ, Độ ẩm và Công suất tiêu thụ theo chu kỳ 24h
              </CardDescription>
            </div>
            <Badge variant="secondary">Cập nhật mỗi 2s</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] w-full">
            <ReactECharts
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'canvas' }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

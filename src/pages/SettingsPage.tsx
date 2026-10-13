import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, ShieldAlert, Cpu } from 'lucide-react';

const settingsSchema = z.object({
  gatewayUrl: z.string().url({ message: 'Địa chỉ Gateway MQTT phải là một URL hợp lệ' }),
  pollingInterval: z
    .number()
    .min(1, { message: 'Tần suất quét tối thiểu là 1 giây' })
    .max(600, { message: 'Tần suất tối đa là 600 giây' }),
  enableTelemetryAlerts: z.boolean(),
  apiKey: z.string().min(8, { message: 'API Key phải chứa ít nhất 8 ký tự' }),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gatewayUrl: 'http://192.168.1.200:1883',
      pollingInterval: 5,
      enableTelemetryAlerts: true,
      apiKey: 'sec_key_iot_enterprise_99',
    },
  });

  const enableAlerts = watch('enableTelemetryAlerts');

  const onSubmit = (data: SettingsFormData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast.success('Đã lưu cấu hình hệ thống!', {
          description: `Gateway: ${data.gatewayUrl} | Interval: ${data.pollingInterval}s`,
        });
        resolve();
      }, 500);
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cấu Hình Hệ Thống IoT</h1>
        <p className="text-muted-foreground text-sm">
          Kiểm tra xác thực dữ liệu đầu vào chuẩn chỉ bằng React Hook Form & Zod.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Cpu className="text-primary h-5 w-5" />
            Thông Số Kết Nối Gateway & Telemetry
          </CardTitle>
          <CardDescription>
            Định cấu hình địa chỉ IP, chu kỳ đồng bộ và các cảnh báo sensor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Gateway Endpoint URL</label>
              <Input {...register('gatewayUrl')} placeholder="http://192.168.1.200:1883" />
              {errors.gatewayUrl && (
                <p className="text-destructive flex items-center gap-1 text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {errors.gatewayUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chu Kỳ Polling (Giây)</label>
              <Input
                type="number"
                {...register('pollingInterval', { valueAsNumber: true })}
                placeholder="5"
              />
              {errors.pollingInterval && (
                <p className="text-destructive flex items-center gap-1 text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {errors.pollingInterval.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Khóa Bảo Mật (API Key)</label>
              <Input type="password" {...register('apiKey')} placeholder="••••••••••••" />
              {errors.apiKey && (
                <p className="text-destructive flex items-center gap-1 text-xs">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {errors.apiKey.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label className="cursor-pointer text-sm font-medium">
                  Tự Động Báo Động Ngưỡng Cảnh Báo
                </label>
                <p className="text-muted-foreground text-xs">
                  Gửi thông báo Toast và Realtime qua Socket khi nhiệt độ &gt; 50°C
                </p>
              </div>
              <Switch
                checked={enableAlerts}
                onCheckedChange={(checked) => setValue('enableTelemetryAlerts', checked)}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

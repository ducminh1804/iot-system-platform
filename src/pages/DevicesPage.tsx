import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { type Device, useAppStore } from '@/stores/useAppStore';

const initialDevices: Device[] = [
  {
    id: 'DEV-001',
    name: 'Cảm biến nhiệt độ Kho Lạnh A',
    type: 'sensor',
    status: 'online',
    lastSeen: '1 phút trước',
    value: 4.2,
    unit: '°C',
  },
  {
    id: 'DEV-002',
    name: 'Cảm biến độ ẩm Phòng Server',
    type: 'sensor',
    status: 'warning',
    lastSeen: '3 phút trước',
    value: 78.5,
    unit: '%',
  },
  {
    id: 'DEV-003',
    name: 'Công tắc Relay Bơm nước 01',
    type: 'actuator',
    status: 'online',
    lastSeen: 'Vừa xong',
    value: 1,
    unit: 'ON',
  },
  {
    id: 'DEV-004',
    name: 'Gateway Trung tâm Tầng 2',
    type: 'gateway',
    status: 'online',
    lastSeen: 'Vừa xong',
    value: 12,
    unit: 'nodes',
  },
  {
    id: 'DEV-005',
    name: 'Cảm biến CO2 Khu sản xuất',
    type: 'sensor',
    status: 'offline',
    lastSeen: '2 giờ trước',
    value: 0,
    unit: 'ppm',
  },
];

const columnHelper = createColumnHelper<Device>();

export function DevicesPage() {
  const [data] = useState<Device[]>(initialDevices);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const { setSelectedDevice } = useAppStore();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Mã Thiết Bị',
        cell: (info) => <span className="font-mono text-xs font-semibold">{info.getValue()}</span>,
      }),
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Tên Thiết Bị
            <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
          </Button>
        ),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('type', {
        header: 'Phân Loại',
        cell: (info) => {
          const type = info.getValue();
          const color =
            type === 'gateway'
              ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
              : type === 'actuator'
                ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
          return (
            <Badge variant="outline" className={`capitalize ${color}`}>
              {type}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Trạng Thái',
        cell: (info) => {
          const status = info.getValue();
          return (
            <span className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${
                  status === 'online'
                    ? 'bg-emerald-500'
                    : status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-medium capitalize">{status}</span>
            </span>
          );
        },
      }),
      columnHelper.accessor('value', {
        header: 'Giá Trị Telemetry',
        cell: (info) => (
          <span className="font-mono font-medium">
            {info.getValue()} {info.row.original.unit}
          </span>
        ),
      }),
      columnHelper.accessor('lastSeen', {
        header: 'Cập Nhật Lần Cuối',
        cell: (info) => <span className="text-muted-foreground text-xs">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Thao Tác',
        cell: (props) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => {
                setSelectedDevice(props.row.original);
                toast.info(`Đã chọn thiết bị: ${props.row.original.name}`);
              }}
            >
              Chi tiết
            </Button>
          </div>
        ),
      }),
    ],
    [setSelectedDevice]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Danh Sách Thiết Bị</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý bảng thiết bị bằng TanStack Table với khả năng sort, filter, phân trang linh
            hoạt.
          </p>
        </div>
        <Button size="sm" onClick={() => toast.success('Mở form thêm thiết bị mới')}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Thiết Bị
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="relative w-full sm:w-80">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm thiết bị..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                Bộ lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Không tìm thấy thiết bị nào phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-muted-foreground text-xs">Tổng số: {data.length} thiết bị</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Tiếp
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

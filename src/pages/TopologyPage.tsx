import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { toast } from 'sonner';
import { Network, Cpu, Radio, ShieldCheck } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'gw-1',
    position: { x: 250, y: 50 },
    data: { label: 'Gateway MQTT Broker (ESP32-S3)' },
    style: {
      background: 'oklch(0.2 0 0)',
      color: '#fff',
      border: '1px solid oklch(0.488 0.243 264.376)',
      borderRadius: '8px',
      padding: '12px',
      fontWeight: '600',
    },
  },
  {
    id: 'sensor-1',
    position: { x: 100, y: 200 },
    data: { label: 'DHT22 Nhiệt Độ / Độ Ẩm' },
    style: {
      background: 'oklch(0.2 0 0)',
      color: '#fff',
      border: '1px solid #06b6d4',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'sensor-2',
    position: { x: 400, y: 200 },
    data: { label: 'BMP280 Áp Suất Khí Quyển' },
    style: {
      background: 'oklch(0.2 0 0)',
      color: '#fff',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '10px',
    },
  },
  {
    id: 'actuator-1',
    position: { x: 250, y: 320 },
    data: { label: 'Relay 4-Kênh Quạt Thông Gió' },
    style: {
      background: 'oklch(0.2 0 0)',
      color: '#fff',
      border: '1px solid #10b981',
      borderRadius: '8px',
      padding: '10px',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'gw-1', target: 'sensor-1', animated: true, style: { stroke: '#06b6d4' } },
  { id: 'e1-3', source: 'gw-1', target: 'sensor-2', animated: true, style: { stroke: '#f59e0b' } },
  {
    id: 'e1-4',
    source: 'gw-1',
    target: 'actuator-1',
    animated: true,
    style: { stroke: '#10b981' },
  },
];

export function TopologyPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(nodes[0]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
    toast.success('Đã kết nối luồng node mới!');
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sơ Đồ Mạng Lưới IoT (React Flow)</h1>
          <p className="text-muted-foreground text-sm">
            Kéo thả, kết nối các Node mạng, Gateway và Cảm biến trên Canvas tương tác thời gian
            thực.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
            Mesh Topology Active
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden border">
        <ResizablePanelGroup orientation="horizontal" className="min-h-[580px] rounded-lg">
          <ResizablePanel defaultSize={72} minSize={40}>
            <div className="bg-card h-[580px] w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(_, node) => setSelectedNode(node)}
                fitView
              >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
                <Controls />
              </ReactFlow>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={28} minSize={20}>
            <div className="bg-muted/20 flex h-full flex-col justify-between p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Network className="text-primary h-5 w-5" />
                  <h3 className="text-sm font-semibold">Thuộc Tính Node (Inspector)</h3>
                </div>

                {selectedNode ? (
                  <div className="space-y-3">
                    <div className="bg-background/50 space-y-2 rounded-md border p-3">
                      <div className="text-muted-foreground font-mono text-xs">
                        Node ID: {selectedNode.id}
                      </div>
                      <div className="text-sm font-medium">
                        {String(selectedNode.data?.label || '')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          X: {Math.round(selectedNode.position.x)}, Y:{' '}
                          {Math.round(selectedNode.position.y)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/20 text-xs text-emerald-500"
                        >
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b py-1">
                        <span className="text-muted-foreground">Giao thức:</span>
                        <span className="font-medium">MQTT / CoAP</span>
                      </div>
                      <div className="flex items-center justify-between border-b py-1">
                        <span className="text-muted-foreground">Băng thông:</span>
                        <span className="font-medium">115200 baud</span>
                      </div>
                      <div className="flex items-center justify-between border-b py-1">
                        <span className="text-muted-foreground">Bảo mật:</span>
                        <span className="flex items-center gap-1 font-medium text-emerald-500">
                          <ShieldCheck className="h-3 w-3" /> TLS 1.3
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    Nhấp vào một node trên canvas để xem thông số chi tiết.
                  </div>
                )}
              </div>

              <div className="text-muted-foreground flex items-center gap-2 border-t pt-4 text-xs">
                <Cpu className="h-4 w-4" />
                <span>Kéo mép panel để thay đổi kích thước linh hoạt.</span>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusTabProps {
  subscriberId: string;
}

const mockConnectionStatus = {
  status: 'Online',
  latency: '12ms',
  packetLoss: '0%',
  liveThroughput: {
    download: '48.5 Mbps',
    upload: '18.2 Mbps',
  },
  signalQuality: '-55 dBm',
};

export function ConnectionStatusTab({ subscriberId }: ConnectionStatusTabProps) {
  const data = mockConnectionStatus;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={data.status === 'Online' ? 'default' : 'destructive'}>{data.status}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.latency}</div>
          <p className="text-xs text-muted-foreground">{data.packetLoss} packet loss</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">DL: {data.liveThroughput.download}</div>
          <div className="text-xl font-bold">UL: {data.liveThroughput.upload}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Signal Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.signalQuality}</div>
        </CardContent>
      </Card>
    </div>
  );
}

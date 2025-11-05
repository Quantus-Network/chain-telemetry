# Prometheus Metrics

The Quantus Telemetry backend (`telemetry_core`) exposes Prometheus metrics at the `/metrics` endpoint.

## Endpoint

```
http://localhost:8000/metrics
```

## Available Metrics

The following metrics are exposed for each aggregator instance:

| Metric Name | Type | Description | Labels |
|-------------|------|-------------|--------|
| `telemetry_core_connected_feeds` | Gauge | Number of connected WebSocket feeds (frontends) | `aggregator` |
| `telemetry_core_connected_nodes` | Gauge | Number of connected blockchain nodes | `aggregator` |
| `telemetry_core_connected_shards` | Gauge | Number of connected telemetry shards | `aggregator` |
| `telemetry_core_chains_subscribed_to` | Gauge | Number of chains with active subscriptions | `aggregator` |
| `telemetry_core_subscribed_feeds` | Gauge | Number of feeds subscribed to chains | `aggregator` |
| `telemetry_core_total_messages_to_feeds` | Counter | Total messages sent to feeds | `aggregator` |
| `telemetry_core_current_messages_to_aggregator` | Gauge | Current messages being processed by aggregator | `aggregator` |
| `telemetry_core_total_messages_to_aggregator` | Counter | Total messages received by aggregator | `aggregator` |
| `telemetry_core_dropped_messages_to_aggregator` | Counter | Messages dropped by aggregator (backpressure) | `aggregator` |

## Prometheus Configuration

Add this job to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'quantus-telemetry'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

### Docker Compose Integration

If you're running Prometheus in Docker alongside Quantus Telemetry:

```yaml
scrape_configs:
  - job_name: 'quantus-telemetry'
    scrape_interval: 15s
    static_configs:
      - targets: ['telemetry-backend-core:8000']
    metrics_path: '/metrics'
```

## Example Metrics Output

```
telemetry_core_connected_feeds{aggregator="0"} 2 1699123456789
telemetry_core_connected_nodes{aggregator="0"} 150 1699123456789
telemetry_core_connected_shards{aggregator="0"} 1 1699123456789
telemetry_core_chains_subscribed_to{aggregator="0"} 5 1699123456789
telemetry_core_subscribed_feeds{aggregator="0"} 2 1699123456789
telemetry_core_total_messages_to_feeds{aggregator="0"} 12450 1699123456789
telemetry_core_current_messages_to_aggregator{aggregator="0"} 3 1699123456789
telemetry_core_total_messages_to_aggregator{aggregator="0"} 45000 1699123456789
telemetry_core_dropped_messages_to_aggregator{aggregator="0"} 0 1699123456789
```

## Testing the Endpoint

### Using curl

```bash
curl http://localhost:8000/metrics
```

### Using wget

```bash
wget -qO- http://localhost:8000/metrics
```

### Using Docker

If running in Docker:
```bash
docker exec quantus-telemetry-core wget -qO- http://localhost:8000/metrics
```

## Grafana Dashboard

You can use these metrics to create monitoring dashboards in Grafana. Here are some useful queries:

### Active Connections
```promql
sum(telemetry_core_connected_nodes)
```

### Message Rate
```promql
rate(telemetry_core_total_messages_to_feeds[5m])
```

### Dropped Messages
```promql
rate(telemetry_core_dropped_messages_to_aggregator[5m])
```

### Chain Activity
```promql
telemetry_core_chains_subscribed_to
```

## Metric Format

Metrics follow the [Prometheus Text Exposition Format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-format-details) version 0.0.4.

Each metric line contains:
- Metric name
- Labels in curly braces `{label="value"}`
- Current value
- Timestamp in Unix milliseconds

## Notes

- Metrics are updated approximately every 10 seconds
- The `aggregator` label indicates which internal aggregator instance the metric comes from
- Metrics are lightweight and don't impact telemetry performance
- No authentication is required for the `/metrics` endpoint

## Security Considerations

The `/metrics` endpoint is exposed without authentication. If deploying in production:

1. **Use a reverse proxy** (nginx, Traefik) to restrict access
2. **Firewall rules** to allow only Prometheus server
3. **Network segmentation** to keep metrics on internal network
4. **VPN/Tunnel** for remote Prometheus access

Example nginx configuration:

```nginx
location /metrics {
    allow 10.0.0.0/8;  # Internal network
    deny all;
    proxy_pass http://telemetry-core:8000;
}
```

## Related Documentation

- [Docker Quick Start](./DOCKER_QUICKSTART.md)
- [Quantus Rebrand](./QUANTUS_REBRAND.md)
- [Prometheus Documentation](https://prometheus.io/docs/introduction/overview/)


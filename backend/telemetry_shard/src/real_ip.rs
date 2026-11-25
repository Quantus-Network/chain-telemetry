// Source code for the Substrate Telemetry Server.
// Copyright (C) 2021 Parity Technologies (UK) Ltd.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

use std::net::{IpAddr, SocketAddr};

/// Address of the client that opened this connection, and where that address came from.
///
/// `Forwarded`, `X-Forwarded-For`, and `X-Real-IP` are ignored. The client can set
/// those headers, and this address is the ban-list key and the node IP. `CF-Connecting-IP`
/// is used when it contains a single IP, because Cloudflare overwrites that header.
/// Otherwise the socket peer is used.
///
/// `CF-Connecting-IP` is only authoritative when the shard is reachable through
/// Cloudflare and not directly from the internet.
pub fn real_ip(addr: SocketAddr, headers: &hyper::HeaderMap) -> (IpAddr, Source) {
    if let Some(ip) = cf_connecting_ip(headers) {
        return (ip, Source::CfConnectingIp);
    }
    (addr.ip(), Source::SocketAddr)
}

/// The source of the address returned.
pub enum Source {
    CfConnectingIp,
    SocketAddr,
}

impl std::fmt::Display for Source {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Source::CfConnectingIp => write!(f, "'CF-Connecting-IP' header"),
            Source::SocketAddr => write!(f, "Socket address"),
        }
    }
}

fn cf_connecting_ip(headers: &hyper::HeaderMap) -> Option<IpAddr> {
    let value = headers.get("cf-connecting-ip").and_then(header_as_str)?;
    parse_single_ip(value)
}

fn header_as_str(value: &hyper::header::HeaderValue) -> Option<&str> {
    std::str::from_utf8(value.as_bytes()).ok()
}

/// A single IP, with surrounding whitespace ignored. Lists and host:port values
/// are rejected so a crafted header cannot select an address by position.
fn parse_single_ip(value: &str) -> Option<IpAddr> {
    let value = value.trim();
    if value.is_empty() || value.contains(',') {
        return None;
    }
    value.parse().ok()
}

#[cfg(test)]
mod test {
    use super::*;

    fn headers(pairs: &[(&str, &str)]) -> hyper::HeaderMap {
        let mut map = hyper::HeaderMap::new();
        for (name, value) in pairs {
            map.insert(
                hyper::header::HeaderName::from_bytes(name.as_bytes()).unwrap(),
                hyper::header::HeaderValue::from_str(value).unwrap(),
            );
        }
        map
    }

    fn peer() -> SocketAddr {
        "10.1.1.1:40000".parse().unwrap()
    }

    #[test]
    fn ignores_client_supplied_forwarding_headers() {
        let headers = headers(&[
            ("Forwarded", "for=203.0.113.21"),
            ("X-Forwarded-For", "203.0.113.21"),
            ("X-Real-IP", "203.0.113.21"),
        ]);

        let (ip, source) = real_ip(peer(), &headers);
        assert_eq!(ip, peer().ip());
        assert!(matches!(source, Source::SocketAddr));
    }

    #[test]
    fn uses_cloudflare_connecting_ip() {
        let headers = headers(&[
            ("Forwarded", "for=203.0.113.21"),
            ("X-Forwarded-For", "198.51.100.21"),
            ("CF-Connecting-IP", "192.0.2.10"),
        ]);

        let (ip, source) = real_ip(peer(), &headers);
        assert_eq!(ip, "192.0.2.10".parse::<IpAddr>().unwrap());
        assert!(matches!(source, Source::CfConnectingIp));
    }

    #[test]
    fn uses_cloudflare_ipv6() {
        let headers = headers(&[("CF-Connecting-IP", " 2001:db8::10 ")]);

        let (ip, source) = real_ip(peer(), &headers);
        assert_eq!(ip, "2001:db8::10".parse::<IpAddr>().unwrap());
        assert!(matches!(source, Source::CfConnectingIp));
    }

    #[test]
    fn rejects_a_list_or_garbage_cloudflare_header() {
        for value in [
            "203.0.113.21, 192.0.2.10",
            "not-an-ip",
            "192.0.2.10:443",
            "",
        ] {
            let headers = headers(&[("CF-Connecting-IP", value)]);
            let (ip, source) = real_ip(peer(), &headers);
            assert_eq!(ip, peer().ip(), "header value: {value}");
            assert!(
                matches!(source, Source::SocketAddr),
                "header value: {value}"
            );
        }
    }
}

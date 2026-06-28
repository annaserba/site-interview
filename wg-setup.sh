#!/bin/bash
set -e

echo "=== Настройка WireGuard tunnel ==="
echo ""
echo "На VPS 2 (144.124.255.55) выполни:"
echo ""

# Wait for WireGuard to start
echo "1. Жди 30 секунд пока WireGuard запустится..."
sleep 5

echo ""
echo "2. Получи конфиг для VPS 1:"
echo "   docker exec wireguard cat /config/peer1/peer1.conf"
echo ""
echo "3. Скопируй вывод и выполни на VPS 1 (192.144.59.118):"
echo "   mkdir -p /etc/wireguard"
echo "   cat > /etc/wireguard/wg0.conf << 'WGEOF'"
echo "   [Interface]"
echo "   PrivateKey = <PRIVATE_KEY_FROM_PEER1>"
echo "   Address = 10.0.0.2/32"
echo "   DNS = 1.1.1.1"
echo ""
echo "   [Peer]"
echo "   PublicKey = <PUBLIC_KEY_FROM_PEER1>"
echo "   Endpoint = 144.124.255.55:51820"
echo "   AllowedIPs = 10.0.0.0/24"
echo "   PersistentKeepalive = 25"
echo "   WGEOF"
echo ""
echo "4. Запусти WireGuard на VPS 1:"
echo "   wg-quick up wg0"
echo "   systemctl enable wg-quick@wg0"
echo ""
echo "5. Проверь связь:"
echo "   ping 10.0.0.1"

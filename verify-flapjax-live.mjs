#!/usr/bin/env node
// verify-flapjax-live.mjs — Zero-dependency live BSC RPC verifier for FLAPJAX (0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df)
// Usage: node verify-flapjax-live.mjs [--block latest|0x...] [--wallet 0x...]

const RPC_ENDPOINTS = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io'
];

const FLAPJAX = '0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df';
const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const TREASURY = '0x7C34E9e21eE28A49Ff0b84B61774119E6633359f';
const POOL_V3_1PCT = '0xcA93EC685b8623688E6B236f9068034B298c2150';
const POS_MANAGER = '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364';

async function rpcCall(method, params) {
  for (const url of RPC_ENDPOINTS) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params })
      });
      const j = await r.json();
      if (j.result !== undefined) return j.result;
    } catch {}
  }
  throw new Error('All BSC RPC endpoints failed for ' + method);
}

const balSelector = (addr) => '0x70a08231' + addr.slice(2).toLowerCase().padStart(64, '0');

const blkHex = await rpcCall('eth_blockNumber', []);
const blkNum = parseInt(blkHex, 16);
const [ownerHex, supplyHex, treasFjHex, treasBnbHex, poolFjHex, poolWbnbHex, liqHex, nft1Owner] = await Promise.all([
  rpcCall('eth_call', [{ to: FLAPJAX, data: '0x8da5cb5b' }, blkHex]),
  rpcCall('eth_call', [{ to: FLAPJAX, data: '0x18160ddd' }, blkHex]),
  rpcCall('eth_call', [{ to: FLAPJAX, data: balSelector(TREASURY) }, blkHex]),
  rpcCall('eth_getBalance', [TREASURY, blkHex]),
  rpcCall('eth_call', [{ to: FLAPJAX, data: balSelector(POOL_V3_1PCT) }, blkHex]),
  rpcCall('eth_call', [{ to: WBNB, data: balSelector(POOL_V3_1PCT) }, blkHex]),
  rpcCall('eth_call', [{ to: POOL_V3_1PCT, data: '0x1a686502' }, blkHex]),
  rpcCall('eth_call', [{ to: POS_MANAGER, data: '0x6352211e' + (1456181).toString(16).padStart(64, '0') }, blkHex])
]);

const checks = [
  { claim: 'Ownership renounced (owner == 0x0)', status: BigInt(ownerHex) === 0n ? 'PASS' : 'FAIL', value: ownerHex },
  { claim: 'Total supply == 44,444,444,444 FJ', status: (BigInt(supplyHex) / (10n ** 18n)) === 44444444444n ? 'PASS' : 'FAIL', value: (BigInt(supplyHex) / (10n ** 18n)).toString() + ' FJ' },
  { claim: 'Treasury FLAPJAX balance > 0', status: BigInt(treasFjHex) > 0n ? 'PASS' : 'FAIL', value: (BigInt(treasFjHex) / (10n ** 18n)).toString() + ' FJ' },
  { claim: 'Treasury BNB gas reserve >= 0.025 BNB', status: BigInt(treasBnbHex) >= 25000000000000000n ? 'PASS' : 'FAIL', value: (Number(BigInt(treasBnbHex)) / 1e18).toFixed(6) + ' BNB' },
  { claim: 'V3 1% Pool active liquidity > 0', status: BigInt(liqHex) > 0n ? 'PASS' : 'FAIL', value: BigInt(liqHex).toString() },
  { claim: 'LP NFT 1456181 held by locker contract', status: nft1Owner.toLowerCase().endsWith('25c9c4b56e820e0dea438b145284f02d9ca9bd52') ? 'PASS' : 'FAIL', value: '0x' + nft1Owner.slice(-40) }
];

console.log(JSON.stringify({ block: blkNum, blockHex: blkHex, checks }, null, 2));

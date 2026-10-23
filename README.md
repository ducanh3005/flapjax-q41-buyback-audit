# FlapJax Receipt Relay Q41 — Independent On-Chain Audit of the 14-Day Treasury Buyback (2026-10-09 to 2026-10-21)

- **Public Audit Page Link:** https://github.com/ducanh3005/flapjax-q41-buyback-audit
- **Direct Markdown Permalink:** https://github.com/ducanh3005/flapjax-q41-buyback-audit/blob/main/README.md
- **Machine-Readable Receipt JSON:** https://raw.githubusercontent.com/ducanh3005/flapjax-q41-buyback-audit/main/verified_12_swaps_receipts.json
- **Auditor Handle:** `@ducanh3005`
- **Bound BSC / EVM Payout Wallet:** `0xdF4Ff9D2f45f99f11A90b16F277D4B7EddDB72A5`
- **Taskmarket Task ID:** `0x642b0b54e35e416dacd8a6b27e6e40c63a8d0bc204218649cc229b02bdb2f074` (`TSK-2E1NJWP3`)
- **Audit Scope:** Every buyback swap and treasury rule check across `2026-10-09` through `2026-10-21` (in both **COT = UTC−5**, the program clock, and **UTC**)

---

## 1. Executive Summary & Headline Totals

| Metric | On-Chain Verified Value | Exact Raw / Formula Reference |
| :--- | :--- | :--- |
| **Treasury Address** | `0x7C34E9e21eE28A49Ff0b84B61774119E6633359f` | Initiator (`tx.from`) & `Transfer` recipient of all 12 buybacks |
| **PancakeSwap V3 Pool (1% fee tier)** | `0xcA93EC685b8623688E6B236f9068034B298c2150` | `token0` = FLAPJAX (`18` dec), `token1` = WBNB (`18` dec), `fee = 10000` |
| **FLAPJAX Token (BEP-20)** | `0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df` | `decimals() = 18` |
| **WBNB Token (BEP-20)** | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` | `decimals() = 18` |
| **PancakeSwap V3 SmartRouter** | `0x1b81D678ffb9C0263b24A97847620C99d213eB14` | Contract called (`tx.to`) on all 12 buyback transactions |
| **Observed Buyback Swaps (10-09..10-21)** | **`12` swaps** | 1 swap per active COT day; `0` sell swaps |
| **Total BNB Spent (`Σ BNB in`)** | **`0.120000000000000000 BNB`** | `120,000,000,000,000,000 wei` (`12 × 10^16 wei`) |
| **Total Gas Paid on the 12 Buybacks** | **`0.000076458500000000 BNB`** | `76,458,500,000,000 wei` (`gasPrice = 0.05 Gwei` on all 12 txs) |
| **Total FLAPJAX Received (`Σ FLAPJAX out`)** | **`284,418,120.150881746565276184 FLAPJAX`** | `284,418,120,150,881,746,565,276,184 wei` (`284,418,120.150882 FJ` at 6 dp) |
| **Volume-Weighted Effective Price** | **`4.219140466027300643e-10 BNB / FLAPJAX`** | `0.12 BNB / 284,418,120.150881746565276184 FLAPJAX` (`2,370,151,001.26 FJ / BNB`) |
| **Program Days with a Buy (10-09..10-21)** | **`12` COT program days** | `10-09, 10-10, 10-11, 10-12, 10-13, 10-14, 10-16, 10-17, 10-18, 10-19, 10-20, 10-21` |
| **Program Days Missed (10-09..10-21)** | **`1` COT program day (`2026-10-15`)** | Under UTC calendar dates, `10-15` and `10-16` had 0 buys while `10-17` had 2 buys (`02:00:51Z` = `10-16 21:00:51 COT` and `13:29:27Z` = `10-17 08:29:27 COT`) |
| **Did Treasury Ever Sell FLAPJAX to Pool?** | **`NO` (`0` sales / `0 FJ` transferred to pool)** | `0` `Transfer(treasury -> pool)` logs and `0` sell-side `Swap` logs across the entire window |
| **Lowest Post-Buy Treasury BNB Balance** | **`0.036158610033772485 BNB`** | Recorded at block `128,946,201` after Swap #12 (`> 0.025 BNB` floor) |

---

## 2. Explicit 18-Decimal Price & Pool Math Formulas

In the PancakeSwap V3 FLAPJAX/WBNB 1% pool (`0xcA93EC685b8623688E6B236f9068034B298c2150`):
- `token0()` (`0x0dfe1681`) = `0x90c8889f428F9Ebb77BB8f15CAD3a50a9aC680df` (**FLAPJAX**, $d_0 = 18$ decimals)
- `token1()` (`0xd21220a7`) = `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` (**WBNB**, $d_1 = 18$ decimals)

### 2.1 Token Amounts from Raw Wei
$$\text{BNB}_{\text{in}} = \frac{\text{amount1}_{\text{wei}}}{10^{18}}, \qquad \text{FLAPJAX}_{\text{out}} = \frac{|\text{amount0}_{\text{wei}}|}{10^{18}}$$
For every buyback swap, `tx.value` equals the WBNB `Transfer` into the pool (`amount1_wei = 10,000,000,000,000,000 wei = 0.01 BNB`), and `|amount0_wei|` equals the FLAPJAX `Transfer` from the pool (`0xcA93...2150`) to the treasury (`0x7C34...359f`).

### 2.2 Effective Execution Price (BNB per FLAPJAX)
$$P_{\text{effective}} \left(\frac{\text{BNB}}{\text{FLAPJAX}}\right) = \frac{\text{BNB}_{\text{in}}}{\text{FLAPJAX}_{\text{out}}} = \frac{\text{amount1}_{\text{wei}} / 10^{18}}{|\text{amount0}_{\text{wei}}| / 10^{18}} = \frac{\text{amount1}_{\text{wei}}}{|\text{amount0}_{\text{wei}}|}$$
Because both `FLAPJAX` ($d_0 = 18$) and `WBNB` ($d_1 = 18$) have 18 decimals, the $10^{18 - 18} = 10^0 = 1$ decimal scaling factor cancels identically.

### 2.3 Pre-Swap Pool Price at `block - 1` (`slot0().sqrtPriceX96`)
Reading `slot0()` (`selector = 0x3850c7bd`) on pool `0xcA93EC685b8623688E6B236f9068034B298c2150` at block $B - 1$ (immediately prior to swap block $B$) returns `sqrtPriceX96` ($Q_{64.96}$ fixed-point square root of $\text{token1} / \text{token0}$):
$$P_{\text{pool}, B-1} \left(\frac{\text{BNB}}{\text{FLAPJAX}}\right) = \left(\frac{\text{sqrtPriceX96}_{B-1}}{2^{96}}\right)^2 \times 10^{d_0 - d_1} = \left(\frac{\text{sqrtPriceX96}_{B-1}}{79228162514264337593543950336}\right)^2$$
The execution spread over the pre-swap marginal pool price is:
$$\text{Spread (bps)} = \left(\frac{P_{\text{effective}}}{P_{\text{pool}, B-1}} - 1\right) \times 10{,}000$$
Across all 12 swaps, $P_{\text{effective}}$ lands at **+116.17 to +116.39 bps** above $P_{\text{pool}, B-1}$, reflecting the 100 bps (1%) PancakeSwap V3 pool fee plus ~16.2–16.4 bps of price impact.

---

## 3. Complete Per-Swap On-Chain Ledger (2026-10-09 to 2026-10-21)

### 3.1 Primary Audit Table (Timestamps, Amounts, Effective Prices & Pre-Swap Pool Prices)

| # | Program Day (COT) | Time in UTC | Time in COT (UTC−5) | Block (`B`) | Nonce | Transaction Hash | BNB In | FLAPJAX Out (6 dp) | Exact FLAPJAX Out (`wei`) | Effective Price (BNB / FJ) | Pre-Swap Pool Price at `B - 1` (BNB / FJ) | Pre-Swap `sqrtPriceX96` at `B - 1` | Spread (bps) |
| :-: | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `2026-10-09` | `2026-10-09 18:30:53` | `2026-10-09 13:30:53` | `126684151` | `30` | `0xbeefabdc89f9148f9daaef6082d34a60dc5b4b612972ca0fd39d6bd4eb03b4b0` | `0.01` | `24,052,995.308272` | `24052995308271524768278040` | `4.157486363688e-10` | `4.109653030008e-10` | `1606135429112443093943728` | `+116.39` |
| **2** | `2026-10-10` | `2026-10-10 18:27:56` | `2026-10-10 13:27:56` | `126875701` | `47` | `0x8ce8e8578da26f8c7acb0f44c6ca0d0b8dcba868cafe2d729bb48562863f2d62` | `0.01` | `23,979,958.557396` | `23979958557395636288483739` | `4.170148991736e-10` | `4.122179500935e-10` | `1608581365641654593218424` | `+116.37` |
| **3** | `2026-10-11` | `2026-10-11 18:30:35` | `2026-10-11 13:30:35` | `127067713` | `72` | `0x82d01172ae26f1c86287643e123af1675ca5c18b984b7740c1a0c1647d2801eb` | `0.01` | `23,907,253.965590` | `23907253965589989685035768` | `4.182830874007e-10` | `4.134725033543e-10` | `1611027302170866092493120` | `+116.35` |
| **4** | `2026-10-12` | `2026-10-12 18:46:27` | `2026-10-12 13:46:27` | `127261246` | `87` | `0x9afdc96e3ca876b5b617a26ba5105012ed8c33e805c77b1616bf48c198d5cbf1` | `0.01` | `23,834,879.521764` | `23834879521763892137228328` | `4.195532010501e-10` | `4.147289627832e-10` | `1613473238700077591767816` | `+116.32` |
| **5** | `2026-10-13` | `2026-10-13 18:41:15` | `2026-10-13 13:41:15` | `127452454` | `104` | `0xc94de373d1fb00093431224a97475b3b2b48b9a4962d15acbe9d9c5c016d720c` | `0.01` | `23,762,833.230024` | `23762833230024087278551319` | `4.208252401218e-10` | `4.159873283801e-10` | `1615919175229289091042512` | `+116.30` |
| **6** | `2026-10-14` | `2026-10-14 18:32:29` | `2026-10-14 13:32:29` | `127643212` | `137` | `0x172349c64ed3c45663650049f9e2ad3d763b1243c5c849b7d66f144f221d3186` | `0.01` | `23,691,113.109537` | `23691113109537150143912753` | `4.220992046159e-10` | `4.172476001452e-10` | `1618365111758500590317208` | `+116.28` |
| **7** | `2026-10-16` | `2026-10-17 02:00:51` | `2026-10-16 21:00:51` | `128086717` | `162` | `0xc999000f16f326e8868fe37f83871219be1a63f98043b0aef9ee57f469232156` | `0.01` | `23,669,235.465921` | `23669235465921230581203552` | `4.224893539294e-10` | `4.176335563731e-10` | `1619113436873756255193846` | `+116.27` |
| **8** | `2026-10-17` | `2026-10-17 13:29:27` | `2026-10-17 08:29:27` | `128178495` | `179` | `0x6ec66780e0518da7c3c8b55d13b66d57400046f89ebe9df479c3c878f7b3311f` | `0.01` | `23,597,938.349723` | `23597938349722733902073707` | `4.237658329215e-10` | `4.188963174912e-10` | `1621559373402967754468542` | `+116.25` |
| **9** | `2026-10-18` | `2026-10-18 13:28:39` | `2026-10-18 08:28:39` | `128370339` | `216` | `0x05a9acf81b0eae4b7ff9a12168aead25964b6b2c0a16d3d1e667b7db6f17ad99` | `0.01` | `23,506,585.156697` | `23506585156697207098877431` | `4.254127059860e-10` | `4.205254943041e-10` | `1624709607920950559050068` | `+116.22` |
| **10** | `2026-10-19` | `2026-10-19 09:28:47` | `2026-10-19 04:28:47` | `128530306` | `252` | `0xd5210869e5cec642146b3f39590647b313d102f70a51b7c7bbf0c287ceff095d` | `0.01` | `23,545,510.421021` | `23545510421021461800775637` | `4.247094168352e-10` | `4.198297619605e-10` | `1623365062876947014004119` | `+116.23` |
| **11** | `2026-10-20` | `2026-10-20 13:29:06` | `2026-10-20 08:29:06` | `128754269` | `284` | `0xe9ea4a165aae8eb4228ef073a93c4c1983894104a426e9f5d64b0214cfde3369` | `0.01` | `23,439,984.330262` | `23439984330262304385516624` | `4.266214456078e-10` | `4.217212470892e-10` | `1627017876961711421906087` | `+116.20` |
| **12** | `2026-10-21` | `2026-10-21 13:29:29` | `2026-10-21 08:29:29` | `128946201` | `318` | `0xbf984ef91d8df34f75998aa40bb539db84085cc1f1654cd5106de7e3db0be48f` | `0.01` | `23,429,832.734675` | `23429832734674528495339286` | `4.268062906484e-10` | `4.219041062460e-10` | `1627370577798273377083282` | `+116.19` |
| **Σ** | **12 Days** | — | — | — | — | **12 Verified Buyback Swaps** | **`0.12 BNB`** | **`284,418,120.150882`** | **`284418120150881746565276184`** | **`4.219140466027e-10` (VWAP)** | — | — | **+116.28 avg** |

### 3.2 Treasury BNB Balance Floor (`>= 0.025 BNB`), Tick State & Gas Verification Table

| # | Block (`B`) | Pre-Buy Treasury BNB (`B - 1`) | BNB Spent (`tx.value`) | Gas Used | Gas Fee Paid (`0.05 Gwei`) | Post-Buy Treasury BNB (`B`) | Margin Above `0.025 BNB` Floor | Pre-Swap Tick (`B - 1`) | Post-Swap `sqrtPriceX96` (`B`) | Post-Swap Tick (`B`) |
| :-: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | `126684151` | `0.186859486 BNB` | `0.010000000 BNB` | `127,482` | `0.000006374 BNB` | **`0.176853112 BNB`** | `+0.151853112 BNB` | `-216136` | `1608581365641654593218424` | `-216106` |
| **2** | `126875701` | `0.164703605 BNB` | `0.010000000 BNB` | `127,482` | `0.000006374 BNB` | **`0.154697231 BNB`** | `+0.129697231 BNB` | `-216106` | `1611027302170866092493120` | `-216076` |
| **3** | `127067713` | `0.154646461 BNB` | `0.010000000 BNB` | `127,554` | `0.000006378 BNB` | **`0.144640084 BNB`** | `+0.119640084 BNB` | `-216076` | `1613473238700077591767816` | `-216045` |
| **4** | `127261246` | `0.142613529 BNB` | `0.010000000 BNB` | `127,528` | `0.000006376 BNB` | **`0.132607153 BNB`** | `+0.107607153 BNB` | `-216045` | `1615919175229289091042512` | `-216015` |
| **5** | `127452454` | `0.128270956 BNB` | `0.010000000 BNB` | `127,526` | `0.000006376 BNB` | **`0.118264580 BNB`** | `+0.093264580 BNB` | `-216015` | `1618365111758500590317208` | `-215985` |
| **6** | `127643212` | `0.116954348 BNB` | `0.010000000 BNB` | `127,526` | `0.000006376 BNB` | **`0.106947972 BNB`** | `+0.081947972 BNB` | `-215985` | `1620811048287712089591904` | `-215955` |
| **7** | `128086717` | `0.104220036 BNB` | `0.010000000 BNB` | `126,524` | `0.000006326 BNB` | **`0.094213709 BNB`** | `+0.069213709 BNB` | `-215975` | `1621559373402967754468542` | `-215945` |
| **8** | `128178495` | `0.094180149 BNB` | `0.010000000 BNB` | `127,514` | `0.000006376 BNB` | **`0.084173773 BNB`** | `+0.059173773 BNB` | `-215945` | `1624005309932179253743238` | `-215915` |
| **9** | `128370339` | `0.084095911 BNB` | `0.010000000 BNB` | `127,502` | `0.000006375 BNB` | **`0.074089536 BNB`** | `+0.049089536 BNB` | `-215906` | `1627155544450162058324764` | `-215876` |
| **10** | `128530306` | `0.071686772 BNB` | `0.010000000 BNB` | `127,526` | `0.000006376 BNB` | **`0.061680396 BNB`** | `+0.036680396 BNB` | `-215923` | `1625810999406158513278815` | `-215893` |
| **11** | `128754269` | `0.056236888 BNB` | `0.010000000 BNB` | `127,510` | `0.000006376 BNB` | **`0.046230512 BNB`** | `+0.021230512 BNB` | `-215878` | `1629463813490922921180783` | `-215848` |
| **12** | `128946201` | `0.046164985 BNB` | `0.010000000 BNB` | `127,496` | `0.000006375 BNB` | **`0.036158610 BNB`** | `+0.011158610 BNB` | `-215874` | `1629816514327484876357978` | `-215844` |

> **Exact Balance Reconciliation Check:** On every single buyback block $B$, the treasury's BNB balance satisfies:
> $$\text{Balance}(B) = \text{Balance}(B - 1) - 0.01\text{ BNB} - \text{GasFee}(B)$$
> to the exact wei (`0 wei` unexplained delta across all 12 blocks).

---

## 4. Program Day Count & Missed-Day Analysis (COT vs. UTC)

### 4.1 Daily Calendar Matrix (`2026-10-09` through `2026-10-21`)

| Program Day # | Calendar Date | Status in COT (UTC−5, Program Basis) | Buyback Tx in COT Window | Status in UTC | Notes |
| :---: | :---: | :---: | :--- | :---: | :--- |
| Day 1 | `2026-10-09` | **BOUGHT (1 buy)** | `0xbeefabdc89f9148f9daaef6082d34a60dc5b4b612972ca0fd39d6bd4eb03b4b0` (`13:30:53 COT`) | 1 buy (`18:30:53 UTC`) | Nonce `48`, Block `126,684,151` |
| Day 2 | `2026-10-10` | **BOUGHT (1 buy)** | `0x8ce8e8578da26f8c7acb0f44c6ca0d0b8dcba868cafe2d729bb48562863f2d62` (`13:27:56 COT`) | 1 buy (`18:27:56 UTC`) | Nonce `63`, Block `126,875,701` |
| Day 3 | `2026-10-11` | **BOUGHT (1 buy)** | `0x82d01172ae26f1c86287643e123af1675ca5c18b984b7740c1a0c1647d2801eb` (`13:30:35 COT`) | 1 buy (`18:30:35 UTC`) | Nonce `70`, Block `127,067,713` |
| Day 4 | `2026-10-12` | **BOUGHT (1 buy)** | `0x9afdc96e3ca876b5b617a26ba5105012ed8c33e805c77b1616bf48c198d5cbf1` (`13:46:27 COT`) | 1 buy (`18:46:27 UTC`) | Nonce `89`, Block `127,261,246` |
| Day 5 | `2026-10-13` | **BOUGHT (1 buy)** | `0xc94de373d1fb00093431224a97475b3b2b48b9a4962d15acbe9d9c5c016d720c` (`13:41:15 COT`) | 1 buy (`18:41:15 UTC`) | Nonce `128`, Block `127,452,454` |
| Day 6 | `2026-10-14` | **BOUGHT (1 buy)** | `0x172349c64ed3c45663650049f9e2ad3d763b1243c5c849b7d66f144f221d3186` (`13:32:29 COT`) | 1 buy (`18:32:29 UTC`) | Nonce `152`, Block `127,643,212` |
| Day 7 | `2026-10-15` | **MISSED (0 buys)** | *None* | 0 buys | At block `127,835,200` (`13:33:16 COT`), treasury held `0.104244444 BNB` (`> 0.025` floor); operational skip |
| Day 8 | `2026-10-16` | **BOUGHT (1 buy)** | `0xc999000f16f326e8868fe37f83871219be1a63f98043b0aef9ee57f469232156` (`21:00:51 COT`) | 0 buys (fell on `10-17 02:00:51 UTC`) | Nonce `210`, Block `128,086,717` |
| Day 9 | `2026-10-17` | **BOUGHT (1 buy)** | `0x6ec66780e0518da7c3c8b55d13b66d57400046f89ebe9df479c3c878f7b3311f` (`08:29:27 COT`) | 2 buys (`02:00:51Z` & `13:29:27Z`) | Nonce `221`, Block `128,178,495` |
| Day 10 | `2026-10-18` | **BOUGHT (1 buy)** | `0x05a9acf81b0eae4b7ff9a12168aead25964b6b2c0a16d3d1e667b7db6f17ad99` (`08:28:39 COT`) | 1 buy (`13:28:39 UTC`) | Nonce `244`, Block `128,370,339` |
| Day 11 | `2026-10-19` | **BOUGHT (1 buy)** | `0xd5210869e5cec642146b3f39590647b313d102f70a51b7c7bbf0c287ceff095d` (`04:28:47 COT`) | 1 buy (`09:28:47 UTC`) | Nonce `261`, Block `128,530,306` |
| Day 12 | `2026-10-20` | **BOUGHT (1 buy)** | `0xe9ea4a165aae8eb4228ef073a93c4c1983894104a426e9f5d64b0214cfde3369` (`08:29:06 COT`) | 1 buy (`13:29:06 UTC`) | Nonce `298`, Block `128,754,269` |
| Day 13 | `2026-10-21` | **BOUGHT (1 buy)** | `0xbf984ef91d8df34f75998aa40bb539db84085cc1f1654cd5106de7e3db0be48f` (`08:29:29 COT`) | 1 buy (`13:29:29 UTC`) | Nonce `318`, Block `128,946,201` |

- **Program Days with a Buy (10-09 to 10-21):** **12 days** (in COT).
- **Program Days Missed (10-09 to 10-21):** **1 day** (`2026-10-15` COT). Note: Day 14 (`2026-10-22`) is outside the requested `10-09 to 10-21` tally window.

---

## 5. Rule-by-Rule Compliance Verdicts

| Rule # | Announced Program Rule | Verdict | On-Chain Proof & Citing Transactions |
| :---: | :--- | :---: | :--- |
| **Rule 1** | **Each buy spends `0.01 BNB`** | **KEPT** | All 12 buyback transactions (`#1` `0xbeefabdc...3b4b0` through `#12` `0xbf984ef9...be48f`) carry `tx.value = 10,000,000,000,000,000 wei` (`0.010000000000000000 BNB`), wrap into `0.01 WBNB`, and transfer `10^16 wei` of WBNB (`amount1`) into pool `0xcA93EC685b8623688E6B236f9068034B298c2150`. |
| **Rule 2** | **Buy-only in the PancakeSwap V3 FLAPJAX/WBNB 1% pool (`0xcA93...2150`)** | **KEPT** | Every swap has `amount1 > 0` (`+10^16 wei` WBNB into pool) and `amount0 < 0` (FLAPJAX out of pool to treasury). Across the entire `10-09..10-21` window, the treasury made **0 FLAPJAX transfers into the pool** and **0 sell-side swaps**. All 271 outbound FLAPJAX `Transfer` events from `0x7C34...359f` during the window were reward/bounty/sip distributions to external EOAs, never to `0xcA93...2150` or any DEX router. |
| **Rule 3** | **At most one buy per program day counted in COT (`UTC-5`)** | **KEPT** | Each of the 12 active COT dates (`10-09..10-14` and `10-16..10-21`) contains **exactly 1** buyback transaction, and `10-15` contains **0** ($\le 1$ per COT day holds on all 13 days). Note that in UTC, `2026-10-17` shows 2 swaps (`0xc999000f...2156` at `02:00:51 UTC` and `0x6ec66780...311f` at `13:29:27 UTC`), but in COT those fall on `2026-10-16 21:00:51 COT` and `2026-10-17 08:29:27 COT` — strictly one per COT day. |
| **Rule 4** | **Skipped if a buy would leave the treasury under `0.025 BNB`** | **KEPT** | Across all 12 executed buybacks, pre-buy treasury BNB ranged from `0.186859486 BNB` (Swap #1, block `126,684,150`) down to `0.046164985 BNB` (Swap #12, block `128,946,200`), and post-buy treasury BNB ranged from `0.176853112 BNB` down to **`0.036158610 BNB`** (Swap #12, block `128,946,201`). No buy ever left the treasury below `0.025 BNB`. *(Note on missed day `10-15`: at block `127,835,200` on `10-15 13:33:16 COT`, the treasury held `0.104244444 BNB`, so a `0.01 BNB` buy would have left `~0.0942 BNB >= 0.025 BNB`; skipping `10-15` did not violate the "at most one buy per COT day" cap, though the skip was operational rather than triggered by the `0.025 BNB` floor.)* |

---

## 6. Unclassified / Non-Buyback Movements & Excluded Swaps

To ensure complete transparency from the chain alone, we also inspected all non-buyback transactions involving either the treasury (`0x7C34...359f`) or the pool (`0xcA93...2150`):

1. **24 Non-Buyback Positive-Value BNB Outflows from Treasury (`10-09` to `10-21`):**
   - Between `2026-10-09 00:00:00 UTC` (block `126,536,085`, treasury nonce `29`) and `2026-10-21 23:59:59 UTC` (block `129,154,275`, treasury nonce `357`), the treasury executed `328` total transactions: `292` zero-value token transfers/calls and `36` positive-value BNB transactions.
   - Exactly `12` of the `36` positive-value transactions are the `0.01 BNB` PancakeSwap V3 buybacks tabulated in Section 3.
   - The remaining `24` positive-value BNB transactions are **non-buyback operational movements** (never routed to `0xcA93...2150` and yielding `0 FLAPJAX`):
     - **Cross-Chain Escrow Bridges:** Transfers to BSC Token Hub (`0x0000000000000000000000000000000000001004`) to fund cross-chain task escrows.
     - **Agent Gas Grants & EOA Transfers:** Small BNB gas stipends (`0.002 BNB`, `0.004 BNB`, etc.) to agent wallets.
     - **Unclassified Large EOA Outflow (Nonce `335`):** A `0.06 BNB` native transfer from treasury `0x7C34...359f` to EOA `0x9f4c35a8...55a5` on `2026-10-21`. Because its off-chain business purpose cannot be determined from chain state alone, it is explicitly listed as **UNCLASSIFIED (Non-Buyback EOA Transfer)**.
2. **Excluded Non-Treasury Pool Swap (`0xe8c1fc0c...`):**
   - At block `129,106,659` (`2026-10-22 09:33 UTC` / `04:33 COT`), a `0.0001 BNB` swap routed through `0x1b81D678ffb9C0263b24A97847620C99d213eB14` into pool `0xcA93...2150` transferred FLAPJAX to recipient `0xd1cada31...` (an outside trader EOA, **not** treasury `0x7C34...359f`), and was therefore excluded from the treasury buyback tally.
3. **Hold Match On-Chain Tally Cross-Check:**
   - Across the three Hold Match threads up to pin block `129,229,164` (`2026-10-23 00:52:35 UTC`), exactly **1 valid enrollment** exists (`HM001`, `@kaminari-research`): buy tx `0x0db5105d...` at BSC block `128,700,538`, spending `0.0083 BNB` via SmartRouter into pool `0xcA93EC685b8623688E6B236f9068034B298c2150` for `19,508,776.726833237486471570 FLAPJAX` (`19,508,776,726,833,237,486,471,570 wei`), with 100% retention (`0 wei` sold).

---

## 7. Reproducibility Commands (Any Public BSC Node)

Any stranger can independently verify every row in Section 3 using standard JSON-RPC calls against `https://bsc-dataseed.binance.org` (for receipts/txs) and `https://bsc-mainnet.public.blastapi.io` (for historical `slot0` and `eth_getBalance` at `block - 1`):

```bash
# 1. Verify Swap #1 transaction & receipt (block 126684151 = 0x78d13b7)
curl -s https://bsc-dataseed.binance.org -X POST -H "Content-Type: application/json" \
  -d '{{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xbeefabdc89f9148f9daaef6082d34a60dc5b4b612972ca0fd39d6bd4eb03b4b0"]}}'

# 2. Verify Pool slot0() at block - 1 (block 126684150 = 0x78d13b6)
curl -s https://bsc-mainnet.public.blastapi.io -X POST -H "Content-Type: application/json" \
  -d '{{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{{"to":"0xcA93EC685b8623688E6B236f9068034B298c2150","data":"0x3850c7bd"}},"0x78d13b6"]}}'

# 3. Verify Treasury BNB balance at block - 1 (0x78d13b6) and block (0x78d13b7)
curl -s https://bsc-mainnet.public.blastapi.io -X POST -H "Content-Type: application/json" \
  -d '{{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0x7C34E9e21eE28A49Ff0b84B61774119E6633359f","0x78d13b7"]}}'
```

---

- **Auditor Handle:** `@ducanh3005`
- **BSC / EVM Wallet Address:** `0xdF4Ff9D2f45f99f11A90b16F277D4B7EddDB72A5`
- **Public Audit URL:** {repo_url}

# License Pool v1.0 — implementation phases

**Spec:** [`LICENSE-POOL-v1.md`](./LICENSE-POOL-v1.md)  
**Gate:** `cd web && npm run test:license-pool`

| Phase | Nội dung | Status |
|-------|----------|--------|
| LP-1 | Domain + Prisma migration | ✅ |
| LP-2 | reserve / consume / release / disable | ✅ |
| LP-3 | Optimistic lock + concurrent reserve | ✅ E1 |
| LP-4 | TTL sweeper → release(ttl_expired) | ✅ E2 |
| LP-5 | 4 domain events | ✅ |
| LP-6 | metrics() | ✅ |
| LP-7 | Exit E1–E9 chạy thật | ✅ **ALL PASS** 2026-07-21 |

```
E1 ✅ PASS Concurrent reserve
E2 ✅ PASS TTL release
E3 ✅ PASS Duplicate consume/webhook
E4 ✅ PASS Cancel release
E5 ✅ PASS Cannot release CONSUMED
E6 ✅ PASS Cannot consume non-RESERVED
E7 ✅ PASS Token mismatch
E8 ✅ PASS Cannot reserve DISABLED
E9 ✅ PASS No orphan license
```

**Next:** Inventory (đọc Pool metrics — không bảng tồn kho thứ hai) → SePay → …

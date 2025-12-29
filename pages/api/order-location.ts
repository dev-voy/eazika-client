// Simplified: live-only tracking (no cache). Always reply 200 with pending status.
export default function handler(_req: any, res: any) {
  return res.status(200).json({ status: "pending" });
}

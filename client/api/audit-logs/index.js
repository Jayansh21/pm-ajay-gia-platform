import { auditLogs } from '../_data';

export default function handler(req, res) {
  res.status(200).json(auditLogs);
}



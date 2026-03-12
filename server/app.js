const { URL } = require('url');
const {
  complaints,
  CATEGORIES,
  FAQS,
  createComplaint,
  findComplaintById,
} = require('./data/store');

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (_error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function validateCreateComplaintPayload(payload) {
  const requiredFields = ['citizenName', 'phoneNumber', 'location', 'category', 'issueDescription'];
  const missing = requiredFields.filter((field) => !payload[field]);
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  if (!CATEGORIES.some((category) => category.id === payload.category)) return 'Invalid complaint category';
  return null;
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { success: true });
  }

  const reqUrl = new URL(req.url, 'http://localhost');
  const path = reqUrl.pathname;

  if (req.method === 'GET' && path === '/health') {
    return sendJson(res, 200, { success: true, service: 'civichelp-desk-backend', uptime: process.uptime() });
  }

  if (req.method === 'GET' && path === '/api/meta/categories') {
    return sendJson(res, 200, { success: true, data: CATEGORIES });
  }

  if (req.method === 'GET' && path === '/api/meta/faqs') {
    return sendJson(res, 200, { success: true, data: FAQS });
  }

  if (req.method === 'GET' && path === '/api/complaints') {
    const status = reqUrl.searchParams.get('status');
    const category = reqUrl.searchParams.get('category');
    const location = reqUrl.searchParams.get('location');

    const filtered = complaints.filter((complaint) => {
      if (status && complaint.status !== status) return false;
      if (category && complaint.category !== category) return false;
      if (location && !complaint.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });

    return sendJson(res, 200, { success: true, count: filtered.length, data: filtered });
  }

  if (req.method === 'POST' && path === '/api/complaints') {
    try {
      const body = await parseBody(req);
      const validationError = validateCreateComplaintPayload(body);
      if (validationError) return sendJson(res, 400, { success: false, message: validationError });
      const complaint = createComplaint(body);
      return sendJson(res, 201, { success: true, message: 'Complaint registered successfully', data: complaint });
    } catch (error) {
      return sendJson(res, 400, { success: false, message: error.message });
    }
  }

  const complaintIdMatch = path.match(/^\/api\/complaints\/([^/]+)$/);
  if (req.method === 'GET' && complaintIdMatch) {
    const complaint = findComplaintById(complaintIdMatch[1]);
    if (!complaint) return sendJson(res, 404, { success: false, message: 'Complaint not found' });
    return sendJson(res, 200, { success: true, data: complaint });
  }

  const statusMatch = path.match(/^\/api\/complaints\/([^/]+)\/status$/);
  if (req.method === 'PATCH' && statusMatch) {
    const complaint = findComplaintById(statusMatch[1]);
    if (!complaint) return sendJson(res, 404, { success: false, message: 'Complaint not found' });

    const body = await parseBody(req).catch(() => null);
    if (!body) return sendJson(res, 400, { success: false, message: 'Invalid JSON body' });

    const allowed = ['submitted', 'in_progress', 'resolved'];
    if (!allowed.includes(body.status)) return sendJson(res, 400, { success: false, message: 'Invalid status value' });

    complaint.status = body.status;
    complaint.updatedAt = new Date().toISOString();
    complaint.updates.push({
      id: `upd-${Date.now()}`,
      status: body.status,
      note: body.note || `Status changed to ${body.status}`,
      createdAt: new Date().toISOString(),
    });

    return sendJson(res, 200, { success: true, message: 'Complaint status updated', data: complaint });
  }

  const assignMatch = path.match(/^\/api\/complaints\/([^/]+)\/assign$/);
  if (req.method === 'POST' && assignMatch) {
    const complaint = findComplaintById(assignMatch[1]);
    if (!complaint) return sendJson(res, 404, { success: false, message: 'Complaint not found' });

    const body = await parseBody(req).catch(() => null);
    if (!body || !body.officerName) {
      return sendJson(res, 400, { success: false, message: 'officerName is required' });
    }

    complaint.assignedOfficer = body.officerName;
    complaint.updatedAt = new Date().toISOString();
    complaint.updates.push({
      id: `upd-${Date.now()}`,
      status: complaint.status,
      note: `Assigned to officer: ${body.officerName}`,
      createdAt: new Date().toISOString(),
    });

    return sendJson(res, 200, { success: true, message: 'Complaint assigned successfully', data: complaint });
  }

  const feedbackMatch = path.match(/^\/api\/complaints\/([^/]+)\/feedback$/);
  if (req.method === 'POST' && feedbackMatch) {
    const complaint = findComplaintById(feedbackMatch[1]);
    if (!complaint) return sendJson(res, 404, { success: false, message: 'Complaint not found' });

    const body = await parseBody(req).catch(() => null);
    if (!body || !body.rating || body.rating < 1 || body.rating > 5) {
      return sendJson(res, 400, { success: false, message: 'rating must be between 1 and 5' });
    }

    complaint.feedback = {
      rating: body.rating,
      comment: body.comment || '',
      createdAt: new Date().toISOString(),
    };
    complaint.updatedAt = new Date().toISOString();

    return sendJson(res, 200, { success: true, message: 'Feedback saved successfully', data: complaint });
  }

  return sendJson(res, 404, {
    success: false,
    message: `Route ${req.method} ${path} not found.`,
  });
}

module.exports = handler;

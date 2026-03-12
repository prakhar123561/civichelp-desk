const { randomUUID } = require('crypto');

const CATEGORY_DEPARTMENT_MAP = {
  road_damage: 'Municipal Department',
  water_supply: 'Water Department',
  electricity: 'Electricity Board',
  garbage_collection: 'Sanitation Department',
  public_health: 'Public Health Department',
  office_complaint: 'Administrative Office',
};

const CATEGORIES = Object.entries(CATEGORY_DEPARTMENT_MAP).map(([id, department]) => ({
  id,
  label: id
    .split('_')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' '),
  department,
}));

const FAQS = [
  {
    id: 'office-timing',
    question: 'What are office timings?',
    answer: 'Most municipal offices are open Monday to Friday, 10:00 AM to 5:00 PM.',
  },
  {
    id: 'documents',
    question: 'Which documents are needed to register a complaint?',
    answer: 'Basic contact details and location are required. Attach photos/videos if available.',
  },
  {
    id: 'helpline',
    question: 'What is the city helpline number?',
    answer: 'You can call the civic support helpline at 1800-000-111.',
  },
];

const complaints = [];

function createComplaint(payload) {
  const category = CATEGORIES.find((item) => item.id === payload.category);

  const complaint = {
    id: randomUUID(),
    complaintId: `CHD-${Date.now().toString().slice(-8)}`,
    citizenName: payload.citizenName,
    phoneNumber: payload.phoneNumber,
    location: payload.location,
    category: payload.category,
    issueDescription: payload.issueDescription,
    mediaUrls: payload.mediaUrls || [],
    language: payload.language || 'en',
    status: 'submitted',
    assignedDepartment: category.department,
    assignedOfficer: null,
    updates: [
      {
        id: randomUUID(),
        note: 'Complaint submitted successfully.',
        status: 'submitted',
        createdAt: new Date().toISOString(),
      },
    ],
    feedback: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  complaints.push(complaint);
  return complaint;
}

function findComplaintById(id) {
  return complaints.find((complaint) => complaint.id === id || complaint.complaintId === id);
}

module.exports = {
  CATEGORY_DEPARTMENT_MAP,
  CATEGORIES,
  FAQS,
  complaints,
  createComplaint,
  findComplaintById,
};

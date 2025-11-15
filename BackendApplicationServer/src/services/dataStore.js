'use strict';

/**
 * In-memory data store that seeds demo data for development use.
 * This is a lightweight fallback to enable frontend integration
 * without a real database. Not intended for production use.
 */

// Simple counters for deterministic IDs
let userCounter = 1001;
let ticketCounter = 1001;
let complaintCounter = 1001;
let notificationCounter = 1001;

// Internal stores
const users = [];
const tickets = [];
const complaints = [];
const case360 = {}; // keyed by caseId

/**
 * Utility: generate deterministic IDs with a prefix.
 * @param {string} prefix
 * @returns {string}
 */
function generateId(prefix) {
  const map = {
    USR: () => userCounter++,
    TICK: () => ticketCounter++,
    CMP: () => complaintCounter++,
    NTF: () => notificationCounter++,
  };
  const next = map[prefix] ? map[prefix]() : Math.floor(Math.random() * 100000);
  return `${prefix}-${next}`;
}

/**
 * Utility: get a random element from array
 * @param {Array} arr
 * @returns {*}
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Seed demo users
 */
function seedUsers() {
  if (users.length > 0) return;
  const rolesPool = [
    ['agent'],
    ['admin'],
    ['supervisor'],
    ['customer'],
    ['agent', 'supervisor'],
  ];
  const names = [
    'Amit Sharma',
    'Priya Singh',
    'Rahul Verma',
    'Neha Gupta',
    'Rohit Mehta',
    'Ananya Rao',
    'Vikram Patel',
    'Sneha Nair',
    'Arjun Kapoor',
    'Simran Kaur',
    'Karan Malhotra',
    'Pooja Joshi',
  ];

  names.forEach((name, idx) => {
    const username = name.toLowerCase().replace(/\s+/g, '.');
    users.push({
      id: generateId('USR'),
      username,
      email: `${username}@example.com`,
      roles: pick([rolesPool[0], rolesPool[1], rolesPool[2], rolesPool[3], rolesPool[4]]),
      status: idx % 9 === 0 ? 'inactive' : 'active',
    });
  });
}

/**
 * Seed demo tickets
 */
function seedTickets() {
  if (tickets.length > 0) return;
  const types = ['incident', 'service', 'request', 'bug'];
  const categories = ['IT', 'Accounts', 'Trading', 'KYC', 'Onboarding'];
  const subCategories = ['Login', 'Email', 'Order', 'Verification', 'Reporting'];
  const severities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];

  // Pick agents for assignment
  const agents = () => users.filter(u => u.roles.includes('agent') || u.roles.includes('supervisor'));

  for (let i = 0; i < 12; i += 1) {
    const reqUser = users[i % users.length];
    const assigned = pick(agents());
    const now = new Date();
    const created = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
    const updated = new Date(created.getTime() + (i % 3) * 60 * 60 * 1000);
    tickets.push({
      id: generateId('TICK'),
      type: pick(types),
      category: pick(categories),
      subCategory: pick(subCategories),
      severity: pick(severities),
      description: `Demo ticket #${i + 1} regarding ${pick(subCategories)} in ${pick(categories)} module.`,
      requestor: reqUser,
      status: pick(statuses),
      assignedAgent: assigned,
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
    });
  }
}

/**
 * Seed demo complaints
 */
function seedComplaints() {
  if (complaints.length > 0) return;
  const types = ['service-quality', 'delay', 'billing', 'fraud-suspect', 'miscommunication'];
  const severities = ['low', 'medium', 'high'];
  const statuses = ['open', 'escalated', 'resolved'];

  for (let i = 0; i < 10; i += 1) {
    const reqUser = users[(i + 3) % users.length];
    const now = new Date();
    const created = new Date(now.getTime() - (i + 2) * 12 * 60 * 60 * 1000);
    const updated = new Date(created.getTime() + (i % 4) * 2 * 60 * 60 * 1000);
    complaints.push({
      id: generateId('CMP'),
      type: pick(types),
      severity: pick(severities),
      description: `Customer complaint #${i + 1} noted for investigation.`,
      requestor: reqUser,
      status: pick(statuses),
      escalationDetails: i % 3 === 0 ? 'Escalated to supervisor due to SLA breach.' : 'NA',
      createdAt: created.toISOString(),
      updatedAt: updated.toISOString(),
    });
  }
}

/**
 * Seed demo case360 object(s)
 */
function seedCase360() {
  if (Object.keys(case360).length > 0) return;
  const knownCaseId = 'CSE-1001';
  const related = tickets.slice(0, 3).map(t => t.id);
  const interactions = [
    '2024-09-11 09:31 - Customer reported login failure via call center.',
    '2024-09-11 10:05 - Agent acknowledged and created ticket.',
    '2024-09-11 13:22 - Workaround provided; customer confirmed partial relief.',
    '2024-09-12 10:00 - Root cause identified; patch scheduled.',
    '2024-09-13 16:40 - Patch deployed; ticket resolved.',
  ];
  case360[knownCaseId] = {
    caseId: knownCaseId,
    summary: 'Consolidated view for recurring login issue affecting critical operations.',
    lifecycleStatus: 'resolved',
    relatedSolutions: related,
    agentMapping: 'Primary: agent.amit, Backup: agent.priya',
    interactionHistory: interactions,
  };
}

/**
 * Initialize store upon module load
 */
function initialize() {
  seedUsers();
  seedTickets();
  seedComplaints();
  seedCase360();
}
initialize();

/**
 * Paginate an array lightly
 * @param {Array} arr
 * @param {number} page
 * @param {number} pageSize
 * @returns {Array}
 */
function paginate(arr, page, pageSize) {
  const p = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const ps = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : arr.length;
  const start = (p - 1) * ps;
  return arr.slice(start, start + ps);
}

// PUBLIC_INTERFACE
function getUsers({ page, pageSize } = {}) {
  /** Returns a list of demo users (optionally paginated). */
  return paginate(users, page, pageSize);
}

// PUBLIC_INTERFACE
function getTickets({ page, pageSize } = {}) {
  /** Returns a list of demo tickets (optionally paginated). */
  return paginate(tickets, page, pageSize);
}

// PUBLIC_INTERFACE
function addTicket(payload) {
  /**
   * Create a new ticket in-memory and return it.
   * Required: type, description, requestor (user or {id})
   */
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }
  const { type, description, requestor, category, subCategory, severity, assignedAgent } = payload;
  if (!type || !description) {
    throw new Error('Missing required fields: type, description');
  }

  // Resolve requestor object
  let reqUser = requestor;
  if (!reqUser || typeof reqUser !== 'object') {
    reqUser = users[0];
  } else if (reqUser.id) {
    const match = users.find(u => u.id === reqUser.id);
    reqUser = match || users[0];
  }

  // Resolve assigned agent if provided by id
  let assigned = null;
  if (assignedAgent && typeof assignedAgent === 'object') {
    if (assignedAgent.id) {
      assigned = users.find(u => u.id === assignedAgent.id) || null;
    } else {
      assigned = assignedAgent;
    }
  }

  const now = new Date();
  const ticket = {
    id: generateId('TICK'),
    type,
    category: category || 'General',
    subCategory: subCategory || 'General',
    severity: severity || 'medium',
    description,
    requestor: reqUser,
    status: 'open',
    assignedAgent: assigned,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  tickets.unshift(ticket);
  return ticket;
}

// PUBLIC_INTERFACE
function getComplaints({ page, pageSize } = {}) {
  /** Returns a list of demo complaints (optionally paginated). */
  return paginate(complaints, page, pageSize);
}

// PUBLIC_INTERFACE
function addComplaint(payload) {
  /**
   * Create a new complaint in-memory and return it.
   * Required: type, description, requestor (user or {id})
   */
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }
  const { type, description, requestor, severity, escalationDetails } = payload;
  if (!type || !description) {
    throw new Error('Missing required fields: type, description');
  }

  // Resolve requestor object
  let reqUser = requestor;
  if (!reqUser || typeof reqUser !== 'object') {
    reqUser = users[1] || users[0];
  } else if (reqUser.id) {
    const match = users.find(u => u.id === reqUser.id);
    reqUser = match || users[0];
  }

  const now = new Date();
  const complaint = {
    id: generateId('CMP'),
    type,
    severity: severity || 'medium',
    description,
    requestor: reqUser,
    status: 'open',
    escalationDetails: escalationDetails || 'NA',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  complaints.unshift(complaint);
  return complaint;
}

// PUBLIC_INTERFACE
function getCase360(caseId) {
  /** Returns the 360 object for a case by ID or null if not found. */
  return case360[caseId] || null;
}

// PUBLIC_INTERFACE
function getReport(type, dateRange) {
  /** Returns a mock report object by type. Currently supports 'summary'. */
  if (!type) {
    throw new Error('Missing required query parameter: type');
  }
  const now = new Date();
  const dr = dateRange || 'last-30-days';
  if (type !== 'summary') {
    // Provide a generic mock payload for unsupported types as well
    return {
      reportId: `RPT-${now.getTime()}`,
      type,
      dateRange: dr,
      data: {
        note: 'Mock report data - only summary has enriched statistics in dev mode.',
        generatedAt: now.toISOString(),
      },
    };
  }

  // Build a summary using existing data
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const complaintsCount = complaints.length;

  const sevCounts = tickets.reduce((acc, t) => {
    acc[t.severity] = (acc[t.severity] || 0) + 1;
    return acc;
  }, {});

  // Count tickets per agent
  const perAgent = {};
  tickets.forEach(t => {
    if (t.assignedAgent && t.assignedAgent.username) {
      perAgent[t.assignedAgent.username] = (perAgent[t.assignedAgent.username] || 0) + 1;
    }
  });
  const topAgents = Object.entries(perAgent)
    .map(([agent, count]) => ({ agent, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    reportId: `RPT-${now.getTime()}`,
    type: 'summary',
    dateRange: dr,
    data: {
      totals: { totalTickets, openTickets, resolvedTickets, complaintsCount },
      ticketsBySeverity: sevCounts,
      topAgents,
      generatedAt: now.toISOString(),
    },
  };
}

// PUBLIC_INTERFACE
function sendNotification(payload) {
  /** Returns a mock notification response with status=sent. */
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid payload');
  }
  const { type, recipient, message } = payload;
  if (!type || !recipient || !message) {
    throw new Error('Missing required fields: type, recipient, message');
  }
  const now = new Date();
  return {
    notificationId: generateId('NTF'),
    type,
    recipient,
    message,
    status: 'sent',
    sentAt: now.toISOString(),
  };
}

module.exports = {
  getUsers,
  getTickets,
  addTicket,
  getComplaints,
  addComplaint,
  getCase360,
  getReport,
  sendNotification,
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { Product } from '../models/Product.js';
import { Lead } from '../models/Lead.js';
import { Customer } from '../models/Customer.js';
import { Quote } from '../models/Quote.js';
import { Order } from '../models/Order.js';
import { Appointment } from '../models/Appointment.js';
import { CallLog } from '../models/CallLog.js';
import { Workflow } from '../models/Workflow.js';
import { INITIAL_PRODUCTS } from '../data/bearingsData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.log(`[Seed Notice] MongoDB is not connected yet. ${INITIAL_PRODUCTS.length} bearings are available in backend memory cache.`);
      return;
    }

    console.log('[Seed] Clearing existing collections...');
    await Product.deleteMany({});
    await Lead.deleteMany({});
    await Customer.deleteMany({});
    await Quote.deleteMany({});
    await Order.deleteMany({});
    await Appointment.deleteMany({});
    await CallLog.deleteMany({});
    await Workflow.deleteMany({});

    console.log(`[Seed] Inserting ${INITIAL_PRODUCTS.length} initial products...`);
    await Product.insertMany(INITIAL_PRODUCTS);

    console.log('[Seed] Inserting sample CRM leads...');
    const sampleLeads = [
      {
        id: 'L-101',
        name: 'Arvind Swamy',
        mobile: '+91 98450 12053',
        email: 'arvind.swamy@reliance.com',
        company: 'Reliance Industries Ltd (Jamnagar)',
        productInterest: 'CSCD040-HLE',
        source: 'Google Search',
        status: 'Qualified',
        leadScore: 85,
        utmSource: 'google-organic',
        lastActivity: 'Sourced catalog specifications directly',
        chatHistory: [
          { sender: 'user', text: 'Need quote for 15 units of INA thin section bearings CSCD040', time: '10:15 AM' },
          { sender: 'assistant', text: 'Connecting with Sales Hub. Price estimated roughly at ₹5,200/unit.', time: '10:16 AM' }
        ],
        notes: 'Requested urgent dispatch availability. Technical team verified replacement matches NSK alternative.'
      },
      {
        id: 'L-102',
        name: 'Meera Chawla',
        mobile: '+91 97110 58402',
        email: 'm.chawla@tatamotors.com',
        company: 'Tata Motors Plant Pune',
        productInterest: 'KIT233',
        source: 'Homepage Modal',
        status: 'Contacted',
        leadScore: 90,
        utmSource: 'direct',
        lastActivity: 'AI calling agent completed qualification session',
        notes: 'Interested in Generation II integrated front wheel hub bearings.'
      },
      {
        id: 'L-103',
        name: 'Siddharth Rao',
        mobile: '+91 94432 77890',
        email: 's.rao@jsw.in',
        company: 'JSW Steel Ballari',
        productInterest: '16030',
        source: 'WhatsApp',
        status: 'New',
        leadScore: 70,
        utmSource: 'whatsapp',
        lastActivity: 'Inquiry received via WhatsApp channel',
        notes: 'Needs 4 units for rolling mill overhaul.'
      }
    ];
    await Lead.insertMany(sampleLeads);

    console.log('[Seed] Inserting sample Customers...');
    const sampleCustomers = [
      {
        customerId: 'CUST-001',
        company: 'Reliance Industries Ltd',
        contactName: 'Vikram Shah',
        email: 'v.shah@ril.com',
        phone: '+91 98210 54102',
        city: 'Mumbai',
        tier: 'Corporate OEM',
        totalSpend: 450000,
        notes: 'Key refinery account with annual procurement contract.'
      },
      {
        customerId: 'CUST-002',
        company: 'Mahindra & Mahindra Plant III',
        contactName: 'Arjun Mehta',
        email: 'amehta@mahindra.com',
        phone: '+91 97410 20384',
        city: 'Pune',
        tier: 'Corporate OEM',
        totalSpend: 280000,
        notes: 'Automotive assembly motion guides buyer.'
      }
    ];
    await Customer.insertMany(sampleCustomers);

    console.log('[Seed] Inserting sample Quotes & Orders...');
    const sampleQuotes = [
      {
        quoteId: 'UE-885402',
        name: 'Vikram Shah',
        companyName: 'Reliance Industries Ltd',
        phone: '+91 98210 54102',
        email: 'v.shah@ril.com',
        routing: 'CRM',
        items: [
          { product: { partNumber: '16001JRX', brand: 'NTN', price: 224, category: 'Deep Groove Ball Bearings' }, quantity: 15 },
          { product: { partNumber: '16002JRX', brand: 'NTN', price: 242, category: 'Deep Groove Ball Bearings' }, quantity: 20 }
        ],
        subtotal: 8200,
        status: 'In Transit',
        statusTimeline: [
          { label: 'Request Sourced', date: 'Aug 20, 2026', done: true, desc: 'Sourcing inquiry logged in Universal Enterprise CRM.' },
          { label: 'Technical Validation', date: 'Aug 21, 2026', done: true, desc: 'Tolerances and brand-crosses verified by Senior QA Inspector.' },
          { label: 'Custom Crating & Pack', date: 'Aug 22, 2026', done: true, desc: 'Export-grade double-layer timber crating applied for moisture protection.' },
          { label: 'Depot Dispatch', date: 'Aug 23, 2026', done: true, desc: 'Outbound clearance granted. Shipped via BlueDart Express (AWB #BD-884021).' },
          { label: 'In Transit via Air Cargo', date: 'Aug 24, 2026', done: true, desc: 'Shipment arrived at regional cargo hub. Scheduled morning truck delivery.' },
          { label: 'Recipient Delivered', date: '', done: false, desc: 'Awaiting final terminal gate manager signature.' }
        ]
      },
      {
        quoteId: 'UE-115049',
        name: 'Arjun Mehta',
        companyName: 'Mahindra & Mahindra Plant III',
        phone: '+91 97410 20384',
        email: 'amehta@mahindra.com',
        routing: 'WhatsApp',
        items: [
          { product: { partNumber: 'HSR20A', brand: 'THK', price: 6400, category: 'THK Linear Motion Guides' }, quantity: 4 }
        ],
        subtotal: 25600,
        status: 'Custom Crating',
        statusTimeline: [
          { label: 'Request Sourced', date: 'Aug 22, 2026', done: true, desc: 'Inquiry generated and dynamic WhatsApp routing agent assigned.' },
          { label: 'Technical Validation', date: 'Aug 23, 2026', done: true, desc: 'Pre-lubrication heavy load profile matched to M&M plant spec sheet.' },
          { label: 'Custom Crating & Pack', date: 'Aug 24, 2026', done: true, desc: 'Heavy-duty shock-absorbent vacuum palletizing verified.' },
          { label: 'Depot Dispatch', date: '', done: false, desc: 'Awaiting road safety clearance permit corridors.' },
          { label: 'In Transit via Air Cargo', date: '', done: false, desc: '' },
          { label: 'Recipient Delivered', date: '', done: false, desc: '' }
        ]
      }
    ];
    await Quote.insertMany(sampleQuotes);

    const sampleOrders = [
      {
        referenceId: 'UE-885402',
        quoteId: 'UE-885402',
        customerName: 'Vikram Shah',
        companyName: 'Reliance Industries Ltd',
        email: 'v.shah@ril.com',
        phone: '+91 98210 54102',
        carrier: 'BlueDart Express',
        awbNumber: 'BD-884021',
        items: [
          { partNumber: '16001JRX', brand: 'NTN', category: 'Deep Groove Ball Bearings', quantity: 15, price: 224 },
          { partNumber: '16002JRX', brand: 'NTN', category: 'Deep Groove Ball Bearings', quantity: 20, price: 242 }
        ],
        totalAmount: 8200,
        currentStatus: 'In Transit via Air Cargo',
        milestones: sampleQuotes[0].statusTimeline
      },
      {
        referenceId: 'UE-115049',
        quoteId: 'UE-115049',
        customerName: 'Arjun Mehta',
        companyName: 'Mahindra & Mahindra Plant III',
        email: 'amehta@mahindra.com',
        phone: '+91 97410 20384',
        carrier: 'BlueDart Express',
        awbNumber: 'BD-119403',
        items: [
          { partNumber: 'HSR20A', brand: 'THK', category: 'Linear Motion Guides', quantity: 4, price: 6400 }
        ],
        totalAmount: 25600,
        currentStatus: 'Custom Crating',
        milestones: sampleQuotes[1].statusTimeline
      }
    ];
    await Order.insertMany(sampleOrders);

    console.log('[Seed] Inserting sample Appointments, CallLogs, and Workflows...');
    await Appointment.insertMany([
      {
        id: 'APT-1',
        leadId: 'L-101',
        leadName: 'Arvind Swamy',
        company: 'Reliance Industries Ltd (Jamnagar)',
        email: 'arvind.swamy@reliance.com',
        phone: '+91 98450 12053',
        dateTime: '2026-09-02T11:00',
        type: 'Technical Consultation',
        status: 'Scheduled',
        notes: 'Verify CAD alignment and torque parameters for CSCD040 replacements.'
      }
    ]);

    await CallLog.insertMany([
      {
        callId: 'CALL-501',
        leadName: 'Meera Chawla',
        phone: '+91 97110 58402',
        duration: '3m 12s',
        transcript: [
          { speaker: 'AI Agent', text: 'Hello, this is the Universal Enterprise sourcing assistant. Are you inquiring about automotive hub assemblies?' },
          { speaker: 'Meera Chawla', text: 'Yes, looking for KIT233 specifications for Pune assembly line.' },
          { speaker: 'AI Agent', text: 'We have stock with Generation II active ABS sensor rings. Shall I schedule an engineer?' },
          { speaker: 'Meera Chawla', text: 'Yes please, send specs to m.chawla@tatamotors.com.' }
        ],
        qualificationSummary: 'High intent procurement requirement confirmed for 14 kits.',
        outcome: 'Qualified'
      }
    ]);

    await Workflow.insertMany([
      {
        id: 'WF-1',
        name: 'High-Score Lead Auto WhatsApp Notification',
        trigger: 'Lead Score > 75',
        conditions: 'Source is Homepage Modal or Contact Form',
        action: 'Send instant WhatsApp RFQ acknowledgment to sales hotline',
        enabled: true
      },
      {
        id: 'WF-2',
        name: 'Urgent RFQ Escalation',
        trigger: 'Quote Subtotal > ₹50,000',
        conditions: 'Status is Request Sourced',
        action: 'Assign Senior Technical Sourcing Specialist within 15 minutes',
        enabled: true
      }
    ]);

    console.log('[Seed] Database seeded successfully!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

if (process.argv[1]?.endsWith('seedDatabase.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

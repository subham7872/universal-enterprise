import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
  callId: { type: String, unique: true, index: true },
  leadName: { type: String, required: true },
  phone: { type: String, required: true },
  duration: { type: String, default: '2m 45s' },
  transcript: [{
    speaker: { type: String, required: true },
    text: { type: String, required: true },
    time: String
  }],
  qualificationSummary: { type: String, default: 'Bearing load and series specifications gathered successfully.' },
  outcome: { type: String, enum: ['Qualified', 'Follow Up', 'Unreachable', 'Not Interested'], default: 'Qualified' },
  agentType: { type: String, default: 'AI Voice Sourcing Agent' },
  callDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, {
  timestamps: true
});

export const CallLog = mongoose.models.CallLog || mongoose.model('CallLog', callLogSchema);
export default CallLog;
